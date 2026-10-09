// Version française du contenu du site. Même structure que site.ts : quand un
// texte change en espagnol, il faut aussi le mettre à jour ici. Les codes
// internes (slug, quote, id) restent en espagnol : ils pilotent les URL et le
// formulaire de devis.
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

export const waLink = (
  text = "Bonjour Transpack, je souhaite des informations sur un déménagement",
) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const VIDEOS = [
  {
    id: "i4G8QG8lan8",
    tag: "Déménagement international",
    title: "Des États-Unis vers la Colombie",
  },
  { id: "uFEVARznuhM", tag: "Retour en Colombie", title: "Vous vous installez en Colombie ?" },
  {
    id: "bUOWdNVa2Uc",
    tag: "Préparation",
    title: "Un déménagement international réussi commence bien avant l'expédition",
  },
];

export const SLOGAN = "Nous promettons avec le cœur, nous tenons parole avec excellence.";

export const STATS = [
  { value: 58, suffix: "+", label: "ans d'expérience" },
  { value: 176, suffix: "+", label: "pays de destination" },
  { value: 60, suffix: "K+", label: "tonnes de biens personnels exportées" },
  { value: 2000, suffix: "+", label: "agents internationaux" },
];

export const EMBASSIES = [
  "États-Unis",
  "Espagne",
  "Canada",
  "Mexique",
  "Inde",
  "France",
  "Allemagne",
  "Égypte",
  "Émirats arabes unis",
  "Italie",
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Déménagement local",
    short:
      "Déménagements dans Bogota et son agglomération, avec des équipes formées, la protection du mobilier et des véhicules adaptés au volume.",
    quote: "local",
    cta: "Demander un devis",
    image: imgEquipoSala,
    kicker: "Déménager à Bogota",
    headline: "Votre déménagement en ville, sans stress et sans surprise",
    intro:
      "Nous préparons chaque déménagement local en fonction du logement de départ et d'arrivée : étage, ascenseur, escaliers, accès du camion et horaires autorisés par la copropriété. Nous arrivons ainsi avec l'équipe et le temps qu'il faut.",
    includes: [
      "Visite technique ou appel vidéo lorsque le volume le justifie",
      "Équipe de manutention formée au transport de meubles",
      "Protection du mobilier, de l'électroménager et des objets fragiles",
      "Démontage et remontage des meubles",
      "Véhicule adapté au volume de votre inventaire",
      "Garde-meubles temporaire en option",
    ],
    steps: [
      {
        title: "Décrivez votre déménagement",
        text: "Départ, arrivée, date, type de logement et ce que vous déménagez.",
      },
      {
        title: "Recevez votre estimation",
        text: "Nous vous envoyons une estimation puis, si elle vous convient, le devis définitif.",
      },
      {
        title: "Nous emballons et protégeons",
        text: "Selon le niveau de service choisi : basique, protection ou clés en main.",
      },
      {
        title: "Nous livrons",
        text: "Nous déchargeons et installons tout dans votre nouveau logement.",
      },
    ],
    note: "Les déménagements locaux se planifient généralement 1 à 2 semaines à l'avance, mais nous traitons aussi les demandes urgentes selon nos disponibilités.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "Déménagement national",
    short:
      "Déménagements entre villes colombiennes avec inventaire détaillé, emballage professionnel, suivi du véhicule et livraison de porte à porte.",
    quote: "nacional",
    cta: "Demander un devis",
    image: imgCargue,
    kicker: "Entre villes colombiennes",
    headline: "D'une ville à l'autre, vos biens protégés sur tout le trajet",
    intro:
      "Dans un déménagement national, l'inventaire est la base de tout : il nous permet de calculer le volume, le véhicule et les moyens nécessaires. Nous veillons à la sécurité, à la protection et au respect des délais sur chaque itinéraire.",
    includes: [
      "Inventaire détaillé et calcul du volume",
      "Emballage professionnel et protection spécialisée",
      "Suivi du véhicule pendant tout le trajet",
      "Chargement et déchargement planifiés au départ et à l'arrivée",
      "Service de porte à porte dans tout le pays",
      "Garde-meubles à Bogota si votre nouveau logement n'est pas encore prêt",
    ],
    steps: [
      {
        title: "Inventaire",
        text: "Nous listons tout ce qui part pour estimer le volume et le coût.",
      },
      {
        title: "Itinéraire et organisation",
        text: "Nous validons l'itinéraire, le véhicule et les conditions d'accès.",
      },
      {
        title: "Emballage et chargement",
        text: "Chaque objet est protégé selon sa valeur et sa fragilité.",
      },
      {
        title: "Livraison",
        text: "Nous déchargeons et installons tout dans votre nouvelle ville.",
      },
    ],
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "Déménagement international",
    short:
      "Par voie maritime ou aérienne, depuis et vers la Colombie. Nous vous conseillons sur les formalités, les délais et la douane avant de chiffrer.",
    quote: "internacional",
    cta: "Parler à un conseiller",
    image: imgGlobal,
    kicker: "Depuis et vers la Colombie",
    headline: "Votre nouvelle vie à l'étranger commence par un plan clair",
    intro:
      "Un déménagement international ne se gère pas comme un déménagement local. Vous comprenez d'abord le processus, les formalités, les délais et les coûts ; ensuite nous chiffrons. Un conseiller spécialisé vous accompagne dès le premier contact, avec l'appui de plus de 2 000 agents dans 176 pays.",
    includes: [
      "Conseil initial sur les formalités au départ et à l'arrivée",
      "Fret maritime (gros volumes) ou aérien (envois urgents)",
      "Formalités douanières et documents pour les biens personnels",
      "Caisses en bois et emballage export",
      "Coordination avec des agents certifiés LACMA, IAM et PAIMA",
      "Livraison de porte à porte dans le pays de destination",
    ],
    steps: [
      {
        title: "Analyse de votre projet",
        text: "Départ, destination, date, motif du déménagement et inventaire préliminaire.",
      },
      {
        title: "Conseil spécialisé",
        text: "Nous passons en revue avec vous les formalités, les délais et les frais annexes.",
      },
      {
        title: "Emballage export",
        text: "Inventaire, classement et protection pour le transport international.",
      },
      {
        title: "Transit et livraison",
        text: "Nous assurons le suivi jusqu'à ce que votre nouveau logement soit habitable.",
      },
    ],
    note: "Nous vous recommandons de lancer les démarches 1 à 2 mois avant la date d'emballage.",
    featured: true,
    tags: [
      { icon: "water", label: "Maritime" },
      { icon: "airplane", label: "Aérien" },
    ],
  },
  {
    slug: "bodegaje",
    icon: "boxes",
    title: "Garde-meubles",
    short:
      "Stockage sécurisé à Bogota, à la journée, au mois ou le temps de finaliser votre déménagement. Entrepôts propres et suivi d'inventaire.",
    quote: "bodegaje",
    cta: "Demander un devis",
    image: imgContenedor,
    kicker: "Stockage à Bogota",
    headline: "Un lieu sûr pour vos biens, aussi longtemps que nécessaire",
    intro:
      "Nos entrepôts à Bogota vous permettent de stocker mobilier, équipements de bureau ou archives pendant votre installation, vos travaux ou en attendant votre départ. Le service peut être réservé seul ou avec votre déménagement.",
    includes: [
      "Entrepôts propres à Bogota",
      "Suivi d'inventaire des biens stockés",
      "Enlèvement à votre adresse et livraison à la demande",
      "Emballage adapté au stockage de longue durée",
      "Formules à la journée, au mois ou longue durée",
      "Idéal pour les entreprises, les expatriés et les familles en transition",
    ],
    steps: [
      { title: "Dites-nous quoi stocker", text: "Type de biens, volume et durée estimée." },
      { title: "Nous enlevons", text: "Nous emballons et inventorions sur place." },
      { title: "Nous stockons", text: "Vos biens restent sous contrôle dans nos entrepôts." },
      { title: "Nous livrons", text: "Quand vous le souhaitez, à l'adresse de votre choix." },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Emballage spécialisé",
    short:
      "Caisses en bois sur mesure, calage haute densité et protection pour œuvres d'art, verrerie et mobilier de valeur.",
    quote: "local",
    cta: "Demander un devis",
    image: imgGuacales,
    kicker: "Ingénierie d'emballage",
    headline: "Les pièces de valeur ne s'emballent pas comme le reste",
    intro:
      "Œuvres d'art, collections, verrerie et mobilier design exigent une véritable ingénierie d'emballage : caisses en bois sur mesure pour les toiles, calage anti-chocs haute densité et protection contre l'humidité pour les longs transits.",
    includes: [
      "Caisses en bois fabriquées sur mesure",
      "Calage anti-chocs haute densité",
      "Protection contre l'humidité pour le transport maritime",
      "Manutention de pianos et d'objets volumineux",
      "Inventaire et étiquetage pièce par pièce",
      "Équipes expérimentées dans les objets fragiles",
    ],
    steps: [
      {
        title: "Évaluation",
        text: "Nous identifions les pièces spéciales, leurs dimensions et leur fragilité.",
      },
      {
        title: "Conception de l'emballage",
        text: "Nous définissons les matériaux et les caisses pour chaque pièce.",
      },
      { title: "Emballage", text: "Nous emballons, étiquetons et inventorions." },
      { title: "Transport", text: "Une manutention experte jusqu'à la destination finale." },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Douane et documentation",
    short:
      "Accompagnement pour l'exportation et l'importation de biens personnels, inventaires déclarés et formalités au départ et à l'arrivée.",
    quote: "internacional",
    cta: "Demander un devis",
    image: imgBarco,
    kicker: "Formalités internationales",
    headline: "La douane est un labyrinthe juridique. Nous en connaissons le chemin",
    intro:
      "Un inventaire mal déclaré ou une autorisation manquante peut coûter des semaines de retard et des pénalités. Nous vous accompagnons dans les documents d'exportation et d'importation de vos biens et effets personnels, selon la réglementation de chaque pays.",
    includes: [
      "Vérification des exigences du pays de départ et d'arrivée",
      "Inventaire déclaré pour la douane",
      "Coordination des frais portuaires et aéroportuaires",
      "Accompagnement lors des inspections et contrôles",
      "Conseils pour les Colombiens qui rentrent au pays",
      "Communication proactive tout au long du processus",
    ],
    steps: [
      { title: "Diagnostic", text: "Nous étudions votre situation et les documents requis." },
      { title: "Préparation", text: "Inventaire et documents sans incohérences." },
      {
        title: "Démarches",
        text: "Nous nous coordonnons avec les autorités et les agents à destination.",
      },
      { title: "Dédouanement", text: "Nous assurons le suivi jusqu'à la livraison de vos biens." },
    ],
  },
];

// ─── Solutions par profil ─────────────────────────────────────────────────────

export const SEGMENTS = [
  {
    id: "residencial",
    icon: "house-door",
    tab: "Particuliers",
    kicker: "Transpack Particuliers",
    title: "Votre maison, dans le même état à destination",
    text: "Déménagements de particuliers locaux, nationaux et internationaux. Choisissez ce que vous nous confiez : du simple transport à un service clés en main où nous nous occupons de tout.",
    points: [
      "Emballage, démontage et remontage des meubles",
      "Protection des objets fragiles et de valeur",
      "Garde-meubles temporaire le temps de vous installer",
    ],
    cta: "Demander un devis pour mon déménagement",
    quote: "local" as QuoteService,
    image: imgEquipoSala,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "Un seul prestataire pour transférer vos bureaux et vos talents",
    text: "Transferts de bureaux et mobilité nationale et internationale de collaborateurs. Nous travaillons avec les Achats et les Ressources humaines dans le cadre d'accords ou de contrats, avec un chargé de compte dédié.",
    points: [
      "Chargé de compte et opérations récurrentes",
      "Interventions de nuit ou le week-end selon le planning",
      "Reporting, traçabilité et conditions entreprise",
    ],
    cta: "Demander une proposition entreprise",
    quote: "empresarial" as QuoteService,
    image: imgContenedor,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Discrétion, protocole et précision pour les missions diplomatiques",
    text: "Les ambassades des États-Unis, d'Espagne, du Canada, du Mexique, d'Inde, de France, d'Allemagne, d'Égypte, des Émirats arabes unis et d'Italie, ainsi que des institutions comme la CAF, nous ont confié le déménagement de leur personnel.",
    points: [
      "Service protocolaire et confidentialité absolue",
      "Référencement en tant que fournisseur institutionnel",
      "Conformité réglementaire au départ et à l'arrivée",
    ],
    cta: "Contacter notre équipe institutionnelle",
    quote: "internacional" as QuoteService,
    image: imgGuacales,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Vivre à l'étranger",
    kicker: "Partir à l'étranger ou revenir en Colombie",
    title: "Nous ne transportons pas seulement vos affaires : nous facilitons votre transition",
    text: "Que vous partiez vivre aux États-Unis, au Canada, en Europe ou ailleurs, ou que vous rentriez en Colombie, nous vous accompagnons dès la préparation pour que vous arriviez avec tout en ordre.",
    points: [
      "Conseils sur les formalités, les délais et les coûts avant l'emballage",
      "Envoi maritime ou aérien selon votre situation",
      "Un réseau d'agents qui vous accueille dans votre pays de destination",
    ],
    cta: "Préparer mon déménagement international",
    quote: "internacional" as QuoteService,
    image: imgNuevaEtapa,
  },
];

// ─── Niveaux de service ───────────────────────────────────────────────────────

export const LEVELS = [
  {
    n: "01",
    title: "Transport simple",
    text: "Tout est déjà emballé. Nous fournissons l'équipe et le véhicule.",
    points: ["Équipe de chargement", "Transport", "Déchargement à destination"],
    value: "Niveau 1 · Transport simple",
  },
  {
    n: "02",
    title: "Protection et emballage",
    text: "Nous emballons vos cartons et protégeons votre mobilier avec une manutention professionnelle.",
    points: [
      "Tout le niveau 1",
      "Mise en cartons",
      "Protection du mobilier",
      "Manutention professionnelle",
    ],
    value: "Niveau 2 · Protection et emballage",
    featured: true,
  },
  {
    n: "03",
    title: "Service clés en main",
    text: "Nous prenons en charge tout le processus, du début à la fin : vous n'avez plus qu'à arriver.",
    points: [
      "Tout le niveau 2",
      "Démontage et remontage",
      "Installation à destination",
      "Coordination complète",
    ],
    value: "Niveau 3 · Service clés en main",
  },
];

export const PROCESS = [
  {
    title: "Diagnostic",
    text: "Nous analysons départ, destination, délais, inventaire et le niveau de service souhaité.",
  },
  {
    title: "Conception de la solution",
    text: "Nous combinons transport, emballage, garde-meubles et formalités. Si nécessaire, nous réalisons une visite technique.",
  },
  {
    title: "Emballage et inventaire",
    text: "Nous classons et protégeons chaque objet avec des matériaux adaptés à sa valeur et à sa fragilité.",
  },
  {
    title: "Opération et suivi",
    text: "Nous coordonnons l'itinéraire national ou international et vous tenons informé.",
  },
  {
    title: "Livraison de porte à porte",
    text: "Notre mission s'achève quand votre nouveau logement est prêt à vivre.",
  },
];

export const FAQS = [
  {
    q: "Combien de temps à l'avance dois-je réserver mon déménagement ?",
    a: "Les déménagements locaux peuvent se planifier une à deux semaines à l'avance, et nous traitons aussi les demandes urgentes selon nos disponibilités. Pour un déménagement international, nous recommandons de commencer les démarches un à deux mois avant l'emballage.",
  },
  {
    q: "Combien de temps dure un déménagement maritime international ?",
    a: "Cela dépend du départ, de la destination, de la fréquence des lignes maritimes, des formalités douanières et de la saison. En moyenne, il faut compter de plusieurs semaines à quelques mois. Une bonne préparation et un dossier complet réduisent les retards.",
  },
  {
    q: "Vaut-il mieux déménager par mer ou par avion ?",
    a: "Le maritime est idéal pour les gros volumes, le mobilier complet et les biens de toute une famille. L'aérien est plus rapide et recommandé pour les petits envois ou les urgences. Nous vous conseillons selon votre budget, vos délais et le type de biens.",
  },
  {
    q: "Une visite technique est-elle nécessaire pour obtenir un devis ?",
    a: "Pas toujours. Si les informations sur votre inventaire et votre logement sont suffisantes, nous pouvons vous donner une estimation. En cas de complexité ou de risque d'erreur (accès difficile, objets particuliers, gros volumes), nous recommandons une visite ou un appel vidéo.",
  },
  {
    q: "Pourquoi l'inventaire est-il si important ?",
    a: "L'inventaire nous permet d'estimer le volume, les moyens et le temps nécessaires. Un oubli peut modifier le coût final : plus il est précis, plus votre devis sera juste.",
  },
  {
    q: "Que se passe-t-il si le camion ne peut pas stationner près du logement ?",
    a: "C'est une information essentielle : la distance entre le véhicule et la porte change l'organisation. Indiquez-nous si le camion doit rester hors de la résidence ou loin de l'immeuble afin de prévoir l'équipe et le temps adaptés.",
  },
];

export const GALLERY: { src: string; caption: string; tall?: boolean }[] = [
  { src: imgEmbalajeSala, caption: "Emballage à domicile" },
  { src: imgContenedor, caption: "Chargement de conteneur", tall: true },
  { src: imgArteHogar, caption: "Protection d'œuvres d'art à domicile" },
  { src: imgCargueCajas, caption: "Chargement des cartons Transpack" },
  { src: imgGuacales, caption: "Caisses en bois sur mesure" },
  { src: imgEmbalajeCuadro, caption: "Emballage d'un tableau", tall: true },
  { src: imgBodegaGuacales, caption: "Entrepôt avec caisses de stockage" },
  { src: imgEquipoSala, caption: "Protection du mobilier" },
  { src: imgBarco, caption: "Lignes maritimes", tall: true },
  { src: imgEmbalajeHogar, caption: "Emballage du mobilier à domicile" },
  { src: imgGuacalExportacion, caption: "Caisse d'exportation" },
  { src: imgDespachoBodega, caption: "Expédition depuis l'entrepôt" },
  { src: imgBodegaMuebles, caption: "Meubles protégés en entrepôt" },
];

// Política de tratamiento de datos (traducción; la versión en español es la oficial).
// Mismas secciones y orden que PRIVACY en src/data/site.ts.
export const PRIVACY = {
  title: "Politique de traitement des données personnelles",
  intro: "Chez Transpack S.A.S., nous traitons vos données personnelles conformément à la loi colombienne 1581 de 2012 et au décret 1377 de 2013 (compilé dans le décret 1074 de 2015). Nous vous expliquons ici quelles données nous collectons sur ce site, à quoi elles servent, comment elles sont transmises et comment exercer vos droits.",
  updated: "Dernière mise à jour : 8 octobre 2026",
  notice: "Ceci est une traduction fournie pour votre commodité. La version espagnole fait foi.",
  sections: [
    {
      id: "responsable",
      title: "Responsable du traitement",
      text: [
        "L'entreprise responsable de vos données personnelles est :",
      ],
    },
    {
      id: "datos",
      title: "Données collectées et finalités",
      text: [
        "Nous ne demandons que les données nécessaires pour traiter votre demande. Voici tous les canaux du site :",
      ],
      table: {
        head: ["Où", "Données", "Finalité"],
        rows: [
          [
            "Formulaire de contact",
            "Nom, entreprise (facultatif), e-mail, téléphone (facultatif), motif et message.",
            "Répondre à votre message ou à votre demande, y compris les demandes concernant vos données personnelles.",
          ],
          [
            "Formulaire de devis",
            "Service, départ et arrivée, dates, détails du logement, volume ou inventaire, niveau de service, services complémentaires et commentaires ; nom, portable et e-mail. Pour une entreprise : son nom et le poste du collaborateur.",
            "Préparer l'estimation et le devis formel, vous contacter pour le revoir et, si vous l'acceptez, coordonner le service.",
          ],
          [
            "Chat de Joel (conseiller virtuel)",
            "Les options que vous choisissez et ce que vous écrivez dans la conversation, y compris votre nom, votre numéro de portable ou WhatsApp et, le cas échéant, le nom de votre entreprise.",
            "Vous orienter et préparer votre demande. Si vous choisissez d'envoyer votre devis à un conseiller, le récapitulatif (avec votre nom et votre portable) est envoyé à notre équipe commerciale via Zoho SalesIQ pour vous contacter et assurer le suivi. Le reste de la conversation reste dans votre navigateur.",
          ],
          [
            "Chat avec un conseiller (Zoho SalesIQ)",
            "Ce que vous écrivez dans la conversation et les informations que vous choisissez de nous donner (par exemple nom, e-mail ou téléphone), ainsi que des données techniques de la visite : pages consultées, localisation approximative, navigateur et appareil.",
            "Traiter votre demande avec un conseiller de notre équipe, dans la même fenêtre que le chat de Joel. Il n'est utilisé que si vous choisissez « Discuter avec un conseiller ».",
          ],
          [
            "WhatsApp et téléphone",
            "Votre numéro et ce que vous choisissez de nous dire.",
            "Répondre à votre question ou à votre demande.",
          ],
          [
            "Mesure d'audience (uniquement si vous acceptez les cookies)",
            "Pages consultées, localisation approximative (pays ou ville), type d'appareil et actions comme ouvrir le chat ou envoyer une demande, jamais leur contenu.",
            "Mesurer de façon agrégée l'utilisation du site pour l'améliorer.",
          ],
        ],
      },
      after: [
        "Nous ne vendons pas vos données et ne les utilisons pas à des fins publicitaires.",
      ],
    },
    {
      id: "sensibles",
      title: "Données sensibles et données de mineurs",
      text: [
        "Nous ne demandons pas de données sensibles (informations de santé, origine ethnique, convictions ou données biométriques, par exemple) ni de données d'enfants ou d'adolescents. Merci de ne pas les inclure dans vos messages ; si vous le faites, nous les utiliserons uniquement pour traiter votre demande.",
        "Ce site ne s'adresse pas aux mineurs.",
      ],
    },
    {
      id: "transmision",
      title: "Transmission et conservation de vos données",
      items: [
        "Formulaire de contact et devis par e-mail : vos données sont transmises de façon chiffrée (HTTPS) à une fonction du site lui-même, qui les envoie par e-mail à Transpack via Brevo, notre prestataire d'e-mails, agissant comme sous-traitant. Brevo vous envoie aussi une confirmation de réception de votre demande. Le site ne conserve aucune copie de ce que vous envoyez.",
        "WhatsApp : si vous choisissez d'envoyer votre demande par WhatsApp, cette conversation est également régie par les conditions et la politique de confidentialité de WhatsApp (Meta).",
        "Dans votre navigateur : les préférences du conseiller virtuel et votre choix concernant les cookies sont enregistrés uniquement dans votre navigateur (stockage local) et ne sont jamais envoyés à Transpack. Vous pouvez les supprimer à tout moment en effaçant les données de ce site dans votre navigateur.",
        "Chat avec un conseiller : si vous le choisissez dans le chat de Joel, vos messages sont envoyés depuis notre site à Zoho SalesIQ, l'outil de chat de notre CRM, qui agit comme sous-traitant. La conversation est conservée sur les serveurs de Zoho, qui peuvent se trouver hors de Colombie, et dans notre CRM. Tant que vous ne choisissez pas ce chat, rien n'est envoyé à Zoho.",
        "Conservation : nous conservons les demandes reçues le temps nécessaire pour les traiter et fournir le service, puis la durée exigée par les règles comptables, fiscales et légales.",
      ],
    },
    {
      id: "compartir",
      title: "Avec qui nous partageons vos données",
      items: [
        "Pour les déménagements internationaux, avec nos agents et partenaires dans le pays de départ ou d'arrivée et avec les autorités douanières, uniquement dans la mesure nécessaire au déménagement. Cela peut impliquer un transfert de vos données hors de Colombie.",
        "Avec les prestataires qui nous aident à faire fonctionner le site et à communiquer avec vous, en tant que sous-traitants : Vercel (hébergement du site), Brevo (envoi d'e-mails), Zoho (chat avec un conseiller et CRM) et Google (mesure d'audience, uniquement si vous l'acceptez). Certains sont situés hors de Colombie : vos données peuvent donc être transmises à d'autres pays.",
        "Avec les autorités, lorsque la loi l'exige.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies et mesure d'audience",
      text: [
        "Nous utilisons Google Analytics uniquement si vous acceptez les cookies d'analyse dans l'avis affiché à votre arrivée. Google agit comme sous-traitant. Nous n'utilisons pas de cookies publicitaires et, si vous les refusez, le site fonctionne de la même façon. Si vous choisissez de discuter avec un conseiller, Zoho SalesIQ se charge et dépose les cookies nécessaires au fonctionnement de la conversation.",
      ],
    },
    {
      id: "derechos",
      title: "Vos droits",
      text: [
        "En tant que titulaire des données, vous pouvez :",
      ],
      items: [
        "Connaître, mettre à jour et rectifier vos données.",
        "Demander la preuve de l'autorisation que vous nous avez donnée.",
        "Savoir quel usage nous en avons fait.",
        "Révoquer votre autorisation ou demander la suppression de vos données, en l'absence d'obligation légale ou contractuelle de les conserver.",
        "Accéder gratuitement à vos données.",
        "Déposer une plainte auprès de la Surintendance de l'industrie et du commerce de Colombie (SIC), après avoir adressé votre demande à Transpack.",
      ],
    },
    {
      id: "como-ejercerlos",
      title: "Comment exercer vos droits",
      text: [
        `Utilisez le formulaire de contact avec le motif « Données personnelles » ou écrivez à ${CONTACT.email}. Indiquez votre nom, votre demande et un moyen de vous répondre.`,
      ],
      items: [
        "Demandes d'information : nous répondons dans un délai maximal de 10 jours ouvrables, prolongeable de 5 jours ouvrables au plus, en vous en indiquant le motif.",
        "Réclamations (rectification, mise à jour, suppression ou révocation) : nous répondons dans un délai maximal de 15 jours ouvrables, prolongeable de 8 jours ouvrables au plus, en vous en indiquant le motif.",
      ],
      after: [
        "Si notre réponse ne vous satisfait pas, vous pouvez déposer une plainte auprès de la Surintendance de l'industrie et du commerce (SIC).",
      ],
    },
    {
      id: "autorizacion",
      title: "Autorisation",
      text: [
        "En cochant la case d'autorisation du formulaire de contact ou du formulaire de devis, vous nous autorisez à traiter vos données pour les finalités de cette politique. Si vous nous écrivez sur le chat avec un conseiller ou par WhatsApp, ou nous appelez, vous nous donnez votre autorisation par ce geste, afin que nous traitions votre demande. Vous pouvez la révoquer à tout moment par les moyens indiqués dans « Comment exercer vos droits ».",
      ],
    },
    {
      id: "seguridad",
      title: "Sécurité",
      text: [
        "Nous appliquons des mesures techniques, humaines et administratives raisonnables pour protéger vos données contre la perte, la consultation, l'utilisation ou l'accès non autorisés.",
      ],
    },
    {
      id: "vigencia",
      title: "Modifications et entrée en vigueur",
      text: [
        "Cette politique s'applique dès sa publication sur ce site. En cas de modification substantielle, nous l'annoncerons ici avant son application et mettrons à jour la date de cette page.",
      ],
    },
  ] as PrivacySection[],
};
