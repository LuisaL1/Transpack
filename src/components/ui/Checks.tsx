import { Bi } from "./Bi";

// Lista con checks naranja
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
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-naranja text-[0.8rem] text-white">
            <Bi n="check-lg" />
          </span>
          {it}
        </li>
      ))}
    </ul>
  );
}
