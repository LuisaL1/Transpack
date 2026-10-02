// Versione italiana dei contenuti del sito. Stessa struttura di site.ts: quando
// un testo cambia in spagnolo va aggiornato anche qui. I codici interni (slug,
// quote, id) restano in spagnolo perché guidano URL e modulo di preventivo.
import imgEquipoSala from "@/imports/equipo-sala.jpg";
import imgEmbalajeSala from "@/imports/embalaje-sala.jpg";
import imgContenedor from "@/imports/contenedor.jpg";
import imgGuacales from "@/imports/guacales.jpg";
import imgNuevaEtapa from "@/imports/nueva-etapa.jpg";
import imgGlobal from "@/imports/global.jpg";
import imgCargue from "@/imports/cargue.jpg";
import imgBarco from "@/imports/barco.jpg";
import type { QuoteService, Service } from "@/data/site";
import { CONTACT } from "@/data/site";

export { CONTACT, YOUTUBE_CHANNEL, ABOUT_IMAGES } from "@/data/site";

export const waLink = (text = "Ciao Transpack, vorrei informazioni su un trasloco") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const VIDEOS = [
  { id: "i4G8QG8lan8", tag: "Trasloco internazionale", title: "Dagli Stati Uniti alla Colombia" },
  { id: "uFEVARznuhM", tag: "Rientro in Colombia", title: "Ti trasferisci in Colombia?" },
  {
    id: "bUOWdNVa2Uc",
    tag: "Pianificazione",
    title: "Un ottimo trasloco internazionale inizia molto prima della spedizione",
  },
];

export const SLOGAN = "Promettiamo con il cuore, manteniamo con eccellenza.";

export const STATS = [
  { value: 58, suffix: "+", label: "anni di esperienza" },
  { value: 176, suffix: "+", label: "paesi di destinazione" },
  { value: 60, suffix: "K+", label: "tonnellate di masserizie esportate" },
  { value: 2000, suffix: "+", label: "agenti internazionali" },
];

export const EMBASSIES = [
  "Stati Uniti",
  "Spagna",
  "Canada",
  "Messico",
  "India",
  "Francia",
  "Germania",
  "Egitto",
  "Emirati Arabi Uniti",
  "Italia",
];

// ─── Servizi ──────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Trasloco locale",
    short:
      "Traslochi all'interno di Bogotá e della sua area metropolitana, con personale qualificato, protezione dei mobili e mezzi adatti al volume.",
    quote: "local",
    cta: "Richiedi un preventivo",
    image: imgEquipoSala,
    kicker: "Traslochi a Bogotá",
    headline: "Il tuo trasloco in città, senza stress e senza sorprese",
    intro:
      "Pianifichiamo ogni trasloco locale in base all'immobile di partenza e di arrivo: piano, ascensore, scale, accesso del camion e orari consentiti dall'amministrazione. Così arriviamo con la squadra e i tempi giusti.",
    includes: [
      "Sopralluogo o videochiamata quando il volume lo richiede",
      "Squadra di carico esperta nella movimentazione di mobili",
      "Protezione di mobili, elettrodomestici e oggetti fragili",
      "Smontaggio e rimontaggio dei mobili",
      "Mezzo adatto al volume del tuo inventario",
      "Deposito temporaneo su richiesta",
    ],
    steps: [
      {
        title: "Raccontaci il trasloco",
        text: "Partenza, arrivo, data, tipo di immobile e cosa devi trasportare.",
      },
      {
        title: "Ricevi la stima",
        text: "Ti inviamo una stima e, se ti convince, il preventivo definitivo.",
      },
      {
        title: "Imballiamo e proteggiamo",
        text: "In base al livello di servizio scelto: base, protezione o completo.",
      },
      { title: "Consegniamo", text: "Scarichiamo e sistemiamo tutto nella tua nuova casa." },
    ],
    note: "I traslochi locali si programmano di solito con 1-2 settimane di anticipo, ma gestiamo anche richieste urgenti in base alla disponibilità.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "Trasloco nazionale",
    short:
      "Traslochi tra città colombiane con inventario dettagliato, imballaggio professionale, monitoraggio del mezzo e consegna porta a porta.",
    quote: "nacional",
    cta: "Richiedi un preventivo",
    image: imgCargue,
    kicker: "Tra città colombiane",
    headline: "Da una città all'altra, con i tuoi beni protetti per tutto il viaggio",
    intro:
      "In un trasloco nazionale l'inventario è la base di tutto: ci permette di calcolare volume, mezzo e risorse necessarie. Curiamo sicurezza, protezione e rispetto dei tempi su ogni tratta.",
    includes: [
      "Inventario dettagliato e calcolo del volume",
      "Imballaggio professionale e protezione specializzata",
      "Monitoraggio del mezzo durante il viaggio",
      "Carico e scarico pianificati alla partenza e all'arrivo",
      "Servizio porta a porta in tutto il paese",
      "Deposito a Bogotá se la nuova casa non è ancora pronta",
    ],
    steps: [
      {
        title: "Inventario",
        text: "Elenchiamo tutto ciò che si trasferisce per stimare volume e costo.",
      },
      {
        title: "Tratta e organizzazione",
        text: "Verifichiamo percorso, mezzo e condizioni di accesso.",
      },
      {
        title: "Imballaggio e carico",
        text: "Proteggiamo ogni oggetto in base al valore e alla fragilità.",
      },
      { title: "Consegna", text: "Scarichiamo e sistemiamo tutto nella tua nuova città." },
    ],
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "Trasloco internazionale",
    short:
      "Via mare o via aerea, da e per la Colombia. Prima del preventivo ti consigliamo su requisiti, tempi e pratiche doganali.",
    quote: "internacional",
    cta: "Parla con un consulente",
    image: imgGlobal,
    kicker: "Da e per la Colombia",
    headline: "La tua nuova vita all'estero inizia con un piano chiaro",
    intro:
      "Un trasloco internazionale non si gestisce come uno locale. Prima conosci il processo, i requisiti, i tempi e i costi; poi facciamo il preventivo. Un consulente specializzato ti segue dal primo contatto, con il supporto di oltre 2.000 agenti in 176 paesi.",
    includes: [
      "Consulenza iniziale sui requisiti di partenza e di arrivo",
      "Trasporto marittimo (grandi volumi) o aereo (spedizioni urgenti)",
      "Pratiche doganali e documentazione per le masserizie",
      "Casse in legno e imballaggio per l'esportazione",
      "Coordinamento con agenti certificati LACMA, IAM e PAIMA",
      "Consegna porta a porta nel paese di destinazione",
    ],
    steps: [
      {
        title: "Analisi della richiesta",
        text: "Partenza, destinazione, data, motivo del trasferimento e inventario preliminare.",
      },
      {
        title: "Consulenza specializzata",
        text: "Esaminiamo con te requisiti, tempi e costi aggiuntivi.",
      },
      {
        title: "Imballaggio per l'esportazione",
        text: "Inventario, classificazione e protezione per il transito internazionale.",
      },
      { title: "Transito e consegna", text: "Ti seguiamo finché la nuova casa non è abitabile." },
    ],
    note: "Ti consigliamo di avviare la procedura 1-2 mesi prima della data dell'imballaggio.",
    featured: true,
    tags: [
      { icon: "water", label: "Marittimo" },
      { icon: "airplane", label: "Aereo" },
    ],
  },
  {
    slug: "bodegaje",
    icon: "boxes",
    title: "Deposito mobili",
    short:
      "Deposito sicuro a Bogotá, a giorni, a mesi o finché il trasloco non è completato. Magazzini di proprietà e controllo dell'inventario.",
    quote: "bodegaje",
    cta: "Richiedi un preventivo",
    image: imgContenedor,
    kicker: "Deposito a Bogotá",
    headline: "Un posto sicuro per le tue cose, per tutto il tempo che serve",
    intro:
      "I nostri magazzini a Bogotá ti permettono di custodire masserizie, arredi da ufficio o archivi mentre ti sistemi, ristrutturi o aspetti la data della partenza. Puoi prenotare il servizio da solo o insieme al trasloco.",
    includes: [
      "Magazzini di proprietà a Bogotá",
      "Controllo dell'inventario dei beni depositati",
      "Ritiro al tuo indirizzo e consegna su richiesta",
      "Imballaggio adatto alla custodia prolungata",
      "Formule a giorni, a mesi o a lungo termine",
      "Ideale per aziende, espatriati e famiglie in transizione",
    ],
    steps: [
      { title: "Dicci cosa depositare", text: "Tipo di beni, volume e durata stimata." },
      { title: "Ritiriamo", text: "Imballiamo e inventariamo presso di te." },
      { title: "Custodiamo", text: "I tuoi beni restano sotto controllo nei nostri magazzini." },
      { title: "Consegniamo", text: "Quando vuoi, all'indirizzo che ci indichi." },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Imballaggio specializzato",
    short:
      "Casse in legno su misura, imbottitura ad alta densità e protezione per opere d'arte, cristalleria e mobili di valore.",
    quote: "local",
    cta: "Richiedi un preventivo",
    image: imgGuacales,
    kicker: "Ingegneria dell'imballaggio",
    headline: "I pezzi di valore non si imballano come tutto il resto",
    intro:
      "Opere d'arte, collezioni, cristalleria e mobili di design richiedono una vera ingegneria dell'imballaggio: casse in legno su misura per le tele, protezione antiurto ad alta densità e difesa dall'umidità nei transiti lunghi.",
    includes: [
      "Casse in legno realizzate su misura",
      "Protezione antiurto ad alta densità",
      "Protezione dall'umidità per il trasporto marittimo",
      "Movimentazione di pianoforti e oggetti ingombranti",
      "Inventario ed etichettatura pezzo per pezzo",
      "Personale esperto nella gestione di oggetti fragili",
    ],
    steps: [
      { title: "Valutazione", text: "Individuiamo i pezzi speciali, le misure e la fragilità." },
      { title: "Progetto dell'imballaggio", text: "Definiamo materiali e casse per ogni pezzo." },
      { title: "Imballaggio", text: "Imballiamo, etichettiamo e inventariamo." },
      { title: "Trasporto", text: "Movimentazione esperta fino alla destinazione finale." },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Dogana e documenti",
    short:
      "Assistenza per l'esportazione e l'importazione di masserizie, inventari dichiarati e requisiti di partenza e destinazione.",
    quote: "internacional",
    cta: "Richiedi un preventivo",
    image: imgBarco,
    kicker: "Pratiche internazionali",
    headline: "La dogana è un labirinto di norme. Noi conosciamo la strada",
    intro:
      "Un inventario dichiarato male o un permesso mancante possono costare settimane di ritardo e sanzioni. Ti assistiamo con la documentazione di esportazione e importazione di masserizie ed effetti personali, secondo le norme di ciascun paese.",
    includes: [
      "Verifica dei requisiti del paese di partenza e di destinazione",
      "Inventario dichiarato per la dogana",
      "Coordinamento dei costi portuali e aeroportuali",
      "Assistenza durante ispezioni e verifiche",
      "Consulenza per i colombiani che rientrano in patria",
      "Comunicazione proattiva durante tutto il processo",
    ],
    steps: [
      { title: "Analisi", text: "Esaminiamo il tuo caso e i documenti richiesti." },
      { title: "Preparazione", text: "Inventario e documenti senza incongruenze." },
      { title: "Pratiche", text: "Ci coordiniamo con le autorità e gli agenti a destinazione." },
      { title: "Sdoganamento", text: "Ti seguiamo fino alla consegna dei tuoi beni." },
    ],
  },
];

// ─── Soluzioni per tipo di cliente ────────────────────────────────────────────

export const SEGMENTS = [
  {
    id: "residencial",
    icon: "house-door",
    tab: "Privati",
    kicker: "Transpack Privati",
    title: "La tua casa, nelle stesse condizioni a destinazione",
    text: "Traslochi di abitazioni locali, nazionali e internazionali. Scegli quanto delegare: dal semplice trasporto al servizio completo in cui ci occupiamo di tutto noi.",
    points: [
      "Imballaggio, smontaggio e rimontaggio dei mobili",
      "Protezione di oggetti fragili e di valore",
      "Deposito temporaneo mentre ti sistemi",
    ],
    cta: "Richiedi un preventivo per il tuo trasloco",
    quote: "local" as QuoteService,
    image: imgEquipoSala,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "Un unico partner per trasferire uffici e talenti",
    text: "Traslochi d'ufficio e trasferimento di dipendenti in Colombia e all'estero. Lavoriamo con Acquisti e Risorse Umane tramite accordi o contratti, con un account manager dedicato.",
    points: [
      "Account manager e operazioni ricorrenti",
      "Interventi notturni o nel fine settimana secondo il programma",
      "Report, tracciabilità e condizioni aziendali",
    ],
    cta: "Richiedi una proposta aziendale",
    quote: "empresarial" as QuoteService,
    image: imgContenedor,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Discrezione, protocollo e precisione per le missioni diplomatiche",
    text: "Le ambasciate di Stati Uniti, Spagna, Canada, Messico, India, Francia, Germania, Egitto, Emirati Arabi Uniti e Italia, e istituzioni come la CAF, ci hanno affidato il trasferimento del loro personale.",
    points: [
      "Servizio protocollare e assoluta riservatezza",
      "Registrazione come fornitore istituzionale",
      "Conformità normativa alla partenza e all'arrivo",
    ],
    cta: "Contatta il nostro team istituzionale",
    quote: "internacional" as QuoteService,
    image: imgGuacales,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Colombiani all'estero",
    kicker: "Comunità colombiana nel mondo",
    title: "Non trasportiamo solo le tue cose: ti aiutiamo a ricominciare",
    text: "Che tu vada a vivere negli Stati Uniti, in Canada, in Europa o altrove, o che torni in Colombia, ti accompagniamo fin dalla pianificazione perché tu arrivi con tutto in ordine.",
    points: [
      "Consulenza su requisiti, tempi e costi prima di imballare",
      "Spedizione via mare o via aerea in base al tuo caso",
      "Una rete di agenti che ti accoglie nel paese di destinazione",
    ],
    cta: "Pianifica il mio trasloco internazionale",
    quote: "internacional" as QuoteService,
    image: imgNuevaEtapa,
  },
];

// ─── Livelli di servizio ──────────────────────────────────────────────────────

export const LEVELS = [
  {
    n: "01",
    title: "Trasporto base",
    text: "Hai già imballato tutto. Noi mettiamo la squadra e il mezzo.",
    points: ["Squadra di carico", "Trasporto", "Scarico a destinazione"],
    value: "Livello 1 · Trasporto base",
  },
  {
    n: "02",
    title: "Protezione e imballaggio",
    text: "Imballiamo i tuoi scatoloni e proteggiamo i mobili con una movimentazione professionale.",
    points: [
      "Tutto il livello base",
      "Imballaggio degli scatoloni",
      "Protezione dei mobili",
      "Movimentazione professionale",
    ],
    value: "Livello 2 · Protezione e imballaggio",
    featured: true,
  },
  {
    n: "03",
    title: "Servizio completo",
    text: "Ci occupiamo di tutto il processo, dall'inizio alla fine: a te basta arrivare.",
    points: [
      "Tutto il livello 2",
      "Smontaggio e rimontaggio",
      "Sistemazione a destinazione",
      "Coordinamento completo",
    ],
    value: "Livello 3 · Servizio completo",
  },
];

export const PROCESS = [
  {
    title: "Analisi",
    text: "Valutiamo partenza, destinazione, tempi, inventario e il livello di servizio che cerchi.",
  },
  {
    title: "Progettazione della soluzione",
    text: "Combiniamo trasporto, imballaggio, deposito e pratiche. Se serve, facciamo un sopralluogo.",
  },
  {
    title: "Imballaggio e inventario",
    text: "Classifichiamo e proteggiamo ogni oggetto con materiali adatti al suo valore e alla sua fragilità.",
  },
  {
    title: "Operazione e monitoraggio",
    text: "Coordiniamo la tratta nazionale o internazionale e ti teniamo aggiornato.",
  },
  {
    title: "Consegna porta a porta",
    text: "Abbiamo finito solo quando la tua nuova casa è pronta da vivere.",
  },
];

export const FAQS = [
  {
    q: "Con quanto anticipo devo prenotare il trasloco?",
    a: "I traslochi locali si possono programmare con una o due settimane di anticipo, e gestiamo anche richieste urgenti in base alla disponibilità. Per i traslochi internazionali consigliamo di iniziare la procedura uno o due mesi prima dell'imballaggio.",
  },
  {
    q: "Quanto dura un trasloco internazionale via mare?",
    a: "Dipende dalla partenza, dalla destinazione, dalla frequenza delle rotte, dalle procedure doganali e dalla stagione. In media può richiedere da alcune settimane a qualche mese. Una buona pianificazione e una documentazione completa riducono i ritardi.",
  },
  {
    q: "È meglio un trasloco via mare o via aerea?",
    a: "Il trasporto marittimo è ideale per grandi volumi, arredamenti completi e i beni di un'intera famiglia. Quello aereo è più rapido ed è consigliato per spedizioni piccole o urgenti. Ti consigliamo in base a budget, tempi e tipo di beni.",
  },
  {
    q: "Serve un sopralluogo per ottenere un preventivo?",
    a: "Non sempre. Se le informazioni sull'inventario e sull'immobile sono sufficienti, possiamo darti una stima. In caso di complessità o rischio di errore (accessi difficili, oggetti particolari, grandi volumi) consigliamo un sopralluogo o una videochiamata.",
  },
  {
    q: "Perché l'inventario è così importante?",
    a: "L'inventario ci permette di stimare volume, risorse e tempi necessari. Una dimenticanza può cambiare il costo finale: più è preciso, più accurato sarà il preventivo.",
  },
  {
    q: "Cosa succede se il camion non può parcheggiare vicino all'immobile?",
    a: "È un'informazione fondamentale: la distanza tra il mezzo e la porta cambia l'organizzazione. Facci sapere se il camion deve restare fuori dal complesso o lontano dal palazzo, così pianifichiamo la squadra e i tempi giusti.",
  },
];

export const GALLERY = [
  { src: imgEmbalajeSala, caption: "Imballaggio a domicilio" },
  { src: imgGuacales, caption: "Casse in legno su misura" },
  { src: imgBarco, caption: "Rotte marittime" },
  { src: imgContenedor, caption: "Carico del container" },
  { src: imgEquipoSala, caption: "Protezione dei mobili" },
];
