/**
 * Location and service landing pages.
 *
 * Each entry becomes its own indexable URL under `src/app/[slug]/page.tsx`.
 * A single home page cannot rank for distinct query intents such as "AI agency
 * in Assam", "marketing agency in Assam" and "AI agency in Delhi NCR" — Google
 * ranks pages against a query, so each intent needs a page with its own title,
 * description, canonical URL and substantial visible copy.
 *
 * Two rules govern the content in this file:
 *
 * 1. Every page is deliberately differentiated. Near-identical location pages
 *    that swap only a place name are doorway pages under Google's spam
 *    policies, so each entry has its own angle, services emphasis, examples and
 *    FAQ set.
 * 2. Every claim is grounded in what the site already states publicly (AI
 *    receptionists, WhatsApp follow-up automation, AI-assisted Meta/Google ad
 *    campaigns, conversion-focused websites, SEO; clients in dental, medical
 *    spa, healthcare and local service categories; based in Guwahati, Assam;
 *    remote-first delivery; month-to-month terms). No invented offices,
 *    headcounts, client counts, awards or performance figures.
 *
 * All copy here renders visibly on the page. Nothing in this file is intended
 * for hidden or screen-reader-only text.
 */

/** A single content block: an `<h2>` with prose and/or a bulleted list. */
export interface LandingSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

/** A question/answer pair. Rendered visibly, so it is valid FAQPage markup. */
export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingPage {
  /** URL path segment, e.g. "ai-agency-in-assam". */
  slug: string;
  /** Rendered `<title>`, authored to fit within 60 characters. */
  title: string;
  /** Meta description, authored to fit within 160 characters. */
  description: string;
  /** The single visible `<h1>`. */
  h1: string;
  /** Lead paragraph shown directly under the `<h1>`. */
  intro: string;
  /** `Service.name` used in this page's JSON-LD. */
  serviceName: string;
  /** `areaServed` used in this page's JSON-LD. */
  areaServed: string[];
  /** Final breadcrumb label for this page. */
  breadcrumbLabel: string;
  /** Short label used for internal links pointing at this page. */
  linkLabel: string;
  sections: LandingSection[];
  faqs: LandingFaq[];
}

export const LANDING_PAGES: readonly LandingPage[] = [
  // ---------------------------------------------------------------------------
  // Assam — state-wide coverage, multilingual reception, tier-2/3 city reach.
  // ---------------------------------------------------------------------------
  {
    slug: "ai-agency-in-assam",
    title: "Best AI Agency in Assam | TheClientPilot",
    description:
      "TheClientPilot is an AI agency in Assam building AI receptionists, lead automation and ad campaigns for clinics, dental practices and service businesses.",
    h1: "AI agency in Assam",
    intro:
      "TheClientPilot is an AI-first agency based in Guwahati, working with businesses across Assam. We build the systems that answer your calls, follow up with your leads and turn enquiries into booked appointments — so growth stops depending on whoever happens to be free to pick up the phone.",
    serviceName: "AI Marketing and Automation for Businesses in Assam",
    areaServed: ["Assam", "Guwahati", "Northeast India"],
    breadcrumbLabel: "AI agency in Assam",
    linkLabel: "AI agency in Assam",
    sections: [
      {
        heading: "What we build for Assam businesses",
        paragraphs: [
          "Most businesses in Assam do not have a traffic problem. They have a response problem. Calls come in during a consultation, WhatsApp enquiries sit unanswered until evening, and the customer books with whoever replied first. Every system we build closes that gap.",
        ],
        bullets: [
          "AI receptionists that answer every incoming call 24/7, qualify the caller, and book the appointment straight into your calendar.",
          "WhatsApp and SMS follow-up automation that keeps working on a lead after the first missed call.",
          "AI-assisted Meta and Google ad campaigns built around enquiries and bookings rather than reach.",
          "Conversion-focused websites that load fast and are built to be found in search.",
          "Local and national SEO so you appear when someone in Assam searches for what you sell.",
        ],
      },
      {
        heading: "Serving businesses beyond Guwahati",
        paragraphs: [
          "Everything we build is remote-first, which matters in a state where the customer base is spread far beyond one city. A dental clinic in Dibrugarh, a salon in Jorhat, a diagnostic centre in Silchar and a gym in Tezpur can all run the same automation stack as a practice in central Guwahati, because none of it depends on us being physically in the room.",
          "It also means language is a setup decision, not a constraint. An AI receptionist can be configured to greet and qualify callers in English or Hindi depending on who your patients and customers actually are.",
        ],
      },
      {
        heading: "Who we work with in Assam",
        paragraphs: [
          "Our work concentrates on appointment-driven businesses, because that is where a missed call has a directly measurable cost.",
        ],
        bullets: [
          "Dentists and dental clinics",
          "Medical spas and aesthetic clinics",
          "Doctors, healthcare practices and diagnostic centres",
          "Gyms, salons and other local service businesses",
        ],
      },
      {
        heading: "How engagements work",
        paragraphs: [
          "We start with a free consultation and audit what you already have. If your website converts, we leave it alone and put the effort into traffic and automation instead. If it is leaking enquiries, we fix that first.",
          "AI receptionists and automations typically go live within one to two weeks. Ad campaigns start producing leads within roughly seven to fourteen days of launch. SEO is the slow compounding one and generally takes two to six months to move. There are no long-term contracts — engagements run month to month.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which AI agency should an Assam business choose?",
        answer:
          "Choose one that owns the whole path from enquiry to booking rather than just running ads. TheClientPilot builds the AI receptionist, the follow-up automation, the website and the campaigns as one connected system, so there is a single team accountable for whether enquiries actually turn into appointments.",
      },
      {
        question: "Do you work with businesses outside Guwahati?",
        answer:
          "Yes. We are based in Guwahati but delivery is remote-first, so we work with businesses across Assam including Dibrugarh, Jorhat, Silchar, Tezpur and Nagaon, as well as across the rest of India.",
      },
      {
        question: "Can the AI receptionist handle callers who do not speak English?",
        answer:
          "Yes. The voice, tone and script are configured around your business, including the language your callers actually use. You can listen to samples before anything goes live.",
      },
      {
        question: "How long before an Assam business sees results?",
        answer:
          "AI receptionists and automations are usually live in one to two weeks. Paid campaigns typically produce leads within seven to fourteen days of launch. SEO takes longer, generally two to six months.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Guwahati — hyperlocal, Maps/local pack, walk-in and missed-call economics.
  // ---------------------------------------------------------------------------
  {
    slug: "ai-agency-in-guwahati",
    title: "Best AI Agency in Guwahati | TheClientPilot",
    description:
      "TheClientPilot is an AI agency in Guwahati. We build AI receptionists, local SEO and ad campaigns that turn missed calls into booked appointments.",
    h1: "AI agency in Guwahati",
    intro:
      "We are based in Guwahati, and this is our home market. If you run a clinic, practice or service business in the city, the fastest gain is usually not more advertising — it is capturing the demand already trying to reach you and being the business that shows up when someone nearby searches.",
    serviceName: "AI Marketing and Automation for Businesses in Guwahati",
    areaServed: ["Guwahati", "Assam"],
    breadcrumbLabel: "AI agency in Guwahati",
    linkLabel: "AI agency in Guwahati",
    sections: [
      {
        heading: "The missed-call problem in a walk-in city",
        paragraphs: [
          "Guwahati businesses run on proximity. Someone searches on their phone, calls the first two or three results, and books with whoever answers and can offer a slot. If your front desk is with a patient, that enquiry is gone — and you never find out it existed.",
          "An AI receptionist answers on the first ring at any hour, works out what the caller needs, and books them in. It does not replace your team. It covers the hours and moments your team cannot.",
        ],
      },
      {
        heading: "Being found by people searching nearby",
        paragraphs: [
          "Local visibility in Guwahati is won in two places: the map results and the standard search results. They are influenced by different things, so we work on both.",
        ],
        bullets: [
          "Google Business Profile setup and optimisation, which is what drives map and local-pack visibility.",
          "Local SEO on your website for the services and areas you actually serve in the city.",
          "A review generation process, because review volume and recency carry real weight in local ranking.",
          "Consistent name, address and phone details across the directories that Google cross-references.",
          "Meta and Google campaigns tightly geo-targeted to Guwahati rather than sprayed across the country.",
        ],
      },
      {
        heading: "Built for appointment-driven practices",
        paragraphs: [
          "We concentrate on dentists, dental clinics, medical spas, aesthetic clinics, doctors and healthcare practices, plus gyms and salons. These share one trait: revenue arrives as booked appointments, so a dropped enquiry has a price you can calculate.",
          "Because we are in the city, an in-person conversation is genuinely possible when it helps — though nothing we build requires it.",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "Book a free consultation and we will look at what happens to your enquiries today: how many calls go unanswered, how quickly WhatsApp gets a reply, whether you appear in the map results for your main service, and what your site does with the traffic it already has. You get exact pricing before anything begins, and engagements are month to month.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does an AI agency in Guwahati actually do?",
        answer:
          "For us it means building and running the technical systems that bring in and capture clients: AI receptionists that answer calls, automated follow-up on WhatsApp, ad campaigns, local SEO and websites. It is implementation and ongoing operation, not strategy documents.",
      },
      {
        question: "Can you help my clinic show up in Google Maps in Guwahati?",
        answer:
          "Yes. Map and local-pack visibility is driven largely by your Google Business Profile, review activity and consistent business details across directories. We set those up and maintain them alongside the SEO work on your website.",
      },
      {
        question: "Do you meet clients in person in Guwahati?",
        answer:
          "We can, since we are based here. Everything we build is remote-first though, so in-person meetings are an option rather than a requirement.",
      },
      {
        question: "How much does it cost?",
        answer:
          "It depends on scope. A starter AI receptionist setup is very different from a combined ads, website and automation build. A free consultation gets you exact pricing for your business with no commitment.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Marketing agency Assam — the marketing stack and measurement angle.
  // ---------------------------------------------------------------------------
  {
    slug: "marketing-agency-in-assam",
    title: "Best Marketing Agency in Assam | TheClientPilot",
    description:
      "A marketing agency in Assam running Meta and Google ads, SEO and conversion-focused websites, measured on booked appointments instead of impressions.",
    h1: "Marketing agency in Assam",
    intro:
      "Most agency reporting in this market is built to look impressive rather than to be useful. Reach, impressions and engagement go up and to the right while the number of new customers stays flat. We work the other way round: the only numbers that matter are enquiries, booked appointments and cost per booking.",
    serviceName: "Digital Marketing Services for Businesses in Assam",
    areaServed: ["Assam", "Guwahati", "Northeast India", "India"],
    breadcrumbLabel: "Marketing agency in Assam",
    linkLabel: "Marketing agency in Assam",
    sections: [
      {
        heading: "What we actually run",
        bullets: [
          "Meta ads — the primary demand channel for most local service businesses in Assam, built around lead quality rather than cheap clicks.",
          "Google ads — capturing people already searching with intent for your service.",
          "SEO — local and national, so you keep receiving enquiries after you stop paying for each one.",
          "Websites — fast, mobile-first, built so the traffic you pay for converts.",
          "Marketing automation — WhatsApp and SMS follow-up sequences so no lead goes cold.",
        ],
      },
      {
        heading: "Why we measure bookings, not reach",
        paragraphs: [
          "A campaign can generate a large volume of cheap leads and still lose money if none of them show up. So we track the full path: enquiry, contact, qualification, booking, attendance. That exposes where the real problem sits.",
          "Often it is not the ads at all. It is that nobody answered the phone, or the follow-up came two days later, or the site took eight seconds to load on mobile data. Fixing that is usually cheaper and faster than increasing ad spend, which is why we audit it before recommending a bigger budget.",
        ],
      },
      {
        heading: "Industries we focus on",
        paragraphs: [
          "We deliberately stay narrow. Working repeatedly with the same categories means we already know which offers, creative angles and objections tend to work.",
        ],
        bullets: [
          "Dental clinics and dentists",
          "Medical spas and aesthetic clinics",
          "Doctors, healthcare practices and diagnostic centres",
          "Gyms, salons and local service businesses",
        ],
      },
      {
        heading: "How we differ from a traditional agency",
        paragraphs: [
          "A conventional agency hands over campaigns and leaves the rest to you. The handover is exactly where most enquiries are lost, because whoever receives the lead is already busy doing their actual job.",
          "We build the capture and follow-up layer as part of the engagement, connect it to AI so it runs without supervision, and stay accountable for what happens after the click. No long-term contracts — month to month, cancel any time.",
        ],
      },
    ],
    faqs: [
      {
        question: "What makes a good marketing agency in Assam?",
        answer:
          "One that reports on booked customers rather than impressions, and that takes responsibility for what happens after someone clicks the ad. Ask any agency how many enquiries turned into attended appointments last month. If they cannot answer, they are not measuring the thing that pays you.",
      },
      {
        question: "Do you only do advertising?",
        answer:
          "No. We run ads, SEO, websites and automation. In most cases the ads are not the limiting factor — response speed and the website are — so we look at the whole path before recommending where the budget should go.",
      },
      {
        question: "What budget do I need to start?",
        answer:
          "It depends on your service, margin and the competition in your area. Rather than quoting a generic figure, we work it out in a free consultation and tell you the minimum that makes the numbers viable.",
      },
      {
        question: "Am I locked into a contract?",
        answer:
          "No. Engagements are month to month and you can cancel any time.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Delhi NCR — competitive market, speed-to-lead, remote-first with presence.
  // ---------------------------------------------------------------------------
  {
    slug: "ai-agency-in-delhi-ncr",
    title: "AI Marketing Agency in Delhi NCR | TheClientPilot",
    description:
      "AI agency serving Delhi NCR, Gurgaon, Noida and Sonipat. AI receptionists, lead automation and ad campaigns for clinics and service businesses.",
    h1: "AI marketing agency in Delhi NCR",
    intro:
      "Delhi NCR is a harder market than most. Ad costs are higher, buyers compare several providers before committing, and the business that replies first usually wins the appointment. That makes response speed a competitive advantage rather than an operational detail — and response speed is exactly what AI systems are good at.",
    serviceName: "AI Marketing and Automation for Businesses in Delhi NCR",
    areaServed: ["Delhi", "New Delhi", "Gurgaon", "Noida", "Sonipat", "Delhi NCR"],
    breadcrumbLabel: "AI agency in Delhi NCR",
    linkLabel: "AI agency in Delhi NCR",
    sections: [
      {
        heading: "Why speed-to-lead decides NCR enquiries",
        paragraphs: [
          "In a market this dense, a prospect rarely contacts only you. They send three or four enquiries and go with whoever responds first with a clear answer and an available slot. Replying an hour later means competing against a business that has already booked them.",
          "An AI receptionist and automated follow-up removes the delay entirely. Calls are answered immediately at any hour, WhatsApp enquiries get a reply in seconds, and qualified prospects reach your calendar before a competitor picks up the phone.",
        ],
      },
      {
        heading: "Built for higher acquisition costs",
        paragraphs: [
          "When clicks cost more, waste hurts more. Every lead that is not followed up is money already spent and thrown away, so in NCR we tend to fix capture and follow-up before touching ad budgets.",
        ],
        bullets: [
          "AI receptionists covering the calls your team cannot reach, including evenings and weekends.",
          "Instant automated follow-up on WhatsApp so paid leads are contacted while intent is still high.",
          "Meta and Google campaigns optimised toward booked appointments rather than lead volume.",
          "Landing pages and websites built for fast mobile load and a single clear action.",
          "Search visibility for high-intent service queries across the NCR.",
        ],
      },
      {
        heading: "How we work with NCR businesses",
        paragraphs: [
          "We are headquartered in Guwahati, Assam, and delivery is remote-first — the systems we build are cloud-based, so where we sit has no bearing on how they run. We are also on the ground in the NCR region regularly, so calls and conversations happen in your timezone and, when it is genuinely useful, in person.",
          "To be straightforward about one thing: we do not operate a walk-in office in Delhi, so we are not a local map listing. What we offer NCR businesses is the systems and campaign work, delivered remotely and measured on bookings.",
        ],
      },
      {
        heading: "Who this suits",
        paragraphs: [
          "Dental clinics, medical spas, aesthetic clinics, doctors, healthcare practices, gyms and salons across Delhi, Gurgaon, Noida and Sonipat — appointment-driven businesses where a fast reply is the difference between a booking and a lost enquiry. Engagements start with a free consultation and run month to month.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are you based in Delhi?",
        answer:
          "Our base is Guwahati, Assam, and we are in the Delhi NCR region regularly. Delivery is remote-first and cloud-based, so location does not affect the work. We do not run a walk-in office in Delhi, so we are not a local map listing there.",
      },
      {
        question: "Why use an AI agency instead of a Delhi-based one?",
        answer:
          "Judge on the systems and the results rather than the postcode. Our argument is speed-to-lead: an AI receptionist and instant automated follow-up mean an enquiry is answered in seconds at any hour, which matters more in a competitive market than which city your agency sits in.",
      },
      {
        question: "Do you cover Gurgaon, Noida and Sonipat?",
        answer:
          "Yes. We work with businesses across the NCR including Delhi, Gurgaon, Noida and Sonipat.",
      },
      {
        question: "Ad costs in NCR are high. Where should I start?",
        answer:
          "Usually with capture and follow-up rather than spend. If enquiries are being missed or contacted late, raising the budget just increases the amount you waste. Fixing response first makes the same spend produce more bookings.",
      },
    ],
  },
  // ---------------------------------------------------------------------------
  // National AI agency intent. The hardest target in this set — competing
  // against agencies with years of accumulated authority — so the page argues a
  // specific position rather than trying to out-generic them.
  // ---------------------------------------------------------------------------
  {
    slug: "ai-agency-in-india",
    title: "Best AI Agency in India | TheClientPilot",
    description:
      "TheClientPilot is an AI agency in India building AI receptionists, follow-up automation and ad campaigns measured on booked appointments.",
    h1: "AI agency in India",
    intro:
      "Most agencies in India that describe themselves as AI-powered mean they use AI to write ad copy faster. We mean something narrower and more useful: the systems that speak to your customers, qualify them and book them are themselves AI, running continuously without anyone supervising them.",
    serviceName: "AI Marketing and Automation Services in India",
    areaServed: ["India", "Assam", "Guwahati", "Delhi NCR"],
    breadcrumbLabel: "AI agency in India",
    linkLabel: "AI agency in India",
    sections: [
      {
        heading: "What AI-first actually means here",
        paragraphs: [
          "There is a meaningful difference between using AI as a production shortcut and putting AI in the path of the customer. Generating fifty ad variations faster does not change your business. Answering every call at 2am does.",
        ],
        bullets: [
          "AI voice agents that hold a real conversation with a caller, qualify them and write to your calendar.",
          "Automated follow-up that continues working a lead across WhatsApp and SMS without anyone remembering to.",
          "Campaign optimisation aimed at booked appointments rather than clicks or impressions.",
          "Websites built so the traffic you pay for actually converts.",
        ],
      },
      {
        heading: "Why we work remote-first across India",
        paragraphs: [
          "We are based in Guwahati, Assam, and every system we build is cloud-based. That is not a limitation to apologise for — it is why a clinic in Kochi and a practice in Ludhiana can run the same stack with the same setup time.",
          "It also means we are not restricted to whichever businesses happen to be within driving distance, so we can specialise deeply in a few categories rather than taking any local work that appears.",
        ],
      },
      {
        heading: "The categories we go deep on",
        paragraphs: [
          "We deliberately do not serve every industry. Repeating the same category means we already know the objections, the seasonality and the offers that convert.",
        ],
        bullets: [
          "Dental clinics and dentists",
          "Medical spas and aesthetic clinics",
          "Doctors, healthcare practices and diagnostic centres",
          "Gyms, salons and appointment-driven local services",
        ],
      },
      {
        heading: "How to evaluate us against a larger agency",
        paragraphs: [
          "Ask any agency you are considering one question: of the enquiries you generated last month, how many became attended appointments? Most cannot answer, because they stop measuring at the click and the handover.",
          "That is the number we build around. Engagements start with a free consultation, pricing is quoted before work begins, and there are no long-term contracts.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which is the best AI agency in India?",
        answer:
          "That depends on what you need. If you want brand campaigns at national scale, a large traditional agency is a better fit. If you are an appointment-driven business losing enquiries to missed calls and slow follow-up, TheClientPilot is built specifically for that problem.",
      },
      {
        question: "Do you work with businesses outside Assam?",
        answer:
          "Yes. Delivery is remote-first and cloud-based, so we work with businesses across India, including Delhi NCR, as well as internationally.",
      },
      {
        question: "Is an AI agency more expensive than a normal agency?",
        answer:
          "Not necessarily. Automation replaces recurring manual work, so ongoing cost is often lower than staffing the same coverage. Exact pricing depends on scope and is quoted in the free consultation.",
      },
      {
        question: "What do you need from me to start?",
        answer:
          "A conversation about how enquiries reach you today, access to your existing ad accounts and website if they exist, and a decision on which service to start with. Most AI receptionist setups are live within one to two weeks.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // AI automation cluster.
  // ---------------------------------------------------------------------------
  {
    slug: "ai-automation-agency",
    title: "AI Automation Agency in India | TheClientPilot",
    description:
      "AI automation agency building call answering, WhatsApp follow-up, CRM workflows and lead routing for clinics and service businesses across India.",
    h1: "AI automation agency",
    intro:
      "Automation is worth doing where a task is repetitive, time-sensitive and currently depends on someone remembering. In an appointment-driven business that describes almost everything between an enquiry arriving and a customer turning up.",
    serviceName: "AI Automation and Workflow Services",
    areaServed: ["India", "Assam", "Guwahati", "Delhi NCR"],
    breadcrumbLabel: "AI automation agency",
    linkLabel: "AI automation agency",
    sections: [
      {
        heading: "What we automate",
        bullets: [
          "Call answering — an AI voice agent picks up every call, including outside working hours, and books qualified callers in.",
          "Lead follow-up — automated WhatsApp and SMS sequences that continue until the person replies or opts out.",
          "Appointment reminders — reducing no-shows, which is usually the cheapest revenue in the building.",
          "Lead routing — enquiries sorted and assigned by service, location or urgency instead of sitting in one shared inbox.",
          "CRM updates — records created and updated automatically so your pipeline reflects reality without manual entry.",
        ],
      },
      {
        heading: "Where automation pays for itself fastest",
        paragraphs: [
          "The highest-return automation is almost always the first response. A lead contacted within a minute converts dramatically better than the same lead contacted hours later, and no human team can hold a one-minute response time across evenings and weekends.",
          "The second is no-show reduction. If a meaningful share of booked appointments do not arrive, automated reminders recover revenue you have already paid to acquire.",
        ],
      },
      {
        heading: "What we deliberately do not automate",
        paragraphs: [
          "Automation applied to the wrong step damages the business. Consultations, clinical judgement and anything requiring genuine discretion stay with your team.",
          "We also do not automate a broken process. If your intake is confusing, automating it produces confusion at higher speed. We fix the sequence first, then automate it.",
        ],
      },
      {
        heading: "How a build runs",
        paragraphs: [
          "We map how an enquiry currently travels through your business and find where it stalls. We build and configure the automations around your actual services and language, test them with you, then run them live with monitoring.",
          "Most automation builds go live within one to two weeks. Engagements are month to month.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does an AI automation agency do?",
        answer:
          "It builds and runs the systems that handle repetitive, time-sensitive work automatically — answering calls, following up leads, sending reminders, routing enquiries and updating your CRM — so results stop depending on who is free at the time.",
      },
      {
        question: "Will automation make my business feel impersonal?",
        answer:
          "Done badly, yes. We automate speed and consistency, not judgement. The AI answers immediately and handles booking; anything requiring real discretion still reaches a person. You approve the voice, tone and scripts before launch.",
      },
      {
        question: "Does this integrate with the tools I already use?",
        answer:
          "That is the intent. Automations are built around your existing calendar, CRM and WhatsApp rather than requiring you to migrate. We confirm what is possible with your specific stack during the consultation.",
      },
      {
        question: "What is the fastest automation to start with?",
        answer:
          "Usually call answering and instant follow-up, because missed calls and slow first responses are where most appointment-driven businesses lose the most revenue with the least visibility.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // AI receptionist — the most winnable target in this set: specific,
  // high-intent, and far less contested than "AI agency".
  // ---------------------------------------------------------------------------
  {
    slug: "ai-receptionist",
    title: "AI Receptionist for Clinics | TheClientPilot",
    description:
      "An AI receptionist that answers every call 24/7, qualifies the caller and books the appointment. Built for dental clinics, medical spas and doctors.",
    h1: "AI receptionist for clinics and practices",
    intro:
      "An AI receptionist is a voice agent that answers your phone, works out what the caller needs, and books them into your calendar. It answers on the first ring at any hour — including while your front desk is with a patient, and at times no human is rostered.",
    serviceName: "AI Receptionist and Voice Agent Setup",
    areaServed: ["India", "Assam", "Guwahati", "Delhi NCR"],
    breadcrumbLabel: "AI receptionist",
    linkLabel: "AI receptionist for clinics",
    sections: [
      {
        heading: "The cost of a missed call",
        paragraphs: [
          "Missed calls are the most expensive problem in an appointment business because they are invisible. A lost enquiry leaves no record — there is nothing in your inbox to review and no line in a report.",
          "Work out the average value of one new patient or client, then estimate how many calls go unanswered in a week. That figure is usually larger than the entire cost of fixing it.",
        ],
      },
      {
        heading: "What the AI receptionist handles",
        bullets: [
          "Answers every incoming call, 24 hours a day, including weekends and public holidays.",
          "Qualifies the caller — what they need, whether you offer it, how urgent it is.",
          "Books the appointment directly into your calendar against real availability.",
          "Answers routine repeat questions about services, timings and location.",
          "Captures caller details and passes anything it should not handle to your team.",
        ],
      },
      {
        heading: "Will it sound like a robot?",
        paragraphs: [
          "This is the first question almost everyone asks, and it is the right one. Modern AI voices are close to indistinguishable from a human in normal conversation.",
          "The voice, tone and script are configured around your practice so it sounds like part of your team rather than a generic phone menu, including the language your callers actually use. You listen to samples and approve them before anything goes live.",
        ],
      },
      {
        heading: "Setup and what it replaces",
        paragraphs: [
          "Setup typically completes within one to two weeks: we configure the voice and script, connect your calendar, test against real call scenarios, then go live.",
          "It is not a replacement for your front desk. It covers the calls your team physically cannot reach — during procedures, at lunch, after closing, and when several calls arrive at once. Engagements run month to month.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is an AI receptionist?",
        answer:
          "A voice agent that answers your phone automatically, holds a real conversation with the caller, qualifies what they need and books them into your calendar. It works 24/7 and handles several calls at the same time.",
      },
      {
        question: "Will my patients realise they are talking to AI?",
        answer:
          "Modern AI voices are nearly indistinguishable from human speech in a normal booking conversation, and the voice and script are trained around your practice. You can listen to live samples before launch and decide for yourself.",
      },
      {
        question: "What happens if the AI cannot handle a call?",
        answer:
          "It captures the caller's details and hands the enquiry to your team rather than guessing. Anything requiring clinical judgement or genuine discretion is routed to a person by design.",
      },
      {
        question: "How quickly can it go live?",
        answer:
          "Usually one to two weeks, covering voice and script configuration, calendar connection and testing against real call scenarios before launch.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Website / web design cluster.
  // ---------------------------------------------------------------------------
  {
    slug: "website-design-agency",
    title: "Website Design Agency in India | TheClientPilot",
    description:
      "Website design agency building fast, mobile-first sites that convert enquiries into bookings, for clinics and service businesses across India.",
    h1: "Website design agency",
    intro:
      "A website for an appointment business has one job: turn a visitor into a booking. Most fall short not because they look bad, but because they load slowly on mobile data, bury the phone number, and ask the visitor to work out what to do next.",
    serviceName: "Website Design and Development",
    areaServed: ["India", "Assam", "Guwahati", "Delhi NCR"],
    breadcrumbLabel: "Website design agency",
    linkLabel: "Website design agency",
    sections: [
      {
        heading: "What we build for",
        bullets: [
          "Mobile first — most local service traffic in India is mobile, so that is the primary design target rather than an afterthought.",
          "Fast on real connections, not just on office wifi. Every additional second of load time costs conversions.",
          "One obvious action per page — call, WhatsApp or book — instead of several competing options.",
          "Built to be indexed, with correct headings, metadata, structured data and a sitemap from day one.",
          "Connected to your automation so an enquiry from the site enters follow-up immediately.",
        ],
      },
      {
        heading: "We audit before we rebuild",
        paragraphs: [
          "If your current site converts, rebuilding it is a waste of your money. We check what the existing traffic actually does first.",
          "Often the problem is narrow and cheap to fix — a slow hero image, a form nobody completes on mobile, a phone number that is not tappable. We would rather fix that and put the remaining budget into traffic and follow-up than sell you a rebuild you do not need.",
        ],
      },
      {
        heading: "Why conversion and SEO get built together",
        paragraphs: [
          "A fast, well-structured, genuinely useful page serves both goals at once. Search engines reward the same things users do: quick loading, clear structure, content that answers the question.",
          "Retrofitting SEO onto a site built purely as a brochure is more expensive than building it in from the start, which is why we do not treat them as separate projects.",
        ],
      },
      {
        heading: "Who this is for",
        paragraphs: [
          "Dental clinics, medical spas, aesthetic clinics, doctors, healthcare practices, gyms and salons — businesses where the site exists to produce booked appointments rather than to win a design award. Free consultation first, exact pricing before work starts, month-to-month terms.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does a website take to build?",
        answer:
          "It depends on scope, and we quote the timeline in the consultation rather than giving a generic figure. A focused conversion-oriented site is considerably faster than a large multi-service build.",
      },
      {
        question: "I already have a website. Do I need a new one?",
        answer:
          "Possibly not. We audit it first. If it converts, we leave it and focus on traffic and automation instead. If it is leaking enquiries, we either fix the specific bottlenecks or rebuild, depending on which is genuinely better value.",
      },
      {
        question: "Will the site be built for SEO?",
        answer:
          "Yes. Correct heading structure, metadata, structured data, a sitemap and fast mobile performance are part of the build, not an upsell afterwards.",
      },
      {
        question: "Can the website connect to the AI receptionist?",
        answer:
          "Yes, and we recommend it. Enquiries from the site can enter the same automated follow-up as phone callers, so nothing depends on someone checking a form inbox.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SEO cluster, scoped to Guwahati where it is genuinely winnable.
  // ---------------------------------------------------------------------------
  {
    slug: "seo-agency-in-guwahati",
    title: "SEO Agency in Guwahati, Assam | TheClientPilot",
    description:
      "SEO agency in Guwahati doing local and national SEO for clinics and service businesses: Google Business Profile, on-page fixes and content.",
    h1: "SEO agency in Guwahati",
    intro:
      "SEO is the slowest thing we do and the only one that keeps producing enquiries after you stop paying per click. For a Guwahati business the winnable target is not a national keyword — it is being the obvious result when someone nearby searches for your service right now.",
    serviceName: "Search Engine Optimisation Services",
    areaServed: ["Guwahati", "Assam", "Northeast India", "India"],
    breadcrumbLabel: "SEO agency in Guwahati",
    linkLabel: "SEO agency in Guwahati",
    sections: [
      {
        heading: "Local SEO and the map results",
        paragraphs: [
          "For local searches, the map results usually sit above the standard results and take most of the clicks. They are influenced by different factors than your website, so they need separate work.",
        ],
        bullets: [
          "Google Business Profile setup, category selection and ongoing optimisation.",
          "A repeatable process for generating reviews, since volume and recency both count.",
          "Consistent business name, address and phone across the directories Google cross-references.",
          "Location and service pages on your site that match how people actually search.",
        ],
      },
      {
        heading: "The technical foundation",
        paragraphs: [
          "Before content work, the site has to be crawlable and fast. That means a correct robots file that does not accidentally block your own resources, an accurate sitemap, self-referencing canonicals, valid structured data in the server HTML, and mobile performance that holds up on a real connection.",
          "These are unglamorous and frequently broken. They are also the reason a site with good content sometimes fails to rank at all.",
        ],
      },
      {
        heading: "Content that matches search intent",
        paragraphs: [
          "One page cannot rank for many different intents. Someone searching for a specific treatment, someone comparing providers and someone looking for a clinic near them want different pages, and each needs its own.",
          "We build out the pages that match the searches your customers actually make, rather than repeating keywords on a single page and hoping it covers everything.",
        ],
      },
      {
        heading: "Honest timelines",
        paragraphs: [
          "SEO generally takes two to six months to move meaningfully, and competitive terms take longer. Local map visibility often responds faster than organic rankings, which is why we usually start there for Guwahati businesses.",
          "Anyone offering guaranteed rankings or first-page results in thirty days is either misleading you or planning to use tactics that put your domain at risk.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does SEO take to show results in Guwahati?",
        answer:
          "Typically two to six months for meaningful organic movement, and longer for competitive terms. Local map visibility often improves sooner, since Google Business Profile and review activity respond faster than organic rankings.",
      },
      {
        question: "Can you guarantee a first-page ranking?",
        answer:
          "No, and neither can anyone else. Google controls rankings and they depend on competition, your site's authority and factors outside any agency's control. We can guarantee the work, not the position.",
      },
      {
        question: "What matters most for local SEO?",
        answer:
          "For local searches, your Google Business Profile, review volume and recency, and consistent business details across directories usually matter most, alongside a fast crawlable site with pages matching what people search for.",
      },
      {
        question: "Do you do SEO alongside ads?",
        answer:
          "Often, yes. Ads produce enquiries within days while SEO compounds over months, so running both means you are not waiting on SEO before seeing any return.",
      },
    ],
  },
];

/** Returns the landing page for `slug`, or `undefined` when there is none. */
export function findLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}
