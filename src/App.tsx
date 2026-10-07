import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AnalyticsTracker, CookieBanner } from "@/components/layout/Analytics";
import { SeoHead } from "@/components/layout/SeoHead";
import { ContactModal } from "@/components/layout/ContactModal";
import { LandingPage } from "@/pages/LandingPage";
import { NosotrosPage } from "@/pages/NosotrosPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { LANGS, localize, type Lang } from "@/i18n";

// Rutas de cada idioma con prefijo (/en, /fr, /de, /it, /ar)
const LOCAL_ROUTES = (LANGS.filter((l) => l !== "es") as Lang[]).map((l) => ({
  lang: l,
  home: `/${l}`,
  about: localize("/nosotros", l),
  services: localize("/servicios", l),
  privacy: localize("/privacidad", l),
}));

// Rutas del sitio (una página por ruta, en cada idioma)
export function App() {
  return (
    <>
      <SeoHead />
      <AnalyticsTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* Otros idiomas */}
          {LOCAL_ROUTES.flatMap((r) => [
            <Route key={`${r.lang}-home`} path={r.home} element={<LandingPage />} />,
            <Route key={`${r.lang}-about`} path={r.about} element={<NosotrosPage />} />,
            <Route key={`${r.lang}-privacy`} path={r.privacy} element={<PrivacyPage />} />,
            <Route
              key={`${r.lang}-svc`}
              path={`${r.services}/:slug`}
              element={<ServiceDetailPage />}
            />,
            <Route
              key={`${r.lang}-blog`}
              path={`${r.home}/blog/:slug`}
              element={<ArticlePage />}
            />,
            <Route key={`${r.lang}-404`} path={`${r.home}/*`} element={<NotFoundPage />} />,
          ])}
        </Route>
      </Routes>
      <CookieBanner />
      <ContactModal />
    </>
  );
}
