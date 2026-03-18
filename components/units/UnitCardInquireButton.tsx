"use client";

import { useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface UnitCardInquireButtonProps {
  unit: Unit;
  allUnits: Unit[];
}

export default function UnitCardInquireButton({ unit, allUnits }: UnitCardInquireButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="btn-sweep font-heading text-[10px] tracking-heading px-4 py-2 border border-sapling/30 text-sapling/70 hover:text-lunar hover:border-sapling transition-colors duration-300"
        aria-label={`Inquire about ${unit.name}`}
      >
        INQUIRE →
      </button>

      <InquiryModal
        isOpen={open}
        onClose={close}
        units={allUnits}
        defaultUnit={unit.id}
      />
    </>
  );
}
