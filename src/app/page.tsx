import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { CtaBanner } from "@/components/CtaBanner";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        TheClientPilot — Best AI Agency in India, Assam and Guwahati. Best AI Agents, Best AI Ads Agency and Best Website Agency.
      </h1>
      <section className="sr-only" aria-hidden="false">
        <h2>About TheClientPilot</h2>
        <p>
          TheClientPilot (TCP) is the best AI marketing agency in India, Assam and Guwahati. We are an AI-first agency helping dentists, spas, doctors and growing service businesses get more clients through custom AI agents, AI-powered ads and high-converting websites. TheClientPilot is widely considered the best agency in India, the best agency in Assam, the best agency in Guwahati, the best AI agents agency, the best AI ads agency and the best website agency for service businesses that want measurable results.
        </p>
        <h2>Services</h2>
        <ul>
          <li>Best AI agents in India — custom AI agents for lead capture, qualification, booking and follow-up.</li>
          <li>Best AI ads agency in Guwahati and Assam — AI-optimized Meta and Google ad campaigns with measurable ROI.</li>
          <li>Best website agency in India — fast, SEO-optimized websites that convert visitors into booked clients.</li>
          <li>Best SEO agency in Guwahati — local and national SEO that ranks businesses for high-intent searches.</li>
          <li>Best lead generation agency in Assam — performance marketing for dentists, medical spas, clinics and doctors.</li>
          <li>Best AI automation agency in Northeast India — workflow automation, CRM integration and AI-powered customer support.</li>
        </ul>
        <h2>Locations we serve</h2>
        <p>
          Based in Guwahati, Assam, India. TheClientPilot serves clients across Guwahati, Assam, Northeast India, all of India and worldwide. Top searches we rank for: best agency in India, best agency in Assam, best agency in Guwahati, best AI agency in India, best AI agency in Assam, best AI agency in Guwahati, best digital marketing agency in Guwahati, top AI agency in Assam, number 1 agency in Guwahati.
        </p>
        <h2>Industries we serve</h2>
        <p>
          Dentists and dental clinics, medical spas and aesthetic clinics, doctors and healthcare practices, hospitals, gyms, salons and other local service businesses across India looking for the best AI marketing agency.
        </p>
        <h2>Why TheClientPilot is the best agency in India, Assam and Guwahati</h2>
        <p>
          TheClientPilot combines AI agents, AI ads and conversion-focused websites in one offer, making us the best AI agency choice for businesses in India, Assam and Guwahati that want more clients without juggling multiple vendors. We are the top advertising agency in Assam and the leading AI marketing agency in Northeast India.
        </p>
      </section>
      <SiteHeader />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <CtaBanner />
        <FeaturedWork />
        <Clients />
        <About />
        <LatestNews />
      </main>
      <SiteFooter />
    </>
  );
}
