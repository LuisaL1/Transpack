// Logos de clientes para la franja del hero. Fuentes: Wikimedia Commons y
// Simple Icons (DHL usa la versión de Commons). Se muestran en un solo tono gris
// con CSS, así que los archivos pueden conservar sus colores originales.
// "ratio" = ancho / alto del logo, para que todos se vean del mismo peso visual.
import dhl from "@/assets/images/clientes/dhl.svg";
import mitsubishi from "@/assets/images/clientes/mitsubishi.svg";
import saintGobain from "@/assets/images/clientes/saintgobain.png";
import sumitomo from "@/assets/images/clientes/sumitomo.svg";
import holcim from "@/assets/images/clientes/holcim.svg";
import schneider from "@/assets/images/clientes/schneider.svg";
import mapfre from "@/assets/images/clientes/mapfre.svg";
import airLiquide from "@/assets/images/clientes/airliquide.svg";
import argos from "@/assets/images/clientes/argos.png";
import teleperformance from "@/assets/images/clientes/teleperformance.svg";
import pernodRicard from "@/assets/images/clientes/pernodricard.svg";
import m3 from "@/assets/images/clientes/3m.svg";
import santander from "@/assets/images/clientes/santander.svg";
import nexans from "@/assets/images/clientes/nexans.svg";
import cencosud from "@/assets/images/clientes/cencosud.svg";
import smartFit from "@/assets/images/clientes/smartfit.svg";
// Banderas de las embajadas atendidas (flag-icons, licencia MIT; España y México
// en PNG pequeño porque su escudo pesa mucho en SVG)
import flagUs from "@/assets/images/clientes/banderas/us.svg";
import flagEs from "@/assets/images/clientes/banderas/es.png";
import flagCa from "@/assets/images/clientes/banderas/ca.svg";
import flagMx from "@/assets/images/clientes/banderas/mx.png";
import flagIn from "@/assets/images/clientes/banderas/in.svg";
import flagFr from "@/assets/images/clientes/banderas/fr.svg";
import flagDe from "@/assets/images/clientes/banderas/de.svg";
import flagEg from "@/assets/images/clientes/banderas/eg.svg";
import flagAe from "@/assets/images/clientes/banderas/ae.svg";
import flagIt from "@/assets/images/clientes/banderas/it.svg";
// Logos de las embajadas (Wikimedia Commons, dominio público o Licence Ouverte):
// el de la Embajada de Francia en Colombia; para las demás, la imagen oficial de
// su cancillería o gobierno (Estados Unidos: sello del Departamento de Estado) o
// el escudo o emblema nacional (España: el logo del ministerio en grises no se leía). En PNG pequeño, recortados y a 200 px de alto.
import logoUs from "@/assets/images/clientes/embajadas/us.png";
import logoEs from "@/assets/images/clientes/embajadas/es.png";
import logoCa from "@/assets/images/clientes/embajadas/ca.png";
import logoMx from "@/assets/images/clientes/embajadas/mx.png";
import logoIn from "@/assets/images/clientes/embajadas/in.png";
import logoFr from "@/assets/images/clientes/embajadas/fr.png";
import logoDe from "@/assets/images/clientes/embajadas/de.png";
import logoEg from "@/assets/images/clientes/embajadas/eg.png";
import logoAe from "@/assets/images/clientes/embajadas/ae.png";
import logoIt from "@/assets/images/clientes/embajadas/it.png";
import { EMBASSIES } from "@/data/site";

export const CLIENT_LOGOS = [
  { name: "DHL", src: dhl, ratio: 7.18 },
  { name: "Mitsubishi", src: mitsubishi, ratio: 1.16 },
  { name: "Saint-Gobain", src: saintGobain, ratio: 2.38 },
  { name: "Sumitomo Corporation", src: sumitomo, ratio: 11.4 },
  { name: "Holcim", src: holcim, ratio: 4.33 },
  { name: "Schneider Electric", src: schneider, ratio: 3.39 },
  { name: "Mapfre", src: mapfre, ratio: 2.07 },
  { name: "Air Liquide", src: airLiquide, ratio: 5.23 },
  { name: "Argos", src: argos, ratio: 0.83 },
  { name: "Teleperformance", src: teleperformance, ratio: 5.72 },
  { name: "Pernod Ricard", src: pernodRicard, ratio: 2.72 },
  { name: "3M", src: m3, ratio: 2.9 },
  { name: "Grupo Santander", src: santander, ratio: 7.48 },
  { name: "Nexans", src: nexans, ratio: 2.43 },
  { name: "Cencosud", src: cencosud, ratio: 1.9 },
  { name: "Smart Fit", src: smartFit, ratio: 2.74 },
];

/** Bandera de cada embajada, por su nombre en español (EMBASSIES de site.ts) */
export const EMBASSY_FLAGS: Record<string, string> = {
  "Estados Unidos": flagUs,
  España: flagEs,
  Canadá: flagCa,
  México: flagMx,
  India: flagIn,
  Francia: flagFr,
  Alemania: flagDe,
  Egipto: flagEg,
  "Emiratos Árabes": flagAe,
  Italia: flagIt,
};

/** Bandera de la embajada en la posición `i` de EMBASSIES (mismo orden en todos
 * los idiomas) */
export const embassyFlag = (i: number) => EMBASSY_FLAGS[EMBASSIES[i]];

/** Logo de cada embajada, por su nombre en español ("ratio" = ancho / alto) */
export const EMBASSY_LOGOS: Record<string, { src: string; ratio: number }> = {
  "Estados Unidos": { src: logoUs, ratio: 1 },
  España: { src: logoEs, ratio: 0.97 },
  Canadá: { src: logoCa, ratio: 4.18 },
  México: { src: logoMx, ratio: 1.5 },
  India: { src: logoIn, ratio: 0.63 },
  Francia: { src: logoFr, ratio: 1.1 },
  Alemania: { src: logoDe, ratio: 1.82 },
  Egipto: { src: logoEg, ratio: 0.73 },
  "Emiratos Árabes": { src: logoAe, ratio: 0.78 },
  Italia: { src: logoIt, ratio: 0.88 },
};
export const embassyLogo = (i: number) => EMBASSY_LOGOS[EMBASSIES[i]];

/** Logos de clientes con las embajadas repartidas entre ellos (franja del hero) */
export function logosWithEmbassies<E>(embassies: E[]) {
  const items: (
    | { kind: "logo"; logo: (typeof CLIENT_LOGOS)[number] }
    | { kind: "embassy"; embassy: E; logo: { src: string; ratio: number } }
  )[] = [];
  const n = CLIENT_LOGOS.length;
  CLIENT_LOGOS.forEach((logo, i) => {
    items.push({ kind: "logo", logo });
    const from = Math.floor((i * embassies.length) / n);
    const to = Math.floor(((i + 1) * embassies.length) / n);
    for (let k = from; k < to; k++)
      items.push({ kind: "embassy", embassy: embassies[k], logo: embassyLogo(k) });
  });
  return items;
}

// Altura que iguala el área visual de cada logo (los anchos se ven más bajos)
export const logoHeight = (ratio: number) =>
  Math.round(Math.min(46, Math.max(18, Math.sqrt(3600 / ratio))));
