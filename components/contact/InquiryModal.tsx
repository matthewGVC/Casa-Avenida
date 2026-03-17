"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import InquiryForm from "./InquiryForm";
import type { Unit } from "@/lib/types";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  defaultUnit?: string;
}

export default function InquiryModal({ isOpen, onClose, units, defaultUnit }: InquiryModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Inquire about a residence"
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[61] w-auto md:w-full md:max-w-xl bg-lunar border border-sapling/20 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
              <div>
                <p className="font-heading text-sapling text-[10px] tracking-[0.2em] mb-1">CASA AVENIDA</p>
                <h2 className="font-heading text-white text-sm tracking-heading">INQUIRE ABOUT A RESIDENCE</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close inquiry form"
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-sapling transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <InquiryForm units={units} defaultUnit={defaultUnit} onSuccess={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
