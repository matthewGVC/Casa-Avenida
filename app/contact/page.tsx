import type { Metadata } from "next";
import { getUnits, getAgents } from "@/lib/content";
import InquiryForm from "@/components/contact/InquiryForm";
import AgentCard from "@/components/contact/AgentCard";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Contact & Inquire | Casa Avenida — Delray Beach",
  description:
    "Schedule a private briefing or request floorplans for Casa Avenida — eight luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. Contact TJ Verdiglione and Nicole Melveney at Douglas Elliman.",
  openGraph: {
    title: "Contact | Casa Avenida",
    description: "Inquire about residences at Casa Avenida — eight luxury townhomes in Delray Beach.",
  },
};

export default function ContactPage() {
  const units = getUnits();
  const agents = getAgents();

  return (
    <>
      {/* Header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              SCHEDULE A CONVERSATION
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              INQUIRE
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Our sales team at Douglas Elliman will respond within one business day. Pricing
              is available upon request.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Form + Agents */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">

            {/* Form — wider column */}
            <div className="lg:col-span-3">
              <ScrollFade>
                <InquiryForm units={units} />
              </ScrollFade>
            </div>

            {/* Agent cards + info */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollFade delay={100}>
                <p className="font-heading text-sapling/60 text-xs tracking-heading mb-5">
                  SALES TEAM
                </p>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </ScrollFade>

              <ScrollFade delay={160}>
                <div className="border border-white/10 p-5 space-y-3 mt-6">
                  <p className="font-heading text-white/40 text-[10px] tracking-heading">
                    PROJECT ADDRESS
                  </p>
                  <address className="not-italic">
                    <p className="font-body text-white/70 text-sm leading-relaxed">
                      102 SE 5th Avenue<br />
                      Delray Beach, FL 33483
                    </p>
                  </address>
                  <p className="font-heading text-sapling/60 text-[10px] tracking-heading mt-2">
                    COMPLETION Q2 2027
                  </p>
                </div>
              </ScrollFade>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
