"use client";

import { useEffect, useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface FloatingCTAProps {
  units: Unit[];
}

export default function FloatingCTA({ units }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const pct = window.scrollY / scrollable;
      // Show after 30% scroll, hide after 90%
      setVisible(pct > 0.3 && pct < 0.9);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div
        className={`
          fixed bottom-8 left-1/2 -translate-x-1/2 z-40
          transition-all duration-500
          ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        aria-hidden={!visible}
      >
        <button
          onClick={openModal}
          tabIndex={visible ? 0 : -1}
          className="btn-sweep flex items-center gap-3 font-heading text-xs tracking-nav px-7 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 shadow-lg backdrop-blur-sm bg-lunar/60"
        >
          INQUIRE ABOUT A RESIDENCE
          <span aria-hidden="true" className="text-sapling/60">→</span>
        </button>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={closeModal}
        units={units}
      />
    </>
  );
}
