// English version of the site content. Same structure as site.ts: when a text
// changes in Spanish, update it here too. Internal codes (slug, quote, id)
// stay in Spanish because they drive URLs and the quote form.
import imgEquipoSala from "@/imports/equipo-sala.jpg";
import imgEmbalajeSala from "@/imports/embalaje-sala.jpg";
import imgContenedor from "@/imports/contenedor.jpg";
import imgGuacales from "@/imports/guacales.jpg";
import imgNuevaEtapa from "@/imports/nueva-etapa.jpg";
import imgGlobal from "@/imports/global.jpg";
import imgCargue from "@/imports/cargue.jpg";
import imgBarco from "@/imports/barco.jpg";
import type { QuoteService, Service } from "@/data/site";

export { CONTACT, YOUTUBE_CHANNEL, ABOUT_IMAGES } from "@/data/site";
export type { QuoteService, Service } from "@/data/site";
import { CONTACT } from "@/data/site";

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
  { value: 176, suffix: "+", label: "destination countries" },
  { value: 60, suffix: "K+", label: "tons of household goods exported" },
  { value: 2000, suffix: "+", label: "international agents" },
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
      "Moves within Bogotá and its metropolitan area, with trained crews, furniture protection and vehicles sized to your load.",
    quote: "local",
    cta: "Get a quote",
    image: imgEquipoSala,
    kicker: "Moving in Bogotá",
    headline: "Your move across town, with no stress and no surprises",
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
    kicker: "Between Colombian cities",
    headline: "From one city to another, with your belongings protected all the way",
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
    headline: "Your next life abroad starts with a clear plan",
    intro:
      "An international move is not handled like a local one. First you understand the process, the requirements, the timelines and the costs; then we quote. A specialized advisor guides you from the first contact, backed by more than 2,000 agents in 176 countries.",
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
    image: imgContenedor,
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
    headline: "High-value pieces are not wrapped in generic packaging",
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
    image: imgBarco,
    kicker: "International paperwork",
    headline: "Customs is a legal maze. We know the way through",
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
    title: "Your home, in the same condition at its new destination",
    text: "Local, national and international household moves. Choose how much you want to hand over: from a basic move to a full service where we take care of everything.",
    points: [
      "Packing, furniture disassembly and reassembly",
      "Protection for fragile and high-value items",
      "Temporary storage while you settle in",
    ],
    cta: "Get a quote for a home move",
    quote: "local" as QuoteService,
    image: imgEquipoSala,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "One provider to move offices and talent",
    text: "Office moves and national and international employee relocation. We work with Procurement and Human Resources under agreements or contracts, with a dedicated account executive.",
    points: [
      "Account executive and recurring operations",
      "Night or weekend schedules when the plan requires it",
      "Reporting, traceability and corporate terms",
    ],
    cta: "Request a corporate proposal",
    quote: "empresarial" as QuoteService,
    image: imgContenedor,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Discretion, protocol and precision for diplomatic missions",
    text: "The embassies of the United States, Spain, Canada, Mexico, India, France, Germany, Egypt, the United Arab Emirates and Italy, and institutions such as CAF, have trusted us to move their staff.",
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
    tab: "Diaspora",
    kicker: "International diaspora",
    title: "We don't just move your things: we ease your transition",
    text: "Whether you are moving to the United States, Canada, Europe or anywhere else, or coming back to Colombia, we guide you from the planning stage so you arrive with everything in order.",
    points: [
      "Advice on requirements, timelines and costs before you pack",
      "Sea or air shipping, depending on your case",
      "An agent network that receives you in your destination country",
    ],
    cta: "Plan my international move",
    quote: "internacional" as QuoteService,
    image: imgNuevaEtapa,
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

export const GALLERY = [
  { src: imgEmbalajeSala, caption: "On-site packing" },
  { src: imgGuacales, caption: "Custom wooden crates" },
  { src: imgBarco, caption: "Sea routes" },
  { src: imgContenedor, caption: "Container loading" },
  { src: imgEquipoSala, caption: "Furniture protection" },
];
