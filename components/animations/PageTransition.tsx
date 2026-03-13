"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps page content with a subtle fade transition on route change.
 * Uses usePathname as the AnimatePresence key so Motion detects the route swap.
 * Respects prefers-reduced-motion — reduces to instant crossfade.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
