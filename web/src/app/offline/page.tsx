import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800/50 border border-zinc-700">
            <WifiOff className="h-10 w-10 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-zinc-400 mb-6">
            It looks like you&apos;ve lost your internet connection. KohlCorp needs a connection to show live market data and alerts.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </a>
          <p className="mt-8 text-xs text-zinc-600">
            KohlCorp - AI-Powered Stock Alerts
          </p>
        </div>
      </body>
    </html>
  );
}
