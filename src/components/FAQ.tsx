"use client";

import { useState } from "react";
import { ChevronArrowIcon, StarBurst } from "./icons";
import { cn } from "@/lib/utils";

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: "What does TheClientPilot actually do?",
    a: "We build the systems that bring you more clients — AI receptionists that answer every call, automations that follow up with leads on WhatsApp, high-converting websites, and AI-powered ad campaigns. We pick the right mix for your business so you spend less time chasing leads and more time serving customers.",
  },
  {
    q: "Who do you work with?",
    a: "Dentists, dental clinics, medical spas, doctors, healthcare practices, and growing service businesses across India. If you have a real business and want a predictable flow of new clients, we can help.",
  },
  {
    q: "How is this different from a regular marketing agency?",
    a: "Most agencies hand you ads and walk away. We build the entire client-getting system — capture, qualify, book, follow up — and connect it to AI so it runs without you. Better leads, fewer dropped calls, less work for your team.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on what you need. A starter AI receptionist setup is different from a full ad + website + automation buildout. Book a free consultation and we'll give you exact pricing for your business — no commitment, no surprises.",
  },
  {
    q: "How long until I see results?",
    a: "AI receptionists and automations are live within 1–2 weeks. Ad campaigns start producing leads in 7–14 days after launch. SEO and website ranking take 2–6 months. We'll set realistic expectations on day one.",
  },
  {
    q: "Do you only work with clients in Guwahati or Assam?",
    a: "No. We're based in Guwahati, Assam, but we work with businesses across India and globally. Everything we build is remote-first, so location doesn't matter.",
  },
  {
    q: "What's an AI receptionist and why do I need one?",
    a: "An AI voice agent that answers every incoming call 24/7, qualifies the caller, books appointments, and updates your calendar — even at 2am or while you're with a patient. If you're missing calls, you're missing money. AI receptionists fix that.",
  },
  {
    q: "Will the AI sound robotic or annoy my clients?",
    a: "No. Modern AI voices are nearly indistinguishable from humans. We custom-train the voice, tone, and script around your business so it sounds like part of your team — not a chatbot. You can listen to live samples before launch.",
  },
  {
    q: "What if I already have a website?",
    a: "We audit it first. If it's converting well, we leave it alone and focus on traffic and automation. If it's leaking leads, we rebuild it or fix the conversion bottlenecks. We don't push services you don't need.",
  },
  {
    q: "Is there a contract or am I locked in?",
    a: "No long-term contracts. Month-to-month, cancel anytime. We earn your business by delivering results, not by trapping you in paperwork.",
  },
  {
    q: "How do I get started?",
    a: "Click Book Now in the top right, fill in a few details, and we'll reach out within 24 hours to set up a free consultation. We'll show you exactly what we'd build, what it would cost, and what results to expect.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  // Schema.org FAQPage markup — helps Google show rich results in search
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="relative bg-copula-orange px-(--padding-x) py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="mx-auto flex max-w-292.5 flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-6">
          <div className="text-copula-white flex items-center gap-2">
            <StarBurst className="size-6 animate-spin-slow text-copula-white" />
            <p className="display uppercase text-[40px] leading-none">FAQ</p>
          </div>
          <h2 className="display text-copula-white leading-[0.9] max-w-4xl">
            Questions
            <br />
            we hear often.
          </h2>
        </div>

        <ul className="flex flex-col">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.q}
                className="border-b border-copula-white/25"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-4 py-6 text-left md:py-8"
                  aria-expanded={isOpen}
                >
                  <h3 className="h2 text-copula-white uppercase leading-[1.05]">
                    {f.q}
                  </h3>
                  <ChevronArrowIcon
                    className={cn(
                      "size-7 shrink-0 text-copula-white transition-all duration-500 md:size-10",
                      isOpen ? "rotate-180 opacity-100" : "opacity-70 group-hover:opacity-100"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-copula-white/90 pb-6 text-base leading-relaxed md:pb-10 md:text-lg max-w-3xl">
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
