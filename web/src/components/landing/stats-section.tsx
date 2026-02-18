"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Fraud Losses",
    target: 12500000000,
    prefix: "$",
    suffix: "",
    display: "$12.5B",
    trend: "+14%",
    source: "Source: FTC 2024",
  },
  {
    label: "FTC Complaints Filed",
    target: 2600000,
    prefix: "",
    suffix: "",
    display: "2.6M",
    trend: "+8%",
    source: "Source: FTC 2024",
  },
  {
    label: "Monthly Subscription Waste",
    target: 133,
    prefix: "$",
    suffix: "",
    display: "$133",
    trend: "+22%",
    source: "Source: Consumer Reports",
  },
  {
    label: "Americans in Data Breaches",
    target: 25,
    prefix: "1 in ",
    suffix: "",
    display: "1 in 4",
    trend: "+11%",
    source: "Source: FBI IC3 2024",
  },
];

function formatNum(n: number): string {
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + "B";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return n.toString();
}

function AnimatedStat({
  target,
  prefix,
  display,
}: {
  target: number;
  prefix: string;
  suffix: string;
  display: string;
}) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDone(true);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-white sm:text-4xl tabular-nums font-data">
      {done ? display : `${prefix}${formatNum(value)}`}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-900/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-2">
            THREAT ASSESSMENT
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            THE NUMBERS ARE GETTING WORSE
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedStat
                target={stat.target}
                prefix={stat.prefix}
                suffix={stat.suffix}
                display={stat.display}
              />
              <div className="mt-2 flex items-center justify-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-bold text-red-500 font-data">
                  {stat.trend}
                </span>
              </div>
              <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
              <div className="mt-1 text-[10px] text-zinc-600 font-data">
                {stat.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
