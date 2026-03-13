import type { Metadata } from "next";
import { Raleway, Afacad } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import BackToTop from "@/components/layout/BackToTop";
import MobileInquireBar from "@/components/layout/MobileInquireBar";
import "@/styles/globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const afacadFlux = Afacad({
  subsets: ["latin"],
  variable: "--font-afacad",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Casa Avenida | Luxury Residences in Delray Beach, FL",
    template: "%s | Casa Avenida",
  },
  description:
    "Eight boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. Prices from the low $3M. Private elevator, cocktail pool, rooftop terrace. Completion Q2 2027.",
  metadataBase: new URL("https://casaavenidadelray.com"),
  keywords: [
    "Casa Avenida",
    "Delray Beach luxury real estate",
    "Delray Beach townhomes",
    "luxury condos Delray Beach",
    "pre-construction Delray Beach",
    "Atlantic Avenue Delray Beach",
    "South Florida luxury homes",
    "Douglas Elliman Delray Beach",
  ],
  authors: [{ name: "Casa Avenida" }],
  openGraph: {
    siteName: "Casa Avenida",
    locale: "en_US",
    type: "website",
    url: "https://casaavenidadelray.com",
    title: "Casa Avenida | Luxury Residences in Delray Beach, FL",
    description:
      "Eight boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach. Prices from the low $3M.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Casa Avenida — Luxury Residences in Delray Beach, FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Avenida | Luxury Residences in Delray Beach",
    description: "Eight boutique luxury townhomes at 102 SE 5th Ave, Delray Beach.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "https://casaavenidadelray.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${afacadFlux.variable}`}
    >
      <head>
        {/* Preload Quake OTF — WOFF2 listed as future-proof; OTF is the available file */}
        <link
          rel="preload"
          href="/fonts/Quake.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {/* CSS grain overlay — zero JS, position: fixed */}
        <div className="grain-overlay" aria-hidden="true" />

        <Navbar />

        <main id="main-content">
          {children}
        </main>

        <Footer />
        <BackToTop />
        <MobileInquireBar />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
