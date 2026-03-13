import type { ConstructionTimeline as TimelineData } from "@/lib/types";
import ScrollFade from "@/components/animations/ScrollFade";

interface ConstructionTimelineProps {
  data: TimelineData;
}

/**
 * Horizontal milestone strip driven by settings.json constructionTimeline.
 * Current phase highlighted in Sapling gold.
 * Final milestone always gold regardless of current phase.
 * Fully data-driven — no code changes needed to update milestone status.
 */
export default function ConstructionTimeline({ data }: ConstructionTimelineProps) {
  const { milestones, currentPhase, completionDate } = data;

  return (
    <section
      className="bg-lunar py-20 lg:py-28 px-6 lg:px-12 border-t border-white/10"
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollFade className="mb-12">
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">
            DEVELOPMENT PROGRESS
          </p>
          <h2
            id="timeline-heading"
            className="font-display text-white text-[clamp(1.75rem,3vw,2.5rem)] leading-tight"
          >
            COMPLETION {completionDate}
          </h2>
        </ScrollFade>

        {/* Desktop: horizontal strip */}
        <ScrollFade>
          <div className="hidden lg:flex items-start">
            {milestones.map((milestone, i) => {
              const isActive   = milestone.label === currentPhase;
              const isFinal    = i === milestones.length - 1;
              const isGold     = isActive || isFinal;
              const isComplete = milestone.completed;
              const isLast     = i === milestones.length - 1;

              return (
                <div key={milestone.label} className="flex items-start flex-1 min-w-0">
                  {/* Milestone node */}
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    {/* Dot */}
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        isGold
                          ? "bg-sapling border-sapling"
                          : isComplete
                          ? "bg-white/40 border-white/40"
                          : "bg-transparent border-white/20"
                      }`}
                      aria-current={isActive ? "step" : undefined}
                    />
                    {/* Label */}
                    <div className="text-center px-2">
                      <p
                        className={`font-heading text-[10px] tracking-heading ${
                          isGold ? "text-sapling" : isComplete ? "text-white/60" : "text-white/30"
                        }`}
                      >
                        {milestone.label.toUpperCase()}
                      </p>
                      {milestone.date && (
                        <p className={`font-ui text-[9px] mt-1 ${isGold ? "text-sapling/70" : "text-white/25"}`}>
                          {milestone.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={`flex-1 h-px mt-[5px] transition-colors ${
                        isComplete ? "bg-white/30" : "bg-white/10"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical list */}
          <ol className="lg:hidden space-y-6" aria-label="Construction milestones">
            {milestones.map((milestone, i) => {
              const isActive = milestone.label === currentPhase;
              const isFinal  = i === milestones.length - 1;
              const isGold   = isActive || isFinal;

              return (
                <li key={milestone.label} className="flex items-center gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${
                      isGold
                        ? "bg-sapling border-sapling"
                        : milestone.completed
                        ? "bg-white/40 border-white/40"
                        : "bg-transparent border-white/20"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  />
                  <div>
                    <span
                      className={`font-heading text-[10px] tracking-heading ${
                        isGold ? "text-sapling" : milestone.completed ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {milestone.label.toUpperCase()}
                    </span>
                    {milestone.date && (
                      <span className={`font-ui text-[9px] ml-3 ${isGold ? "text-sapling/70" : "text-white/25"}`}>
                        {milestone.date}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </ScrollFade>
      </div>
    </section>
  );
}
