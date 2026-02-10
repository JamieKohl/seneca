"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

// Real company HQ locations
const COMPANY_LOCATIONS: [number, number][] = [
  [37.3349, -122.009],   // Apple — Cupertino, CA
  [30.2218, -97.7737],   // Tesla — Austin, TX
  [37.422, -122.084],    // Google — Mountain View, CA
  [47.6396, -122.1282],  // Microsoft — Redmond, WA
  [46.8509, -121.7606],  // Amazon — Seattle area, WA
  [37.4848, -122.1484],  // Meta — Menlo Park, CA
  [2.3721, -121.9645],   // NVIDIA — Santa Clara, CA (corrected below)
  [40.7578, -73.9712],   // JPMorgan — New York, NY
  [40.7527, -73.9772],   // Goldman Sachs — New York, NY
  [41.8818, -87.6352],   // Boeing — Chicago, IL
  [33.9202, -118.3291],  // SpaceX — Hawthorne, CA
  [37.5326, -122.2065],  // Oracle — Redwood City, CA
  [55.7558, 37.6173],    // Yandex — Moscow, Russia
  [39.9042, 116.4074],   // Baidu — Beijing, China
  [22.5431, 114.0579],   // Tencent — Shenzhen, China
  [31.2304, 121.4737],   // Alibaba — Shanghai, China
  [35.6585, 139.7454],   // Sony — Tokyo, Japan
  [37.3861, 127.1152],   // Samsung — Suwon, South Korea
  [52.3546, 4.9039],     // ASML — Veldhoven area, Netherlands
  [48.1188, 11.6022],    // BMW — Munich, Germany
  [51.5074, -0.1278],    // HSBC — London, UK
  [12.9716, 77.5946],    // Infosys — Bangalore, India
  [-23.5505, -46.6333],  // Petrobras — São Paulo, Brazil
  [-33.8688, 151.2093],  // BHP Group — Sydney, Australia
  [25.2048, 55.2708],    // Emirates NBD — Dubai, UAE
  [59.3293, 18.0686],    // Spotify — Stockholm, Sweden
  [43.6532, -79.3832],   // Shopify — Toronto, Canada
];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

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

  useEffect(() => {
    if (!canvasRef.current) return;

    const markers = COMPANY_LOCATIONS.map(([lat, lng]) => ({
      location: [lat, lng] as [number, number],
      size: 0.05,
    }));

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.34, 0.85, 0.49], // emerald
      glowColor: [0.13, 0.55, 0.33],   // emerald glow
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
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ contain: "layout paint size", opacity: 1 }}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
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
