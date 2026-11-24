// Botones — clases compartidas para <a>, <Link> y <button>
// La flecha (bi-arrow-right) se desliza al pasar el cursor; el primario además
// lleva un brillo que lo cruza (nov. 2026)
const btnBase =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer [&_.bi-arrow-right]:transition-transform [&_.bi-arrow-right]:duration-300 hover:[&_.bi-arrow-right]:translate-x-1";
const shine =
  "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[150%] before:skew-x-[-20deg] before:bg-white/35 before:transition-transform before:duration-700 hover:before:translate-x-[400%] motion-reduce:before:hidden";
export const btn = {
  primary: `${btnBase} ${shine} border-transparent bg-naranja text-white shadow-[0_10px_24px_-10px_rgba(255,118,25,.7)] hover:bg-naranja-600 hover:-translate-y-0.5`,
  secondary: `${btnBase} border-transparent bg-azul text-white hover:bg-azul-700 hover:-translate-y-0.5`,
  outline: `${btnBase} border-azul text-azul hover:bg-azul hover:text-white`,
  ghost: `${btnBase} border-white/45 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:border-white`,
  light: `${btnBase} border-transparent bg-white text-azul hover:bg-beige hover:-translate-y-0.5`,
  whatsapp: `${btnBase} border-transparent bg-whatsapp text-white hover:brightness-95 hover:-translate-y-0.5`,
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-6 py-3 text-[0.95rem]",
};
