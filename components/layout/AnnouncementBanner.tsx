"use client";

import { useState } from "react";

interface AnnouncementBannerProps {
  message: string;
}

export default function AnnouncementBanner({ message }: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    window.dispatchEvent(new CustomEvent("banner-dismissed"));
  };

  return (
    <div
      role="banner"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 60,
        background: "linear-gradient(90deg, #14110A 0%, #1E1A0A 40%, #14110A 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 48px",
        height: 36,
      }}
    >
      <div aria-hidden="true" style={{
        position: "absolute",
        bottom: 0, left: "20%", right: "20%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45) 50%, transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span aria-hidden="true" style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#C9A84C",
          boxShadow: "0 0 6px rgba(201,168,76,0.8)",
          flexShrink: 0,
          animation: "pulse 2s ease-in-out infinite",
        }} />
        <p style={{
          fontFamily: "var(--font-raleway)",
          fontSize: 10,
          letterSpacing: "0.16em",
          fontWeight: 500,
          color: "#DFD1A7",
          margin: 0,
          whiteSpace: "nowrap",
        }}>
          {message.toUpperCase()}
        </p>
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute", right: 16,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(223,209,167,0.4)", padding: 6, lineHeight: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#DFD1A7")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(223,209,167,0.4)")}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
