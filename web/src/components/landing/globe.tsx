"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";

interface ThreatMarker {
  name: string;
  label: string;
  location: [number, number];
}

const THREATS: ThreatMarker[] = [
  { name: "North America - Phishing", label: "PHISHING", location: [37.3349, -122.009] },
  { name: "North America - ID Theft", label: "ID THEFT", location: [30.2218, -97.7737] },
  { name: "North America - Ransomware", label: "RANSOMWARE", location: [37.422, -122.084] },
  { name: "North America - Wire Fraud", label: "WIRE FRAUD", location: [47.6396, -122.1282] },
  { name: "North America - Smishing", label: "SMISHING", location: [46.8509, -121.7606] },
  { name: "North America - Vishing", label: "VISHING", location: [37.4848, -122.1484] },
  { name: "North America - Data Breach", label: "DATA BREACH", location: [37.3861, -121.9645] },
  { name: "East Coast - BEC", label: "BEC FRAUD", location: [40.7578, -73.9712] },
  { name: "East Coast - Card Fraud", label: "CARD FRAUD", location: [40.7527, -73.9772] },
  { name: "Midwest - Romance Scam", label: "ROMANCE SCAM", location: [41.8818, -87.6352] },
  { name: "West Coast - Tech Support", label: "TECH SCAM", location: [33.9202, -118.3291] },
  { name: "West Coast - Crypto Fraud", label: "CRYPTO FRAUD", location: [37.5326, -122.2065] },
  { name: "Russia - APT", label: "APT GROUP", location: [55.7558, 37.6173] },
  { name: "China - Espionage", label: "ESPIONAGE", location: [39.9042, 116.4074] },
  { name: "SE Asia - Call Center", label: "CALL CENTER", location: [22.5431, 114.0579] },
  { name: "Asia - Pig Butcher", label: "PIG BUTCHER", location: [31.2304, 121.4737] },
  { name: "Japan - Credential", label: "CREDENTIAL", location: [35.6585, 139.7454] },
  { name: "Korea - Deepfake", label: "DEEPFAKE", location: [37.3861, 127.1152] },
  { name: "Europe - GDPR", label: "DATA SALE", location: [52.3546, 4.9039] },
  { name: "Germany - Malware", label: "MALWARE", location: [48.1188, 11.6022] },
  { name: "UK - Invoice Fraud", label: "INVOICE FRAUD", location: [51.5074, -0.1278] },
  { name: "India - Support Scam", label: "SUPPORT SCAM", location: [12.9716, 77.5946] },
  { name: "Brazil - Banking Trojan", label: "TROJAN", location: [-23.5505, -46.6333] },
  { name: "Australia - SIM Swap", label: "SIM SWAP", location: [-33.8688, 151.2093] },
  { name: "UAE - Impersonation", label: "IMPERSONATION", location: [25.2048, 55.2708] },
  { name: "Sweden - Skimming", label: "SKIMMING", location: [59.3293, 18.0686] },
  { name: "Canada - Phishing", label: "PHISHING", location: [43.6532, -79.3832] },
];

const FEATURED_LABELS = [
  "PHISHING", "ID THEFT", "RANSOMWARE", "WIRE FRAUD", "SMISHING", "DATA BREACH",
  "BEC FRAUD", "CARD FRAUD", "ROMANCE SCAM", "CRYPTO FRAUD", "APT GROUP", "MALWARE",
  "TROJAN", "SIM SWAP", "DEEPFAKE", "SUPPORT SCAM",
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
        return prev.map((idx) => (idx + 1) % FEATURED_LABELS.length);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const markers = THREATS.map(({ location }) => ({
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
      markerColor: [0.85, 0.34, 0.34],
      glowColor: [0.55, 0.13, 0.13],
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
      {/* Red radial glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-red-600/10 blur-3xl scale-75" />

      {/* Floating threat labels */}
      <div className="absolute inset-0 pointer-events-none">
        {activeLabels.map((tickerIdx, i) => {
          const label = FEATURED_LABELS[tickerIdx];
          const angle = (i / activeLabels.length) * 360;
          const radius = 48;
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={`${label}-${i}`}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-zinc-900/80 backdrop-blur-sm px-2.5 py-1 shadow-lg shadow-red-600/10">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 live-indicator" />
                <span className="text-[10px] font-bold text-red-400 tracking-wider font-data">
                  {label}
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
