import type { Metadata } from "next";
import Image from "next/image";
import { getTeamMembers, BLUR_DATA_URL } from "@/lib/content";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "The Team | Casa Avenida — Delray Beach",
  description:
    "Casa Avenida is developed by Kastelo and 4TRO Capital, designed by RWB-Linares Architecture, with interiors by Stef Leonel and Ava Gray. Sales through Douglas Elliman.",
  openGraph: {
    title: "The Team | Casa Avenida",
    description: "The visionary team behind Casa Avenida — Kastelo, 4TRO, RWB-Linares, Stef Leonel, Ava Gray, Douglas Elliman.",
  },
};

const ROLE_ORDER = ["Sales", "Development", "Architecture", "Interior Design"];

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    Sales: "SALES",
    Development: "DEVELOPMENT",
    Architecture: "ARCHITECTURE",
    "Interior Design": "INTERIOR DESIGN",
  };
  return labels[role] ?? role.toUpperCase();
}

export default function TeamPage() {
  const members = getTeamMembers();

  // Group by role, in spec order
  const grouped = ROLE_ORDER.map((role) => ({
    role,
    members: members.filter((m) => m.role === role),
  })).filter((g) => g.members.length > 0);

  return (
    <>
      {/* Header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              DESIGNED BY THE BEST
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              THE TEAM
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Every decision at Casa Avenida — from site selection to the placement of a cabinet
              pull — reflects the collective expertise of a team assembled at the top of their
              respective disciplines.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Team sections by role */}
      {grouped.map((group, gi) => (
        <section
          key={group.role}
          className={`bg-lunar px-6 lg:px-12 py-16 lg:py-24 ${gi < grouped.length - 1 ? "border-b border-white/10" : ""}`}
        >
          <div className="max-w-[1440px] mx-auto">
            <ScrollFade className="mb-10">
              <p className="font-heading text-sapling/60 text-xs tracking-heading">
                {getRoleLabel(group.role)}
              </p>
            </ScrollFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {group.members.map((member, i) => (
                <ScrollFade key={member.id} delay={i * 80} className="bg-lunar">
                  <MemberCard member={member} />
                </ScrollFade>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

function MemberCard({ member }: { member: ReturnType<typeof getTeamMembers>[number] }) {
  const hasImage = Boolean(member.image);

  return (
    <div className="p-6 lg:p-8 flex gap-6 items-start">
      {/* Logo / photo */}
      <div className="relative w-16 h-16 shrink-0 overflow-hidden">
        {hasImage ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-contain"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="64px"
          />
        ) : (
          <ImagePlaceholder label={member.name.charAt(0)} className="absolute inset-0" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div>
          <p className="font-heading text-white text-xs tracking-heading">{member.name.toUpperCase()}</p>
          <p className="font-body text-sapling/60 text-xs mt-0.5">{member.title}</p>
        </div>
        <p className="font-body text-white/50 text-sm leading-relaxed">{member.bio}</p>
        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-heading text-[10px] tracking-heading text-sapling/60 hover:text-sapling transition-colors duration-200 mt-1"
          >
            VISIT WEBSITE →
          </a>
        )}
      </div>
    </div>
  );
}
