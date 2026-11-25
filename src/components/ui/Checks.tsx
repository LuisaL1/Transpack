// Lista con checks naranja. El ✓ es un trazo SVG (largo 1, `data-check`) para
// que una página pueda dibujarlo al entrar (strokeDashoffset de 1 a 0, como en
// los servicios); quieto se ve completo.
export function Checks({
  items,
  light = false,
  small = false,
}: {
  items: string[];
  light?: boolean;
  small?: boolean;
}) {
  return (
    <ul className={`grid ${small ? "gap-2.5" : "gap-3"}`}>
      {items.map((it) => (
        <li
          key={it}
          className={`flex items-start gap-3 font-medium ${
            small ? "text-[0.92rem]" : ""
          } ${light ? "text-white" : "text-tinta"}`}
        >
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-naranja text-white">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                data-check
                d="M3.2 8.4 6.6 11.6 12.8 4.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
              />
            </svg>
          </span>
          {it}
        </li>
      ))}
    </ul>
  );
}
