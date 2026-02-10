import { useState, useEffect } from "react";

interface MarketStatus {
  isOpen: boolean;
  label: string;
  nextEvent: string;
}

function getMarketStatus(): MarketStatus {
  const now = new Date();
  // Convert to ET (NYSE timezone)
  const et = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const day = et.getDay(); // 0=Sun, 6=Sat
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 30; // 9:30 AM ET
  const marketClose = 16 * 60; // 4:00 PM ET

  // Weekend
  if (day === 0 || day === 6) {
    return { isOpen: false, label: "Market Closed", nextEvent: "Opens Monday" };
  }

  // Pre-market
  if (timeInMinutes < marketOpen) {
    const minsUntil = marketOpen - timeInMinutes;
    const h = Math.floor(minsUntil / 60);
    const m = minsUntil % 60;
    return {
      isOpen: false,
      label: "Pre-Market",
      nextEvent: h > 0 ? `Opens in ${h}h ${m}m` : `Opens in ${m}m`,
    };
  }

  // Market hours
  if (timeInMinutes < marketClose) {
    const minsUntil = marketClose - timeInMinutes;
    const h = Math.floor(minsUntil / 60);
    const m = minsUntil % 60;
    return {
      isOpen: true,
      label: "Market Open",
      nextEvent: h > 0 ? `Closes in ${h}h ${m}m` : `Closes in ${m}m`,
    };
  }

  // After hours
  return {
    isOpen: false,
    label: "After Hours",
    nextEvent: "Opens tomorrow 9:30 AM",
  };
}

export function useMarketStatus(): MarketStatus {
  const [status, setStatus] = useState<MarketStatus>(getMarketStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60_000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return status;
}
