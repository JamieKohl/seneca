import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "@/components/ui/toast";
import { CookieConsent } from "@/components/cookie-consent";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export const metadata: Metadata = {
  title: {
    default: "KohlCorp Shield - AI Consumer Protection",
    template: "%s | KohlCorp Shield",
  },
  description:
    "Your AI bodyguard for money & privacy. Shield fights scams, tracks subscriptions, protects your privacy, and catches price discrimination — automatically.",
  manifest: "/manifest.json",
  keywords: [
    "scam protection",
    "consumer protection",
    "subscription tracker",
    "privacy protection",
    "price discrimination",
    "AI security",
    "fraud detection",
    "data broker opt-out",
  ],
  openGraph: {
    type: "website",
    title: "KohlCorp Shield - AI Consumer Protection",
    description:
      "Your AI bodyguard for money & privacy. Stop scams, save on subscriptions, and protect your data.",
    siteName: "KohlCorp Shield",
  },
  twitter: {
    card: "summary_large_image",
    title: "KohlCorp Shield - AI Consumer Protection",
    description:
      "Your AI bodyguard for money & privacy. Stop scams, save on subscriptions, and protect your data.",
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
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950`}>
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
