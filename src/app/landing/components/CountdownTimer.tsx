"use client";
import React, { useEffect, useState } from "react";

/*
 * Live countdown for the hero — same rolling-digit timer as the original home page,
 * restyled in the landing page's `--u` unit system so it scales with the artwork.
 */

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const TIME_UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "يوم" },
  { key: "hours", label: "ساعة" },
  { key: "minutes", label: "دقيقة" },
  { key: "seconds", label: "ثانية" },
];

function pad(num: number, size = 2) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const distance = target.getTime() - Date.now();
  if (distance <= 0) return null;
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

export default function CountdownTimer({
  targetDate = "2025-09-25T23:59:59",
}: {
  targetDate?: string;
}) {
  // Server and first client paint render zeros so hydration matches; the real
  // values roll in on mount.
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const tick = () => setTime(getTimeLeft(new Date(targetDate)));
    tick();
    setMounted(true);
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (mounted && !time) {
    return (
      <div className="dhl-cd" dir="rtl">
        <div className="dhl-cd-expired">انتهى وقت التسجيل!</div>
      </div>
    );
  }

  return (
    <div className="dhl-cd" dir="rtl">
      <div className="dhl-cd-grid">
        {TIME_UNITS.map((unit) => {
          const valueStr = pad(time ? time[unit.key] : 0);
          // right-to-left inside the card: units digit first, then tens (then hundreds)
          const digitIndexes = valueStr.split("").map((_, i) => i).reverse();
          return (
            <div className="dhl-cd-unit" key={unit.key}>
              <div className="dhl-cd-digits">
                {digitIndexes.map((digitIdx) => (
                  <div className="dhl-cd-window" key={digitIdx}>
                    <div
                      className="dhl-cd-column"
                      style={{ transform: `translateY(calc(-${valueStr[digitIdx]} * var(--digit-height)))` }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <div className="dhl-cd-digit" key={i}>
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="dhl-cd-label">{unit.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
