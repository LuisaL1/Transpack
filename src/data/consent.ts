// Aviso de cookies (solo aparece si Google Analytics está configurado).
// Las cookies analíticas no se usan con fines publicitarios y el sitio funciona
// igual si se rechazan (Ley 1581 de 2012, protección de datos en Colombia).
import type { Tr } from "@/i18n";

export const cookieText = (tr: Tr) => ({
  label: tr("Aviso de cookies", "Cookie notice", {
    fr: "Avis sur les cookies",
    de: "Cookie-Hinweis",
    it: "Avviso sui cookie",
    ar: "إشعار ملفات تعريف الارتباط",
  }),
  title: tr("Usamos cookies analíticas", "We use analytics cookies", {
    fr: "Nous utilisons des cookies analytiques",
    de: "Wir verwenden Analyse-Cookies",
    it: "Usiamo cookie analitici",
    ar: "نستخدم ملفات تعريف الارتباط التحليلية",
  }),
  text: tr(
    "Nos ayudan a entender cómo se usa el sitio para mejorarlo. No las usamos con fines publicitarios. Puedes aceptarlas o rechazarlas: el sitio funciona igual (Ley 1581 de 2012).",
    "They help us understand how the site is used so we can improve it. We never use them for advertising. You can accept or reject them: the site works the same either way (Colombian Law 1581 of 2012).",
    {
      fr: "Ils nous aident à comprendre comment le site est utilisé afin de l'améliorer. Nous ne les utilisons jamais à des fins publicitaires. Vous pouvez les accepter ou les refuser : le site fonctionne de la même façon (loi colombienne 1581 de 2012).",
      de: "Sie helfen uns zu verstehen, wie die Website genutzt wird, damit wir sie verbessern können. Für Werbung nutzen wir sie nie. Sie können sie akzeptieren oder ablehnen – die Website funktioniert in beiden Fällen gleich (kolumbianisches Gesetz 1581 von 2012).",
      it: "Ci aiutano a capire come viene usato il sito per migliorarlo. Non li usiamo mai a fini pubblicitari. Puoi accettarli o rifiutarli: il sito funziona allo stesso modo (legge colombiana 1581 del 2012).",
      ar: "تساعدنا على فهم كيفية استخدام الموقع لتحسينه. لا نستخدمها أبدًا لأغراض إعلانية. يمكنك قبولها أو رفضها، فالموقع يعمل بالطريقة نفسها (القانون الكولومبي 1581 لسنة 2012).",
    },
  ),
  accept: tr("Aceptar", "Accept", { fr: "Accepter", de: "Akzeptieren", it: "Accetta", ar: "قبول" }),
  reject: tr("Rechazar", "Reject", { fr: "Refuser", de: "Ablehnen", it: "Rifiuta", ar: "رفض" }),
});
