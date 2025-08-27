"use client";
import React, { useEffect, useRef, useState } from "react";

// Helper to pad numbers with leading zeros
function pad(num: number, size = 2) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

const TIME_UNITS = [
  { key: "days", label: "يوم" },
  { key: "hours", label: "ساعة" },
  { key: "minutes", label: "دقيقة" },
  { key: "seconds", label: "ثانية" },
];

const DIGIT_HEIGHT = 48; // px, must match CSS

function getTimeLeft(target: Date) {
  const now = new Date();
  const distance = target.getTime() - now.getTime();
  if (distance <= 0) return null;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({
  targetDate = "2025-09-14T23:59:59",
  title = "الوقت المتبقي على إغلاق التسجيل",
}: {
  targetDate?: string;
  title?: string;
}) {
  const [time, setTime] = useState(getTimeLeft(new Date(targetDate)));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!time) {
      setExpired(true);
      return;
    }
    const interval = setInterval(() => {
      const t = getTimeLeft(new Date(targetDate));
      setTime(t);
      if (!t) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [targetDate]);

  // Animation: store previous values for smooth digit transitions
  const prevTime = useRef(time);
  useEffect(() => {
    prevTime.current = time;
  }, [time]);

  return (
    <div className="countdown-container" dir="rtl">
      {!expired ? (
        <div className="countdown-grid">
          {TIME_UNITS.map((unit, idx) => {
            const value = time ? time[unit.key as keyof typeof time] : 0;
            const valueStr = pad(value);
            return (
              <div className="time-unit" key={unit.key}>
                <div className="digits-container">
                  {[1, 0].map((digitIdx) => {
                    const digit = parseInt(valueStr[digitIdx]);
                    return (
                      <div className="digit-wrapper" key={digitIdx}>
                        <div
                          className="digit-column"
                          style={{
                            transform: `translateY(-${digit * DIGIT_HEIGHT}px)`,
                            transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        >
                          {[...Array(10)].map((_, i) => (
                            <div className="digit" key={i}>
                              {i}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="time-label">{unit.label}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="expired-message">انتهى وقت التسجيل!</div>
      )}
      <style>{`
        .countdown-container {
          text-align: center;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          background: rgba(255,255,255,0.0);
        }
        .countdown-title {
          display: none;
        }
        .countdown-grid {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .time-unit {
          background: #fff2e9;
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          min-width: 120px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid #fff2e9;
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          animation: fadeInScale 0.8s ease-out forwards;
        }
        .time-unit:nth-child(1) { animation-delay: 0.3s; }
        .time-unit:nth-child(2) { animation-delay: 0.4s; }
        .time-unit:nth-child(3) { animation-delay: 0.5s; }
        .time-unit:nth-child(4) { animation-delay: 0.6s; }
        .digits-container {
          display: flex;
          justify-content: center;
          gap: 0px;
          margin-bottom: 0.5rem;
        }
        .digit-wrapper {
          position: relative;
          width: 32px;
          height: 48px;
          overflow: hidden;
          background: transparent;
          border-radius: 8px;
          box-shadow: none;
        }
        .digit-column {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        .digit {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          color: #761814;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .time-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 640px) {
          .countdown-grid {
            gap: 0.5rem;
          }
          .time-unit {
            min-width: 70px;
            padding: 0.5rem 0.25rem;
            border-radius: 10px;
          }
          .digits-container {
            gap: 0px;
          }
          .digit-wrapper {
            width: 18px;
            height: 28px;
            border-radius: 4px;
          }
          .digit {
            height: 28px;
            font-size: 1.1rem;
          }
          .time-label {
            font-size: 0.7rem;
          }
          .countdown-title {
            font-size: 1rem;
          }
        }
        .expired-message {
          color: white;
          font-size: 2rem;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
