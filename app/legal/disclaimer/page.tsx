import type { Metadata } from "next";
import { getDisclaimer } from "@/lib/content";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Legal Disclaimer | Casa Avenida",
  description: "Legal disclaimer for Casa Avenida — a Douglas Elliman Real Estate offering.",
  robots: { index: false, follow: false },
};

export default function DisclaimerPage() {
  const disclaimer = getDisclaimer();

  return (
    <section className="bg-lunar min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollFade>
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
            LEGAL
          </p>
          <h1 className="font-display text-white text-3xl lg:text-4xl leading-tight mb-10 pb-6 border-b border-white/10">
            DISCLAIMER
          </h1>
        </ScrollFade>

        <ScrollFade delay={100}>
          <p className="font-body text-white/50 text-sm leading-loose whitespace-pre-wrap">
            {disclaimer}
          </p>
        </ScrollFade>

        <ScrollFade delay={150} className="mt-12 pt-8 border-t border-white/10 space-y-2">
          <p className="font-body text-white/30 text-xs leading-relaxed">
            This website is operated by Douglas Elliman Real Estate on behalf of Casa Avenida.
            All information is deemed reliable but not guaranteed.
          </p>
          <p className="font-body text-white/30 text-xs leading-relaxed">
            Oral representations cannot be relied upon as correctly stating the representations
            of the developer. For correct representations, make reference to this brochure and
            to the documents required by Section 718.503, Florida Statutes, to be furnished by
            a developer to a buyer or lessee.
          </p>
        </ScrollFade>
      </div>
    </section>
  );
}
