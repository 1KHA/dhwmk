import dynamic from "next/dynamic";

const CountdownTimer = dynamic(() => import("@/components/ui/countdown-timer"), { ssr: false });

export default function HomePage() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative", margin: 0, padding: 0 }}>
      {/* Countdown overlay at top center */}
      <div
        style={{
          position: "absolute",
          top: "19%",
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
    </div>
  );
}
