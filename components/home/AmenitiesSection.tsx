import ScrollFade from "@/components/animations/ScrollFade";

const AMENITIES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6" y="3" width="16" height="22" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="3" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="6" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    label: "PRIVATE ELEVATOR",
    body: "Each residence commands a private in-unit elevator across all four levels — no shared lobbies, no shared corridors.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="16" width="20" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 16V12C8 9.79 9.79 8 12 8H16C18.21 8 20 9.79 20 12V16" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="20" r="2" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    label: "COCKTAIL POOL + GARDEN",
    body: "Ground-level private pool with a planted garden — a sanctuary that separates Casa Avenida from any other Delray address.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18H24V22H4V18Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 18V10H20V18" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 10H24" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 4V10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    label: "ROOFTOP TERRACE",
    body: "The fourth level opens to a private rooftop terrace above Delray Beach — sunset views, summer kitchen, and open sky.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="14" width="22" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 14V10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 14V10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10H21" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
        <path d="M18 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "PRIVATE GARAGE + EV",
    body: "A private 2-car garage with dedicated EV charging — direct-entry access, no valet, no waiting.",
  },
];

/**
 * Full-bleed dark amenities section with Bahama Blue accent details.
 */
export default function AmenitiesSection() {
  return (
    <section
      className="bg-lunar py-24 lg:py-36 px-6 lg:px-12"
      aria-labelledby="amenities-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollFade className="mb-16 lg:mb-20">
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
            INCLUDED IN EVERY RESIDENCE
          </p>
          <h2
            id="amenities-heading"
            className="font-display text-white text-[clamp(2rem,4vw,3.5rem)] leading-tight"
          >
            CRAFTED FOR<br />EXCEPTIONAL LIVING
          </h2>
        </ScrollFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {AMENITIES.map(({ icon, label, body }, i) => (
            <ScrollFade key={label} delay={i * 80}>
              <div className="bg-lunar p-8 lg:p-10 flex flex-col gap-5 h-full">
                <div className="text-bahama">{icon}</div>
                <div className="gold-rule w-8" />
                <h3 className="font-heading text-white text-xs tracking-heading">
                  {label}
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}
