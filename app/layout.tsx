import type { Metadata, Viewport } from "next";
import { Inter, Oxanium } from "next/font/google";
import "./globals.css";

const display = Oxanium({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dynatech-labs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dynatech Labs — Daniel Nathaniel Ayomide · Designer & Web Developer",
    template: "%s · Dynatech Labs",
  },
  description:
    "Dynatech Labs is the studio of Daniel Nathaniel Ayomide, a graphic designer and web developer in Abuja, Nigeria. Brand graphics, modern websites and photography.",
  openGraph: {
    type: "website",
    siteName: "Dynatech Labs",
    title: "Dynatech Labs — Design that speaks. Websites that work.",
    description: "Graphic design, web development and photography by Daniel Nathaniel Ayomide, Abuja.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Dynatech Labs" }],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Dynatechdesign",
    creator: "@Dynatechdesign",
    images: ["/brand/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
