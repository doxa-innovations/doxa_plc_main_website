import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Build a self-contained server bundle for the Docker/Dokploy VPS deploy.
  output: "standalone",

  // Pin the workspace root so output-file tracing is correct (an unrelated
  // lockfile in a parent dir otherwise makes Next infer the wrong root).
  turbopack: { root: import.meta.dirname },

  // Set explicitly: withPayload() re-adds "X-Powered-By: Next.js, Payload"
  // unless this is already false. We don't advertise the stack.
  poweredByHeader: false,

  // Portfolio/team imagery is served from the company CDN and optimized by next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.doxaplc.com", pathname: "/**" },
      // Single reused placeholder photo for slots awaiting real photography.
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      // Topical stock imagery (services, how-it-works) until real assets land.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },

  // nodemailer uses dynamic requires that should not be bundled by Turbopack/webpack.
  // withPayload() appends its own entries (pino, graphql, drizzle-kit, ...) to this list.
  serverExternalPackages: ["nodemailer"],

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The admin panel is deliberately NOT listed in robots.txt, since that
      // would publish the path to anyone who reads it. A response header keeps
      // it out of indexes without announcing where it lives.
      {
        source: "/olympus/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withPayload(nextConfig);
