"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ca_cookie_consent");
      if (!consent) setVisible(true);
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, []);

  const accept = () => {
    localStorage.setItem("ca_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("ca_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-lunar border-t border-white/20 px-6 py-4"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-ui text-xs text-white/70">
          We use functional cookies to provide this experience. Analytics are
          optional.{" "}
          <a
            href="/legal/privacy-policy"
            className="text-sapling underline underline-offset-2"
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-4 flex-shrink-0">
          <button
            onClick={decline}
            className="font-heading text-xs tracking-nav text-white/50 hover:text-white transition-colors duration-200"
          >
            DECLINE
          </button>
          <button
            onClick={accept}
            className="font-heading text-xs tracking-nav px-4 py-2 border border-sapling text-sapling hover:bg-sapling hover:text-lunar transition-colors duration-200"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
}
