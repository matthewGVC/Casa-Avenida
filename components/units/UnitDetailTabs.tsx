"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Unit, FinishesPackage } from "@/lib/types";
import FloorplanViewer from "@/components/units/FloorplanViewer";
import { BLUR_DATA_URL, formatSF } from "@/lib/content";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

type TabId = "overview" | "floorplan" | "finishes" | "inquire";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "OVERVIEW" },
  { id: "floorplan", label: "FLOORPLAN" },
  { id: "finishes", label: "FINISHES" },
  { id: "inquire", label: "INQUIRE" },
];

interface UnitDetailTabsProps {
  unit: Unit;
  finishes: FinishesPackage[];
  initialTab?: TabId;
}

export default function UnitDetailTabs({ unit, finishes, initialTab = "overview" }: UnitDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [finishTab, setFinishTab] = useState<"brisa" | "noir">(
    unit.finishPackages.includes("brisa") ? "brisa" : unit.finishPackages[0]
  );

  return (
    <>
      {/* Tab bar */}
      <div className="border-b border-white/10 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex gap-0 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`
                font-heading text-[10px] tracking-heading px-6 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-sapling text-sapling"
                    : "border-transparent text-white/40 hover:text-white/70"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-[1440px] mx-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div id="panel-overview" role="tabpanel">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left: hero image */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
                  {unit.heroImage ? (
                    <Image
                      src={unit.heroImage}
                      alt={`${unit.name} — ${unit.tagline}`}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <ImagePlaceholder label={unit.name} className="absolute inset-0" />
                  )}
                </div>

                {/* Right: details */}
                <div className="flex flex-col justify-center space-y-8">
                  <div>
                    <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">
                      {unit.name.toUpperCase()}
                    </p>
                    <h2 className="font-display text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-tight mb-4">
                      {unit.tagline.toUpperCase()}
                    </h2>
                    <p className="font-body text-white/60 text-base leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  {/* Specs grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                    <SpecItem label="BEDROOMS" value={unit.bedrooms} />
                    <SpecItem label="BATHROOMS" value={unit.bathrooms} />
                    <SpecItem label="UNDER AIR" value={`${formatSF(unit.underAirSF)} SF`} />
                    <SpecItem label="TOTAL GSF" value={`${formatSF(unit.gsf)} SF`} />
                    <SpecItem label="EXTERIOR" value={`${formatSF(unit.exteriorSF)} SF`} />
                    <SpecItem label="LEVELS" value={unit.levels} />
                  </div>

                  {/* Features */}
                  <div>
                    <p className="font-heading text-white/40 text-[10px] tracking-heading mb-3">
                      FEATURES
                    </p>
                    <ul className="space-y-2">
                      {unit.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span className="text-sapling mt-0.5 shrink-0">—</span>
                          <span className="font-body text-white/70 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("floorplan")}
                      className="btn-sweep font-heading text-[10px] tracking-heading px-6 py-3 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
                    >
                      VIEW FLOORPLAN
                    </button>
                    <button
                      onClick={() => setActiveTab("inquire")}
                      className="font-heading text-[10px] tracking-heading px-6 py-3 border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 transition-colors duration-200"
                    >
                      INQUIRE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FLOORPLAN */}
          {activeTab === "floorplan" && (
            <div id="panel-floorplan" role="tabpanel">
              <div className="max-w-3xl">
                <h2 className="font-heading text-white text-xs tracking-heading mb-6">
                  {unit.name.toUpperCase()} — FLOORPLAN
                </h2>
                <FloorplanViewer unit={unit} />
              </div>
            </div>
          )}

          {/* FINISHES */}
          {activeTab === "finishes" && (
            <div id="panel-finishes" role="tabpanel">
              {/* Package selector */}
              <div className="flex gap-2 mb-8">
                {unit.finishPackages.map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setFinishTab(pkg)}
                    aria-pressed={finishTab === pkg}
                    className={`
                      font-heading text-[10px] tracking-heading px-5 py-2.5 border transition-colors duration-200
                      ${
                        finishTab === pkg
                          ? "border-sapling text-sapling bg-sapling/10"
                          : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
                      }
                    `}
                  >
                    {pkg.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Package content */}
              {finishes
                .filter((f) => unit.finishPackages.includes(f.id as "brisa" | "noir") && f.id === finishTab)
                .map((pkg) => (
                  <div key={pkg.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Hero image */}
                    <div className="relative aspect-[4/3]">
                      {pkg.heroImage ? (
                        <Image
                          src={pkg.heroImage}
                          alt={`${pkg.name} finish package`}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <ImagePlaceholder label={pkg.name} className="absolute inset-0" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                      <div>
                        <p className="font-heading text-sapling/60 text-xs tracking-heading mb-2">
                          {pkg.name.toUpperCase()} COLLECTION
                        </p>
                        <p className="font-display text-white text-2xl lg:text-3xl leading-tight mb-4">
                          {pkg.tagline.toUpperCase()}
                        </p>
                        <p className="font-body text-white/60 text-sm leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Swatch categories */}
                      <div className="space-y-4 border-t border-white/10 pt-6">
                        {pkg.swatches.map((cat) => (
                          <div key={cat.category}>
                            <p className="font-heading text-white/40 text-[10px] tracking-heading mb-2">
                              {cat.category.toUpperCase()}
                            </p>
                            {cat.items.map((item) => (
                              <div key={item.name} className="mb-1">
                                <p className="font-body text-white/80 text-sm">{item.name}</p>
                                {item.description && (
                                  <p className="font-body text-white/40 text-xs leading-snug">{item.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* PDF download */}
                      {pkg.pdf && (
                        <a
                          href={pkg.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 hover:border-sapling px-5 py-2.5 transition-colors duration-200"
                        >
                          DOWNLOAD {pkg.name.toUpperCase()} TEAR SHEET
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* INQUIRE */}
          {activeTab === "inquire" && (
            <div id="panel-inquire" role="tabpanel">
              <div className="max-w-xl">
                <h2 className="font-heading text-white text-xs tracking-heading mb-2">
                  INQUIRE ABOUT {unit.name.toUpperCase()}
                </h2>
                <p className="font-body text-white/50 text-sm mb-8 leading-relaxed">
                  Our sales team will respond within one business day.
                </p>
                <UnitInquireForm unitName={unit.name} unitId={unit.id} />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function SpecItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-heading text-white/40 text-[10px] tracking-heading mb-1">{label}</p>
      <p className="font-body text-white text-base font-medium">{value}</p>
    </div>
  );
}

function UnitInquireForm({ unitName, unitId }: { unitName: string; unitId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Honeypot check (client-side)
    if (data._hp) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, unitOfInterest: unitId }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-sapling/30 p-8 text-center">
        <p className="font-heading text-sapling text-xs tracking-heading mb-2">THANK YOU</p>
        <p className="font-body text-white/60 text-sm">
          Your inquiry about {unitName} has been received. Our team will be in touch shortly.
        </p>
        <Link
          href="/residences"
          className="inline-block mt-6 font-heading text-[10px] tracking-heading text-white/50 hover:text-sapling transition-colors duration-200"
        >
          ← BACK TO ALL RESIDENCES
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" name="firstName" required />
        <Field label="Last Name" name="lastName" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />
      <Field label="Message" name="message" as="textarea" rows={4} />

      <div className="pt-2">
        <p className="font-heading text-white/30 text-[10px] tracking-heading mb-2">
          UNIT OF INTEREST
        </p>
        <p className="font-body text-white/60 text-sm">{unitName}</p>
      </div>

      {status === "error" && (
        <p className="font-body text-red-400 text-sm">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-sweep w-full font-heading text-xs tracking-heading py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "SENDING…" : "SEND INQUIRY"}
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
}

function Field({ label, name, type = "text", required = false, as = "input", rows }: FieldProps) {
  const base =
    "w-full bg-white/5 border border-white/10 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200";

  return (
    <div>
      <label className="block font-heading text-white/40 text-[10px] tracking-heading mb-1.5">
        {label.toUpperCase()}
        {required && <span className="text-sapling ml-1">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea name={name} rows={rows ?? 4} className={`${base} resize-none`} />
      ) : (
        <input name={name} type={type} required={required} className={base} />
      )}
    </div>
  );
}
