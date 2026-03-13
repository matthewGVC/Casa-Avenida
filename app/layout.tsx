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
    default: "Casa Avenida | Luxury Residences in Delray Beach",
    template: "%s | Casa Avenida",
  },
  description:
    "8 boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. From the low $3M. Expected completion Q2 2027.",
  metadataBase: new URL("https://casaavenidadelray.com"),
  openGraph: {
    siteName: "Casa Avenida",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
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
        {/* Preload Quake font if present — gracefully no-ops if file is missing */}
        <link
          rel="preload"
          href="/fonts/Quake.woff2"
          as="font"
          type="font/woff2"
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
