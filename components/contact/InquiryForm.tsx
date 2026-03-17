"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Unit } from "@/lib/types";

interface InquiryFormProps {
  units: Unit[];
  /** Pre-select a unit (from query params or unit detail page) */
  defaultUnit?: string;
  /** Called after the success state has been shown (~1.8s). Use in modals instead of navigating away. */
  onSuccess?: () => void;
}

const FINISH_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "brisa", label: "Brisa — Warm Coastal" },
  { value: "noir", label: "Noir — Dark Dramatic" },
];

const CONTACT_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either" },
];

export default function InquiryForm({ units, defaultUnit = "", onSuccess }: InquiryFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Honeypot check client-side
    if (data._hp) {
      sessionStorage.setItem("form_submitted", "1");
      router.push("/thank-you");
      return;
    }

    try {
      // Collect reCAPTCHA token if available
      let recaptchaToken = "";
      if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          recaptchaToken = await (window as Window & { grecaptcha?: { execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha?.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: "contact_submit" }
          ) ?? "";
        } catch {
          // If reCAPTCHA fails, proceed anyway (graceful degradation)
          recaptchaToken = "";
        }
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (res.ok) {
        sessionStorage.setItem("form_submitted", "1");
        if (onSuccess) {
          setStatus("success");
          timerRef.current = setTimeout(onSuccess, 1800);
        } else {
          router.push("/thank-you");
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {status === "success" && (
        <div className="py-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border border-sapling/40 flex items-center justify-center mx-auto">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
              <path d="M1 6l5 5L15 1" stroke="var(--color-sapling)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-heading text-sapling text-xs tracking-heading">INQUIRY RECEIVED</p>
          <p className="font-body text-white/50 text-sm">Our team will be in touch shortly.</p>
        </div>
      )}

      {status !== "success" && (
        <>
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First Name" name="firstName" required />
            <Field label="Last Name" name="lastName" required />
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
          </div>

          {/* Unit selector */}
          <div>
            <label className="block font-heading text-white/40 text-[10px] tracking-heading mb-1.5">
              UNIT OF INTEREST
            </label>
            <select
              name="unitOfInterest"
              defaultValue={defaultUnit}
              className="w-full bg-white/5 border border-white/10 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 appearance-none transition-colors duration-200"
            >
              <option value="">No preference</option>
              {units.map((u) => (
                <option key={u.id} value={u.id} disabled={u.status === "sold"}>
                  {u.name}
                  {u.status !== "available" ? ` (${u.status === "sold" ? "Sold" : "Under Contract"})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Finish selector */}
          <div>
            <label className="block font-heading text-white/40 text-[10px] tracking-heading mb-1.5">
              FINISH PREFERENCE
            </label>
            <select
              name="finishPreference"
              className="w-full bg-white/5 border border-white/10 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 appearance-none transition-colors duration-200"
            >
              {FINISH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Preferred contact */}
          <div>
            <p className="font-heading text-white/40 text-[10px] tracking-heading mb-2">
              PREFERRED CONTACT METHOD
            </p>
            <div className="flex gap-3 flex-wrap">
              {CONTACT_OPTIONS.map((o) => (
                <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value={o.value}
                    defaultChecked={o.value === "either"}
                    className="accent-sapling"
                  />
                  <span className="font-body text-white/60 text-sm">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-heading text-white/40 text-[10px] tracking-heading mb-1.5">
              MESSAGE
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us what you're looking for…"
              className="w-full bg-white/5 border border-white/10 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200 resize-none"
            />
          </div>

          {status === "error" && (
            <p className="font-body text-red-400 text-sm">
              Something went wrong. Please try again or contact us directly at{" "}
              <a href="mailto:tj@douglaselliman.com" className="underline">
                tj@douglaselliman.com
              </a>
              .
            </p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-sweep w-full font-heading text-xs tracking-heading py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "SENDING…" : "SEND INQUIRY"}
            </button>
          </div>
        </>
      )}

      <p className="font-body text-white/25 text-xs leading-relaxed">
        Your information will be shared only with the Casa Avenida sales team at Douglas Elliman.
        We respect your privacy.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-heading text-white/40 text-[10px] tracking-heading mb-1.5">
        {label.toUpperCase()}
        {required && <span className="text-sapling ml-1">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-white/5 border border-white/10 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200"
      />
    </div>
  );
}
