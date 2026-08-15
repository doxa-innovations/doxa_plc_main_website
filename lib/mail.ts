import nodemailer from "nodemailer";

/**
 * Builds a Nodemailer transport from the SMTP_* env contract (the same one the
 * legacy app used, plus the `secure` flag it dropped).
 */
export function createTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    /**
     * Omitted entirely when there are no credentials, rather than passed with
     * empty strings. Nodemailer treats a present `auth` object as "log in",
     * and an incomplete one fails the whole send with `Missing credentials
     * for "PLAIN"`.
     *
     * That is what stood between CLAUDE.md's instruction to point SMTP at
     * Mailpit locally and it actually working: Mailpit accepts no auth, so the
     * documented setup could not send at all, and the path of least resistance
     * was to leave the real provider configured in .env and send live mail
     * from a dev box. Which happened.
     */
    ...(user && pass ? { auth: { user, pass } } : {}),
  });
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes user-supplied text before interpolating it into an HTML email body. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}
