import Script from "next/script";

/**
 * The Google Tag Manager container.
 *
 * A server component, so the container id is read at REQUEST time. That is the
 * same lesson TURNSTILE_SITE_KEY documents in `.env.example`: a
 * `NEXT_PUBLIC_` variable is baked into the client bundle during `next build`,
 * the Docker build deliberately runs with no environment variables, and the
 * result would be a container id compiled to an empty string. The value is not
 * a secret — the browser receives it either way — the prefix is purely about
 * when it is resolved.
 *
 * Renders nothing at all when GTM_CONTAINER_ID is unset, which is the state
 * local development and any un-configured deployment run in. No script tag, no
 * request to googletagmanager.com, no cookies.
 *
 * Mounted from `app/(site)/layout.tsx` rather than the root layout so that
 * /olympus is not measured — admin sessions are staff traffic and would skew
 * every number on the dashboard the same staff read. The side effect is that
 * `app/not-found.tsx` belongs to no route group and so carries no container;
 * 404s are invisible to GTM and visible in the first-party visit beacon.
 */

/**
 * Google's ids are `GTM-` followed by alphanumerics. Validated because the
 * value is interpolated into a script URL: a malformed variable should render
 * nothing rather than emit a broken or attacker-influenced tag.
 */
const CONTAINER_ID = /^GTM-[A-Z0-9]+$/;

export function GoogleTagManager() {
  const id = process.env.GTM_CONTAINER_ID?.trim();
  if (!id) return null;

  if (!CONTAINER_ID.test(id)) {
    console.warn(
      `[gtm] Ignoring GTM_CONTAINER_ID="${id}": expected the form GTM-XXXXXXX.`,
    );
    return null;
  }

  return (
    <Script
      id="gtm-container"
      strategy="afterInteractive"
      // Google's standard snippet. `afterInteractive` is correct even though
      // consent mode is order-sensitive: the denied default is pushed by the
      // inline head script in the root layout, which has already run by the
      // time any of this executes.
      //
      // The <noscript> iframe from Google's copy-paste block is deliberately
      // omitted. It cannot read the consent state, so it would measure people
      // who declined, and it only ever fires for visitors with JavaScript off,
      // who cannot use this site's forms or navigation anyway.
      dangerouslySetInnerHTML={{
        __html:
          `(function(w,d,s,l,i){w[l]=w[l]||[];` +
          `w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
          `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),` +
          `dl=l!='dataLayer'?'&l='+l:'';j.async=true;` +
          `j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
          `f.parentNode.insertBefore(j,f);` +
          `})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  );
}
