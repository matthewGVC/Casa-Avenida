"use client";

import Link from "next/link";
import Image from "next/image";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  id: string;
  links: NavLink[];
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

const STAGGER_MS = [0, 45, 90, 135, 180, 225, 270, 315, 360];

export default function MobileNav({ id, links, isOpen, onClose, pathname }: MobileNavProps) {
  return (
    <div
      id={id}
      aria-hidden={!isOpen}
      className="lg:hidden"
      style={{
        position: "fixed", inset: 0, zIndex: 40,
        display: "flex", flexDirection: "column",
        background: "linear-gradient(160deg, #14110A 0%, #1E1B10 40%, #373A36 100%)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.35s ease",
      }}
    >
      {/* Gold atmospheric glow at top */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ padding: "22px 32px", flexShrink: 0, lineHeight: 0 }}>
        <Image
          src="/images/logos/casa%20avenida%20logos/Casa%20Avenida%20-%20Gold%20Bronze.svg"
          alt="Casa Avenida" width={140} height={28}
          style={{ height: 24, width: "auto" }}
        />
      </div>

      {/* Rule */}
      <div style={{ margin: "0 32px", height: 1, background: "rgba(223,209,167,0.12)", flexShrink: 0 }} />

      {/* Links */}
      <nav aria-label="Mobile navigation" style={{
        flex: 1, display: "flex", alignItems: "center",
        padding: "0 32px", overflowY: "auto",
      }}>
        <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0, width: "100%" }}>
          {links.map(({ href, label }, i) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const delay = STAGGER_MS[i] || 0;
            return (
              <li key={href} style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transform: isOpen ? "translateY(0)" : "translateY(16px)",
                opacity: isOpen ? 1 : 0,
                transition: "transform 0.45s ease " + delay + "ms, opacity 0.45s ease " + delay + "ms",
              }}>
                <Link href={href} onClick={onClose} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "15px 0", fontFamily: "var(--font-raleway)",
                  fontSize: 12, letterSpacing: "0.13em",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#DFD1A7" : "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}>
                  {label.toUpperCase()}
                  {active && (
                    <span style={{
                      width: 4, height: 4, borderRadius: "50%",
                      background: "#DFD1A7", flexShrink: 0,
                      boxShadow: "0 0 6px rgba(223,209,167,0.6)",
                    }} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CTA */}
      <div style={{
        padding: "24px 32px 52px", flexShrink: 0,
        transform: isOpen ? "translateY(0)" : "translateY(12px)",
        opacity: isOpen ? 1 : 0,
        transition: "transform 0.5s ease 380ms, opacity 0.5s ease 380ms",
      }}>
        <Link href="/contact" onClick={onClose} style={{
          display: "block", textAlign: "center",
          fontFamily: "var(--font-raleway)", fontSize: 10,
          letterSpacing: "0.18em", fontWeight: 600,
          color: "#373A36", background: "#DFD1A7",
          padding: "14px 24px", textDecoration: "none",
        }}>
          INQUIRE ABOUT A RESIDENCE
        </Link>
      </div>
    </div>
  );
}
