// English version of the site content. Same structure as site.ts: when a text
// changes in Spanish, update it here too. Internal codes (slug, quote, id)
// stay in Spanish because they drive URLs and the quote form.
import imgInspeccionCanina from "@/assets/images/inspeccion-canina.jpg";
import imgEmbalajeSala from "@/assets/images/embalaje-sala.jpg";
import imgContenedor from "@/assets/images/contenedor.jpg";
import imgCargador from "@/assets/images/cargador.jpg";
import imgGuacales from "@/assets/images/guacales.jpeg";
import imgOficina from "@/assets/images/oficina.jpeg";
import imgExterior from "@/assets/images/exterior.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import imgCargue from "@/assets/images/cargue.jpg";
import imgArteHogar from "@/assets/images/galeria/arte-hogar.jpg";
import imgEmbalajeHogar from "@/assets/images/galeria/embalaje-hogar.jpg";
import imgCargueCajas from "@/assets/images/galeria/cargue-cajas.jpg";
import imgDespachoBodega from "@/assets/images/galeria/despacho-bodega.jpg";
import imgBodegaGuacales from "@/assets/images/galeria/bodega-guacales.jpg";
import imgGuacalExportacion from "@/assets/images/galeria/guacal-exportacion.jpg";
import imgEmbalajeCuadro from "@/assets/images/galeria/embalaje-cuadro.jpg";
import type { QuoteService, Service, ServiceGuide } from "@/data/site";

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

// Local and national moving guide (client text, November 2026)
const HOME_MOVE_GUIDE: ServiceGuide = {
  eyebrow: "Quick guide",
  title: "Your move, step by step",
  sections: [
    {
      icon: "clipboard-check",
      title: "The first step: planning your move",
      text: [
        "Before packing the first box, we need to work out the size of your move. We call this the Pre-Move Survey. For your convenience, we can do an In-Home Estimate (we visit your home), a Virtual one (by video call) or a Phone estimate.",
        "With it we create your Inventory List, the official document where we record all your Household Goods (furniture, appliances) and Personal Effects (clothes, books, personal items). That way we know exactly what is travelling and we make sure everything arrives complete.",
      ],
    },
    {
      icon: "box-seam",
      title: "Moving day: packing and caring for your things",
      text: [
        "On the scheduled day, our team will arrive at your current home. They have the best Staff Training to look after your belongings as if they were their own:",
      ],
      items: [
        {
          b: "Packing Materials:",
          t: "we use heavy-duty boxes, bubble wrap and kraft paper. We also have Eco-Friendly Materials if you prefer to look after the environment.",
        },
        {
          b: "Loading and Stowage:",
          t: "the art of fitting everything perfectly inside the truck. We make sure there is a Balanced Load so the weight is well distributed and nothing is damaged by the movement of the journey.",
        },
        {
          b: "Sealed Container / Enclosed Truck:",
          t: "your belongings travel protected from the weather and road dust, with security seals if needed.",
        },
      ],
    },
    {
      icon: "signpost-split",
      title: "The journey: on the road to your new home",
      text: [
        "To keep your move free of unnecessary delays, we use Route Optimization technology. It lets us choose the safest and most efficient way, avoiding difficult areas and heavy traffic.",
        "If your destination city has a vehicle restriction or a Special Permit is required (for example, to enter a gated residential complex or to drive at certain hours), our team will advise you so everything is ready.",
      ],
    },
    {
      icon: "key",
      title: "Your arrival: unpacking and delivery",
      text: [
        "We have arrived! Our team will unload everything with the utmost care. Once inside your new home, we do the Unpacking of the main items and help you with the Assembly and Installation of your beds, wardrobes or tables so you can live in your home from day one. When we finish, we take care of Waste Removal, taking away all the used packing material to leave your space clean.",
      ],
    },
    {
      icon: "shield-check",
      title: "Your peace of mind comes first: risks and insurance",
      text: [
        "Although we work to the highest standard to prevent Transport, Loading or Unloading Risks, the unexpected can happen on the road. For your complete peace of mind, we offer Insurance Coverage options:",
      ],
      items: [
        {
          b: "Full Coverage (All-Risk):",
          t: "your best ally. It protects your whole move against any mishap or accident on the way.",
        },
        {
          b: "Partial Coverage:",
          t: "ideal if you only want to insure certain specific items of value.",
        },
      ],
    },
  ],
  closing: {
    title: "Our commitment to you",
    text: [
      "We understand the Logistical Challenges of moving an entire home and we adapt to your needs. We measure the quality of our service with Quality Indicators (KPIs) to make sure you receive five-star care. And if something does not go as you expected, our Complaints and Claims Management team will resolve any issue right away.",
      "Relax and start planning your new space, we will take care of the truck!",
    ],
  },
};

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Local moving",
    short:
      "Moves within Bogotá and its metropolitan area, with trained crews, furniture protection and vehicles sized to your load.",
    quote: "local",
    cta: "Get a quote",
    image: imgEmbalajeHogar,
    kicker: "Moving in Bogotá",
    headline: "Your move across town, stress-free",
    intro:
      "We plan every local move around the origin and destination property: floor, elevator, stairs, truck access and the hours allowed by building management. That way we arrive with the right crew and the right time.",
    includes: [
      "On-site survey or video call when the volume requires it",
      "Loading crew trained in furniture handling",
      "Protection for furniture, appliances and fragile items",
      "Furniture disassembly and reassembly",
      "A vehicle sized to your inventory",
      "Optional temporary storage",
    ],
    steps: [
      {
        title: "Tell us about your move",
        text: "Origin, destination, date, type of property and what you are moving.",
      },
      {
        title: "Get your estimate",
        text: "We send you an estimate and, if you agree, the formal quote.",
      },
      {
        title: "We pack and protect",
        text: "Depending on the service level you choose: basic, protection or full service.",
      },
      { title: "We deliver", text: "We unload and place everything in your new space." },
    ],
    note: "Local moves are usually booked 1 to 2 weeks in advance, but we also handle urgent requests subject to availability.",
    guide: HOME_MOVE_GUIDE,
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "National moving",
    short:
      "Moves between Colombian cities with a detailed inventory, professional packing, vehicle monitoring and door-to-door delivery.",
    quote: "nacional",
    cta: "Get a quote",
    image: imgCargue,
    heroMap: true,
    kicker: "Between Colombian cities",
    headline: "Your belongings, door to door",
    intro:
      "In a national move the inventory is the foundation of everything: it lets us calculate the volume, the vehicle and the resources needed. We take care of security, protection and on-time delivery on every route.",
    includes: [
      "Detailed inventory and volume calculation",
      "Professional packing and specialized protection",
      "Vehicle monitoring throughout the trip",
      "Loading and unloading planned at origin and destination",
      "Door-to-door service nationwide",
      "Storage in Bogotá if your new home is not ready yet",
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
    guide: HOME_MOVE_GUIDE,
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "International moving",
    short:
      "By sea or air, to and from Colombia. We advise you on requirements, timelines and customs before we quote.",
    quote: "internacional",
    cta: "Talk to an advisor",
    image: imgGlobal,
    kicker: "To and from Colombia",
    headline: "Crossing borders without worry",
    intro:
      "An international move is not handled like a local one. First you understand the process, the requirements, the timelines and the costs; then we quote. A specialized advisor guides you from the first contact, backed by more than 2,000 agents and strategic partners in 176 countries.",
    includes: [
      "Initial advice on origin and destination requirements",
      "Sea freight (large volumes) or air freight (urgent shipments)",
      "Customs and documentation for household goods",
      "Wooden crates and export packing",
      "Coordination with LACMA, IAM and PAIMA certified agents",
      "Door-to-door delivery in the destination country",
    ],
    steps: [
      {
        title: "Profiling",
        text: "Origin, destination, date, reason for moving and a preliminary inventory.",
      },
      {
        title: "Specialized advice",
        text: "We review requirements, timelines and additional costs with you.",
      },
      {
        title: "Export packing",
        text: "Inventory, classification and protection for international transit.",
      },
      {
        title: "Transit and delivery",
        text: "We follow up until your new home is ready to live in.",
      },
    ],
    note: "We recommend starting the process 1 to 2 months before your packing date.",
    guide: {
      eyebrow: "Quick guide",
      title: "Welcome to your new adventure!",
      lead: "We know an international move is the start of a big new chapter, and we want you to enjoy the process without worrying about technical jargon. So that we speak the same language from day one, we have put together this quick guide to the terms you will hear during your move. You will see it is simpler than it looks!",
      sections: [
        {
          icon: "clipboard-check",
          title: "Where it all begins: getting to know your move",
          text: [
            "Before moving a single box, we need to know what we are moving. We call this the Pre-Move Survey. Depending on your time and convenience, we can do an In-Home Estimate (we visit your home), a Virtual one (by video call) or a Phone estimate.",
            "At the end, we will create your Inventory List, the official document where we record each of your Household Goods (furniture, appliances) and Personal Effects (clothes, books).",
          ],
        },
        {
          icon: "box-seam",
          title: "Getting to work: packing and logistics",
          text: ["You are not alone on this journey. You will have the support of two key teams:"],
          items: [
            {
              b: "Origin Agent:",
              t: "the team in your current country that will pack everything professionally.",
            },
            {
              b: "Destination Agent:",
              t: "the company that will receive your belongings in the new country, take them to your new home, do the Unpacking and help you with the Assembly and Installation of your furniture.",
            },
          ],
          after:
            "To protect your belongings we use high-quality Packing Materials (and Eco-Friendly Materials too, to look after the planet!). Everything is placed securely through a process called Loading and Stowage, making sure there is a Balanced Load inside the container so nothing shifts on the way. Your things will travel in a Multimodal Container (suited to ships, trains or trucks), fully protected as a Sealed Container.",
        },
        {
          icon: "passport",
          title: "Going through Customs (stress-free!)",
          text: [
            "Crossing borders takes paperwork, but our Customs Agent will handle the entire clearance for you. You will hear about:",
          ],
          items: [
            {
              b: "Customs Declaration and Forms:",
              t: "the official documents where we tell the authorities what we are bringing and what it is worth.",
            },
            {
              b: "Import or Special Permit:",
              t: "authorizations required if you travel with special items such as artwork, antiques or your pets.",
            },
            {
              b: "Tax Exemption:",
              t: "a great benefit you can apply for if you prove your Legal Residence, which lets you bring in your belongings without paying taxes, as long as we do it within the Import Deadline set by the law of your new country.",
            },
          ],
        },
        {
          icon: "water",
          title: "The documents for your sea shipment",
          text: [
            "If your belongings travel by sea, the most important document is the Bill of Lading (BOL), which is the contract and title of ownership of your shipment.",
          ],
          items: [
            {
              b: "Original Bill of Lading (OBL):",
              t: "if we ask you for it, it means we will need the physical paper to release your belongings at the port.",
            },
            {
              b: "Express Release:",
              t: "much faster! Everything is released digitally with no need for physical paperwork.",
            },
          ],
        },
        {
          icon: "shield-check",
          title: "Your peace of mind comes first: risks and insurance",
          text: [
            "Although our staff have the best Training to prevent Transport, Loading or Unloading Risks, it is always better to travel protected. That is why we will offer you Insurance Coverage:",
          ],
          items: [
            {
              b: "All-Risk Policy (Full Coverage):",
              t: "your best option. It protects you against practically any mishap or damage.",
            },
            {
              b: "Partial Coverage:",
              t: "ideal if you only want to protect certain specific items or limited risks.",
            },
          ],
        },
      ],
      closing: {
        title: "Our commitment to you",
        text: [
          "We want you to know that we understand the Logistical Challenges of this process and deeply respect the Culture of your destination. We constantly monitor our service with Quality Indicators (KPIs). And if something is not perfect, we have a team dedicated to Complaints and Claims Management to give you a fair and fast solution.",
          "Relax and start packing your dreams, we will take care of the rest!",
        ],
      },
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
    image: imgCargador,
    kicker: "Storage in Bogotá",
    headline: "A safe place for your belongings, for as long as you need",
    intro:
      "Our storage facilities in Bogotá let you keep household goods, office furniture or files while you settle in, renovate or wait for your travel date. You can book it on its own or as part of your move.",
    includes: [
      "Our own warehouses in Bogotá",
      "Inventory control of everything stored",
      "Pickup at your location and delivery whenever you ask",
      "Packing suited to long-term storage",
      "Daily, monthly or long-term plans",
      "Ideal for companies, expats and families in transition",
    ],
    steps: [
      { title: "Tell us what to store", text: "Type of goods, volume and estimated time." },
      { title: "We pick up", text: "We pack and inventory at your location." },
      { title: "We store", text: "Your belongings stay under control in our warehouses." },
      { title: "We deliver", text: "Whenever you need it, to the address you choose." },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Specialized packing",
    short:
      "Custom wooden crates, high-density cushioning and protection for artwork, glassware and high-value furniture.",
    quote: "local",
    cta: "Get a quote",
    image: imgGuacales,
    kicker: "Packing engineering",
    headline: "Your most valuable items in professional hands. Specialized packing and total care",
    intro:
      "Artwork, collections, glassware and designer furniture require packing engineering: custom wooden crates for canvases, high-density impact cushioning and moisture protection for long transits.",
    includes: [
      "Custom-built wooden crates",
      "High-density impact cushioning",
      "Moisture protection for sea transit",
      "Handling of pianos and oversized items",
      "Piece-by-piece inventory and labeling",
      "Crews experienced with fragile items",
    ],
    steps: [
      { title: "Assessment", text: "We identify special pieces, their size and fragility." },
      { title: "Packing design", text: "We choose materials and crates for each piece." },
      { title: "Packing", text: "We pack, label and inventory." },
      { title: "Transport", text: "Expert handling all the way to the final destination." },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Customs and documentation",
    short:
      "Support with the export and import of household goods, declared inventories and origin and destination requirements.",
    quote: "internacional",
    cta: "Get a quote",
    image: imgInspeccionCanina,
    kicker: "International paperwork",
    headline: "Guidance and document procedures for the customs process in every country",
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
];

// ─── Solutions by segment ─────────────────────────────────────────────────────

export const SEGMENTS = [
  {
    id: "residencial",
    icon: "house-door",
    tab: "Residential",
    kicker: "Transpack Residential",
    title: "Your local move: Fast, safe and hassle-free",
    text: "",
    points: [
      "Packing, furniture disassembly and reassembly",
      "Protection for fragile and high-value items",
      "Temporary storage while you settle in",
    ],
    cta: "Get a quote for a home move",
    quote: "local" as QuoteService,
    image: imgInspeccionCanina,
    // Foto panorámica: el marco usa su proporción para que se vea completa
    imageWide: true,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "Transpack, a single provider to move your office with talent",
    text: "",
    points: [
      "Account executive and recurring operations",
      "Reporting, traceability and corporate terms",
    ],
    cta: "Request a corporate proposal",
    quote: "empresarial" as QuoteService,
    image: imgOficina,
    // Foto panorámica: el marco usa su proporción para que se vea completa
    imageWide: true,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Discretion, protocol and precision for diplomatic missions",
    text: "",
    points: [
      "Protocol-level service and complete confidentiality",
      "Registration process as an institutional supplier",
      "Regulatory compliance at origin and destination",
    ],
    cta: "Contact our institutional team",
    quote: "internacional" as QuoteService,
    image: imgGuacales,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Living abroad",
    kicker: "Moving abroad or coming back to Colombia",
    title: "We don't just move your things: we ease your transition",
    text: "",
    points: [
      "Advice on requirements, timelines and costs before you pack",
      "Sea or air shipping, depending on your case",
      "A network of agents and strategic partners that receives you in your destination country",
    ],
    cta: "Plan my international move",
    quote: "internacional" as QuoteService,
    image: imgExterior,
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
    text: "We pack your boxes and protect your furniture with professional handling.",
    points: [
      "Everything in the basic level",
      "Box packing",
      "Furniture protection",
      "Professional handling",
    ],
    value: "Level 2 · Protection and packing",
    featured: true,
  },
  {
    n: "03",
    title: "Full service",
    text: "We take care of the whole process, start to finish, so all you have to do is arrive.",
    points: [
      "Everything in level 2",
      "Disassembly and reassembly",
      "Unpacking and setup at destination",
      "Full coordination",
    ],
    value: "Level 3 · Full service",
  },
];

export const PROCESS = [
  {
    title: "Assessment",
    text: "We understand origin, destination, timeline, inventory and the service level you need.",
  },
  {
    title: "Solution design",
    text: "We combine transport, packing, storage and paperwork. If needed, we do an on-site survey.",
  },
  {
    title: "Packing and inventory",
    text: "We classify and protect every item with materials suited to its value and fragility.",
  },
  {
    title: "Operation and tracking",
    text: "We coordinate the national or international route and keep you informed.",
  },
  { title: "Door-to-door delivery", text: "We are done when your new space is ready to live in." },
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
    a: "Not always. If the information about your inventory and property is enough, we can give you an estimate. When there is complexity or a risk of error (difficult access, special items, large volumes), we recommend a visit or a video call.",
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

export const GALLERY: { src: string; caption: string; tall?: boolean }[] = [
  { src: imgContenedor, caption: "Container loading", tall: true },
  { src: imgEmbalajeCuadro, caption: "Packing a painting", tall: true },
  { src: imgEmbalajeSala, caption: "On-site packing" },
  { src: imgArteHogar, caption: "Protecting artwork at home" },
  { src: imgCargueCajas, caption: "Loading Transpack boxes" },
  { src: imgGuacales, caption: "Custom wooden crates" },
  { src: imgBodegaGuacales, caption: "Warehouse with storage crates" },
  { src: imgEmbalajeHogar, caption: "Packing household goods at home" },
  { src: imgGuacalExportacion, caption: "Export crate" },
  { src: imgDespachoBodega, caption: "Dispatch from our warehouse" },
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
