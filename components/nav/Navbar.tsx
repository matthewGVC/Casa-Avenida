"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/residences", label: "Residences" },
  { href: "/floorplans", label: "Floorplans" },
  { href: "/gallery", label: "Gallery" },
  { href: "/virtual-tour", label: "Virtual Tour" },
  { href: "/neighborhood", label: "Neighborhood" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: scrolled ? 64 : 84,
          background: scrolled
            ? "rgba(14,11,5,0.82)"
            : "linear-gradient(to bottom, rgba(14,11,5,0.55) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          borderBottom: "1px solid",
          borderBottomColor: scrolled ? "rgba(223,209,167,0.10)" : "transparent",
          transition: "height 0.4s ease, background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div aria-hidden="true" style={{
          position: "absolute", bottom: 0, left: "18%", right: "18%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.38) 50%, transparent)",
          opacity: scrolled ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: "none",
        }} />

        <nav aria-label="Primary navigation" style={{
          maxWidth: 1440, margin: "0 auto", padding: "0 48px",
          height: "100%", display: "flex", alignItems: "center", position: "relative",
        }}>
          <Link href="/" aria-label="Casa Avenida" style={{ lineHeight: 0, flexShrink: 0 }}>
            <Image
              src="/images/logos/casa%20avenida%20logos/Casa%20Avenida%20-%20Gold%20Bronze.svg"
              alt="Casa Avenida" width={148} height={30} priority
              style={{ height: 26, width: "auto" }}
            />
          </Link>

          <ul role="list" className="hidden lg:flex" style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            alignItems: "center", gap: 28, margin: 0, padding: 0, listStyle: "none",
          }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href} style={{ position: "relative" }}>
                  <NavLink href={href} label={label} active={active} />
                  {active && (
                    <span aria-hidden="true" style={{
                      position: "absolute", bottom: 2, left: "50%",
                      transform: "translateX(-50%)", width: 3, height: 3,
                      borderRadius: "50%", background: "#DFD1A7",
                      boxShadow: "0 0 5px rgba(223,209,167,0.7)", display: "block",
                    }} />
                  )}
                </li>
              );
            })}
          </ul>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <InquireButton />
            <Hamburger open={mobileOpen} onToggle={() => setMobileOpen(v => !v)} />
          </div>
        </nav>
      </header>

      <MobileNav id="mobile-nav" links={NAV_LINKS} isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", fontFamily: "var(--font-raleway)", fontSize: 10,
        letterSpacing: hovered && !active ? "0.16em" : "0.13em", fontWeight: 500,
        color: active ? "#DFD1A7" : hovered ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
        textDecoration: "none", paddingBottom: 12,
        transition: "color 0.2s ease, letter-spacing 0.25s ease",
        whiteSpace: "nowrap", position: "relative",
      }}
    >
      {label.toUpperCase()}
      <span style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: active ? "#DFD1A7" : "rgba(255,255,255,0.2)",
        transform: hovered || active ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left", transition: "transform 0.25s ease",
      }} />
    </Link>
  );
}

function InquireButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href="/contact" className="hidden lg:inline-flex"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden", fontFamily: "var(--font-raleway)",
        fontSize: 10, letterSpacing: "0.16em", fontWeight: 500,
        color: hovered ? "#373A36" : "#DFD1A7", border: "1px solid",
        borderColor: hovered ? "#DFD1A7" : "rgba(223,209,167,0.4)",
        padding: "9px 20px", textDecoration: "none",
        transition: "color 0.3s ease, border-color 0.3s ease",
        whiteSpace: "nowrap", alignItems: "center",
      }}
    >
      <span style={{
        position: "absolute", inset: 0, background: "#DFD1A7",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left", transition: "transform 0.3s ease",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>INQUIRE</span>
    </Link>
  );
}

function Hamburger({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button className="lg:hidden" onClick={onToggle}
      aria-expanded={open} aria-controls="mobile-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 22 }}>
        <span style={{ display: "block", width: "100%", height: 1, background: "white", borderRadius: 1,
          transition: "transform 0.3s ease", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
        <span style={{ display: "block", width: "100%", height: 1, background: "white", borderRadius: 1,
          transition: "opacity 0.3s ease", opacity: open ? 0 : 1 }} />
        <span style={{ display: "block", width: "100%", height: 1, background: "white", borderRadius: 1,
          transition: "transform 0.3s ease", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
      </div>
    </button>
  );
}
