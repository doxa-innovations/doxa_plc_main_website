"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-32 text-center">
      <h1 className="max-w-xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-ink/70">
        An unexpected error occurred. Please try again — if it keeps happening,
        get in touch and we&apos;ll sort it out.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <a href="/contact">Contact us</a>
        </Button>
      </div>
    </Container>
  );
}
