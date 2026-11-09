# Publicación en GoDaddy (hosting Node.js)

El sitio se publica en el hosting Node.js de GoDaddy (host.godaddy.com →
_My Apps_), conectado a este repositorio de GitHub, como **una sola app
Node.js**, sin PHP. GoDaddy compila la rama elegida y arranca
`server/server.mjs`, que hace todo lo que antes hacía Vercel:

| Qué                      | Dónde                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Páginas pre-generadas    | `dist/` (de `pnpm build`), con URLs limpias: `/nosotros` → `nosotros.html`               |
| `/x/` y `/x.html` → `/x` | `server/server.mjs` (redirección 308)                                                    |
| 404 real                 | `dist/404.html` con estado 404                                                           |
| Cabeceras (CSP, HSTS…)   | `hosting/headers.json` (la del chat, aparte para `/chat-asesor`)                         |
| Redirecciones            | `hosting/headers.json` (`/fr`, `/de`, `/it`, `/ar` → `/en`)                              |
| Formularios              | `/api/contact` → `api/contact.mjs` (Brevo), `/api/ticket` → `api/ticket.mjs` (Zoho Desk) |
| Videos del canal         | `/api/videos` → `api/videos.mjs` (YouTube, caché de 6 h)                                 |
| Compresión               | `.br`/`.gz` que deja `pnpm build` (`scripts/precompress.mjs`)                            |
| `www` y https            | `SITE_CANONICAL_HOST` (abajo)                                                            |

El servidor solo usa módulos de Node; las dependencias del proyecto solo se usan para compilar.

En local: `pnpm build && pnpm start` → http://localhost:3000 (igual que en
producción, sin redirección a `www`).

## 1. Configurar la app (una sola vez)

En host.godaddy.com → _My Apps_ → Transpack → _Settings_:

- **Fuente:** el repositorio de GitHub y la rama (`main`, o una rama de prueba).
- **Instalación:** `pnpm install` (o `npm install`).
- **Build:** `pnpm build` (o `npm run build`).
- **Inicio:** `pnpm start` (o `node server/server.mjs`). **Nunca `dev`**: el
  servidor de desarrollo de Vite no atiende los formularios ni pone las
  cabeceras, y el hosting no le deja abrir su puerto.
- **Node.js:** 22.
- El puerto lo asigna GoDaddy en `PORT`; el servidor lo lee y escucha en `0.0.0.0`.

**Variables de entorno** (misma pantalla; nunca en el repositorio):

| Variable                                                       | Para qué                                                                      |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `VITE_GA_MEASUREMENT_ID`                                       | Google Analytics (se lee al compilar)                                         |
| `VITE_SITE_INDEXABLE`                                          | `true` solo cuando el dominio apunte aquí (se lee al compilar, `docs/seo.md`) |
| `VITE_GOOGLE_SITE_VERIFICATION`                                | Opcional (se lee al compilar)                                                 |
| `BREVO_API_KEY`                                                | Clave de Brevo (`docs/formularios.md`). Secreta                               |
| `LEADS_TO`, `LEADS_TO_QUOTES`, `LEADS_FROM`, `LEADS_FROM_NAME` | Opcionales (`docs/formularios.md`)                                            |
| `ZOHO_*`                                                       | Credenciales de Zoho Desk (comentario de `api/ticket.mjs`)                    |
| `SITE_CANONICAL_HOST`                                          | `www.transpacksas.com` **solo después del cambio de DNS** (paso 6 abajo)      |

Las `VITE_*` se leen al compilar: después de cambiarlas, vuelva a desplegar.

**Brevo:** si la clave tiene restringidas las IP, autorice la IP de salida del
hosting (o quite la restricción).

## 2. Publicar un cambio

Cada push a la rama configurada se compila y publica en la vista previa
(`….airoapp.ai`). Cuando esté bien, publíquelo desde el panel de la app. La
integración continua de GitHub (`.github/workflows/ci.yml`) corre aparte.

## 3. Diagnóstico

- **Registros** (_Logs_ y _Registros de tiempo de ejecución_ en el panel). Cada
  línea empieza por su área y lleva **✓** si se cumplió o **✗** si falló; busque
  "✗" para ver solo los problemas. Nunca incluyen datos del visitante ni claves.

  | Línea                                                        | Qué significa                                                  |
  | ------------------------------------------------------------ | -------------------------------------------------------------- |
  | `[server] ✓ Sitio en http://localhost:… (Node …)`            | La app arrancó                                                 |
  | `[server] Variables: BREVO_API_KEY ✓ · …`                    | Qué variables ve la app (solo el nombre)                       |
  | `[server] ✗ No arrancó en el puerto …`                       | El puerto está ocupado o no permitido                          |
  | `[server] ✗ Error no controlado / Promesa rechazada`         | Error de código; la línea trae el detalle                      |
  | `[server] Deteniendo (SIGTERM)`                              | El hosting reinició o detuvo la app (normal al desplegar)      |
  | `[api] ✓ POST /api/contact → 200 (523 ms)`                   | Una llamada a /api: estado y tiempo                            |
  | `[contact] ✓ Solicitud de cotizacion enviada a …`            | El correo al equipo salió por Brevo                            |
  | `[contact] ✓ Confirmación enviada al visitante`              | El correo de confirmación salió                                |
  | `[contact] ✗ Rechazada (email/consent/origin…)`              | El formulario llegó incompleto o desde otro sitio              |
  | `[contact] ✗ No se envió: falta la variable …`               | Falta `BREVO_API_KEY`                                          |
  | `[contact] ✗ Brevo rechazó …` / `Brevo no respondió`         | Problema con Brevo (clave, IP autorizada, remitente)           |
  | `[contact] ✗ Bot detectado`                                  | Un bot llenó el campo trampa; no se envió nada                 |
  | `[videos] ✓ Canal leído: 1 videos y 43 Shorts`               | `/api/videos` leyó el canal de YouTube (cada 6 h como máximo)  |
  | `[videos] ✗ YouTube no respondió …`                          | Se entrega la última lista; Maestría Transpack usa la guardada |
  | `[ticket] ✓ Ticket #123 creado en Zoho Desk`                 | El ticket del cotizador se creó                                |
  | `[ticket] ✗ No se creó: faltan las variables …`              | Faltan credenciales de Zoho (dice cuáles)                      |
  | `[ticket] ✗ Zoho rechazó la solicitud (oauth-400/desk-401…)` | `oauth-…`: token o centro de datos; `desk-…`: permisos o plan  |

- **Reiniciar:** _Reiniciar la aplicación_ en el panel.
- **¿Formularios configurados?** `https://<dominio>/api/contact` responde
  `{"configured":true}` si existe `BREVO_API_KEY` (no la muestra).
- **Probar cabeceras:** `curl -I https://<dominio>/` y
  `curl -I https://<dominio>/chat-asesor`.
- **En local, igual que en el hosting:** `pnpm build && PORT=8080 pnpm start`.

## 4. Cambio de DNS (día de publicación)

El correo de `servicioalcliente@` y `mercadeo@` **no se debe caer**:

1. Averigüe dónde está el DNS: `dig NS transpacksas.com`.
2. **Copie todos los registros actuales** (captura o exportación) antes de tocar
   nada: MX, TXT (SPF, DKIM y DMARC del correo y de Brevo, verificaciones de
   Google), CNAME.
3. Pruebe el sitio en la vista previa de GoDaddy (`….airoapp.ai`), con
   `SITE_CANONICAL_HOST` vacía.
4. Baje el TTL de `@` y `www` a 300 un día antes. Conecte el dominio desde el
   panel de la app (_Conectar un dominio_) y cambie **solo** los registros `@` y
   `www` que GoDaddy indique.
   **No toque MX ni TXT.**
5. Verifique el candado (https) en `@` y `www`.
6. Ponga `SITE_CANONICAL_HOST=www.transpacksas.com` en la app y reiníciela: el
   dominio sin `www` y `http` pasan a `https://www.transpacksas.com` (301).
7. Envíe una vez el formulario de contacto y el cotizador reales y confirme que
   lleguen los correos y el ticket de Zoho Desk.
8. Siga la lista de `docs/seo.md` (indexación, Search Console).
9. Con todo funcionando: borre `vercel.json` y pause o elimine el proyecto de
   Vercel.
