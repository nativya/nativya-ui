import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderClient from "./provider/SessionProviderClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nativya - Regional Language Data Collection",
  description:
    "Contribute to the preservation and development of Indian languages through community-driven data collection. Support text and audio contributions in 12+ Indian languages.",
  keywords:
    "Indian languages, data collection, regional languages, Bengali, Malayalam, Hindi, Tamil, Telugu, Kannada, Gujarati, Marathi, Punjabi, Odia, Assamese, Urdu",
  authors: [{ name: "Nativya Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Nativya - Regional Language Data Collection",
    description:
      "Contribute to the preservation and development of Indian languages through community-driven data collection.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nativya - Regional Language Data Collection",
    description:
      "Contribute to the preservation and development of Indian languages through community-driven data collection.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nativya" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col scroll-smooth`}
      >
        <SessionProviderClient>{children}</SessionProviderClient>
      </body>
    </html>
  );
}
