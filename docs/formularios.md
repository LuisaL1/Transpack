# Formularios y envío de solicitudes (Brevo)

Todo contacto por correo del sitio pasa por formularios propios. Ningún enlace
abre el programa de correo del visitante, y ningún dato se envía a servicios de
formularios de terceros (FormSubmit, Formspree, etc.).

| Formulario | Dónde se abre | Qué envía |
| --- | --- | --- |
| **Formulario de contacto** (`src/components/layout/ContactModal.tsx`) | Panel de soporte, menú Contacto (escritorio y celular), sección de contacto del inicio, pie de página, chat de Joel ("Enviar un correo" y "Enviar por correo" del resumen), respuestas de Joel y política de datos | Nombre, empresa, correo, teléfono, motivo, mensaje, idioma (si no es español) y autorización de datos |
| **Cotizador** (`src/components/home/QuoteWizard.tsx`) | Sección `#cotizar` del inicio | Servicio y respuestas de cada paso, nombre, celular, correo, idioma y autorización de datos |

- **Enlaces:** cualquier enlace a `#contacto` abre el formulario. Con
  `contactHref({ motivo, mensaje, nombre, empresa })` (`src/data/contact.ts`)
  se abre con datos precargados, por ejemplo `#contacto?motivo=datos`. Así lo
  hace el chat al terminar una cotización (nombre, empresa y resumen).
- **Motivos:** cotización, información general, soporte, PQRS, datos personales
  (Ley 1581), trabajar con nosotros y otro. El correo al equipo llega siempre
  con el motivo en español.
- **Autorización:** ambos formularios exigen la casilla de **autorización de
  tratamiento de datos** (Ley 1581 de 2012), sin marcar por defecto y con enlace
  a `/privacidad`. El servidor la vuelve a verificar.
- **Cotizador:** el resumen ofrece dos botones:
  - "Enviar por WhatsApp": abre `wa.me` con toda la solicitud ya escrita, con
    negritas;
  - "Enviar por correo": envío directo por la función. Si el visitante no dejó
    correo en el paso de contacto, el resumen se lo pide para poder responderle.
- **Estados:** enviando, éxito ("Un asesor te responderá a {correo}") y error
  con la alternativa de WhatsApp.
- **Sin suscripción:** el sitio no tiene boletín. Si se agrega, debe llevar la
  misma casilla de autorización.

## Cómo viaja la información

```
Navegador ──POST /api/contact──► Función de Vercel (api/contact.ts) ──API de Brevo──► servicioalcliente@transpacksas.com
                                                                         └──────────► confirmación al visitante
```

- **Protección:**
  - rechaza envíos desde otros dominios (403);
  - valida el JSON (400), el correo, el número y el largo de los campos y la
    autorización (422);
  - el **campo trampa** `website` (oculto a las personas) hace que a los bots se
    les responda "ok" sin enviar nada;
  - escapa el HTML antes de armar el correo.
- **Correo al equipo:** tabla con los campos (más versión de texto), etiqueta
  `sitio-contacto` o `sitio-cotizacion` y **"Responder a" = el visitante**: basta
  con responderlo.
- **Confirmación automática:** el visitante recibe "Recibimos tu solicitud ·
  Transpack" **en su idioma** (los seis del sitio), con su nombre, el servicio o
  motivo, "a la mayor brevedad", WhatsApp, teléfonos y el enlace a la política
  de datos. Si responde, la respuesta llega a `LEADS_TO`. Si esta confirmación
  falla, la solicitud igual se da por enviada.
- **Secretos:** la clave de Brevo solo existe en el servidor y nunca llega al
  navegador. El navegador solo llama a `/api/contact`, por eso la CSP no cambia
  (`connect-src 'self'`).
- **Sin copia:** el sitio no guarda los datos; quedan en el correo de Transpack
  y en el registro de envíos de Brevo.

## Configuración (área encargada de Brevo)

1. En Brevo, **verifique el dominio** `transpacksas.com` agregando en el DNS los
   registros que Brevo indique: SPF, DKIM y DMARC. Como mínimo, verifique el
   remitente que se va a usar.
2. Cree una **clave de API**: SMTP & API → API Keys.
3. En Vercel → proyecto → **Settings → Environment Variables**, entorno
   **Production** (y Preview si se quiere probar ahí):

   | Variable | Valor | Obligatoria |
   | --- | --- | --- |
   | `BREVO_API_KEY` | La clave de API de Brevo. **Secreta**: nunca con prefijo `VITE_` | Sí |
   | `LEADS_TO` | Correo que recibe las solicitudes (por defecto `servicioalcliente@transpacksas.com`) | No |
   | `LEADS_FROM` | Remitente verificado en Brevo (por defecto `no-reply@transpacksas.com`) | No |
   | `LEADS_FROM_NAME` | Nombre del remitente (por defecto "Sitio web Transpack") | No |

4. **Vuelva a desplegar:** Deployments → último despliegue → Redeploy.
5. **Compruebe:**
   - abra `https://<dominio>/api/contact` en el navegador: debe responder
     `{"configured":true}` (no muestra la clave);
   - envíe una prueba desde el formulario y revise la bandeja de entrada (y la
     carpeta de spam la primera vez);
   - revise que llegue la confirmación al correo de prueba.

## Comportamiento sin clave y en desarrollo

- **Sin `BREVO_API_KEY`:** la función responde 503 `not-configured` y el
  formulario muestra el aviso de error con el enlace a WhatsApp. El cotizador
  sigue ofreciendo WhatsApp.
- **`pnpm dev`:** `/api/contact` se **simula** (`vite.config.ts`). No envía
  correos y muestra en la terminal lo que se habría enviado.
- **`pnpm preview` y pruebas de extremo a extremo:** la función no corre; las
  pruebas simulan `/api/contact` con `page.route`.

## Pruebas

No se envía ningún correo real en las pruebas.

- `tests/unit/contact-api.test.ts` (fetch simulado):
  - sin clave → 503;
  - correo o autorización inválidos → 422; JSON inválido → 400;
  - otro dominio → 403;
  - campo trampa → OK sin enviar;
  - destino correcto, "Responder a" del visitante y HTML escapado;
  - variables `LEADS_*`;
  - confirmación al visitante (2 llamadas, "Responder a" = `LEADS_TO`, en su
    idioma);
  - falla solo de la confirmación → 200; falla de Brevo → 502;
  - diagnóstico (GET) sin revelar la clave;
  - teléfonos, WhatsApp y rutas de la política iguales a los del sitio.
- `tests/security/static.test.ts`: ningún `mailto:` en el código y la clave de
  Brevo solo en `api/`.
- `tests/e2e/flows.spec.ts`:
  - el formulario se abre desde soporte, exige la autorización
    (`validity.valueMissing`) y envía;
  - se abre precargado desde la política, muestra el error con WhatsApp y se
    cierra con clic afuera;
  - el cotizador exige la autorización, envía por correo y el enlace de WhatsApp
    lleva la solicitud.
- `tests/e2e/analytics.spec.ts` (`pnpm test:ga`): el botón "Cambiar mi decisión
  sobre cookies" vuelve a mostrar el aviso.
