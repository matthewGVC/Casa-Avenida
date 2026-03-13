"use client";

import Link from "next/link";

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

export default function MobileNav({
  id,
  links,
  isOpen,
  onClose,
  pathname,
}: MobileNavProps) {
  return (
    <div
      id={id}
      className={`fixed inset-0 z-40 bg-lunar flex flex-col items-center justify-center transition-opacity duration-300 lg:hidden ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Logo */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center">
        <span className="font-display text-sapling text-xl tracking-wider">
          CASA AVENIDA
        </span>
      </div>

      <nav aria-label="Mobile navigation">
        <ul className="flex flex-col items-center gap-8" role="list">
          {links.map(({ href, label }, i) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li
                key={href}
                style={{
                  transitionDelay: isOpen ? `${i * 60}ms` : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(12px)",
                  opacity: isOpen ? 1 : 0,
                  transition: "transform 0.4s ease, opacity 0.4s ease",
                }}
              >
                <Link
                  href={href}
                  onClick={onClose}
                  className={`font-heading text-2xl tracking-heading ${
                    isActive ? "text-sapling" : "text-white hover:text-sapling"
                  } transition-colors duration-200`}
                >
                  {label.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Inquire CTA */}
      <div className="mt-12">
        <Link
          href="/contact"
          onClick={onClose}
          className="font-heading text-sm tracking-nav px-8 py-3 border border-sapling text-sapling hover:bg-sapling hover:text-lunar transition-colors duration-300"
        >
          INQUIRE
        </Link>
      </div>
    </div>
  );
}
