import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blinko.site"),
  title: {
    default: "Blinko — AI-Powered Link-in-Bio & Mini Website Builder",
    template: "%s | Blinko",
  },
  description:
    "Create a beautiful AI-powered link-in-bio page, portfolio, contact hub, and mini website in seconds with Blinko.",
  openGraph: {
    title: "Blinko — AI-Powered Link-in-Bio & Mini Website Builder",
    description: "Create your online presence in 30 seconds.",
    url: "https://blinko.site",
    siteName: "Blinko",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blinko",
    description: "AI-powered link-in-bio platform.",
  },
};

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
