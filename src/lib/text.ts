// Utilidades de texto compartidas.

/** Minúsculas y sin tildes ni diéresis (conserva signos y espacios). */
export const stripAccents = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
