import { Link } from "react-router-dom";
import { btn, Eyebrow } from "@/components/ui";
import { PageHero } from "@/components/sections";
import { useLang } from "@/i18n";

export default function NotFoundPage() {
  const { lp, tr } = useLang();
  return (
    <PageHero>
      <div className="max-w-2xl py-10">
        <Eyebrow light>Error 404</Eyebrow>
        <h1 className="mb-5 text-[clamp(2.2rem,1.4rem+3vw,3.6rem)] !text-white">
          {tr("Esta página tomó otra ruta", "This page took another route")}
        </h1>
        <p className="mb-8 text-[1.08rem]">
          {tr(
            "No encontramos lo que buscabas. Te llevamos de vuelta al inicio.",
            "We couldn't find what you were looking for. Let us take you back home.",
          )}
        </p>
        <Link to={lp("/")} className={`${btn.primary} ${btn.lg}`}>
          {tr("Ir al inicio", "Go to home")}
        </Link>
      </div>
    </PageHero>
  );
}
