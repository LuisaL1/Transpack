// Logos de clientes para la franja del hero. Fuentes: Wikimedia Commons y
// Simple Icons (DHL usa la versión de Commons). Se muestran en un solo tono gris
// con CSS, así que los archivos pueden conservar sus colores originales.
// "ratio" = ancho / alto del logo, para que todos se vean del mismo peso visual.
import dhl from "@/imports/clientes/dhl.svg";
import mitsubishi from "@/imports/clientes/mitsubishi.svg";
import saintGobain from "@/imports/clientes/saintgobain.png";
import sumitomo from "@/imports/clientes/sumitomo.svg";
import holcim from "@/imports/clientes/holcim.svg";
import schneider from "@/imports/clientes/schneider.svg";
import mapfre from "@/imports/clientes/mapfre.svg";
import airLiquide from "@/imports/clientes/airliquide.svg";
import argos from "@/imports/clientes/argos.png";
import teleperformance from "@/imports/clientes/teleperformance.svg";
import pernodRicard from "@/imports/clientes/pernodricard.svg";
import m3 from "@/imports/clientes/3m.svg";
import santander from "@/imports/clientes/santander.svg";
import nexans from "@/imports/clientes/nexans.svg";
import cencosud from "@/imports/clientes/cencosud.svg";
import smartFit from "@/imports/clientes/smartfit.svg";

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

// Altura que iguala el área visual de cada logo (los anchos se ven más bajos)
export const logoHeight = (ratio: number) =>
  Math.round(Math.min(46, Math.max(18, Math.sqrt(3600 / ratio))));
