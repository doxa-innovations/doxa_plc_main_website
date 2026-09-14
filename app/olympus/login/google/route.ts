import { redirect } from "next/navigation";

import { beginGoogleSignIn, getGoogleConfig } from "@/lib/google-auth";

/**
 * First leg of "Continue with Google". Sets the state cookie and sends the
 * browser to Google. See lib/google-auth.ts.
 *
 * Reachable while signed out because proxy.ts lets everything under
 * /olympus/login through.
 */
export async function GET() {
  const google = getGoogleConfig();
  if (!google) redirect("/olympus/login");

  redirect(await beginGoogleSignIn(google));
}
