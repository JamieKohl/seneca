import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ToastContainer } from "@/components/ui/toast";
import { CookieConsent } from "@/components/cookie-consent";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export const metadata: Metadata = {
  title: {
    default: "KohlCorp Shield - Consumer Threat Intelligence",
    template: "%s | KohlCorp Shield",
  },
  description:
    "Consumer threat intelligence and automated protection. Real-time fraud detection, financial drain monitoring, data broker surveillance, and price manipulation alerts.",
  manifest: "/manifest.json",
  keywords: [
    "consumer threat intelligence",
    "fraud detection",
    "scam protection",
    "subscription tracker",
    "privacy protection",
    "price discrimination",
    "data broker surveillance",
    "financial monitoring",
  ],
  openGraph: {
    type: "website",
    title: "KohlCorp Shield - Consumer Threat Intelligence",
    description:
      "Real-time fraud detection, financial drain monitoring, and data broker surveillance. Consumer threat intelligence platform.",
    siteName: "KohlCorp Shield",
  },
  twitter: {
    card: "summary_large_image",
    title: "KohlCorp Shield - Consumer Threat Intelligence",
    description:
      "Real-time fraud detection, financial drain monitoring, and data broker surveillance.",
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
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <ToastContainer />
        <CookieConsent />
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
