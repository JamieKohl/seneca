import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChatWidget } from "@/components/chat-widget";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KohlCorp - AI-Powered Stock Predictions & Alerts",
    template: "%s | KohlCorp",
  },
  description:
    "Get AI-powered buy, sell, and hold alerts with profit estimates. Real-time stock market predictions and news-driven insights. Never miss a trade again.",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  keywords: [
    "stock alerts",
    "AI trading",
    "buy sell hold",
    "stock predictions",
    "market alerts",
    "broker companion",
    "Robinhood alerts",
    "stock signals",
  ],
  openGraph: {
    type: "website",
    title: "KohlCorp - AI-Powered Stock Predictions & Alerts",
    description:
      "Get AI-powered buy, sell, and hold alerts. We tell you exactly when to open your broker and act.",
    siteName: "KohlCorp",
  },
  twitter: {
    card: "summary_large_image",
    title: "KohlCorp - AI-Powered Stock Alerts",
    description:
      "Get AI-powered buy, sell, and hold alerts with profit estimates.",
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
        {children}
        <ChatWidget />
        <ToastContainer />
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
