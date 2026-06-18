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
