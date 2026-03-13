"use client";

import { type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  sublabel?: string; // e.g. floor summary "Garage, Foyer, Bedroom"
}

interface TabGroupProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Pill tab group. Used for: floor selector, finishes toggle, gallery filter,
 * unit detail tabs. Controlled — parent owns activeId state.
 */
export default function TabGroup({
  tabs,
  activeId,
  onChange,
  className = "",
  size = "md",
}: TabGroupProps) {
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div
      role="tablist"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`
              font-heading ${textSize} tracking-nav px-4 py-2 border transition-colors duration-200
              ${
                isActive
                  ? "border-sapling bg-sapling text-lunar"
                  : "border-white/20 text-white/60 hover:border-sapling/60 hover:text-white"
              }
            `}
          >
            <span>{tab.label.toUpperCase()}</span>
            {tab.sublabel && (
              <span className="block font-body text-[9px] tracking-normal normal-case opacity-70 mt-0.5">
                {tab.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── TabPanel ────────────────────────────────
// Renders children only when this panel is active

interface TabPanelProps {
  id: string;
  activeId: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, activeId, children, className = "" }: TabPanelProps) {
  if (id !== activeId) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
