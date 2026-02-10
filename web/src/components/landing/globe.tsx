"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

const FINANCIAL_CENTERS: [number, number][] = [
  [40.7128, -74.006],    // New York
  [51.5074, -0.1278],    // London
  [35.6762, 139.6503],   // Tokyo
  [22.3193, 114.1694],   // Hong Kong
  [1.3521, 103.8198],    // Singapore
  [48.8566, 2.3522],     // Paris
  [19.076, 72.8777],     // Mumbai
  [-33.8688, 151.2093],  // Sydney
  [25.2048, 55.2708],    // Dubai
  [47.3769, 8.5417],     // Zurich
];

function locationToAngles(lat: number, lng: number): [number, number] {
  return [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

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

    const markers = FINANCIAL_CENTERS.map(([lat, lng]) => ({
      location: [lat, lng] as [number, number],
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
