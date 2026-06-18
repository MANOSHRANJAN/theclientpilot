"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
};

type StepKey = "name" | "age" | "email" | "phone" | "business";

type Step = {
  key: StepKey;
  label: string;
  hint?: string;
  type: "text" | "number" | "email" | "tel" | "select";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  options?: string[];
  validate?: (v: string) => string | null;
};

const STEPS: Step[] = [
  {
    key: "name",
    label: "What's your name?",
    type: "text",
    placeholder: "Your full name",
    required: true,
    autoComplete: "name",
    validate: (v) => (v.trim().length < 2 ? "Please enter your name" : null),
  },
  {
    key: "age",
    label: "How old are you?",
    type: "number",
    placeholder: "e.g. 28",
    required: true,
    validate: (v) => {
      const n = Number(v);
      if (!v) return "Please enter your age";
      if (Number.isNaN(n) || n < 1 || n > 120) return "Enter a valid age";
      return null;
    },
  },
  {
    key: "email",
    label: "What's your email?",
    type: "email",
    placeholder: "you@email.com",
    required: true,
    autoComplete: "email",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email"),
  },
  {
    key: "phone",
    label: "Your phone number?",
    type: "tel",
    placeholder: "+91 9XXXXXXXXX",
    required: true,
    autoComplete: "tel",
    validate: (v) => (v.replace(/\D/g, "").length < 7 ? "Enter a valid phone number" : null),
  },
  {
    key: "business",
    label: "What is your business?",
    type: "select",
    required: true,
    options: ["Real Estate", "Dental", "Doctor", "Other"],
    validate: (v) => (v ? null : "Pick one"),
  },
];

export function GetStartedDialog({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    name: "",
    age: "",
    email: "",
    phone: "",
    business: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers({ name: "", age: "", email: "", phone: "", business: "" });
      setError(null);
      setDone(false);
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [step, open]);

  const current = STEPS[step];
  const value = answers[current.key];
  const isLast = step === STEPS.length - 1;

  function handleChange(v: string) {
    setError(null);
    setAnswers((a) => ({ ...a, [current.key]: v }));
  }

  async function advance() {
    const err = current.validate?.(value) ?? null;
    if (err) {
      setError(err);
      return;
    }
    if (!isLast) {
      setTransitioning(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setTransitioning(false);
      }, 220);
      return;
    }
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("leads").insert({
        name: answers.name,
        age: answers.age ? Number(answers.age) : null,
        email: answers.email,
        phone: answers.phone,
        business: answers.business,
      });
      if (dbError) throw dbError;
      setDone(true);
    } catch (err) {
      console.error("Supabase insert failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  }

  function back() {
    setError(null);
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => Math.max(0, s - 1));
      setTransitioning(false);
    }, 220);
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-2xl"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-started-title"
        className={cn(
          "relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/15 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:p-10",
          "ring-1 ring-white/10",
          open ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        )}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.2)",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-almost-black text-copula-white transition-transform hover:scale-110"
        >
          <span aria-hidden className="text-lg leading-none">×</span>
        </button>

        {done ? (
          <div className="py-6 text-center">
            <h2 id="get-started-title" className="display text-copula-white mb-3 text-4xl uppercase">
              Thanks!
            </h2>
            <p className="smallBody text-copula-white/80">
              We&apos;ll reach out shortly at the email or phone you shared.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-copula-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-copula-white transition-all hover:scale-105 hover:bg-copula-white hover:text-almost-black"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    i <= step ? "bg-copula-white" : "bg-copula-white/20"
                  )}
                />
              ))}
            </div>

            <div
              className={cn(
                "transition-all duration-200 ease-out",
                transitioning
                  ? "opacity-0 blur-md translate-y-2"
                  : "opacity-100 blur-0 translate-y-0"
              )}
            >
              <div className="mb-6">
                <p className="smallBody text-copula-white/70 mb-2 font-semibold">
                  Question {step + 1} of {STEPS.length}
                </p>
                <h2
                  id="get-started-title"
                  className="display text-copula-white text-3xl uppercase leading-[1] md:text-4xl"
                >
                  {current.label}
                </h2>
              </div>

              {current.type === "select" ? (
                <select
                  ref={(el) => {
                    inputRef.current = el;
                  }}
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-2xl border-2 border-white/30 bg-white/10 px-5 py-4 text-lg text-copula-white outline-none backdrop-blur-md transition-colors focus:border-copula-white focus:bg-white/20"
                >
                  <option value="" disabled className="text-text-black">Select one</option>
                  {current.options?.map((o) => (
                    <option key={o} value={o} className="text-text-black">{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  ref={(el) => {
                    inputRef.current = el;
                  }}
                  type={current.type}
                  value={value}
                  placeholder={current.placeholder}
                  autoComplete={current.autoComplete}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-2xl border-2 border-white/30 bg-white/10 px-5 py-4 text-lg text-copula-white placeholder:text-copula-white/40 outline-none backdrop-blur-md transition-colors focus:border-copula-white focus:bg-white/20"
                />
              )}

              {error && (
                <p className="smallBody text-copula-orange mt-3" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="smallBody font-semibold text-copula-white/70 transition-colors hover:text-copula-white disabled:opacity-30"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={advance}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-copula-white px-7 py-3 text-sm font-semibold uppercase tracking-wider text-almost-black transition-all hover:scale-[1.04] hover:bg-copula-orange hover:text-copula-white disabled:opacity-60"
              >
                {submitting ? "Sending…" : isLast ? "Submit" : "Next →"}
              </button>
            </div>

            <p className="smallBody text-copula-white/60 mt-4 text-center">
              Press <kbd className="rounded bg-white/15 px-1.5 py-0.5 text-xs font-semibold text-copula-white">Enter</kbd> to continue
            </p>
          </>
        )}
      </div>
    </div>
  );
}
