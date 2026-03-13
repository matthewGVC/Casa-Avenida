"use client";

import { useState } from "react";

/**
 * MailerLite subscribe form — email only.
 * Posts to /api/subscribe which calls MailerLite API.
 */
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-sapling/30 px-6 py-5 text-center">
        <p className="font-heading text-sapling text-xs tracking-heading mb-1">SUBSCRIBED</p>
        <p className="font-body text-white/50 text-sm">
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 pt-8 mt-10">
      <p className="font-heading text-sapling/60 text-xs tracking-heading mb-2">HAVEN</p>
      <p className="font-body text-white/60 text-sm mb-5 max-w-sm">
        The Casa Avenida newsletter — market insights, development updates, and lifestyle from
        Delray Beach.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm" noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email address"
          className="flex-1 bg-white/5 border border-white/10 border-r-0 focus:border-sapling/60 outline-none font-body text-white text-sm px-4 py-3 placeholder:text-white/20 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-sweep font-heading text-[10px] tracking-heading px-5 py-3 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 whitespace-nowrap disabled:opacity-50"
        >
          {status === "loading" ? "…" : "SUBSCRIBE"}
        </button>
      </form>
      {status === "error" && (
        <p className="font-body text-red-400 text-xs mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
