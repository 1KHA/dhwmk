"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Head from "next/head";
import Loader from "@/components/ui/loader";

const CountdownTimer = dynamic(() => import("@/components/ui/countdown-timer"), { ssr: false });
const ImageCarousel = dynamic(() => import("@/components/ui/image-carousel"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/ui/faq-section"), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [topPosition, setTopPosition] = useState("20%");
  const [countdownTopPosition, setCountdownTopPosition] = useState("12%");
  const [showLoader, setShowLoader] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Loader timer effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderVisible(false);
      // Start content fade in after loader starts fading out
      setTimeout(() => {
        setShowLoader(false);
        setContentVisible(true);
      }, 300); // Wait for loader fade out to complete
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Manual breakpoints for each 200px range from smallest to largest
      if (window.innerWidth < 520) {
        // Mobile phones (320-519px)
        setTopPosition("5%");
        setCountdownTopPosition("6%");
      } else if (window.innerWidth < 720) {
        // Large phones / Small tablets (520-719px)
        setTopPosition("6%");
        setCountdownTopPosition("7%");
      } else if (window.innerWidth < 920) {
        // Tablets (720-919px)
        setTopPosition("7%");
        setCountdownTopPosition("7%");
      } else if (window.innerWidth < 1120) {
        // Small laptops (920-1119px)
        setTopPosition("8%");
        setCountdownTopPosition("8%");
      } else if (window.innerWidth < 1320) {
        // Medium laptops (1120-1319px)
        setTopPosition("9%");
        setCountdownTopPosition("8%");
      } else if (window.innerWidth < 1520) {
        // Large laptops (1320-1519px)
        setTopPosition("10%");
        setCountdownTopPosition("9%");
      } else if (window.innerWidth < 1720) {
        // Desktop monitors (1520-1719px)
        setTopPosition("12%");
        setCountdownTopPosition("10%");
      } else if (window.innerWidth < 1920) {
        // Large desktop monitors (1720-1919px)
        setTopPosition("14%");
        setCountdownTopPosition("9%");
      } else {
        // Ultra-wide monitors (1920px+)
        setTopPosition("15%");
        setCountdownTopPosition("10%");
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
    <>
      {/* Loader with smooth fade out */}
      {showLoader && <Loader isVisible={loaderVisible} />}
      
      {/* Main content with smooth fade in */}
      <div 
        className={`transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: "100%", minHeight: "100vh", position: "relative", margin: 0, padding: 0 }}
      >
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
      {/* Responsive background image */}
      <picture>
        <source media="(max-width: 520px)" srcSet="/mobtop.png" />
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
      </picture>
      {/* Image Carousel below the background */}
      <ImageCarousel />
      {/* FAQ Section below the carousel */}
      <FAQSection />
      
      {/* Footer Image */}
      <div className="w-full">
        <img 
          src="/footer.png" 
          alt="Footer" 
          className="w-full h-auto"
          style={{ display: "block" }}
        />
      </div>
      </div>
    </>
  );
}
