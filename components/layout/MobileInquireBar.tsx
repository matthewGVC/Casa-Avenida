"use client";

import { useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface MobileInquireBarProps {
  units: Unit[];
}

export default function MobileInquireBar({ units }: MobileInquireBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
        <button
          onClick={openModal}
          className="flex items-center justify-center w-full h-11 bg-sapling text-lunar font-heading text-xs tracking-nav hover:bg-sapling/90 transition-colors duration-200"
          aria-label="Inquire about a residence"
        >
          INQUIRE ABOUT A RESIDENCE
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
