import type { NextConfig } from "next";

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

  // Portfolio/team imagery is served from the company CDN and optimized by next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.doxaplc.com", pathname: "/**" },
      // Single reused placeholder photo for slots awaiting real photography.
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },

  // nodemailer uses dynamic requires that should not be bundled by Turbopack/webpack.
  serverExternalPackages: ["nodemailer"],

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
