import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { createTransport, escapeHtml } from "@/lib/mail";

export const runtime = "nodejs";

const CONTACT_TO = process.env.CONTACT_TO || "company@doxaplc.com";
const FROM_DOMAIN = process.env.DOMAIN || "doxaplc.com";

// Lightweight in-memory rate limit. The app runs as a single standalone
// replica, so a per-instance map is sufficient for a marketing contact form.
const RATE_LIMIT_MS = 30_000;
const lastSeen = new Map<string, number>();

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Honeypot: silently accept bots without sending.
  if (data._gotcha) return NextResponse.json({ ok: true });

  const ip = clientIp(req);
  const now = Date.now();
  const previous = lastSeen.get(ip) ?? 0;
  if (now - previous < RATE_LIMIT_MS) {
    return NextResponse.json(
      { ok: false, error: "Please wait a moment before sending again." },
      { status: 429 },
    );
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company || ", "],
    ["Country", data.country],
    ["Project Type", data.projectType],
    ["Budget", data.budget],
  ];
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html = `
    <h2>New discovery-call request</h2>
    <table style="border-collapse:collapse">${htmlRows}</table>
    <h3>Message</h3>
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `;

  try {
    const transport = createTransport();
    await transport.sendMail({
      from: `Doxa Website <web-contact@${FROM_DOMAIN}>`,
      to: CONTACT_TO,
      replyTo: data.email,
      subject: `New inquiry, ${data.name} (${data.projectType})`,
      html,
    });
  } catch (err) {
    console.error("contact: failed to send email", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message." },
      { status: 500 },
    );
  }

  lastSeen.set(ip, now);
  return NextResponse.json({ ok: true });
}
