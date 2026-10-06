// Cotizador por pasos (src/components/home/QuoteWizard.tsx). Sigue la "Lógica
// de Cotización" de Transpack: servicio → origen/destino → fecha/urgencia →
// inmueble o detalles → volumen/nivel → contacto. No calcula precios (el
// documento no los define): perfila la solicitud para el equipo comercial.
// Aquí están las opciones de cada paso y todos sus textos.
import type { QuoteService } from "@/data/site";
import type { Tr } from "@/i18n";

export type QuoteForm = Record<string, string>;

export const serviceOptions = (
  tr: Tr,
): { value: QuoteService; icon: string; title: string; sub: string }[] => [
  {
    value: "local",
    icon: "house-door",
    title: tr("Mudanza local", "Local move"),
    sub: tr("Dentro de la misma ciudad", "Within the same city"),
  },
  {
    value: "nacional",
    icon: "truck",
    title: tr("Mudanza nacional", "National move"),
    sub: tr("Entre ciudades de Colombia", "Between Colombian cities"),
  },
  {
    value: "internacional",
    icon: "globe-americas",
    title: tr("Mudanza internacional", "International move"),
    sub: tr("Desde o hacia otro país", "To or from another country"),
  },
  {
    value: "empresarial",
    icon: "buildings",
    title: tr("Traslado empresarial", "Corporate move"),
    sub: tr("Oficinas o funcionarios", "Offices or employees"),
  },
  {
    value: "bodegaje",
    icon: "boxes",
    title: tr("Bodegaje", "Storage"),
    sub: tr("Almacenamiento seguro", "Secure storage"),
  },
];

export const serviceNames = (tr: Tr): Record<QuoteService, string> => ({
  local: tr("Mudanza local", "Local move"),
  nacional: tr("Mudanza nacional", "National move"),
  internacional: tr("Mudanza internacional", "International move"),
  empresarial: tr("Traslado empresarial", "Corporate move"),
  bodegaje: tr("Bodegaje", "Storage"),
});

export const placeLabels = (tr: Tr): Record<QuoteService, [string, string, string, string]> => ({
  local: [
    tr("Barrio o dirección de origen", "Origin neighborhood or address"),
    tr("Barrio o dirección de destino", "Destination neighborhood or address"),
    tr("Ej. Bogotá, Chapinero", "E.g. Bogotá, Chapinero"),
    tr("Ej. Bogotá, Cedritos", "E.g. Bogotá, Cedritos"),
  ],
  nacional: [
    tr("Ciudad de origen", "Origin city"),
    tr("Ciudad de destino", "Destination city"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Medellín", "E.g. Medellín"),
  ],
  internacional: [
    tr("Ciudad de origen", "Origin city"),
    tr("Ciudad de destino", "Destination city"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Toronto", "E.g. Toronto"),
  ],
  empresarial: [
    tr("Ciudad o país de origen", "Origin city or country"),
    tr("Ciudad o país de destino", "Destination city or country"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Ciudad de México", "E.g. Mexico City"),
  ],
  bodegaje: [
    tr("¿En qué ciudad o barrio recogemos?", "Which city or neighborhood do we pick up from?"),
    "",
    tr("Ej. Bogotá, Usaquén", "E.g. Bogotá, Usaquén"),
    "",
  ],
});

export const step4Title = (tr: Tr): Record<QuoteService, string> => ({
  local: tr("Cuéntanos sobre el inmueble", "Tell us about the property"),
  nacional: tr("Cuéntanos sobre el inmueble", "Tell us about the property"),
  internacional: tr("Cuéntanos sobre tu traslado", "Tell us about your move"),
  empresarial: tr("Datos de la empresa", "Company details"),
  bodegaje: tr("¿Qué vas a almacenar?", "What will you store?"),
});

export const doneMsg = (tr: Tr): Partial<Record<QuoteService, string>> => ({
  internacional: tr(
    "Por tratarse de una mudanza internacional, un asesor especializado revisará contigo requisitos, tiempos y costos antes de la cotización formal. Envía tu solicitud por WhatsApp para agilizar el contacto.",
    "Since this is an international move, a specialized advisor will review requirements, timelines and costs with you before the formal quote. Send your request on WhatsApp to speed things up.",
  ),
  empresarial: tr(
    "Un ejecutivo de cuenta revisará las condiciones corporativas y te enviará una propuesta. Envía tu solicitud por WhatsApp o correo.",
    "An account executive will review the corporate terms and send you a proposal. Send your request on WhatsApp or by email.",
  ),
  bodegaje: tr(
    "Un asesor te confirmará disponibilidad y condiciones de almacenamiento. Envía tu solicitud por WhatsApp.",
    "An advisor will confirm availability and storage terms. Send your request on WhatsApp.",
  ),
});

export const extrasFor = (tr: Tr): [string, string][] => [
  [
    tr("Objetos delicados / obras de arte", "Fragile items / artwork"),
    tr("Objetos delicados o arte", "Fragile items or art"),
  ],
  [
    tr("Desarme y armado", "Disassembly and reassembly"),
    tr("Desarme y armado", "Disassembly and reassembly"),
  ],
  [tr("Bodegaje temporal", "Temporary storage"), tr("Bodegaje temporal", "Temporary storage")],
  [
    tr("Elementos sobredimensionados", "Oversized items"),
    tr("Piano o sobredimensionados", "Piano or oversized items"),
  ],
  [
    tr("Visita técnica", "On-site survey"),
    tr("Quiero visita técnica", "I'd like an on-site survey"),
  ],
];

/** Número de pasos del cotizador */
export const QUOTE_STEPS_TOTAL = 6;

// Textos del cotizador (pasos, campos, validaciones, resumen y envío)
export const quoteText = (tr: Tr) => ({
  eligeTipoServicioContinuar: tr(
    "Elige el tipo de servicio para continuar.",
    "Choose the type of service to continue.",
  ),
  indicaPaisOrigen: tr("Indica el país de origen.", "Enter the origin country."),
  indicaPaisDestino: tr("Indica el país de destino.", "Enter the destination country."),
  indicaLugarOrigen: tr("Indica el lugar de origen.", "Enter the origin location."),
  indicaLugarDestino: tr("Indica el lugar de destino.", "Enter the destination location."),
  cuentanosCuandoNecesitas: tr("Cuéntanos para cuándo lo necesitas.", "Tell us when you need it."),
  escribeNombre: tr("Escribe tu nombre.", "Enter your name."),
  escribeNumeroCelularValido: tr(
    "Escribe un número de celular válido.",
    "Enter a valid mobile number.",
  ),
  revisaCorreoElectronico: tr("Revisa el correo electrónico.", "Check your email address."),
  debesAutorizarTratamientoDatos: tr(
    "Debes autorizar el tratamiento de datos para enviar la solicitud.",
    "You must authorize data processing to send the request.",
  ),
  servicio: tr("Servicio", "Service"),
  origen: tr("Origen", "Origin"),
  destino: tr("Destino", "Destination"),
  tiempoBodegaje: tr("Tiempo de bodegaje", "Storage time"),
  cuando: tr("Cuándo", "When"),
  fechaFlexible: tr("fecha flexible", "flexible date"),
  piso: tr("piso", "floor"),
  ascensor: tr("Ascensor", "Elevator"),
  parqueoCamion: tr("Parqueo del camión", "Truck parking"),
  motivo: tr("Motivo", "Reason"),
  modalidad: tr("Modalidad", "Mode"),
  empresa: tr("Empresa", "Company"),
  tipoTraslado: tr("Tipo de traslado", "Type of move"),
  cargoFuncionario: tr("Cargo del funcionario", "Employee's position"),
  horario: tr("Horario", "Schedule"),
  almacena: tr("Qué se almacena", "What is stored"),
  recogida: tr("Recogida", "Pickup"),
  volumen: tr("Volumen", "Volume"),
  nivelServicio: tr("Nivel de servicio", "Service level"),
  adicionales: tr("Adicionales", "Extras"),
  inventarioComentarios: tr("Inventario / comentarios", "Inventory / comments"),
  holaTranspackQuieroSolicitar: tr(
    "Hola Transpack, quiero solicitar una cotización:",
    "Hello Transpack, I would like to request a quote:",
  ),
  nombre: tr("Nombre", "Name"),
  celular: tr("Celular", "Mobile"),
  correo: tr("Correo", "Email"),
  selecciona: tr("Selecciona", "Select"),
  listoSolicitudEstaPreparada: tr(
    "¡Listo! Tu solicitud está preparada",
    "Done! Your request is ready",
  ),
  envialaWhatsappAsesorTe: tr(
    "Envíala por WhatsApp y un asesor te responderá con un estimado. Si hace falta, coordinaremos una visita técnica.",
    "Send it on WhatsApp and an advisor will reply with an estimate. If needed, we'll arrange an on-site survey.",
  ),
  enviarWhatsapp: tr("Enviar por WhatsApp", "Send on WhatsApp"),
  solicitudCotizacion: tr("Solicitud de cotización", "Quote request"),
  enviarCorreo: tr("Enviar por correo", "Send by email"),
  hacerOtraSolicitud: tr("Hacer otra solicitud", "Start a new request"),
  paso: tr("Paso", "Step"),
  stepOf: tr("de", "of"),
  necesitasTrasladar: tr("¿Qué necesitas trasladar?", "What do you need to move?"),
  desdeDondeHaciaDonde: tr("¿Desde dónde y hacia dónde?", "From where and to where?"),
  paisOrigen: tr("País de origen", "Origin country"),
  ejColombia: tr("Ej. Colombia", "E.g. Colombia"),
  paisDestino: tr("País de destino", "Destination country"),
  ejCanada: tr("Ej. Canadá", "E.g. Canada"),
  cuantoTiempo: tr("¿Por cuánto tiempo?", "For how long?"),
  menos1Mes: tr("Menos de 1 mes", "Less than 1 month"),
  n13Meses: tr("1 a 3 meses", "1 to 3 months"),
  n36Meses: tr("3 a 6 meses", "3 to 6 months"),
  mas6Meses: tr("Más de 6 meses", "More than 6 months"),
  aunNo: tr("Aún no lo sé", "I don't know yet"),
  cuandoNecesitas: tr("¿Cuándo lo necesitas?", "When do you need it?"),
  urgenteProximosDias: tr("Urgente (próximos días)", "Urgent (next few days)"),
  urgenteProximosDias2: tr("Urgente · próximos días", "Urgent · next few days"),
  cortoPlazo12: tr("Corto plazo (1–2 semanas)", "Short term (1–2 weeks)"),
  n12Semanas: tr("En 1–2 semanas", "In 1–2 weeks"),
  programadoVariasSemanas: tr("Programado (varias semanas)", "Scheduled (several weeks)"),
  variasSemanas: tr("En varias semanas", "In several weeks"),
  planificado1MesMas: tr("Planificado (1 mes o más)", "Planned (1 month or more)"),
  n1MesMas: tr("En 1 mes o más", "In 1 month or more"),
  fechaAproximada: tr("Fecha aproximada", "Approximate date"),
  opcional: tr("(opcional)", "(optional)"),
  fechaFlexible2: tr("Mi fecha es flexible", "My date is flexible"),
  mudanzasInternacionalesRecomendamosIniciar: tr(
    "Para mudanzas internacionales recomendamos iniciar el proceso entre 1 y 2 meses antes del empaque.",
    "For international moves we recommend starting the process 1 to 2 months before packing.",
  ),
  tipoInmueble: tr("Tipo de inmueble", "Type of property"),
  apartamento: tr("Apartamento", "Apartment"),
  casa: tr("Casa", "House"),
  oficina: tr("Oficina", "Office"),
  localComercial: tr("Local comercial", "Retail space"),
  piso2: tr("Piso", "Floor"),
  ej5: tr("Ej. 5", "E.g. 5"),
  tieneAscensor: tr("¿Tiene ascensor?", "Is there an elevator?"),
  si: tr("Sí", "Yes"),
  noSoloEscaleras: tr("No, solo escaleras", "No, stairs only"),
  tanCercaPuedeParquear: tr(
    "¿Qué tan cerca puede parquear el camión?",
    "How close can the truck park?",
  ),
  frenteInmueble: tr("Frente al inmueble", "Right in front"),
  menos50M: tr("A menos de 50 m", "Less than 50 m away"),
  mas50MFuera: tr("A más de 50 m / fuera del conjunto", "More than 50 m / outside the complex"),
  mas50MFuera2: tr("A más de 50 m o fuera del conjunto", "More than 50 m or outside the complex"),
  cualMotivoTraslado: tr("¿Cuál es el motivo del traslado?", "What is the reason for the move?"),
  trabajo: tr("Trabajo", "Work"),
  estudio: tr("Estudio", "Study"),
  meRadicoOtroPais: tr("Me radico en otro país", "Settling in another country"),
  regresoColombia: tr("Regreso a Colombia", "Returning to Colombia"),
  misionDiplomatica: tr("Misión diplomática", "Diplomatic mission"),
  modalidadPreferida: tr("Modalidad preferida", "Preferred mode"),
  maritima: tr("Marítima", "Sea"),
  aerea: tr("Aérea", "Air"),
  necesitoAsesoria: tr("Necesito asesoría", "I need advice"),
  nombreEmpresa: tr("Nombre de la empresa", "Company name"),
  trasladoOficina: tr("Traslado de oficina", "Office move"),
  reubicacionFuncionario: tr("Reubicación de un funcionario", "Relocation of one employee"),
  variosFuncionarios: tr("Varios funcionarios", "Several employees"),
  acuerdoCorporativoRecurrente: tr(
    "Acuerdo corporativo recurrente",
    "Recurring corporate agreement",
  ),
  siAplica: tr("(si aplica)", "(if applicable)"),
  ejGerenteRegional: tr("Ej. Gerente regional", "E.g. Regional manager"),
  horarioOperacion: tr("Horario de operación", "Operating hours"),
  diurnoEntreSemana: tr("Diurno, entre semana", "Daytime, weekdays"),
  nocturno: tr("Nocturno", "Night"),
  finSemana: tr("Fin de semana", "Weekend"),
  definir: tr("Por definir", "To be defined"),
  deseasAlmacenar: tr("¿Qué deseas almacenar?", "What do you want to store?"),
  menajeHogar: tr("Menaje de hogar", "Household goods"),
  mobiliarioOficina: tr("Mobiliario de oficina", "Office furniture"),
  archivoDocumentos: tr("Archivo / documentos", "Files / documents"),
  obrasArteUObjetos: tr("Obras de arte u objetos de valor", "Artwork or valuables"),
  otro: tr("Otro", "Other"),
  necesitasRecojamos: tr("¿Necesitas que recojamos?", "Do you need a pickup?"),
  siRecogerUbicacion: tr("Sí, recoger en mi ubicación", "Yes, pick up at my location"),
  noYoLlevo: tr("No, yo lo llevo", "No, I'll bring it"),
  tantoVasMover: tr("¿Qué tanto vas a mover?", "How much are you moving?"),
  volumenAproximado: tr("Volumen aproximado", "Approximate volume"),
  pocosObjetosCajas: tr("Pocos objetos / cajas", "A few items / boxes"),
  pocosObjetos: tr("Pocos objetos", "A few items"),
  apartaestudio: tr("Apartaestudio", "Studio apartment"),
  apartaestudio2: tr("Apartaestudio", "Studio"),
  apartamento23Habitaciones: tr("Apartamento 2–3 habitaciones", "2–3 bedroom apartment"),
  n23Habitaciones: tr("2–3 habitaciones", "2–3 bedrooms"),
  casaGrande4Habitaciones: tr("Casa grande (4+ habitaciones)", "Large house (4+ bedrooms)"),
  casaGrande: tr("Casa grande", "Large house"),
  serviciosAdicionales: tr("Servicios adicionales", "Additional services"),
  inventarioComentarios2: tr("Inventario o comentarios", "Inventory or comments"),
  entreMasPrecisoMejor: tr(
    "(entre más preciso, mejor la cotización)",
    "(the more accurate, the better the quote)",
  ),
  ej1Sofa3: tr(
    "Ej. 1 sofá de 3 puestos, 2 camas dobles, comedor de 6, nevera, lavadora, 20 cajas, 3 cuadros…",
    "E.g. 1 three-seat sofa, 2 double beds, 6-seat dining table, fridge, washer, 20 boxes, 3 paintings…",
  ),
  comoTeContactamos: tr("¿Cómo te contactamos?", "How can we reach you?"),
  nombreCompleto: tr("Nombre completo", "Full name"),
  celularWhatsapp: tr("Celular / WhatsApp", "Mobile / WhatsApp"),
  correoElectronico: tr("Correo electrónico", "Email"),
  autorizoTranspackSS: tr(
    "Autorizo a Transpack S.A.S. a tratar mis datos para gestionar esta solicitud.",
    "I authorize Transpack S.A.S. to process my data to handle this request.",
  ),
  atras: tr("Atrás", "Back"),
  verSolicitud: tr("Ver mi solicitud", "Review my request"),
  continuar: tr("Continuar", "Continue"),
  solicitud: tr("Tu solicitud", "Your request"),
  eligeServicioComenzar: tr("Elige un servicio para comenzar.", "Choose a service to get started."),
  prefieresHablarAlguien: tr("¿Prefieres hablar con alguien?", "Prefer to talk to someone?"),
});
