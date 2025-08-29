"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Head from "next/head";

const CountdownTimer = dynamic(() => import("@/components/ui/countdown-timer"), { ssr: false });
const ImageCarousel = dynamic(() => import("@/components/ui/image-carousel"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/ui/faq-section"), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [topPosition, setTopPosition] = useState("20%");
  const [countdownTopPosition, setCountdownTopPosition] = useState("12%");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTopPosition("9%");
        setCountdownTopPosition("6%");
      } else if (window.innerWidth <= 945) {
        setTopPosition("9%");
        setCountdownTopPosition("11%");
      } else if (window.innerWidth < 1125) {
        setTopPosition("9%");
        setCountdownTopPosition("8%");
      } else {
        setTopPosition("15%");
        setCountdownTopPosition("12%");
      }
    };

    // Set initial position
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleYellowBoxClick = () => {
    router.push('/register-team');
  };

  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "جائزة مايدة محي الدين ناظر للابتكار 3",
      "description": "تحدي يجمع طلبة الجامعات لاستكشاف وتوظيف الابتكارات الجامعية، توفر جائزة مايـدة محي الديـــن ناظـــر للابتكــــار هاكاثون الابتكار فرصة للعمل ضمن فرق تنافسية على تطوير حلول مبتكرة تسهم في تعزيز الاستدامة وجودة الحيـاة",
      "organizer": {
        "@type": "Organization",
        "name": "جامعة دار الحكمة",
        "url": "https://dah.edu.sa"
      },
      "location": {
        "@type": "Place",
        "name": "جامعة دار الحكمة",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "جدة",
          "addressCountry": "SA"
        }
      },
      "keywords": [
        "جائزة مايدة محي الدين ناظر للابتكار 3",
        "جائزة مايدة محي الدين ناظر للابتكار",
        "جائزة مايدة",
        "هاكاثون الابتكار",
        "دار الحكمة",
        "جامعة دار الحكمة",
        "تحدي يجمع طلبة الجامعات لاستكشاف وتوظيف الابتكارات الجامعية",
        "الاستدامة",
        "جودة الحياة"
      ],
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "url": "https://dar-alhekma.dyam.dev/"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(s => {
        if (s.textContent?.includes('جائزة مايدة محي الدين ناظر للابتكار 3')) {
          document.head.removeChild(s);
        }
      });
    };
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative", margin: 0, padding: 0 }}>
      {/* SEO Content - Hidden but readable by search engines */}
      <div style={{ 
        position: "absolute", 
        left: "-9999px", 
        width: "1px", 
        height: "1px", 
        overflow: "hidden" 
      }}>
        <h1>جائزة مايدة محي الدين ناظر للابتكار 3</h1>
        <h2>هاكاثون الابتكار في جامعة دار الحكمة</h2>
        <p>
          تحدي يجمع طلبة الجامعات لاستكشاف وتوظيف الابتكارات الجامعية، توفر جائزة مايـدة محي الديـــن ناظـــر للابتكــــار 
          هاكاثون الابتكار فرصة للعمل ضمن فرق تنافسية على تطوير حلول مبتكرة تسهم في تعزيز الاستدامة وجودة الحيـاة 
          في جامعة دار الحكمة. انضم إلى هاكاثون الابتكار واكتشف قدراتك في الابتكار والتطوير.
        </p>
        <p>
          دار الحكمة تستضيف جائزة مايدة محي الدين ناظر للابتكار 3، حيث يلتقي الطلاب المبدعون من مختلف الجامعات 
          للمشاركة في تحدي الابتكار وتطوير حلول مستدامة تخدم المجتمع وتحسن جودة الحياة.
        </p>
      </div>
      {/* Countdown overlay at top center */}
      <div
        style={{
          position: "absolute",
          top: countdownTopPosition,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none", // allow interaction with background
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <CountdownTimer />
        </div>
      </div>
      {/* Clickable transparent box over yellow box */}
      <div
        onClick={handleYellowBoxClick}
        style={{
          position: "absolute",
          top: topPosition,
          right: "1%",
          width: "500px",
          height: "500px",
          zIndex: 5,
          cursor: "pointer",
          backgroundColor: "transparent",
        }}
        aria-label="Navigate to register team page"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleYellowBoxClick();
          }
        }}
      />
      {/* Full background image */}
      <img
        src="/dhnew01.png"
        alt="جائزة مايدة محي الدين ناظر للابتكار 3 - هاكاثون الابتكار في جامعة دار الحكمة"
        style={{
          width: "100%",
          maxWidth: "none",
          height: "auto",
          display: "block",
        }}
      />
      {/* Image Carousel below the background */}
      <ImageCarousel />
      {/* FAQ Section below the carousel */}
      <FAQSection />
    </div>
  );
}
