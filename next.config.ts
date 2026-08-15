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
    // Optimized images were going out with `max-age=14400, must-revalidate`
    // (4 hours). `must-revalidate` is what stopped Cloudflare caching them at
    // all — every /_next/image request read cf-cache-status: DYNAMIC and went
    // to the origin optimizer. 30 days lets the edge hold them.
    //
    // Safe because the URL carries the source path, width and quality: a
    // genuinely new picture is uploaded under a new name and gets a new URL.
    // Overwriting a file in place at the SAME path is the one thing this
    // makes slow to propagate, so don't do that.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
      // Static media out of public/ shipped with `public, max-age=14400`,
      // four hours, which is why Lighthouse reports several hundred KiB of
      // avoidable refetching. These files are portfolio screenshots, the logo
      // and the walkthrough poster: they are replaced by uploading a new name,
      // not by editing bytes in place.
      //
      // /_next/static is NOT listed because Next already serves it immutable
      // for a year — those filenames carry a content hash.
      {
        source:
          "/:path*.(png|jpg|jpeg|gif|svg|webp|avif|ico|mp4|webm|vtt|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
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
