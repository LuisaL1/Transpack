// Desplazamiento por código (ir a una sección, volver arriba). Cuando el motor
// de movimiento (src/lib/motion.ts) está activo, lo hace su scroll inercial
// (Lenis): si lo hiciera el navegador por su cuenta, Lenis podría seguir
// animando hacia otro lado y deshacerlo. Si no (aún no carga, movimiento
// reducido), el scroll del navegador. Va en el JS principal y no importa nada
// pesado: el motor se registra aquí al iniciar.
type Target = number | HTMLElement;
type Scroller = {
  scrollTo: (target: Target, opts: { immediate?: boolean; offset?: number }) => void;
};

let scroller: Scroller | null = null;

/** Lo llama el motor de movimiento al crear su scroll inercial */
export function setScroller(s: Scroller | null) {
  scroller = s;
}

/** Lleva la página a `y` (px desde arriba); con `immediate`, sin animación */
export function scrollToY(y: number, immediate = false) {
  if (scroller) scroller.scrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

/** Lleva la página a una sección, con margen para la cabecera fija */
export function scrollToElement(el: HTMLElement) {
  if (scroller) scroller.scrollTo(el, { offset: -90 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
