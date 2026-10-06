import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

// Título de sección: rótulo, título y bajada
export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`mb-12 max-w-3xl md:mb-16 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`mb-4 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] ${
          light ? "!text-white" : ""
        }`}
      >
        {title}
      </h2>
      {sub && <p className={`text-[1.06rem] ${light ? "text-white/75" : "text-suave"}`}>{sub}</p>}
    </Reveal>
  );
}
