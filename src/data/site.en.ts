// English version of the site content. Same structure as site.ts: when a text
// changes in Spanish, update it here too. Internal codes (slug, quote, id)
// stay in Spanish because they drive URLs and the quote form.
// Fotos de los servicios entregadas por el cliente (nov. 2026); originales en RecursosTranspack/Imagenes
import imgNacionalCarretera from "@/assets/images/nacional-carretera.jpg";
import imgInternacionalPuerto from "@/assets/images/internacional-puerto.jpg";
import imgAduanaCajas from "@/assets/images/aduana-cajas.jpg";
import imgBodegajeBodega from "@/assets/images/bodegaje-bodega.jpg";
import imgLocalesResidencial from "@/assets/images/locales-residencial.jpg";
import imgEmbalajeSala from "@/assets/images/embalaje-sala.jpg";
import imgGuacales from "@/assets/images/guacales.jpeg";
import imgTrasladoOficinas from "@/assets/images/traslado-de-oficinas.jpg";
import imgServicioDiplomatico from "@/assets/images/servicio-diplomatico.jpg";
import imgEmbalajeHogar from "@/assets/images/galeria/embalaje-hogar.jpg";
import imgDespachoBodega from "@/assets/images/galeria/despacho-bodega.jpg";
import imgBodegaGuacales from "@/assets/images/galeria/bodega-guacales.jpg";
import imgGuacalExportacion from "@/assets/images/galeria/guacal-exportacion.jpg";
import imgEmbalajeCuadro from "@/assets/images/galeria/embalaje-cuadro.jpg";
import imgEmbalajeCarton from "@/assets/images/galeria/embalaje-carton.jpg";
import imgEmbalajeBiblioteca from "@/assets/images/galeria/embalaje-biblioteca.jpg";
import imgMontacargasBodega from "@/assets/images/galeria/montacargas-bodega.jpg";
import imgMenajeListo from "@/assets/images/galeria/menaje-listo.jpg";
import imgSalaProtegida from "@/assets/images/galeria/sala-protegida.jpg";
import imgBodegaAlmacenamiento from "@/assets/images/galeria/bodega-almacenamiento.jpg";
import imgContenedorCalle from "@/assets/images/galeria/contenedor-calle.jpg";
import imgEmbalajeObra from "@/assets/images/galeria/embalaje-obra.jpg";
import type { Service } from "@/data/site";

export { CONTACT, YOUTUBE_CHANNEL, ABOUT_IMAGES } from "@/data/site";
export type { QuoteService, Service } from "@/data/site";
import { CONTACT, type PrivacySection } from "@/data/site";

export const waLink = (text = "Hello Transpack, I would like information about a move") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const VIDEOS = [
  { id: "i4G8QG8lan8", tag: "International move", title: "Moving to Colombia from the USA" },
  { id: "uFEVARznuhM", tag: "Returning to Colombia", title: "Moving to Colombia?" },
  {
    id: "bUOWdNVa2Uc",
    tag: "Planning",
    title: "Exceptional international moves begin long before the shipment leaves",
  },
];

export const SLOGAN = "We promise with our heart, we deliver with excellence.";

export const STATS = [
  { value: 58, suffix: "+", label: "years of experience" },
  {
    value: 176,
    suffix: "+",
    label: "destination countries, import and export",
    short: "destination countries",
  },
  { value: 60, suffix: "K+", label: "tons of household goods exported" },
  {
    value: 2000,
    suffix: "+",
    label: "agents and strategic partners",
    short: "agents and partners",
  },
];

export const EMBASSIES = [
  "United States",
  "Spain",
  "Canada",
  "Mexico",
  "India",
  "France",
  "Germany",
  "Egypt",
  "United Arab Emirates",
  "Italy",
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Local moving",
    short:
      "Moves in Bogotá and its surroundings, carried out by expert, trained crews for the professional protection of your furniture, with vehicles sized to your load.",
    quote: "local",
    cta: "Get a quote",
    image: imgLocalesResidencial,
    heroMap: "bogota",
    heroLayout: "split",
    kicker: "Moving in Bogotá",
    headline: "Your move across town, stress-free",
    intro:
      "Before we start, we carry out a prior assessment (in person, by video or by phone) in which every piece of furniture, every item and every important detail is recorded to plan your move. That way we know exactly what you are moving and guarantee a stress-free, worry-free move.",
    includes: [
      "On-site survey, video call or phone estimate to determine the volume of your move",
      "Expert crews trained in handling and moving furniture, household goods and high-value items",
      "Proper protection for furniture, appliances and fragile items",
      "Safe vehicles suited to your move",
      "Optional temporary storage",
      "Insurance coverage according to your needs",
    ],
    steps: [
      { title: "Contact us", text: "To receive your estimate." },
      { title: "Quote", text: "Get a service quote tailored to your needs." },
      {
        title: "Coordination",
        text: "We coordinate your move with our logistics team (timing, protection, transport).",
      },
      {
        title: "Delivery at destination",
        text: "We unload and place your household goods in your new space.",
      },
    ],
    commitment:
      "a stress-free move. Plan your new space; we will be with you throughout the process.",
    note: "Local moves are usually booked 1 to 2 weeks in advance, but we also handle urgent requests subject to availability.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "National moving",
    short:
      "Moves to Colombia's main cities with a detailed inventory, professional packing, vehicle monitoring and door-to-door delivery.",
    quote: "nacional",
    cta: "Get a quote",
    image: imgNacionalCarretera,
    heroMap: "colombia",
    heroLayout: "split",
    headline: "Your home, door to door",
    intro:
      "In a national move, the inventory and careful planning are the foundation of everything: they let us calculate the volume, choose the type of vehicle and the packing materials needed for proper protection, and schedule a safe trip on an optimized route to meet the timeline you need.",
    includes: [
      "On-site survey, video call or phone estimate to determine the volume of your move",
      "Expert crews trained in handling and moving furniture, household goods and high-value items",
      "Proper protection for furniture, appliances and fragile items",
      "Safe vehicles suited to your move",
      "Optional temporary storage in Bogotá",
      "Insurance coverage according to your needs",
    ],
    steps: [
      { title: "Inventory", text: "We list everything that moves to estimate volume and cost." },
      {
        title: "Route and operation",
        text: "We confirm the route, the vehicle and access conditions.",
      },
      {
        title: "Packing and loading",
        text: "We protect each item according to its value and fragility.",
      },
      { title: "Delivery", text: "We unload and place everything in your new city." },
    ],
    commitment:
      "proper advice so you can plan your new destination; we will be with you throughout the process.",
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "International moving",
    short:
      "By sea or air, to and from Colombia. We advise you on requirements, timelines and customs before we quote.",
    quote: "internacional",
    cta: "Talk to an advisor",
    image: imgInternacionalPuerto,
    heroMap: "mundo",
    heroLayout: "split",
    kicker: "To and from Colombia",
    headline: "Crossing borders without worry",
    intro:
      "An international move is not handled like a local one. First you understand the process, the requirements, the timelines and the costs. A specialized advisor guides you from the first contact, backed by more than 2,000 agents and strategic partners in 176 countries.",
    includes: [
      "On-site survey by one of our packing coordinators",
      "Initial advice on origin and destination requirements and regulations",
      "A budget tailored to the volume of your move (air or sea)",
      "Guidance on the documentation and customs requirements for moving your household goods",
      "Export-grade packing with top-quality materials",
      "Coordination of destination services through our certified agents",
      "Door-to-door service with delivery to your final home",
    ],
    steps: [
      {
        title: "Profiling",
        text: "Understanding the origin, destination and particular features of your move.",
      },
      {
        title: "Specialized advice",
        text: "We explain the requirements, timelines and costs of the operation.",
      },
      {
        title: "Export packing",
        text: "Professional packing and protection of your move, carried out by experts.",
      },
      {
        title: "Logistics and delivery",
        text: "Shipment scheduling and delivery to your final home.",
      },
    ],
    note: "We recommend starting the process 1 to 2 months before your packing date.",
    guide: {
      eyebrow: "Quick guide",
      title: "Welcome to your new adventure!",
      lead: "We know an international move is the start of a big new chapter, and we want you to enjoy the process without worrying about technical jargon. So that we speak the same language from day one, we have put together this quick guide to the terms you will hear during your move. You will see it is simpler than it looks!",
    },
    featured: true,
    tags: [
      { icon: "water", label: "Sea" },
      { icon: "airplane", label: "Air" },
    ],
  },
  {
    slug: "bodegaje",
    icon: "boxes",
    title: "Storage",
    short:
      "Secure storage in Bogotá, by the day, the month or while your move is completed. Our own facilities and inventory control.",
    quote: "bodegaje",
    cta: "Get a quote",
    image: imgBodegajeBodega,
    imageReveal: "top",
    kicker: "Storage in Bogotá",
    headline: "A safe place for your belongings, for as long as you need",
    intro:
      "Our storage facilities in Bogotá let you keep household goods, office furniture or files while you settle in, renovate or wait for your final move. You can book it on its own or as part of your move, for as long as you need.",
    includes: [
      "Our own warehouses in Bogotá",
      "Inventory control of everything stored",
      "Pickup at your location and delivery whenever you ask",
      "Packing suited to long-term storage",
      "Ideal for companies, expats and families in transition",
    ],
    steps: [
      { title: "What you want to store", text: "Type of goods, estimated time and volume." },
      { title: "We pick up", text: "We pack and inventory everything at your home." },
      {
        title: "We store",
        text: "Your belongings stay in our custody at our facilities, with 24/7 security.",
      },
      { title: "We deliver", text: "Whenever you need it, to the address you choose." },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Specialized packing",
    short:
      "Protection for artwork, glassware and high-value items, with custom-built wooden crates.",
    quote: "local",
    cta: "Get a quote",
    image: imgGuacales,
    imageReveal: "right",
    kicker: "Artwork and valuables",
    headline: "Your most valuable items in professional hands. Specialized packing and total care",
    intro:
      "Artwork, collections, glassware and high-value furniture require specialized protection, carried out by experts with top-quality materials, in compliance with international standards for the care and safekeeping of your most delicate items.",
    photo: { src: imgEmbalajeCuadro, alt: "Packing a painting" },
    reel: [
      { src: imgServicioDiplomatico, caption: "Protecting artwork at home" },
      { src: imgEmbalajeCarton, caption: "Packing a painting" },
      { src: imgGuacalExportacion, caption: "Export crate" },
      { src: imgEmbalajeSala, caption: "On-site packing" },
      { src: imgEmbalajeHogar, caption: "Packing household goods at home" },
      { src: imgBodegaGuacales, caption: "Warehouse with storage crates" },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "International paperwork",
    short:
      "We offer clear, timely guidance on the documentation and customs regulations needed to carry out your move in compliance with international regulations.",
    quote: "internacional",
    cta: "Get a quote",
    image: imgAduanaCajas,
    imageReveal: "top",
    kicker: "Customs documentation",
    headline: "Guidance on documentation and customs requirements for the process in each country",
    intro:
      "A poorly declared inventory or a missing permit can cost weeks of delay and penalties. We guide you through the export and import documentation for household goods and personal effects, according to each country's regulations.",
    includes: [
      "Review of origin and destination country requirements",
      "Inventory declared for customs",
      "Coordination of port and airport charges",
      "Support during inspections and validations",
      "Advice for Colombians returning home",
      "Proactive communication throughout the process",
    ],
    steps: [
      { title: "Assessment", text: "We review your case and the documents required." },
      { title: "Preparation", text: "Inventory and documents with no inconsistencies." },
      { title: "Processing", text: "We coordinate with authorities and agents at destination." },
      { title: "Release", text: "We follow up until your belongings are delivered." },
    ],
  },
  // Formerly under "Solutions" (Nov. 2026)
  {
    slug: "traslado-de-oficinas",
    icon: "buildings",
    title: "Office Moves",
    short:
      "Safe office moves, with an account executive for your requirements and traceability reports.",
    quote: "empresarial",
    cta: "Request a corporate proposal",
    image: imgTrasladoOficinas,
    imageReveal: "right",
    kicker: "Moving for businesses",
    headline: "Transpack, a professional team for the safe move of your office",
    intro:
      "We move offices with a professional team and safe operating conditions. We work under agreements or contracts, with an account executive who handles your requirements and an operation that repeats every time your company needs it.",
    includes: [
      "Account executive to handle your requirements",
      "Traceability reports and safe operating conditions",
      "Agreements or contracts for recurring operations",
      "Storage in Bogotá for office furniture or archives",
    ],
    steps: [
      {
        title: "Assessment",
        text: "We understand what is being moved, the volume and your company's timelines.",
      },
      {
        title: "Proposal",
        text: "We design the operation and present you with a proposal.",
      },
      {
        title: "Agreement",
        text: "We set the terms in an agreement or contract.",
      },
      {
        title: "Operation",
        text: "We coordinate the move and report its progress until delivery.",
      },
    ],
  },
  {
    slug: "diplomatico",
    icon: "flag",
    title: "Diplomatic",
    short:
      "Moves for embassies and foreign and non-governmental organizations, with protocol-minded service and absolute confidentiality.",
    quote: "internacional",
    cta: "Contact the institutional team",
    image: imgServicioDiplomatico,
    imageReveal: "top",
    kicker: "Embassies and foreign and non-governmental organizations",
    headline: "Discretion, protocol and precision for diplomatic missions",
    intro:
      "The embassies of the United States, Spain, Canada, Mexico, India, France, Germany, Egypt, the United Arab Emirates and Italy, and institutions such as CAF, have trusted us to move their staff. We support diplomatic missions and international organizations with protocol-minded service and an institutional process.",
    includes: [
      "Protocol-minded service and absolute confidentiality",
      "Guidance on customs regulations and requirements at origin and destination",
      "Registration process as an institutional supplier",
      "International moves by sea or air",
    ],
    steps: [
      {
        title: "Introduction",
        text: "We present our experience with embassies and international organizations.",
      },
      {
        title: "Registration",
        text: "We complete the registration process as an institutional supplier.",
      },
      {
        title: "Operation",
        text: "We coordinate each move with protocol-minded service and confidentiality.",
      },
      {
        title: "Relationship",
        text: "We support your mission in every new move of its staff.",
      },
    ],
  },
];

// ─── Service levels ───────────────────────────────────────────────────────────

export const LEVELS = [
  {
    n: "01",
    title: "Basic move",
    text: "You have everything packed. We provide the crew and the vehicle.",
    points: ["Loading crew", "Transport", "Unloading at destination"],
    value: "Level 1 · Basic move",
  },
  {
    n: "02",
    title: "Protection and packing",
    text: "We protect your furniture and pack your boxes with a professional team.",
    points: ["Box packing", "Furniture protection", "Professional logistics team"],
    value: "Level 2 · Protection and packing",
    featured: true,
  },
  {
    n: "03",
    title: "Full service",
    text: "We take care of the whole process, with international-grade protection and full packing.",
    points: [
      "Disassembly and reassembly",
      "Full packing with top-quality materials",
      "Unpacking and placing your furniture at destination",
    ],
    value: "Level 3 · Full service",
  },
];

export const PROCESS = [
  {
    title: "Assessment",
    text: "We learn about the origin, destination, timeline and service level you are looking for.",
  },
  {
    title: "On-site survey",
    text: "We carry out an on-site survey to determine the type of packing, the volume and the transport.",
  },
  {
    title: "Packing and inventory",
    text: "We coordinate packing with international-grade, top-quality materials, pickup and inventory.",
  },
  {
    title: "Operation and tracking",
    text: "We coordinate shipping, routes, timing and destination, keeping you informed.",
  },
  {
    title: "Door-to-door delivery",
    text: "Door-to-door delivery coordinated with our partner agents in each country.",
  },
];

export const FAQS = [
  {
    q: "How far in advance should I book my move?",
    a: "Local moves can be scheduled one or two weeks in advance, and we also handle urgent requests subject to availability. For international moves we recommend starting the process one to two months before packing.",
  },
  {
    q: "How long does an international sea move take?",
    a: "It depends on the origin, the destination, how often the routes sail, customs processes and the season. On average it can take from several weeks to a few months. Good planning and complete documentation reduce delays.",
  },
  {
    q: "Is it better to move by sea or by air?",
    a: "Sea freight is ideal for large volumes, full households and family belongings. Air freight is faster and recommended for small or urgent shipments. We advise you based on your budget, timeline and type of belongings.",
  },
  {
    q: "Do I need an on-site survey to get a quote?",
    a: "With an inventory we can give you an estimate; however, when there is complexity due to difficult access or oversized items, we recommend an on-site survey.",
  },
  {
    q: "Why is the inventory so important?",
    a: "The inventory lets us estimate the volume, resources and time needed. Leaving something out can change the final cost, so the more accurate it is, the more precise your quote will be.",
  },
  {
    q: "What if the truck cannot park close to the property?",
    a: "It is key information: the distance between the vehicle and the door changes the operation. Let us know if the truck must stay outside the complex or far from the building so we can plan the right crew and time.",
  },
];

export const GALLERY: { src: string; caption: string; tall?: boolean; wide?: boolean }[] = [
  { src: imgEmbalajeObra, caption: "Protecting a work of art", wide: true },
  { src: imgContenedorCalle, caption: "Container ready for loading", wide: true },
  { src: imgEmbalajeBiblioteca, caption: "Packing a home library", wide: true },
  { src: imgSalaProtegida, caption: "Furniture protected in the living room", wide: true },
  { src: imgMontacargasBodega, caption: "Forklift in our warehouse", wide: true },
  { src: imgBodegaAlmacenamiento, caption: "Storage warehouse", wide: true },
  { src: imgMenajeListo, caption: "Household goods ready to move", wide: true },
  { src: imgEmbalajeSala, caption: "On-site packing" },
  { src: imgDespachoBodega, caption: "Dispatch from our warehouse" },
  { src: imgEmbalajeCuadro, caption: "Packing a painting", tall: true },
  { src: imgEmbalajeHogar, caption: "Packing household goods at home" },
];

// Política de tratamiento de datos (traducción; la versión en español es la oficial).
// Mismas secciones y orden que PRIVACY en src/data/site.ts.
export const PRIVACY = {
  title: "Personal Data Processing Policy",
  intro:
    "At Transpack S.A.S. we process your personal data in accordance with Colombian Law 1581 of 2012 and Decree 1377 of 2013 (compiled in Decree 1074 of 2015). Here we explain what data we collect on this site, what we use it for, how it is transmitted and how you can exercise your rights.",
  updated: "Last updated: October 8, 2026",
  notice: "This is a translation for your convenience. The Spanish version is the official one.",
  sections: [
    {
      id: "responsable",
      title: "Data controller",
      text: ["The company responsible for your personal data is:"],
    },
    {
      id: "datos",
      title: "What data we collect and why",
      text: [
        "We only ask for the data needed to handle your request. These are all the channels on the site:",
      ],
      table: {
        head: ["Where", "Data", "Purpose"],
        rows: [
          [
            "Contact form",
            "Name, company (optional), email, phone (optional), reason and message.",
            "To answer your message or request, including requests about your personal data.",
          ],
          [
            "Quote form",
            "Service, origin and destination, dates, property details, volume or inventory, service level, additional services and comments; name, mobile number and email. For companies: the company name and the employee's position.",
            "To prepare the estimate and formal quote, contact you to review it and, if you accept it, coordinate the service.",
          ],
          [
            "Advisor chat (Zoho SalesIQ)",
            "What you write in the conversation and any details you choose to give us (for example, name, email or phone), along with technical data about the visit: pages viewed, approximate location, browser and device.",
            "To handle your question with an advisor from our team in the site's chat.",
          ],
          [
            "WhatsApp and phone",
            "Your number and whatever you choose to tell us.",
            "To handle your question or request.",
          ],
          [
            "Site analytics (only if you accept cookies)",
            "Pages visited, approximate location (country or city), device type and actions such as opening the chat or sending a request, never their content.",
            "To measure, in aggregate, how the site is used in order to improve it.",
          ],
        ],
      },
      after: ["We do not sell your data or use it for advertising."],
    },
    {
      id: "sensibles",
      title: "Sensitive data and data of minors",
      text: [
        "We do not ask for sensitive data (such as health information, ethnic origin, beliefs or biometric data) or for data of children or adolescents. Please do not include it in your messages; if you do, we will use it only to handle your request.",
        "This site is not directed at minors.",
      ],
    },
    {
      id: "transmision",
      title: "How your data is transmitted and kept",
      items: [
        "Contact form and quote form by email: your data travels encrypted (HTTPS) to a function of the site itself, which emails it to Transpack through Brevo, our email provider, acting as data processor. Brevo also sends you a confirmation that we received your request. The site keeps no copy of what you send.",
        "WhatsApp: if you choose to send your request on WhatsApp, that conversation is also governed by WhatsApp's (Meta) terms and privacy policy.",
        "In your browser: your cookie choice is stored only in your browser (local storage) and is never sent to Transpack. You can delete it at any time by clearing this site's data in your browser.",
        "Advisor chat: the site's chat runs on Zoho SalesIQ, the chat tool of our CRM, which acts as data processor. If you accept cookies in the notice, Zoho loads in the background when you arrive on the site so the chat opens instantly; if you do not accept them, it only loads when you open the chat. Once loaded, it receives technical data about the visit (pages viewed, approximate location, browser and device). What you write in the chat is stored on Zoho's servers, which may be outside Colombia, and in our CRM.",
        "Map photos: your browser loads the photos on the home page map (the Bogotá photos it opens with and the one of each place you tap) directly from Wikimedia Commons, which receives the technical data of that request (IP address and browser). We do not send it any other data about you.",
        "Retention: we keep the requests we receive for as long as needed to handle them and provide the service, and afterwards for as long as accounting, tax and legal rules require.",
      ],
    },
    {
      id: "compartir",
      title: "Who we share your data with",
      items: [
        "For international moves, with our agents and partners in the country of origin or destination and with customs authorities, only as needed to carry out the move. This may involve transferring your data outside Colombia.",
        "With the providers that help us run the site and communicate with you, acting as data processors: Vercel (site hosting), Brevo (email delivery), Zoho (advisor chat and CRM) and Google (analytics, only if you accept it). Some are located outside Colombia, so your data may be transmitted to other countries.",
        "With authorities, when required by law.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and analytics",
      text: [
        "We use Google Analytics only if you accept analytics cookies in the notice shown when you arrive. Google acts as data processor. We do not use cookies for advertising, and if you reject them the site works the same. Zoho SalesIQ, which runs the advisor chat, stores the cookies the chat needs: if you accept cookies, it loads when you arrive on the site; otherwise, only when you open the chat.",
      ],
    },
    {
      id: "derechos",
      title: "Your rights",
      text: ["As the data subject, you can:"],
      items: [
        "Know, update and correct your data.",
        "Request proof of the authorization you gave us.",
        "Find out how we have used it.",
        "Revoke your authorization or ask us to delete your data, when there is no legal or contractual duty to keep it.",
        "Access your data free of charge.",
        "File complaints with Colombia's Superintendence of Industry and Commerce (SIC), after submitting your request to Transpack.",
      ],
    },
    {
      id: "como-ejercerlos",
      title: "How to exercise your rights",
      text: [
        `Use the contact form with the reason “Personal data” or write to ${CONTACT.email}. Include your name, your request and a way to reply to you.`,
      ],
      items: [
        "Inquiries: we answer within 10 business days at most, extendable by up to 5 more business days, in which case we will tell you why.",
        "Claims (correction, update, deletion or revocation): we answer within 15 business days at most, extendable by up to 8 more business days, in which case we will tell you why.",
      ],
      after: [
        "If you are not satisfied with our answer, you can file a complaint with the Superintendence of Industry and Commerce (SIC).",
      ],
    },
    {
      id: "autorizacion",
      title: "Authorization",
      text: [
        "By ticking the authorization box in the contact form or the quote form, you authorize us to process your data for the purposes of this policy. If you write to us in the advisor chat or on WhatsApp, or call us, you give us your authorization through that action, so we can handle your request. You can revoke it at any time through the channels in “How to exercise your rights”.",
      ],
    },
    {
      id: "seguridad",
      title: "Security",
      text: [
        "We apply reasonable technical, human and administrative measures to protect your data against loss and unauthorized consultation, use or access.",
      ],
    },
    {
      id: "vigencia",
      title: "Changes and validity",
      text: [
        "This policy applies from its publication on this site. If we change it substantially, we will announce it here before the changes take effect and update the date on this page.",
      ],
    },
  ] as PrivacySection[],
};
