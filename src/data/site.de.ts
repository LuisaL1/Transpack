// Deutsche Fassung der Website-Inhalte. Gleiche Struktur wie site.ts: Ändert
// sich ein Text auf Spanisch, muss er auch hier angepasst werden. Interne
// Codes (slug, quote, id) bleiben spanisch, da sie URLs und Anfrageformular
// steuern.
import imgEquipoSala from "@/assets/images/equipo-sala.jpg";
import imgEmbalajeSala from "@/assets/images/embalaje-sala.jpg";
import imgContenedor from "@/assets/images/contenedor.jpg";
import imgGuacales from "@/assets/images/guacales.jpg";
import imgNuevaEtapa from "@/assets/images/nueva-etapa.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import imgCargue from "@/assets/images/cargue.jpg";
import imgBarco from "@/assets/images/barco.jpg";
import imgArteHogar from "@/assets/images/galeria/arte-hogar.jpg";
import imgEmbalajeHogar from "@/assets/images/galeria/embalaje-hogar.jpg";
import imgCargueCajas from "@/assets/images/galeria/cargue-cajas.jpg";
import imgDespachoBodega from "@/assets/images/galeria/despacho-bodega.jpg";
import imgBodegaGuacales from "@/assets/images/galeria/bodega-guacales.jpg";
import imgGuacalExportacion from "@/assets/images/galeria/guacal-exportacion.jpg";
import imgBodegaMuebles from "@/assets/images/galeria/bodega-muebles.jpg";
import imgEmbalajeCuadro from "@/assets/images/galeria/embalaje-cuadro.jpg";
import type { QuoteService, Service } from "@/data/site";
import { CONTACT, type PrivacySection } from "@/data/site";

export { CONTACT, YOUTUBE_CHANNEL, ABOUT_IMAGES } from "@/data/site";

export const waLink = (text = "Hallo Transpack, ich hätte gern Informationen zu einem Umzug") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const VIDEOS = [
  { id: "i4G8QG8lan8", tag: "Internationaler Umzug", title: "Von den USA nach Kolumbien" },
  { id: "uFEVARznuhM", tag: "Rückkehr nach Kolumbien", title: "Sie ziehen nach Kolumbien?" },
  {
    id: "bUOWdNVa2Uc",
    tag: "Planung",
    title: "Ein gelungener Auslandsumzug beginnt lange vor dem Versand",
  },
];

export const SLOGAN = "Wir versprechen mit Herz und halten Wort mit Exzellenz.";

export const STATS = [
  { value: 58, suffix: "+", label: "Jahre Erfahrung" },
  { value: 176, suffix: "+", label: "Zielländer" },
  { value: 60, suffix: "K+", label: "Tonnen exportiertes Umzugsgut" },
  { value: 2000, suffix: "+", label: "internationale Partner" },
];

export const EMBASSIES = [
  "USA",
  "Spanien",
  "Kanada",
  "Mexiko",
  "Indien",
  "Frankreich",
  "Deutschland",
  "Ägypten",
  "Vereinigte Arabische Emirate",
  "Italien",
];

// ─── Leistungen ───────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Umzug vor Ort",
    short:
      "Umzüge innerhalb Bogotás und des Großraums – mit geschultem Personal, Möbelschutz und Fahrzeugen in passender Größe.",
    quote: "local",
    cta: "Angebot anfordern",
    image: imgEquipoSala,
    kicker: "Umziehen in Bogotá",
    headline: "Ihr Umzug innerhalb der Stadt – ohne Stress und ohne Überraschungen",
    intro:
      "Wir planen jeden Umzug vor Ort anhand der alten und neuen Wohnung: Stockwerk, Aufzug, Treppen, Zufahrt für den LKW und die von der Hausverwaltung erlaubten Zeiten. So kommen wir mit dem richtigen Team und genügend Zeit.",
    includes: [
      "Besichtigung oder Videocall, wenn der Umfang es erfordert",
      "Ladeteam mit Erfahrung im Möbeltransport",
      "Schutz für Möbel, Haushaltsgeräte und Zerbrechliches",
      "Möbelab- und -aufbau",
      "Fahrzeug passend zum Umfang Ihres Inventars",
      "Optionale Zwischenlagerung",
    ],
    steps: [
      {
        title: "Umzug beschreiben",
        text: "Abholort, Zielort, Datum, Art der Immobilie und was umziehen soll.",
      },
      {
        title: "Kostenschätzung erhalten",
        text: "Sie erhalten eine Schätzung und, wenn sie passt, das verbindliche Angebot.",
      },
      {
        title: "Wir verpacken und schützen",
        text: "Je nach gewähltem Leistungspaket: Basis, Schutz oder Komplettservice.",
      },
      { title: "Wir liefern", text: "Wir entladen und stellen alles in Ihrem neuen Zuhause auf." },
    ],
    note: "Umzüge vor Ort werden meist 1 bis 2 Wochen im Voraus geplant – je nach Verfügbarkeit übernehmen wir aber auch kurzfristige Aufträge.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "Umzug innerhalb Kolumbiens",
    short:
      "Umzüge zwischen kolumbianischen Städten mit detaillierter Inventarliste, professioneller Verpackung, Fahrzeugüberwachung und Lieferung von Tür zu Tür.",
    quote: "nacional",
    cta: "Angebot anfordern",
    image: imgCargue,
    kicker: "Zwischen kolumbianischen Städten",
    headline: "Von einer Stadt in die andere – Ihr Hab und Gut auf der ganzen Strecke geschützt",
    intro:
      "Beim Umzug zwischen Städten ist die Inventarliste die Grundlage: Mit ihr berechnen wir Umfang, Fahrzeug und benötigte Ressourcen. Auf jeder Strecke achten wir auf Sicherheit, Schutz und Termintreue.",
    includes: [
      "Detaillierte Inventarliste und Volumenberechnung",
      "Professionelle Verpackung und Spezialschutz",
      "Überwachung des Fahrzeugs während der Fahrt",
      "Geplantes Be- und Entladen an Abhol- und Zielort",
      "Tür-zu-Tür-Service im ganzen Land",
      "Einlagerung in Bogotá, falls Ihr neues Zuhause noch nicht bereit ist",
    ],
    steps: [
      {
        title: "Inventar",
        text: "Wir erfassen alles, was umzieht, um Umfang und Kosten zu ermitteln.",
      },
      { title: "Route und Planung", text: "Wir prüfen Route, Fahrzeug und Zufahrtsbedingungen." },
      {
        title: "Verpacken und Beladen",
        text: "Jeder Gegenstand wird nach Wert und Zerbrechlichkeit geschützt.",
      },
      { title: "Lieferung", text: "Wir entladen und stellen alles in Ihrer neuen Stadt auf." },
    ],
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "Internationaler Umzug",
    short:
      "Per See- oder Luftfracht, von und nach Kolumbien. Vor dem Angebot beraten wir Sie zu Vorschriften, Fristen und Zollformalitäten.",
    quote: "internacional",
    cta: "Mit einem Berater sprechen",
    image: imgGlobal,
    kicker: "Von und nach Kolumbien",
    headline: "Ihr neues Leben im Ausland beginnt mit einem klaren Plan",
    intro:
      "Ein Auslandsumzug läuft anders ab als ein Umzug vor Ort. Zuerst verstehen Sie Ablauf, Vorschriften, Fristen und Kosten – danach erstellen wir das Angebot. Ein spezialisierter Berater begleitet Sie ab dem ersten Kontakt, gestützt auf über 2.000 Partner in 176 Ländern.",
    includes: [
      "Erstberatung zu Vorschriften im Abreise- und Zielland",
      "Seefracht (große Mengen) oder Luftfracht (eilige Sendungen)",
      "Zoll- und Dokumentenabwicklung für Umzugsgut",
      "Holzkisten und Exportverpackung",
      "Abstimmung mit LACMA-, IAM- und PAIMA-zertifizierten Partnern",
      "Lieferung von Tür zu Tür im Zielland",
    ],
    steps: [
      {
        title: "Bedarfsanalyse",
        text: "Abreiseort, Ziel, Termin, Anlass des Umzugs und vorläufiges Inventar.",
      },
      {
        title: "Fachberatung",
        text: "Wir besprechen mit Ihnen Vorschriften, Fristen und Nebenkosten.",
      },
      {
        title: "Exportverpackung",
        text: "Inventar, Klassifizierung und Schutz für den internationalen Transport.",
      },
      {
        title: "Transport und Zustellung",
        text: "Wir begleiten Sie, bis Ihr neues Zuhause bewohnbar ist.",
      },
    ],
    note: "Wir empfehlen, 1 bis 2 Monate vor dem Packtermin mit den Vorbereitungen zu beginnen.",
    featured: true,
    tags: [
      { icon: "water", label: "Seefracht" },
      { icon: "airplane", label: "Luftfracht" },
    ],
  },
  {
    slug: "bodegaje",
    icon: "boxes",
    title: "Einlagerung",
    short:
      "Sichere Lagerung in Bogotá – tage-, monatsweise oder bis Ihr Umzug abgeschlossen ist. Eigene Lagerhallen und Inventarkontrolle.",
    quote: "bodegaje",
    cta: "Angebot anfordern",
    image: imgContenedor,
    kicker: "Lagerung in Bogotá",
    headline: "Ein sicherer Ort für Ihr Hab und Gut – so lange Sie ihn brauchen",
    intro:
      "In unseren Lagerhallen in Bogotá können Sie Hausrat, Büromöbel oder Akten unterbringen, während Sie sich einrichten, renovieren oder auf Ihren Reisetermin warten. Die Einlagerung ist einzeln oder als Teil Ihres Umzugs buchbar.",
    includes: [
      "Eigene Lagerhallen in Bogotá",
      "Inventarkontrolle der eingelagerten Güter",
      "Abholung an Ihrer Adresse und Lieferung auf Abruf",
      "Verpackung für die Langzeitlagerung",
      "Tages-, Monats- oder Langzeittarife",
      "Ideal für Unternehmen, Expats und Familien im Übergang",
    ],
    steps: [
      { title: "Lagergut angeben", text: "Art der Güter, Umfang und voraussichtliche Dauer." },
      { title: "Wir holen ab", text: "Wir verpacken und inventarisieren vor Ort." },
      {
        title: "Wir lagern ein",
        text: "Ihre Güter bleiben in unseren Lagerhallen unter Kontrolle.",
      },
      { title: "Wir liefern", text: "Wann immer Sie möchten, an die Adresse Ihrer Wahl." },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Spezialverpackung",
    short:
      "Maßgefertigte Holzkisten, hochdichte Polsterung und Schutz für Kunstwerke, Glas und hochwertige Möbel.",
    quote: "local",
    cta: "Angebot anfordern",
    image: imgGuacales,
    kicker: "Verpackungstechnik",
    headline: "Wertvolle Stücke verpackt man nicht wie alles andere",
    intro:
      "Kunstwerke, Sammlungen, Glas und Designermöbel erfordern echte Verpackungstechnik: maßgefertigte Holzkisten für Gemälde, hochdichte Stoßdämpfung und Feuchtigkeitsschutz für lange Transportwege.",
    includes: [
      "Maßgefertigte Holzkisten",
      "Hochdichte Stoßdämpfung",
      "Feuchtigkeitsschutz für die Seefracht",
      "Transport von Klavieren und sperrigen Gegenständen",
      "Inventarisierung und Beschriftung jedes einzelnen Stücks",
      "Personal mit Erfahrung im Umgang mit Zerbrechlichem",
    ],
    steps: [
      {
        title: "Bewertung",
        text: "Wir erfassen besondere Stücke, ihre Maße und ihre Empfindlichkeit.",
      },
      {
        title: "Verpackungskonzept",
        text: "Wir legen Materialien und Kisten für jedes Stück fest.",
      },
      { title: "Verpackung", text: "Wir verpacken, beschriften und inventarisieren." },
      { title: "Transport", text: "Fachkundige Handhabung bis zum Bestimmungsort." },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Zoll und Dokumente",
    short:
      "Begleitung bei Ausfuhr und Einfuhr von Umzugsgut, deklarierten Inventarlisten und den Vorschriften im Abreise- und Zielland.",
    quote: "internacional",
    cta: "Angebot anfordern",
    image: imgBarco,
    kicker: "Internationale Formalitäten",
    headline: "Der Zoll ist ein Labyrinth aus Vorschriften. Wir kennen den Weg",
    intro:
      "Eine fehlerhafte Inventarliste oder eine fehlende Genehmigung kann Wochen an Verzögerung und Strafen kosten. Wir begleiten Sie bei den Aus- und Einfuhrdokumenten für Umzugsgut und persönliche Gegenstände – nach den Vorschriften des jeweiligen Landes.",
    includes: [
      "Prüfung der Vorschriften im Abreise- und Zielland",
      "Zollinventarliste",
      "Abstimmung der Hafen- und Flughafengebühren",
      "Begleitung bei Kontrollen und Prüfungen",
      "Beratung für Kolumbianer, die zurückkehren",
      "Proaktive Kommunikation während des gesamten Prozesses",
    ],
    steps: [
      { title: "Prüfung", text: "Wir analysieren Ihren Fall und die erforderlichen Dokumente." },
      { title: "Vorbereitung", text: "Inventar und Unterlagen ohne Unstimmigkeiten." },
      { title: "Abwicklung", text: "Wir stimmen uns mit Behörden und Partnern im Zielland ab." },
      { title: "Freigabe", text: "Wir begleiten Sie bis zur Zustellung Ihrer Güter." },
    ],
  },
];

// ─── Lösungen nach Zielgruppe ─────────────────────────────────────────────────

export const SEGMENTS = [
  {
    id: "residencial",
    icon: "house-door",
    tab: "Privatkunden",
    kicker: "Transpack Privatkunden",
    title: "Ihr Zuhause – im selben Zustand am neuen Ort",
    text: "Privatumzüge vor Ort, innerhalb Kolumbiens und international. Sie entscheiden, was wir übernehmen: vom reinen Transport bis zum Komplettservice, bei dem wir uns um alles kümmern.",
    points: [
      "Verpackung sowie Möbelab- und -aufbau",
      "Schutz für Zerbrechliches und Wertgegenstände",
      "Zwischenlagerung, während Sie sich einrichten",
    ],
    cta: "Angebot für meinen Umzug anfordern",
    quote: "local" as QuoteService,
    image: imgEquipoSala,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "Ein Partner für den Umzug von Büros und Talenten",
    text: "Büroumzüge sowie nationale und internationale Mitarbeiterumzüge. Wir arbeiten mit Einkauf und Personalabteilung auf Basis von Rahmenverträgen – mit einem persönlichen Kundenbetreuer.",
    points: [
      "Persönlicher Kundenbetreuer und wiederkehrende Abwicklung",
      "Einsätze nachts oder am Wochenende nach Zeitplan",
      "Reporting, Nachverfolgbarkeit und Firmenkonditionen",
    ],
    cta: "Firmenangebot anfordern",
    quote: "empresarial" as QuoteService,
    image: imgContenedor,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Diskretion, Protokoll und Präzision für diplomatische Vertretungen",
    text: "Die Botschaften der USA, Spaniens, Kanadas, Mexikos, Indiens, Frankreichs, Deutschlands, Ägyptens, der Vereinigten Arabischen Emirate und Italiens sowie Institutionen wie die CAF haben uns den Umzug ihres Personals anvertraut.",
    points: [
      "Betreuung nach Protokoll und absolute Vertraulichkeit",
      "Registrierung als institutioneller Lieferant",
      "Einhaltung der Vorschriften im Abreise- und Zielland",
    ],
    cta: "Unser Team für Institutionen kontaktieren",
    quote: "internacional" as QuoteService,
    image: imgGuacales,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Leben im Ausland",
    kicker: "Ins Ausland ziehen oder nach Kolumbien zurückkehren",
    title: "Wir transportieren nicht nur Ihre Sachen – wir erleichtern Ihren Neuanfang",
    text: "Ob Sie in die USA, nach Kanada, Europa oder anderswohin ziehen oder nach Kolumbien zurückkehren: Wir begleiten Sie von der Planung an, damit Sie mit allem in Ordnung ankommen.",
    points: [
      "Beratung zu Vorschriften, Fristen und Kosten vor dem Packen",
      "See- oder Luftfracht – je nach Ihrer Situation",
      "Ein Partnernetzwerk, das Sie im Zielland empfängt",
    ],
    cta: "Meinen Auslandsumzug planen",
    quote: "internacional" as QuoteService,
    image: imgNuevaEtapa,
  },
];

// ─── Leistungspakete ──────────────────────────────────────────────────────────

export const LEVELS = [
  {
    n: "01",
    title: "Basisumzug",
    text: "Sie haben alles bereits verpackt. Wir stellen Team und Fahrzeug.",
    points: ["Ladeteam", "Transport", "Entladen am Zielort"],
    value: "Paket 1 · Basisumzug",
  },
  {
    n: "02",
    title: "Schutz und Verpackung",
    text: "Wir packen Ihre Kartons und schützen Ihre Möbel mit professioneller Handhabung.",
    points: [
      "Alles aus dem Basispaket",
      "Packen der Kartons",
      "Möbelschutz",
      "Professionelle Handhabung",
    ],
    value: "Paket 2 · Schutz und Verpackung",
    featured: true,
  },
  {
    n: "03",
    title: "Komplettservice",
    text: "Wir übernehmen den gesamten Ablauf von Anfang bis Ende – Sie müssen nur noch ankommen.",
    points: [
      "Alles aus Paket 2",
      "Möbelab- und -aufbau",
      "Einräumen am Zielort",
      "Vollständige Koordination",
    ],
    value: "Paket 3 · Komplettservice",
  },
];

export const PROCESS = [
  {
    title: "Bedarfsanalyse",
    text: "Wir klären Abholort, Ziel, Zeitrahmen, Inventar und den gewünschten Leistungsumfang.",
  },
  {
    title: "Lösungskonzept",
    text: "Wir kombinieren Transport, Verpackung, Einlagerung und Formalitäten. Bei Bedarf besichtigen wir vor Ort.",
  },
  {
    title: "Verpackung und Inventar",
    text: "Wir sortieren und schützen jeden Gegenstand mit Materialien passend zu Wert und Empfindlichkeit.",
  },
  {
    title: "Durchführung und Begleitung",
    text: "Wir koordinieren die Route im In- oder Ausland und halten Sie auf dem Laufenden.",
  },
  {
    title: "Lieferung von Tür zu Tür",
    text: "Wir sind erst fertig, wenn Ihr neues Zuhause bewohnbar ist.",
  },
];

export const FAQS = [
  {
    q: "Wie früh sollte ich meinen Umzug buchen?",
    a: "Umzüge vor Ort lassen sich ein bis zwei Wochen im Voraus planen; je nach Verfügbarkeit übernehmen wir auch kurzfristige Aufträge. Für internationale Umzüge empfehlen wir, ein bis zwei Monate vor dem Packtermin zu beginnen.",
  },
  {
    q: "Wie lange dauert ein internationaler Umzug per Seefracht?",
    a: "Das hängt von Abreise- und Zielort, der Häufigkeit der Schiffsverbindungen, den Zollverfahren und der Saison ab. Im Durchschnitt dauert er einige Wochen bis wenige Monate. Gute Planung und vollständige Unterlagen verringern Verzögerungen.",
  },
  {
    q: "Ist ein Umzug per Seefracht oder per Luftfracht besser?",
    a: "Seefracht eignet sich ideal für große Mengen, komplette Einrichtungen und den Hausrat einer Familie. Luftfracht ist schneller und empfiehlt sich für kleine oder eilige Sendungen. Wir beraten Sie nach Budget, Zeitrahmen und Art Ihrer Güter.",
  },
  {
    q: "Ist für ein Angebot eine Besichtigung nötig?",
    a: "Nicht immer. Reichen die Angaben zu Inventar und Immobilie aus, können wir Ihnen eine Kostenschätzung geben. Bei Komplexität oder Fehlerrisiko (schwierige Zufahrt, besondere Gegenstände, große Mengen) empfehlen wir eine Besichtigung oder einen Videocall.",
  },
  {
    q: "Warum ist die Inventarliste so wichtig?",
    a: "Mit der Inventarliste schätzen wir Umfang, Ressourcen und Zeitbedarf. Wird etwas vergessen, kann sich der Endpreis ändern – je genauer die Liste, desto präziser Ihr Angebot.",
  },
  {
    q: "Was, wenn der LKW nicht in der Nähe der Immobilie parken kann?",
    a: "Das ist eine entscheidende Information: Der Abstand zwischen Fahrzeug und Haustür verändert den Ablauf. Teilen Sie uns mit, ob der LKW außerhalb der Wohnanlage oder weit vom Gebäude entfernt stehen muss, damit wir Personal und Zeit richtig planen.",
  },
];

export const GALLERY: { src: string; caption: string; tall?: boolean }[] = [
  { src: imgEmbalajeSala, caption: "Verpackung vor Ort" },
  { src: imgContenedor, caption: "Containerbeladung", tall: true },
  { src: imgArteHogar, caption: "Schutz von Kunstwerken zu Hause" },
  { src: imgCargueCajas, caption: "Verladen von Transpack-Kartons" },
  { src: imgGuacales, caption: "Maßgefertigte Holzkisten" },
  { src: imgEmbalajeCuadro, caption: "Verpackung eines Gemäldes", tall: true },
  { src: imgBodegaGuacales, caption: "Lager mit Aufbewahrungskisten" },
  { src: imgEquipoSala, caption: "Möbelschutz" },
  { src: imgBarco, caption: "Seewege", tall: true },
  { src: imgEmbalajeHogar, caption: "Verpackung des Hausrats vor Ort" },
  { src: imgGuacalExportacion, caption: "Exportkiste" },
  { src: imgDespachoBodega, caption: "Versand aus dem Lager" },
  { src: imgBodegaMuebles, caption: "Geschützte Möbel im Lager" },
];

// Política de tratamiento de datos (traducción; la versión en español es la oficial).
// Mismas secciones y orden que PRIVACY en src/data/site.ts.
export const PRIVACY = {
  title: "Richtlinie zur Verarbeitung personenbezogener Daten",
  intro: "Transpack S.A.S. verarbeitet Ihre personenbezogenen Daten gemäß dem kolumbianischen Gesetz 1581 von 2012 und dem Dekret 1377 von 2013 (zusammengefasst im Dekret 1074 von 2015). Hier erklären wir, welche Daten wir auf dieser Website erheben, wofür wir sie verwenden, wie sie übermittelt werden und wie Sie Ihre Rechte ausüben können.",
  updated: "Letzte Aktualisierung: 8. Oktober 2026",
  notice: "Dies ist eine Übersetzung zu Ihrer Information. Maßgeblich ist die spanische Fassung.",
  sections: [
    {
      id: "responsable",
      title: "Verantwortliche Stelle",
      text: [
        "Verantwortlich für Ihre personenbezogenen Daten ist:",
      ],
    },
    {
      id: "datos",
      title: "Welche Daten wir erheben und wofür",
      text: [
        "Wir fragen nur die Daten ab, die wir zur Bearbeitung Ihrer Anfrage benötigen. Dies sind alle Kanäle der Website:",
      ],
      table: {
        head: ["Wo", "Daten", "Zweck"],
        rows: [
          [
            "Kontaktformular",
            "Name, Unternehmen (optional), E-Mail, Telefon (optional), Anliegen und Nachricht.",
            "Ihre Nachricht oder Anfrage beantworten, einschließlich Anfragen zu Ihren personenbezogenen Daten.",
          ],
          [
            "Angebotsformular",
            "Leistung, Abhol- und Zielort, Termine, Angaben zur Immobilie, Volumen oder Inventar, Servicestufe, Zusatzleistungen und Kommentare; Name, Handynummer und E-Mail. Bei Unternehmen: Name des Unternehmens und Position des Mitarbeiters.",
            "Kostenvoranschlag und verbindliches Angebot erstellen, Sie zur Besprechung kontaktieren und, wenn Sie annehmen, die Leistung koordinieren.",
          ],
          [
            "Chat mit Joel (virtueller Berater)",
            "Die Optionen, die Sie wählen, und was Sie im Gespräch schreiben, einschließlich Ihres Namens und gegebenenfalls Ihres Unternehmens.",
            "Sie beraten und Ihre Anfrage vorbereiten. Das Gespräch wird nicht an Transpack gesendet: Es erreicht uns nur, wenn Sie es per WhatsApp oder über das Formular senden.",
          ],
          [
            "Chat mit einem Berater (Zoho SalesIQ)",
            "Was Sie im Gespräch schreiben und die Angaben, die Sie uns machen möchten (zum Beispiel Name, E-Mail oder Telefon), sowie technische Daten des Besuchs: aufgerufene Seiten, ungefährer Standort, Browser und Gerät.",
            "Ihre Anfrage mit einem Berater unseres Teams bearbeiten, im selben Fenster wie der Chat mit Joel. Er wird nur genutzt, wenn Sie „Mit einem Berater chatten“ wählen.",
          ],
          [
            "WhatsApp und Telefon",
            "Ihre Nummer und was Sie uns mitteilen möchten.",
            "Ihre Frage oder Anfrage bearbeiten.",
          ],
          [
            "Website-Analyse (nur wenn Sie Cookies akzeptieren)",
            "Aufgerufene Seiten, ungefährer Standort (Land oder Stadt), Gerätetyp und Aktionen wie das Öffnen des Chats oder das Senden einer Anfrage, nie deren Inhalt.",
            "Die Nutzung der Website zusammengefasst messen, um sie zu verbessern.",
          ],
        ],
      },
      after: [
        "Wir verkaufen Ihre Daten nicht und nutzen sie nicht für Werbung.",
      ],
    },
    {
      id: "sensibles",
      title: "Sensible Daten und Daten von Minderjährigen",
      text: [
        "Wir fragen keine sensiblen Daten ab (etwa Gesundheitsinformationen, ethnische Herkunft, Überzeugungen oder biometrische Daten) und keine Daten von Kindern oder Jugendlichen. Bitte nehmen Sie solche Daten nicht in Ihre Nachrichten auf; falls doch, verwenden wir sie nur zur Bearbeitung Ihrer Anfrage.",
        "Diese Website richtet sich nicht an Minderjährige.",
      ],
    },
    {
      id: "transmision",
      title: "Wie Ihre Daten übermittelt und aufbewahrt werden",
      items: [
        "Kontaktformular und Angebotsformular per E-Mail: Ihre Daten werden verschlüsselt (HTTPS) an eine Funktion der Website selbst übertragen, die sie über Brevo, unseren E-Mail-Dienstleister und Auftragsverarbeiter, per E-Mail an Transpack sendet. Brevo schickt Ihnen außerdem eine Bestätigung, dass Ihre Anfrage eingegangen ist. Die Website speichert keine Kopie Ihrer Angaben.",
        "WhatsApp: Wenn Sie Ihre Anfrage per WhatsApp senden, gelten für dieses Gespräch zusätzlich die Nutzungsbedingungen und die Datenschutzrichtlinie von WhatsApp (Meta).",
        "In Ihrem Browser: Die Einstellungen des virtuellen Beraters und Ihre Cookie-Entscheidung werden nur in Ihrem Browser (lokaler Speicher) gespeichert und nie an Transpack gesendet. Sie können sie jederzeit löschen, indem Sie die Daten dieser Website in Ihrem Browser entfernen.",
        "Chat mit einem Berater: Wenn Sie ihn im Chat mit Joel wählen, werden Ihre Nachrichten von unserer Website an Zoho SalesIQ gesendet, das Chat-Werkzeug unseres CRM, das als Auftragsverarbeiter handelt. Das Gespräch wird auf den Servern von Zoho, die sich außerhalb Kolumbiens befinden können, und in unserem CRM gespeichert. Solange Sie diesen Chat nicht wählen, wird nichts an Zoho gesendet.",
        "Aufbewahrung: Wir bewahren eingegangene Anfragen so lange auf, wie es für ihre Bearbeitung und die Erbringung der Leistung nötig ist, und danach so lange, wie es buchhalterische, steuerliche und gesetzliche Vorschriften verlangen.",
      ],
    },
    {
      id: "compartir",
      title: "An wen wir Ihre Daten weitergeben",
      items: [
        "Bei internationalen Umzügen an unsere Agenten und Partner im Herkunfts- oder Zielland sowie an die Zollbehörden, nur soweit für den Umzug erforderlich. Dies kann eine Übermittlung Ihrer Daten außerhalb Kolumbiens bedeuten.",
        "An Dienstleister, die uns beim Betrieb der Website und bei der Kommunikation mit Ihnen als Auftragsverarbeiter unterstützen: Vercel (Hosting der Website), Brevo (E-Mail-Versand), Zoho (Chat mit einem Berater und CRM) und Google (Analyse, nur wenn Sie zustimmen). Einige befinden sich außerhalb Kolumbiens, daher können Ihre Daten in andere Länder übermittelt werden.",
        "An Behörden, wenn das Gesetz es verlangt.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies und Website-Analyse",
      text: [
        "Wir verwenden Google Analytics nur, wenn Sie Analyse-Cookies im Hinweis beim Aufruf der Website akzeptieren. Google handelt als Auftragsverarbeiter. Wir verwenden keine Werbe-Cookies, und wenn Sie ablehnen, funktioniert die Website genauso. Wenn Sie mit einem Berater chatten, wird Zoho SalesIQ geladen und setzt die Cookies, die für das Gespräch nötig sind.",
      ],
    },
    {
      id: "derechos",
      title: "Ihre Rechte",
      text: [
        "Als betroffene Person können Sie:",
      ],
      items: [
        "Ihre Daten einsehen, aktualisieren und berichtigen.",
        "Einen Nachweis über die von Ihnen erteilte Einwilligung verlangen.",
        "Erfahren, wie wir Ihre Daten verwendet haben.",
        "Ihre Einwilligung widerrufen oder die Löschung Ihrer Daten verlangen, sofern keine gesetzliche oder vertragliche Pflicht zur Aufbewahrung besteht.",
        "Kostenlos auf Ihre Daten zugreifen.",
        "Beschwerde bei der kolumbianischen Aufsichtsbehörde für Industrie und Handel (SIC) einlegen, nachdem Sie Ihr Anliegen an Transpack gerichtet haben.",
      ],
    },
    {
      id: "como-ejercerlos",
      title: "So üben Sie Ihre Rechte aus",
      text: [
        `Nutzen Sie das Kontaktformular mit dem Anliegen „Personenbezogene Daten“ oder schreiben Sie an ${CONTACT.email}. Geben Sie Ihren Namen, Ihr Anliegen und eine Kontaktmöglichkeit an.`,
      ],
      items: [
        "Anfragen: Wir antworten innerhalb von höchstens 10 Werktagen, verlängerbar um bis zu 5 weitere Werktage unter Angabe des Grundes.",
        "Beschwerden (Berichtigung, Aktualisierung, Löschung oder Widerruf): Wir antworten innerhalb von höchstens 15 Werktagen, verlängerbar um bis zu 8 weitere Werktage unter Angabe des Grundes.",
      ],
      after: [
        "Wenn Sie mit unserer Antwort nicht zufrieden sind, können Sie Beschwerde bei der Aufsichtsbehörde für Industrie und Handel (SIC) einlegen.",
      ],
    },
    {
      id: "autorizacion",
      title: "Einwilligung",
      text: [
        "Indem Sie das Einwilligungsfeld im Kontaktformular oder im Angebotsformular ankreuzen, erlauben Sie uns, Ihre Daten für die Zwecke dieser Richtlinie zu verarbeiten. Wenn Sie uns im Chat mit einem Berater oder per WhatsApp schreiben oder anrufen, erteilen Sie uns Ihre Einwilligung durch diese Handlung, damit wir Ihre Anfrage bearbeiten können. Sie können sie jederzeit über die unter „So üben Sie Ihre Rechte aus“ genannten Wege widerrufen.",
      ],
    },
    {
      id: "seguridad",
      title: "Sicherheit",
      text: [
        "Wir treffen angemessene technische, personelle und organisatorische Maßnahmen, um Ihre Daten vor Verlust sowie unbefugter Einsicht, Nutzung oder unbefugtem Zugriff zu schützen.",
      ],
    },
    {
      id: "vigencia",
      title: "Änderungen und Gültigkeit",
      text: [
        "Diese Richtlinie gilt ab ihrer Veröffentlichung auf dieser Website. Wesentliche Änderungen kündigen wir hier an, bevor sie wirksam werden, und aktualisieren das Datum dieser Seite.",
      ],
    },
  ] as PrivacySection[],
};
