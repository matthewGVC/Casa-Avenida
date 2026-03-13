import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casa Avenida | Luxury Residences in Delray Beach",
  description:
    "8 boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. From the low $3M. Expected completion Q2 2027.",
};

export default function HomePage() {
  return (
    <>
      {/* Placeholder — Home page sections built in Part 15.5 */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-lunar px-6 text-center">
        <h1 className="font-display text-sapling text-5xl md:text-7xl lg:text-9xl mb-6">
          CASA AVENIDA
        </h1>
        <p className="font-heading text-white/60 text-sm tracking-heading">
          DELRAY BEACH · 8 EXCLUSIVE RESIDENCES · COMPLETION Q2 2027
        </p>
        <p className="font-body text-white/40 text-xs mt-8">
          Site under construction
        </p>
      </section>
    </>
  );
}
