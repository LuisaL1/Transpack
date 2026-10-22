// English version of the blog articles (blogData.ts). The slug stays in Spanish
// as an internal id; the English URL comes from the i18n slug map.
import imgBarco from "@/assets/images/barco.jpg";
import imgGuacales from "@/assets/images/guacales.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import type { Post } from "@/data/blogData";

export const blogPosts: Post[] = [
  {
    slug: "por-que-una-mudanza-maritima-internacional-puede-tardar",
    title: "Why can an international sea move take longer than expected?",
    cat: "International moving",
    cover: imgBarco,
    excerpt:
      "Customs, routes, ports and weather: understanding how a sea move works helps you set clear expectations and avoid delays.",
    cta: "Plan my international move",
    blocks: [
      {
        t: "p",
        text: "When people plan an international move, one of the most common questions is: why does the process take so long? It is often assumed that a move simply means loading belongings into a container and sending them to their final destination, but an international sea move involves a complex, coordinated and highly regulated logistics chain.",
      },
      {
        t: "p",
        text: "From customs processes to port times and weather conditions, many factors can affect how long the move takes. Understanding how the process works not only helps you set clearer expectations, it also helps you make better decisions when planning.",
      },
      { t: "h2", text: "How long does an international sea move take?" },
      {
        t: "p",
        text: "On average, an international sea move can take anywhere from several weeks to a few months. There is no single exact timeline, because each move depends on specific variables such as:",
      },
      {
        t: "ul",
        items: [
          "Distance between countries",
          "How often shipping routes sail",
          "Customs processes",
          "Port availability",
          "Type of service booked",
          "Peak seasons",
        ],
      },
      { t: "h2", text: "The main factors that make a sea move take longer" },
      {
        t: "ul",
        items: [
          {
            b: "International customs processes.",
            t: "Each country has its own rules for importing household goods, personal effects and furniture, which involve document reviews, validations and even physical inspections. When the paperwork has inconsistencies, timelines can stretch considerably.",
          },
          {
            b: "Shipping route availability.",
            t: "Shipping lines run on set schedules and frequencies. Some routes require longer waits to consolidate cargo or coordinate port connections.",
          },
          {
            b: "International port congestion.",
            t: "During holiday seasons or year-end closures, loading, unloading and container release times commonly increase.",
          },
          {
            b: "Weather and external factors.",
            t: "Storms, winter seasons or operational restrictions can lead to route changes or temporary logistics adjustments.",
          },
          {
            b: "Packing and protecting your belongings.",
            t: "Artwork, glassware, high-value furniture, fragile items and important documents require inventory, classification and specialized protection. Doing it right takes time, experience and planning.",
          },
        ],
      },
      { t: "h2", text: "Why good planning can reduce delays" },
      {
        t: "p",
        text: "Many delays happen because of a lack of preparation: incomplete documents, miscalculated timelines or unfamiliarity with international processes. Proper planning lets you:",
      },
      {
        t: "ul",
        items: [
          "Anticipate customs requirements",
          "Organize inventories correctly",
          "Coordinate strategic dates",
          "Optimize logistics timelines",
          "Reduce surprises",
        ],
      },
      { t: "h2", text: "Common mistakes that delay a sea move" },
      {
        t: "ul",
        items: [
          {
            b: "Incomplete documentation.",
            t: "Not having every document required for export or for entry into the destination country.",
          },
          {
            b: "Hiring companies without international experience.",
            t: "Not every moving company knows international logistics, sea freight processes and customs coordination.",
          },
          {
            b: "Not planning far enough ahead.",
            t: "Ideally, start the process early to ensure better organization.",
          },
        ],
      },
      { t: "h2", text: "Is it better to move by sea or by air?" },
      {
        t: "p",
        text: "It depends on each move. Sea moves are an excellent option for large volumes, full households and family belongings; air moves can be faster, although they are usually suited to smaller or urgent shipments. The best option depends on your budget, timeline and type of belongings.",
      },
      { t: "h2", text: "Conclusion" },
      {
        t: "p",
        text: "An international move should never feel improvised, especially when it comes to protecting important belongings and starting a new chapter of your life. At Transpack we handle national and international moves with organized processes, specialized packing and personal advice, so you can move with experience, confidence and professional support.",
      },
    ],
  },
  {
    slug: "elegancia-en-transito-seguridad-mudanzas-internacionales-premium",
    title: "Elegance in transit: the science of security in premium international moves",
    cat: "Premium",
    cover: imgGuacales,
    excerpt:
      "For corporate leaders, diplomats and high-profile families, protecting their assets and their peace of mind is non-negotiable. These are the 5 pillars of a seamless transition.",
    cta: "Talk to a consultant",
    blocks: [
      {
        t: "p",
        text: "Settling in a new global destination is a milestone of growth. Yet for corporate leaders, diplomats and high-profile families, an international move is not simply a matter of transport: it is a critical transition where the security of their assets, time management and peace of mind are non-negotiable.",
      },
      {
        t: "p",
        text: "When artwork, designer furniture and private collections must cross borders, improvisation is the greatest risk. True peace of mind comes from entrusting the process to a firm with the structural backing to handle any eventuality.",
      },
      { t: "h2", text: "The 5 pillars of a seamless global transition" },
      {
        t: "ul",
        items: [
          {
            b: "Specialized technical packing.",
            t: "High-value pieces require packing engineering: custom wooden crates for canvases, high-density impact cushioning and moisture control for sea transit, or optimal protection for air freight.",
          },
          {
            b: "Rigorous customs compliance.",
            t: "A poorly declared inventory or a missing port permit can cost weeks of delay and financial penalties. It must be handled by experts who master the legislation at origin and destination.",
          },
          {
            b: "Traceability and active control.",
            t: "Premium clients expect visibility into the status of their shipment and proactive communication that removes uncertainty during transit.",
          },
          {
            b: "International guarantees and certifications.",
            t: "Endorsement from LACMA (Latin American & Caribbean Movers Association), IAM (International Association of Movers) and PAIMA (Pan American International Movers Association) ensures the agent network at destination works to the same standards as at origin.",
          },
          {
            b: "Lifestyle continuity.",
            t: "The service must be strictly door to door. The move ends only when the new home is ready to live in, with the furniture assembled and placed with the same care it was packed with.",
          },
        ],
      },
      {
        t: "h2",
        text: "Transpack S.A.S.: more than half a century of logistics excellence in Colombia",
      },
      {
        t: "p",
        text: "With more than half a century of experience, Transpack S.A.S. has become the strategic partner for relocating multinationals, embassies and key accounts. Our offer combines:",
      },
      {
        t: "ul",
        items: [
          "Premium packing engineering adapted to high-value assets.",
          "Comprehensive customs advice for smooth exports and imports.",
          "Certified global backing from LACMA, IAM and PAIMA.",
        ],
      },
      {
        t: "p",
        text: "For those whose assets' security is non-negotiable, Transpack S.A.S. is the guarantee of a transition without borders. Let our experts design an international moving strategy tailored to your corporate and family requirements.",
      },
    ],
  },
  {
    slug: "empresa-de-mudanzas-internacionales-en-colombia-58-anos",
    title: "International moving company in Colombia: 58 years of experience and global coverage",
    cat: "Experience",
    cover: imgGlobal,
    excerpt:
      "Why the most demanding organizations and diplomatic missions never leave their mobility to chance, and what you should know before choosing your moving provider.",
    cta: "Get a quote for my international move",
    blocks: [
      {
        t: "p",
        text: "An international relocation is not measured in kilometers; it is measured by how much uncertainty you are willing to tolerate. A single customs error, a port delay or poor packing can turn a corporate or life project into a costly logistics nightmare.",
      },
      {
        t: "p",
        text: "That is why, when it comes to moving your assets or your leadership team across borders, improvisation is not an option.",
      },
      { t: "h2", text: "From Colombia to the world: almost six decades of experience" },
      {
        t: "p",
        text: "Transpack's story began 58 years ago, at a time when international trade was slower, more manual and far more uncertain. Over the decades, the company built something that cannot be improvised: a global operating network.",
      },
      {
        t: "p",
        text: "Today that network means more than 2,000 international agents in 176 countries, covering the United States, Canada, the European Union, Asia and all of Latin America. That coverage is why companies and families trust Transpack with their belongings when they cross borders.",
      },
      { t: "h2", text: "Specialists in sea and air routes" },
      {
        t: "p",
        text: "Moving a whole family household to Europe is not the same as handling the urgent shipment of personal effects for an executive taking a new role in Asia within weeks. This dual sea and air capability lets us design flexible solutions without compromising security or timelines.",
      },
      { t: "h2", text: "Corporate standard: the trust of the most demanding brands" },
      {
        t: "p",
        text: "DHL, Mitsubishi, Saint-Gobain, Sumitomo Corp., Holcim, Schneider, Total Colombia, Mapfre, Air Liquide, Argos, Cartus, Teleperformance, Pernod Ricard, 3M, Grupo Santander, Nexans, Cencosud and Smart Fit, among many other companies, have chosen Transpack to relocate their staff. Organizations like these work with providers that meet international standards for security, traceability and punctuality.",
      },
      { t: "h2", text: "A service worthy of diplomacy" },
      {
        t: "p",
        text: "Embassies such as those of the United States, Spain, Canada, Mexico, India, France, Germany, Egypt, the United Arab Emirates and Italy, and institutions such as CAF, have trusted Transpack to move their diplomatic staff, a segment that demands discretion, protocol and precision well above the market standard.",
      },
      { t: "h2", text: "Why this experience matters if you are about to move" },
      {
        t: "p",
        text: "The question you should really ask is not who is the cheapest option, but who has the proven track record to do it right, with no surprises. Discover how Transpack can support you at every stage of your move, with the same experience that has backed the world's most demanding companies and diplomatic missions.",
      },
    ],
  },
];
