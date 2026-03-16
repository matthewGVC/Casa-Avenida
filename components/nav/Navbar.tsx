"use client";

import { useEffect, useRef, useState } from "react";
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
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 60);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "nav-solid" : "nav-transparent"
        }`}
        role="banner"
      >
        <nav
          className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0"
            aria-label="Casa Avenida — return to home"
          >
            <Image
              src="/images/logos/casa%20avenida%20logos/Casa%20Avenida%20-%20Gold%20Bronze.svg"
              alt="Casa Avenida"
              width={160}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`font-heading text-xs tracking-nav hover:tracking-nav-hover transition-all duration-200 pb-0.5 border-b ${
                      isActive
                        ? "text-sapling border-sapling"
                        : "text-white/80 border-transparent hover:text-sapling hover:border-sapling"
                    }`}
                  >
                    {label.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Inquire CTA — desktop */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="btn-sweep font-heading text-xs tracking-nav px-5 py-2.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
            >
              INQUIRE
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-6 h-px bg-current transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-current transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-current transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <MobileNav
        id="mobile-nav"
        links={NAV_LINKS}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
