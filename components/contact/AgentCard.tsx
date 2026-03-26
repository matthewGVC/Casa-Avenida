import Image from "next/image";
import type { Agent } from "@/lib/types";
import { formatPhone, encodeImagePath } from "@/lib/content";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const hasPhoto = Boolean(agent.headshot);
  const phoneFormatted = formatPhone(agent.phone);

  return (
    <div className="border border-white/10 p-6 flex gap-5 items-start">
      {/* Headshot */}
      <div className="relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 overflow-hidden bg-[#373A36]">
        {hasPhoto ? (
          <Image
            src={encodeImagePath(agent.headshot)}
            alt={agent.name}
            fill
            className="object-cover"
            placeholder="empty"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-sapling/40 text-xl">
              {agent.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <p className="font-heading text-white text-xs tracking-heading">{agent.name.toUpperCase()}</p>
          <p className="font-body text-white/40 text-xs mt-0.5">{agent.title}</p>
        </div>

        <div className="space-y-1.5">
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center gap-2 group"
            aria-label={`Call ${agent.name} at ${phoneFormatted}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-sapling/50 shrink-0">
              <path d="M10.5 8.5c0 .2-.04.39-.13.57a2 2 0 01-.37.52C9.67 9.9 9.3 10 9 10c-.44 0-.9-.1-1.39-.31A9.7 9.7 0 016.26 8.8a9.7 9.7 0 01-1.06-1.27 9.7 9.7 0 01-.89-1.39C4.1 5.66 4 5.2 4 4.77c0-.28.05-.55.15-.78.1-.24.26-.46.49-.65.27-.22.57-.33.89-.33.12 0 .24.03.35.07.12.05.22.12.3.24l1.04 1.47c.08.11.14.22.18.32.04.1.06.19.06.28 0 .11-.03.22-.09.33a1.39 1.39 0 01-.24.3l-.32.34c-.05.05-.07.1-.07.16 0 .03 0 .06.02.1.02.03.03.06.04.08.08.15.22.34.4.57.19.23.39.46.61.68.22.22.44.42.67.6.23.19.42.32.57.4l.08.04c.03.01.06.02.1.02.07 0 .12-.03.17-.08l.33-.33c.1-.1.2-.17.3-.22.1-.06.2-.09.32-.09.08 0 .17.02.27.06.1.04.21.1.32.18l1.49 1.06c.12.09.2.19.24.31.04.12.06.24.06.36z" stroke="currentColor" strokeWidth="0.5" fill="currentColor"/>
            </svg>
            <span className="font-body text-white/60 text-sm group-hover:text-sapling transition-colors duration-200">
              {phoneFormatted}
            </span>
          </a>

          <a
            href={`mailto:${agent.email}`}
            className="flex items-center gap-2 group"
            aria-label={`Email ${agent.name}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-sapling/50 shrink-0">
              <rect x="1" y="2.5" width="10" height="7" rx="0.5" stroke="currentColor" strokeWidth="0.8"/>
              <path d="M1 3L6 7L11 3" stroke="currentColor" strokeWidth="0.8"/>
            </svg>
            <span className="font-body text-white/60 text-sm group-hover:text-sapling transition-colors duration-200 truncate">
              {agent.email}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
