// Cifra con sufijo en naranja (ej. 2.000+)
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span>
      {value.toLocaleString("es-CO")}
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}
