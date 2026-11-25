import { CtaBand } from "@/components/sections";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
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
// Ritmo de fondos (nov. 2026, para cortar las rachas de blanco): Hero blanco ·
// cifras en panel azul marino · Servicios blanco · Niveles gris hielo ·
// Cobertura azul noche · Proceso gris hielo · Quiénes somos blanco · Galería ·
// Cotizador gris hielo · Blog azul · FAQ blanco · Shorts violeta · franja
// naranja · Contacto blanco. Nunca dos secciones seguidas del mismo fondo.
export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
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
