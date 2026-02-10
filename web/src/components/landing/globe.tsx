"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";

interface CompanyMarker {
  name: string;
  ticker: string;
  location: [number, number];
}

const COMPANIES: CompanyMarker[] = [
  { name: "Apple", ticker: "AAPL", location: [37.3349, -122.009] },
  { name: "Tesla", ticker: "TSLA", location: [30.2218, -97.7737] },
  { name: "Google", ticker: "GOOGL", location: [37.422, -122.084] },
  { name: "Microsoft", ticker: "MSFT", location: [47.6396, -122.1282] },
  { name: "Amazon", ticker: "AMZN", location: [46.8509, -121.7606] },
  { name: "Meta", ticker: "META", location: [37.4848, -122.1484] },
  { name: "NVIDIA", ticker: "NVDA", location: [37.3861, -121.9645] },
  { name: "JPMorgan", ticker: "JPM", location: [40.7578, -73.9712] },
  { name: "Goldman Sachs", ticker: "GS", location: [40.7527, -73.9772] },
  { name: "Boeing", ticker: "BA", location: [41.8818, -87.6352] },
  { name: "SpaceX", ticker: "SPACE", location: [33.9202, -118.3291] },
  { name: "Oracle", ticker: "ORCL", location: [37.5326, -122.2065] },
  { name: "Yandex", ticker: "YNDX", location: [55.7558, 37.6173] },
  { name: "Baidu", ticker: "BIDU", location: [39.9042, 116.4074] },
  { name: "Tencent", ticker: "TCEHY", location: [22.5431, 114.0579] },
  { name: "Alibaba", ticker: "BABA", location: [31.2304, 121.4737] },
  { name: "Sony", ticker: "SONY", location: [35.6585, 139.7454] },
  { name: "Samsung", ticker: "SSNLF", location: [37.3861, 127.1152] },
  { name: "ASML", ticker: "ASML", location: [52.3546, 4.9039] },
  { name: "BMW", ticker: "BMWYY", location: [48.1188, 11.6022] },
  { name: "HSBC", ticker: "HSBC", location: [51.5074, -0.1278] },
  { name: "Infosys", ticker: "INFY", location: [12.9716, 77.5946] },
  { name: "Petrobras", ticker: "PBR", location: [-23.5505, -46.6333] },
  { name: "BHP Group", ticker: "BHP", location: [-33.8688, 151.2093] },
  { name: "Emirates NBD", ticker: "ENBD", location: [25.2048, 55.2708] },
  { name: "Spotify", ticker: "SPOT", location: [59.3293, 18.0686] },
  { name: "Shopify", ticker: "SHOP", location: [43.6532, -79.3832] },
];

// Show a rotating subset of tickers as floating labels
const FEATURED_TICKERS = [
  "AAPL", "TSLA", "GOOGL", "MSFT", "AMZN", "NVDA", "META", "JPM",
  "SONY", "BABA", "ASML", "SHOP", "SPOT", "BHP", "HSBC", "INFY",
];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const [activeLabels, setActiveLabels] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  // Rotate featured labels
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLabels((prev) => {
        return prev.map((idx) => (idx + 1) % FEATURED_TICKERS.length);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const markers = COMPANIES.map(({ location }) => ({
      location,
      size: 0.06,
    }));

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.34, 0.85, 0.49],
      glowColor: [0.13, 0.55, 0.33],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      globe.destroy();
      resizeObserver.disconnect();
    };
  }, [onResize]);

  return (
    <div className="relative aspect-square w-full max-w-[600px] mx-auto">
      {/* Emerald radial glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl scale-75" />
      
      {/* Floating ticker labels */}
      <div className="absolute inset-0 pointer-events-none">
        {activeLabels.map((tickerIdx, i) => {
          const ticker = FEATURED_TICKERS[tickerIdx];
          const angle = (i / activeLabels.length) * 360;
          const radius = 48;
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={`${ticker}-${i}`}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-zinc-900/80 backdrop-blur-sm px-2.5 py-1 shadow-lg shadow-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider">
                  {ticker}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ contain: "layout paint size", opacity: 1 }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
      />
    </div>
  );
}
