import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Cursor } from "@/components/Cursor";
import { MobileActionBar } from "@/components/MobileActionBar";
import { BackToTop } from "@/components/BackToTop";
import { contact, site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  keywords: [
    "interior designer PCMC",
    "interior designer Pune",
    "interior design Pimpri Chinchwad",
    "turnkey interiors Pune",
    "residential interiors",
    "commercial interiors",
    "Ash Aura Interiors",
    "Aishwarya Alatagi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: site.name,
  description: site.description,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  logo: `${siteUrl}/icon.svg`,
  telephone: contact.phoneDisplay,
  email: contact.email,
  founder: { "@type": "Person", name: site.founder },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pimpri-Chinchwad (PCMC), Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: ["Pimpri-Chinchwad", "Pune"],
  sameAs: [contact.instagramUrl],
};

const stripExtensionAttrs = `(function(){var n=["bis_skin_checked","bis_register","bis_use"];function c(e){for(var i=0;i<n.length;i++)e.hasAttribute(n[i])&&e.removeAttribute(n[i])}var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++)m[i].target.nodeType===1&&c(m[i].target)});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:n});addEventListener("load",function(){setTimeout(function(){o.disconnect()},2000)})})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Some antivirus extensions (Bitdefender) tag every element before React loads, causing
            hydration mismatch errors. Strip those tags until the page has loaded. */}
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttrs }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-beige focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>
          {children}
          <MobileActionBar />
          <BackToTop />
          <Cursor />
        </Providers>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
