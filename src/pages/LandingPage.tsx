import { CtaBand } from "@/components/sections";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
import { Segments } from "@/components/home/Segments";
import { Levels } from "@/components/home/Levels";
import { Coverage } from "@/components/home/Coverage";
import { Process } from "@/components/home/Process";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Gallery } from "@/components/home/Gallery";
import { QuoteSection } from "@/components/home/QuoteSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FaqSection } from "@/components/home/FaqSection";
import { VideoShorts } from "@/components/home/VideoShorts";
import { ContactSection } from "@/components/home/ContactSection";

// Inicio (/): una sección por componente, en src/components/home
export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Segments />
      <Levels />
      <Coverage />
      <Process />
      <AboutTeaser />
      <Gallery />
      <QuoteSection />
      <BlogSection />
      <FaqSection />
      <VideoShorts />
      <CtaBand />
      <ContactSection />
    </>
  );
}
