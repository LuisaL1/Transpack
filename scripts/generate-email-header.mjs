// Genera public/brand/email-header.png: el banner de los correos del sitio
// (api/contact.ts). Es una IMAGEN porque Gmail en modo oscuro invierte los
// colores del HTML y los clientes de correo ignoran las transformaciones CSS
// (el cuadrado girado no se puede hacer en el correo). Ver docs/formularios.md.
//
// Uso: pnpm email:header   (necesita internet para cargar IBM Plex Sans)
//
// Mismos elementos del sitio: fondo azul de marca, logo en su versión para
// fondos oscuros (ícono con borde blanco + "TRANSPACK" en blanco, como en
// components/layout/Logo.tsx), el cuadrado naranja translúcido girado 45° del
// encabezado del chat y del menú (con puntas redondeadas) y el patrón de puntos
// del inicio (sutil).
import { chromium } from "@playwright/test";
import fs from "node:fs";

const OUT = "public/brand/email-header.png";
const logo = fs.readFileSync("public/brand/logo.png").toString("base64");

// 560 × 110 px de CSS, renderizado a 2x → 1120 × 220 px
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@700&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; }
  .banner { position: relative; width: 560px; height: 110px; overflow: hidden; background: #272B7C; }
  /* Patrón de puntos del inicio (Hero.tsx), muy sutil y solo hacia la derecha */
  .dots { position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,255,255,.22) 1.1px, transparent 1.5px);
    background-size: 9px 9px;
    -webkit-mask-image: linear-gradient(90deg, transparent 35%, #000 100%);
            mask-image: linear-gradient(90deg, transparent 35%, #000 100%); }
  /* Cuadrado del encabezado del chat y del menú: naranja al 25 %, girado 45°, esquinas redondeadas */
  /* Se deja ver más de la mitad (dos puntas) para que se note el redondeo */
  .square { position: absolute; right: -18px; top: -52px; width: 104px; height: 104px;
    transform: rotate(45deg); border-radius: 26%; background: rgba(255,118,25,.25); }
  .logo { position: absolute; left: 28px; top: 0; bottom: 0; display: flex; align-items: center; gap: 14px; }
  .logo img { width: 52px; height: 52px; border-radius: 4px; box-shadow: 0 0 0 1.5px rgba(255,255,255,.5); }
  .logo span { font-family: "IBM Plex Sans", sans-serif; font-weight: 700; font-size: 25px;
    letter-spacing: .08em; color: #fff; }
</style></head><body>
<div class="banner">
  <div class="dots"></div>
  <div class="square"></div>
  <div class="logo"><img src="data:image/png;base64,${logo}" alt=""><span>TRANSPACK</span></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 560, height: 110 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.locator(".banner").screenshot({ path: OUT });
await browser.close();
console.log(`${OUT}: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
