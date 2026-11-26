"use client";

import { captureException } from "@doxa-innovations/watch/next/client";
import { useEffect } from "react";

/**
 * Last-resort error page, used only when the root layout itself fails. It replaces that layout, so it renders
 * its own document. Errors inside pages are caught by `(site)/error.tsx`. Reports the error to Doxa Watch.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => captureException(error), [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.75rem", color: "#555" }}>Please try again in a moment.</p>
        <button type="button" onClick={() => reset()} style={{ marginTop: "1.5rem", padding: "0.6rem 1.2rem" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
