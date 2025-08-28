"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative", margin: 0, padding: 0 }}>
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
        src="/dh04.png"
        alt="Full Background Image"
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
