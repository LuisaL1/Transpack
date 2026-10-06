// Botones — clases compartidas para <a>, <Link> y <button>
const btnBase =
  "group inline-flex items-center justify-center gap-2 rounded-full border-2 font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer";
export const btn = {
  primary: `${btnBase} border-transparent bg-naranja text-white shadow-[0_10px_24px_-10px_rgba(255,118,25,.7)] hover:bg-naranja-600 hover:-translate-y-0.5`,
  secondary: `${btnBase} border-transparent bg-azul text-white hover:bg-azul-700 hover:-translate-y-0.5`,
  outline: `${btnBase} border-azul text-azul hover:bg-azul hover:text-white`,
  ghost: `${btnBase} border-white/45 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:border-white`,
  light: `${btnBase} border-transparent bg-white text-azul hover:bg-beige hover:-translate-y-0.5`,
  whatsapp: `${btnBase} border-transparent bg-whatsapp text-white hover:brightness-95 hover:-translate-y-0.5`,
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-6 py-3 text-[0.95rem]",
};
