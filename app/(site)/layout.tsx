import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { getSite } from "@/lib/content";
import { RouteLoaderProvider } from "@/components/loading/RouteLoaderProvider";
import {
  graph,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/jsonld";

/**
 * The public site's chrome.
 *
 * Split out of the root layout so /olympus can render without a marketing
 * navbar, footer and cookie banner wrapped around a data table. Route groups
 * do not appear in URLs, so every path here is exactly what it was.
 *
 * RouteLoaderProvider mounting here — rather than in the root layout — is
 * what scopes the transition curtain to the public site. Navbar and Footer
 * stay server components: passing them through as `children` from a server
 * layout does not pull them into the client bundle.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Structured data reads the same CMS-backed config the pages render, so a
  // changed phone number updates the visible footer and the LocalBusiness
  // schema together rather than letting them drift apart.
  const site = await getSite();

  return (
    <>
      <JsonLd
        schema={graph(
          organizationSchema(site),
          websiteSchema(),
          localBusinessSchema(site),
        )}
      />
      <RouteLoaderProvider>
        {/* One aurora canvas for the whole public site. Bands render with no
            fill of their own so it shows through; the Footer keeps its own
            `bg-deep` and is unaffected. */}
        <div className="aurora-canvas isolate">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
        <ConsentManager />
      </RouteLoaderProvider>
    </>
  );
}
