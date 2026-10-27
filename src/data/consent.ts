// Aviso de cookies (solo aparece si Google Analytics está configurado).
// Las cookies analíticas no se usan con fines publicitarios y el sitio funciona
// igual si se rechazan (Ley 1581 de 2012, protección de datos en Colombia).
import type { Tr } from "@/i18n";
import { privacyLink } from "@/data/pages";

export const cookieText = (tr: Tr) => ({
  label: tr("Aviso de cookies", "Cookie notice"),
  title: tr("Usamos cookies analíticas", "We use analytics cookies"),
  text: tr(
    "Nos ayudan a entender cómo se usa el sitio para mejorarlo. No las usamos con fines publicitarios. Puedes aceptarlas o rechazarlas: el sitio funciona igual (Ley 1581 de 2012).",
    "They help us understand how the site is used so we can improve it. We never use them for advertising. You can accept or reject them: the site works the same either way (Colombian Law 1581 of 2012).",
  ),
  policy: privacyLink(tr),
  accept: tr("Aceptar", "Accept"),
  reject: tr("Rechazar", "Reject"),
});
