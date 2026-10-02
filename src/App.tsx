import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdvisorChat from "@/components/AdvisorChat";
import LandingPage from "@/pages/LandingPage";
import NosotrosPage from "@/pages/NosotrosPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import ArticlePage from "@/pages/ArticlePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { LANG_INFO, LANGS, localize, toSpanish, useLang, type Lang } from "@/i18n";

const SITE = "https://www.transpacksas.com";

const META: Record<Lang, { title: string; description: string }> = {
  es: {
    title: "Transpack | Mudanzas nacionales e internacionales desde 1968",
    description:
      "Transpack S.A.S.: mudanzas locales, nacionales e internacionales, bodegaje y movilidad corporativa desde Bogotá. Más de 58 años de experiencia y cobertura en 176 países.",
  },
  en: {
    title: "Transpack | National and international moving since 1968",
    description:
      "Transpack S.A.S.: local, national and international moving, storage and corporate mobility from Bogotá, Colombia. 58 years of experience and coverage in 176 countries.",
  },
  fr: {
    title: "Transpack | Déménagement national et international depuis 1968",
    description:
      "Transpack S.A.S. : déménagements locaux, nationaux et internationaux, garde-meubles et mobilité d'entreprise depuis Bogota, Colombie. 58 ans d'expérience et une couverture dans 176 pays.",
  },
  de: {
    title: "Transpack | Nationale und internationale Umzüge seit 1968",
    description:
      "Transpack S.A.S.: Umzüge vor Ort, innerhalb Kolumbiens und international, Einlagerung und Firmenmobilität ab Bogotá. 58 Jahre Erfahrung und ein Netzwerk in 176 Ländern.",
  },
  it: {
    title: "Transpack | Traslochi nazionali e internazionali dal 1968",
    description:
      "Transpack S.A.S.: traslochi locali, nazionali e internazionali, deposito mobili e mobilità aziendale da Bogotá, Colombia. 58 anni di esperienza e copertura in 176 paesi.",
  },
  ar: {
    title: "ترانسباك | خدمات النقل المحلي والدولي منذ 1968",
    description:
      "ترانسباك: نقل داخل المدينة وبين المدن ونقل دولي، وتخزين، وخدمات تنقّل للشركات انطلاقًا من بوغوتا، كولومبيا. خبرة 58 عامًا وتغطية في 176 دولة.",
  },
};

// Idioma y dirección del documento, título, descripción y enlaces hreflang
function LangHead() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  useEffect(() => {
    const html = document.documentElement;
    html.lang = LANG_INFO[lang].locale;
    html.dir = LANG_INFO[lang].dir;
    document.title = META[lang].title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", META[lang].description);
    // hreflang: la misma página en cada idioma
    document.querySelectorAll("link[data-hreflang]").forEach((l) => l.remove());
    const es = toSpanish(pathname);
    const links: [string, string][] = [
      ...LANGS.map((l) => [LANG_INFO[l].hreflang, localize(es, l)] as [string, string]),
      ["x-default", es],
    ];
    for (const [code, href] of links) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = code;
      link.href = SITE + href;
      link.dataset.hreflang = "1";
      document.head.appendChild(link);
    }
  }, [lang, pathname]);
  return null;
}

// Rutas de cada idioma con prefijo (/en, /fr, /de, /it, /ar)
const LOCAL_ROUTES = (LANGS.filter((l) => l !== "es") as Lang[]).map((l) => ({
  lang: l,
  home: `/${l}`,
  about: localize("/nosotros", l),
  services: localize("/servicios", l),
}));

// Al cambiar de ruta: si hay #ancla, baja a esa sección; si no, vuelve arriba.
function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      // Espera a que la nueva página se pinte antes de buscar la sección
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 10) setTimeout(go, 50);
      };
      requestAnimationFrame(go);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollManager />
      <LangHead />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AdvisorChat />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Otros idiomas */}
        {LOCAL_ROUTES.flatMap((r) => [
          <Route key={`${r.lang}-home`} path={r.home} element={<LandingPage />} />,
          <Route key={`${r.lang}-about`} path={r.about} element={<NosotrosPage />} />,
          <Route
            key={`${r.lang}-svc`}
            path={`${r.services}/:slug`}
            element={<ServiceDetailPage />}
          />,
          <Route key={`${r.lang}-blog`} path={`${r.home}/blog/:slug`} element={<ArticlePage />} />,
          <Route key={`${r.lang}-404`} path={`${r.home}/*`} element={<NotFoundPage />} />,
        ])}
      </Route>
    </Routes>
  );
}
