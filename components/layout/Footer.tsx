import Link from "next/link";

const DISCLAIMER = `Oral representations cannot be relied upon as correctly stating representations of the developer. For correct representations, make reference to this brochure and to the documents required by Section 718.503, Florida Statutes, to be furnished by a developer to a buyer or lessee. This offering is made only by the prospectus for the condominium and no statement should be relied upon if not made in the prospectus. This is not intended to be an offer to sell, or solicitation of offers to buy, real property in states where prohibited by law. Prices, specifications and availability subject to change without notice. Douglas Elliman Real Estate fully supports the principles of the Fair Housing Act and the Equal Opportunity Act.`;

const NAV_LINKS = [
  { href: "/residences", label: "Residences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/virtual-tour", label: "Virtual Tour" },
  { href: "/neighborhood", label: "Neighborhood" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-lunar border-t border-white/10 pt-16 pb-8 px-6 lg:px-12"
      role="contentinfo"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="font-display text-sapling text-2xl tracking-wider mb-4">
              CASA AVENIDA
            </div>
            <address className="font-body text-white/60 text-sm not-italic leading-relaxed">
              102 SE 5th Ave<br />
              Delray Beach, FL 33483
            </address>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-heading text-xs tracking-nav text-white/60 hover:text-sapling transition-colors duration-200"
                  >
                    {label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Agents */}
          <div className="space-y-6">
            <div>
              <p className="font-heading text-xs tracking-heading text-sapling mb-1">
                SALES
              </p>
              <p className="font-body text-sm text-white/80">TJ Verdiglione</p>
              <div className="flex gap-4 mt-1">
                <a
                  href="tel:+15617993000"
                  className="font-ui text-xs text-white/60 hover:text-sapling transition-colors duration-200"
                  aria-label="Call TJ Verdiglione"
                >
                  Call
                </a>
                <a
                  href="mailto:tj.verdiglione@elliman.com"
                  className="font-ui text-xs text-white/60 hover:text-sapling transition-colors duration-200"
                  aria-label="Email TJ Verdiglione"
                >
                  Email
                </a>
              </div>
            </div>
            <div>
              <p className="font-body text-sm text-white/80">Nicole Melveney</p>
              <div className="flex gap-4 mt-1">
                <a
                  href="tel:+15617993001"
                  className="font-ui text-xs text-white/60 hover:text-sapling transition-colors duration-200"
                  aria-label="Call Nicole Melveney"
                >
                  Call
                </a>
                <a
                  href="mailto:nicole.melveney@elliman.com"
                  className="font-ui text-xs text-white/60 hover:text-sapling transition-colors duration-200"
                  aria-label="Email Nicole Melveney"
                >
                  Email
                </a>
              </div>
            </div>
            <p className="font-ui text-xs text-white/40">
              Douglas Elliman Real Estate
            </p>
          </div>
        </div>

        {/* Disclaimer — required on every page */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="font-ui text-xs text-white/40 leading-relaxed max-w-5xl">
            {DISCLAIMER}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30">
          <p className="font-ui text-xs">
            © {year} Casa Avenida. All rights reserved.
          </p>
          <p className="font-ui text-xs">
            Developed by Kastelo &amp; 4TRO · Architecture by RWB-Linares
          </p>
        </div>
      </div>
    </footer>
  );
}
