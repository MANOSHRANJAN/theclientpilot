/**
 * FAQ content single source of truth.
 *
 * Google's FAQPage structured-data guidelines require every question/answer
 * pair in the markup to also be visible to the user on the page. Keeping the
 * rendered accordion (`components/FAQ.tsx`) and the FAQPage JSON-LD
 * (`lib/structured-data.ts`) on this one list guarantees that invariant and
 * prevents the two from drifting apart or emitting two conflicting FAQPage
 * blocks on the same URL.
 */

export interface FaqItem {
  /** The question, rendered verbatim as the accordion trigger. */
  question: string;
  /** The answer, rendered verbatim as the accordion panel copy. */
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What does TheClientPilot actually do?",
    answer:
      "We build the systems that bring you more clients — AI receptionists that answer every call, automations that follow up with leads on WhatsApp, high-converting websites, and AI-powered ad campaigns. We pick the right mix for your business so you spend less time chasing leads and more time serving customers.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Dentists, dental clinics, medical spas, doctors, healthcare practices, and growing service businesses across India. If you have a real business and want a predictable flow of new clients, we can help.",
  },
  {
    question: "How is this different from a regular marketing agency?",
    answer:
      "Most agencies hand you ads and walk away. We build the entire client-getting system — capture, qualify, book, follow up — and connect it to AI so it runs without you. Better leads, fewer dropped calls, less work for your team.",
  },
  {
    question: "How much does it cost?",
    answer:
      "It depends on what you need. A starter AI receptionist setup is different from a full ad + website + automation buildout. Book a free consultation and we'll give you exact pricing for your business — no commitment, no surprises.",
  },
  {
    question: "How long until I see results?",
    answer:
      "AI receptionists and automations are live within 1–2 weeks. Ad campaigns start producing leads in 7–14 days after launch. SEO and website ranking take 2–6 months. We'll set realistic expectations on day one.",
  },
  {
    question: "Do you only work with clients in Guwahati or Assam?",
    answer:
      "No. We're based in Guwahati, Assam, but we work with businesses across India and globally. Everything we build is remote-first, so location doesn't matter.",
  },
  {
    question: "What's an AI receptionist and why do I need one?",
    answer:
      "An AI voice agent that answers every incoming call 24/7, qualifies the caller, books appointments, and updates your calendar — even at 2am or while you're with a patient. If you're missing calls, you're missing money. AI receptionists fix that.",
  },
  {
    question: "Will the AI sound robotic or annoy my clients?",
    answer:
      "No. Modern AI voices are nearly indistinguishable from humans. We custom-train the voice, tone, and script around your business so it sounds like part of your team — not a chatbot. You can listen to live samples before launch.",
  },
  {
    question: "What if I already have a website?",
    answer:
      "We audit it first. If it's converting well, we leave it alone and focus on traffic and automation. If it's leaking leads, we rebuild it or fix the conversion bottlenecks. We don't push services you don't need.",
  },
  {
    question: "Is there a contract or am I locked in?",
    answer:
      "No long-term contracts. Month-to-month, cancel anytime. We earn your business by delivering results, not by trapping you in paperwork.",
  },
  {
    question: "How do I get started?",
    answer:
      "Click Book Now in the top right, fill in a few details, and we'll reach out within 24 hours to set up a free consultation. We'll show you exactly what we'd build, what it would cost, and what results to expect.",
  },
];
