"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAgents } from "@/lib/content";
import AgentCard from "@/components/contact/AgentCard";
import ScrollFade from "@/components/animations/ScrollFade";

const agents = getAgents();

export default function ThankYouPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("form_submitted");
    if (!flag) {
      router.replace("/not-found");
    } else {
      sessionStorage.removeItem("form_submitted");
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <section className="bg-lunar min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <ScrollFade>
          <div className="w-16 h-16 rounded-full border border-sapling/30 flex items-center justify-center mx-auto mb-8">
            <span className="font-display text-sapling text-2xl">A</span>
          </div>
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
            INQUIRY RECEIVED
          </p>
          <h1 className="font-display text-white text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-6">
            THANK YOU
          </h1>
          <p className="font-body text-white/60 text-base lg:text-lg leading-relaxed mb-12 max-w-lg mx-auto">
            Your inquiry has been received. Our sales team at Douglas Elliman will be in touch
            within one business day.
          </p>
        </ScrollFade>

        <ScrollFade delay={100} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </ScrollFade>

        <ScrollFade delay={160} className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/gallery"
            className="btn-sweep font-heading text-[10px] tracking-heading px-7 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            EXPLORE THE GALLERY
          </Link>
          <Link
            href="/residences"
            className="font-heading text-[10px] tracking-heading px-7 py-3.5 border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 transition-colors duration-200"
          >
            VIEW RESIDENCES
          </Link>
        </ScrollFade>
      </div>
    </section>
  );
}
