import { expect, test, type Locator, type Page } from "@playwright/test";

// Abre el chat y espera a que Joel termine de saludar (mientras escribe, el
// chat no recibe mensajes nuevos).
async function openChat(page: Page) {
  // Si el build tiene Google Analytics, el aviso de cookies tapa el botón en celular
  const cookies = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await cookies.isVisible().catch(() => false))
    await cookies.getByRole("button", { name: "Rechazar" }).click();
  await page.getByRole("button", { name: /Hablar con Joel, asesor virtual/ }).click();
  const chat = page.getByRole("region", { name: "Chat con Joel" });
  await expect(chat.getByRole("button", { name: "Quiero cotizar una mudanza" })).toBeVisible({
    timeout: 10_000,
  });
  return chat;
}

// Escribe y envía como lo haría una persona: espera a que el botón Enviar se
// active (el texto ya quedó registrado) y lo pulsa.
async function send(chat: Locator, text: string) {
  await chat.getByRole("textbox", { name: "Mensaje" }).fill(text);
  const button = chat.getByRole("button", { name: "Enviar" });
  await expect(button).toBeEnabled();
  await button.click();
}

// Chat con un asesor (Zoho SalesIQ) simulado: nunca se carga el script real.
// Imita la API que usa src/lib/crmChat.ts y deja registro en window.__zoho
// (de la página aislada public/chat-asesor.html, donde corre el widget).
const ZOHO_STUB = `(() => {
  const z = window.$zoho.salesiq, log = (window.__zoho = { calls: [], sent: [] }), cb = {};
  z.language = (l) => log.calls.push("language:" + l);
  z.floatbutton = { visible: (v) => log.calls.push("button:" + v) };
  z.floatwindow = {
    visible: (v) => { log.calls.push("window:" + v); if (v === "show") cb.open && cb.open(); if (v === "hide") cb.close && cb.close(); },
    open: (f) => (cb.open = f), close: (f) => (cb.close = f), minimize: (f) => (cb.min = f),
  };
  window.__closeZoho = () => cb.close && cb.close();
  // Ventana de Zoho falsa (iframe del mismo origen, como la real): inicio con
  // "Chatee con nosotros ahora"; al escribir, responde una asesora de prueba.
  const f = document.createElement("iframe"); f.id = "siq_chatwindow"; document.body.appendChild(f);
  const d = f.contentDocument;
  d.body.innerHTML = '<div class="home-icon-optns"><em class="siqico-chat-start"></em>Chatee con nosotros ahora</div><div id="scroll-container"></div>';
  d.querySelector(".home-icon-optns").addEventListener("click", () => {
    const ta = d.createElement("textarea"); ta.className = "siqcw-textarea"; d.body.appendChild(ta);
    ta.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      log.sent.push(ta.value);
      const v = d.createElement("div"); v.setAttribute("data-zsqa", "visitor_msg message_bubble");
      v.innerHTML = '<span data-zsqa="msg"></span>'; v.firstChild.textContent = ta.value;
      d.getElementById("scroll-container").appendChild(v);
      if (log.sent.length > 1) return;
      setTimeout(() => {
        const g = d.createElement("div"); g.className = "siqcw-agentmsg-grp";
        g.innerHTML = '<div class="siqcw-name-div">Laura</div><div class="chat-bubble-cont" id="a1" data-zsqa="agent_msg message_bubble"><span data-zsqa="msg">¡Hola! Soy Laura. ¿En qué te ayudo?</span><div class="tag-div">Mudanza local</div></div>';
        d.getElementById("scroll-container").appendChild(g);
      }, 300);
    });
  });
  setTimeout(() => z.ready && z.ready(), 50);
})();`;

async function mockZoho(page: Page) {
  const requests: string[] = [];
  await page.route("https://salesiq.zohopublic.com/**", (r) => {
    requests.push(r.request().url());
    return r.fulfill({ contentType: "text/javascript", body: ZOHO_STUB });
  });
  return requests;
}

// Recorridos principales del visitante.
test("menú Servicios lleva a la página del servicio", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByRole("button", { name: "Servicios", exact: true }).click();
  } else {
    await page.getByRole("button", { name: "Servicios", exact: true }).hover();
  }
  await page
    .getByRole("link", { name: /Bodegaje/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/servicios\/bodegaje/);
  await expect(page.locator("h1")).toContainText("Un lugar seguro");
});

test("buscador encuentra un servicio sin tildes y lleva a él", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Buscar en el sitio/ })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "Buscar en el sitio" });
  await dialog.getByRole("textbox").fill("gestion aduanera");
  await dialog
    .getByRole("button", { name: /Gestión documental y aduanera/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/servicios\/gestion-aduanera/);
});

test("cotizador: preselección por URL y validación", async ({ page }) => {
  await page.goto("/?servicio=internacional#cotizar");
  const form = page.locator("#cotizar form");
  await expect(form.getByText("País de origen")).toBeVisible();
  await form.getByRole("button", { name: "Continuar" }).click();
  await expect(form.getByText("Indica el país de origen.")).toBeVisible();
});

test("soluciones: el menú abre el segmento pedido", async ({ page }) => {
  await page.goto("/?segmento=diplomatic#soluciones");
  await expect(page.getByRole("tab", { name: /Diplomatic/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("chat de Joel entiende texto libre y no inventa precios", async ({ page }) => {
  await page.goto("/");
  const chat = await openChat(page);
  await send(chat, "me trasladan a Alemania en dos meses");
  await expect(chat.getByText(/te mudas a Alemania/)).toBeVisible({ timeout: 15_000 });
  // Espera a que termine de responder (aparecen sus opciones)
  await expect(chat.getByRole("button", { name: "Empezar mi mudanza internacional" })).toBeVisible({
    timeout: 15_000,
  });
  await send(chat, "y cuanto vale?");
  await expect(chat.getByText(/No es una tarifa fija/)).toBeVisible({ timeout: 15_000 });
  await expect(chat).not.toContainText(/\$\s?\d{2,}|\d+\s?(COP|USD)/);
});

test("chat: el texto del visitante se muestra como texto, nunca como HTML", async ({ page }) => {
  await page.goto("/");
  const chat = await openChat(page);
  await send(chat, '<img src=x onerror="window.__xss=1">');
  await expect(chat.getByText('<img src=x onerror="window.__xss=1">')).toBeVisible();
  expect(
    await page.evaluate(() => (window as unknown as { __xss?: number }).__xss),
  ).toBeUndefined();
});

test("sin API, el chat con un asesor va por el puente con Zoho, dentro de Joel", async ({
  page,
}) => {
  await page.route("**/api/advisor", (r) => r.fulfill({ json: { configured: false } }));
  const requests = await mockZoho(page);
  await page.goto("/");
  const chat = await openChat(page);
  // Joel funciona sin cargar Zoho
  expect(requests).toEqual([]);
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click();
  await expect(chat.getByText(/nuestra plataforma de atención \(Zoho SalesIQ\)/)).toBeVisible({
    timeout: 10_000,
  });
  await chat.getByRole("button", { name: "Chatear con un asesor" }).click();
  await expect(chat.getByText(/Cuéntame en un mensaje/)).toBeVisible();
  expect(requests).toEqual([]);
  // La pregunta abre la conversación en el Zoho escondido
  await send(chat, "Quiero cotizar una mudanza");
  await expect.poll(() => requests.length).toBe(1);
  // Registro del Zoho simulado, dentro de la página aislada
  const zoho = () =>
    page.evaluate(
      () =>
        (
          (document.getElementById("tp-zoho-frame") as HTMLIFrameElement | null)
            ?.contentWindow as unknown as { __zoho?: { calls: string[]; sent: string[] } } | null
        )?.__zoho,
    );
  await expect.poll(async () => (await zoho())?.sent).toEqual(["Quiero cotizar una mudanza"]);
  expect((await zoho())?.calls).toEqual(expect.arrayContaining(["language:es", "button:hide"]));
  // Zoho trabaja en la página aislada, escondida; Joel sigue a la vista
  await expect(page.locator("#tp-zoho-frame")).toBeAttached();
  await expect(page.locator("html")).not.toHaveClass(/tp-zoho-open/);
  await expect(chat).toBeVisible();
  // La respuesta de Zoho aparece en Joel, con el nombre y sus opciones
  await expect(chat.getByText("¡Hola! Soy Laura. ¿En qué te ayudo?")).toBeVisible({ timeout: 10_000 });
  await expect(chat.getByText("Laura", { exact: true })).toBeVisible();
  await chat.getByRole("button", { name: "Mudanza local" }).click();
  // Lo que el visitante escribe después va a Zoho
  await send(chat, "Somos dos personas");
  await expect.poll(async () => (await zoho())?.sent.at(-1)).toBe("Somos dos personas");
  // Volver con Joel termina el puente (la ventana de Zoho no se muestra)
  await chat.getByRole("button", { name: "Volver con Joel" }).click();
  await expect(chat.getByText(/Volviste conmigo/)).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/tp-zoho-open/);
});

test("al terminar una cotización con Joel, llega al chat de los asesores para seguimiento", async ({
  page,
}) => {
  await page.route("**/api/advisor", (r) => r.fulfill({ json: { configured: false } }));
  const requests = await mockZoho(page);
  await page.goto("/");
  const chat = await openChat(page);
  await chat.getByRole("button", { name: "Quiero cotizar una mudanza" }).click();
  await chat.getByRole("button", { name: "Mudanza local (en la misma ciudad)" }).click();
  await send(chat, "Chapinero");
  await send(chat, "Usaquén");
  await chat.getByRole("button", { name: "En 1–2 semanas" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Apartaestudio" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Integral: que se encarguen de todo" }).click({ timeout: 10_000 });
  await send(chat, "Luisa");
  await expect(chat.getByText(/¿A qué número de celular o WhatsApp/)).toBeVisible({ timeout: 10_000 });
  await send(chat, "123");
  await expect(chat.getByText(/Ese número no parece completo/)).toBeVisible({ timeout: 10_000 });
  await send(chat, "300 123 4567");
  await expect(chat.getByText(/Este es el resumen de tu solicitud/)).toBeVisible({ timeout: 10_000 });
  // Joel envía la cotización al chat de los asesores (Zoho escondido)
  await expect.poll(() => requests.length, { timeout: 15_000 }).toBe(1);
  const sent = () =>
    page.evaluate(
      () =>
        (
          (document.getElementById("tp-zoho-frame") as HTMLIFrameElement | null)
            ?.contentWindow as unknown as { __zoho?: { sent: string[] } } | null
        )?.__zoho?.sent ?? [],
    );
  await expect.poll(async () => (await sent())[0] ?? "", { timeout: 15_000 }).toContain(
    "NUEVA COTIZACIÓN para seguimiento",
  );
  const msg = (await sent())[0];
  expect(msg).toContain("Cliente: Luisa");
  expect(msg).toContain("Celular / WhatsApp: 300 123 4567");
  expect(msg).toContain("• Origen: Chapinero");
  await expect(chat.getByText(/Un asesor te contactará al 300 123 4567/)).toBeVisible();
  // La ventana queda escuchando: la respuesta del asesor aparece en Joel
  await expect(chat.getByText("¡Hola! Soy Laura. ¿En qué te ayudo?")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator("html")).not.toHaveClass(/tp-zoho-open/);
});

test("si el chat con un asesor no carga, Joel ofrece WhatsApp y el formulario", async ({
  page,
}) => {
  await page.route("**/api/advisor", (r) => r.fulfill({ json: { configured: false } }));
  await page.route("https://salesiq.zohopublic.com/**", (r) => r.abort());
  await page.goto("/");
  const chat = await openChat(page);
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click();
  await chat.getByRole("button", { name: "Chatear con un asesor" }).click();
  await send(chat, "Hola");
  await expect(chat.getByText("No pudimos abrir el chat con un asesor")).toBeVisible({
    timeout: 15_000,
  });
  await expect(chat.getByRole("link", { name: /Escribir por WhatsApp/ }).last()).toHaveAttribute(
    "href",
    /wa\.me/,
  );
  await chat.getByRole("link", { name: /Dejar un mensaje/ }).click();
  await expect(page.getByRole("dialog", { name: "Escríbenos" })).toBeVisible();
});

test("chat con un asesor dentro de Joel: se escribe y se responde ahí mismo", async ({
  page,
}) => {
  // /api/advisor simulado: nunca se conecta con Zoho en las pruebas
  const calls: { action?: string; question?: string; text?: string }[] = [];
  let polls = 0;
  await page.route("**/api/advisor", async (r) => {
    if (r.request().method() === "GET") return r.fulfill({ json: { configured: true } });
    const b = r.request().postDataJSON();
    calls.push(b);
    if (b.action === "start") return r.fulfill({ json: { ok: true, token: "pase.prueba" } });
    if (b.action === "poll" && ++polls === 2)
      return r.fulfill({
        json: {
          ok: true,
          messages: [
            { id: "1", seq: 1, from: "system", name: "Laura", text: "joined", time: 1 },
            { id: "2", seq: 2, from: "operator", name: "Laura", text: "¡Hola! ¿En qué te ayudo?", time: 2 },
          ],
        },
      });
    return r.fulfill({ json: { ok: true, messages: [] } });
  });
  let zoho = 0;
  await page.route("https://salesiq.zohopublic.com/**", (r) => (zoho++, r.abort()));
  await page.goto("/");
  const chat = await openChat(page);
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click();
  await chat.getByRole("button", { name: "Chatear con un asesor" }).click({ timeout: 10_000 });
  await expect(chat.getByText(/Cuéntame en un mensaje qué necesitas/)).toBeVisible();
  await expect(chat.getByText("Chat con un asesor de Transpack")).toBeVisible();
  // La primera pregunta abre la conversación
  await send(chat, "Quiero cotizar una mudanza a Canadá");
  await expect(chat.getByText(/ya le avisé a nuestro equipo/)).toBeVisible();
  expect(calls.find((c) => c.action === "start")?.question).toBe("Quiero cotizar una mudanza a Canadá");
  // La respuesta del asesor aparece en la ventana de Joel, con su nombre
  await expect(chat.getByText("Laura se unió a la conversación.")).toBeVisible({ timeout: 15_000 });
  await expect(chat.getByText("¡Hola! ¿En qué te ayudo?")).toBeVisible();
  // El visitante responde y el mensaje va al asesor (no al cerebro de Joel)
  await send(chat, "Somos dos personas");
  await expect.poll(() => calls.find((c) => c.action === "send")?.text).toBe("Somos dos personas");
  // Nunca se carga la ventana de Zoho
  expect(zoho).toBe(0);
  // Volver con Joel
  await chat.getByRole("button", { name: "Volver con Joel" }).click();
  await expect(chat.getByText(/Volviste conmigo/)).toBeVisible();
  await expect(chat.getByText("Chat con un asesor de Transpack")).toBeHidden();
});

test("cambio de idioma conserva la página", async ({ page, isMobile }) => {
  test.skip(isMobile, "En celular la franja de idiomas se oculta al desplazarse");
  await page.goto("/servicios/bodegaje");
  await page.getByRole("button", { name: "Elegir región e idioma" }).click();
  await page.getByRole("option", { name: /International/ }).click();
  await expect(page).toHaveURL(/\/en\/services\//);
  await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
});

test("el logo lleva al inicio y arriba, también estando ya en el inicio", async ({ page }) => {
  const logo = page.getByRole("link", { name: "Transpack, inicio" }).first();
  await page.goto("/nosotros");
  await logo.click();
  await expect(page).toHaveURL(/\/$/);
  // Ya en el inicio, más abajo: el logo vuelve arriba
  await page.mouse.wheel(0, 3000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await logo.click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBe(0);
  // Desde una sección del inicio (#cotizar), también
  await page.goto("/#cotizar");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await logo.click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBe(0);
});

// ─── Formularios con envío por correo ────────────────────────────────────────
// /api/contact se simula con page.route: nunca se envía un correo real.
async function closeCookies(page: Page) {
  const cookies = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await cookies.isVisible().catch(() => false))
    await cookies.getByRole("button", { name: "Rechazar" }).click();
}

test("formulario de contacto: se abre desde soporte, exige autorización y envía", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "El ícono de soporte está en la barra de escritorio");
  let sent: Record<string, unknown> | null = null;
  await page.route("**/api/contact", async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ json: { ok: true } });
  });
  await page.goto("/");
  await closeCookies(page);
  await page.getByRole("button", { name: "Soporte" }).first().hover();
  await page.getByRole("link", { name: /Escríbenos Formulario de contacto/ }).click();
  const dlg = page.getByRole("dialog", { name: "Escríbenos" });
  await expect(dlg).toBeVisible();
  await expect(dlg.locator("#ct-nombre")).toBeFocused();
  await dlg.locator("#ct-nombre").fill("Ana Prueba");
  await dlg.locator("#ct-email").fill("ana@empresa.com");
  await dlg.locator("#ct-motivo").selectOption("pqrs");
  await dlg.locator("#ct-mensaje").fill("Quisiera información.");
  // La autorización es obligatoria y no viene marcada
  await expect(dlg.locator("#ct-autorizacion")).not.toBeChecked();
  await dlg.getByRole("button", { name: /Enviar mensaje/ }).click();
  expect(
    await dlg
      .locator("#ct-autorizacion")
      .evaluate((el) => (el as HTMLInputElement).validity.valueMissing),
  ).toBe(true);
  expect(sent).toBeNull();
  await expect(dlg.getByRole("link", { name: "política de tratamiento de datos" })).toHaveAttribute(
    "href",
    "/privacidad",
  );
  await dlg.locator("#ct-autorizacion").check();
  await dlg.getByRole("button", { name: /Enviar mensaje/ }).click();
  await expect(dlg.getByText("¡Mensaje enviado!")).toBeVisible();
  await expect(dlg.getByText(/Un asesor te responderá a ana@empresa.com/)).toBeVisible();
  expect(sent).toMatchObject({
    kind: "contacto",
    topic: "pqrs",
    replyTo: { email: "ana@empresa.com", name: "Ana Prueba" },
    website: "",
    fields: { Motivo: "Peticiones, quejas, reclamos o sugerencias (PQRS)", "Autorización de datos": "Sí" },
  });
  // Esc cierra la ventana
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
});

test("formulario de contacto: se abre precargado y muestra el error con WhatsApp", async ({
  page,
}) => {
  await page.route("**/api/contact", (r) =>
    r.fulfill({ status: 503, json: { ok: false, error: "not-configured" } }),
  );
  await page.goto("/privacidad");
  await closeCookies(page);
  await page.getByRole("link", { name: "Abrir el formulario de contacto" }).first().click();
  const dlg = page.getByRole("dialog", { name: "Escríbenos" });
  await expect(dlg.locator("#ct-motivo")).toHaveValue("datos");
  await dlg.locator("#ct-nombre").fill("Ana");
  await dlg.locator("#ct-email").fill("ana@empresa.com");
  await dlg.locator("#ct-mensaje").fill("Quiero actualizar mis datos.");
  await dlg.locator("#ct-autorizacion").check();
  await dlg.getByRole("button", { name: /Enviar mensaje/ }).click();
  const alert = dlg.getByRole("alert");
  await expect(alert).toContainText("No pudimos enviar tu mensaje");
  await expect(alert.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /wa\.me/);
  // Clic afuera cierra
  await page.mouse.click(5, 5);
  await expect(dlg).toBeHidden();
});

test("cotizador: exige autorización, envía por correo y el WhatsApp lleva la solicitud", async ({
  page,
}) => {
  let sent: { kind?: string; subject?: string; fields?: Record<string, string> } | null = null;
  await page.route("**/api/contact", async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ json: { ok: true } });
  });
  await page.goto("/?servicio=local#cotizar");
  await closeCookies(page);
  const form = page.locator("#cotizar form");
  const next = () => form.getByRole("button", { name: /Continuar|Ver mi solicitud/ }).click();
  await form.locator('input[name="origen"]').fill("Chapinero");
  await form.locator('input[name="destino"]').fill("Usaquén");
  await next();
  await form.getByRole("button", { name: "Urgente · próximos días" }).click();
  await next();
  await next();
  await next();
  await form.locator('input[name="nombre"]').fill("Ana Prueba");
  await form.locator('input[name="telefono"]').fill("3000000000");
  await form.locator('input[name="email"]').fill("ana@empresa.com");
  await next();
  await expect(form.getByText("Debes autorizar el tratamiento de datos")).toBeVisible();
  await form.getByRole("checkbox").check();
  await next();

  const wa = form.getByRole("link", { name: /Enviar por WhatsApp/ });
  const href = decodeURIComponent((await wa.getAttribute("href")) ?? "");
  expect(href).toMatch(/^https:\/\/wa\.me\/573218115967\?text=/);
  expect(href).toContain("*Servicio:* Mudanza local");
  expect(href).toContain("*Nombre:* Ana Prueba");
  expect(href).toContain("*Autorización de datos:* Sí");

  await form.getByRole("button", { name: /Enviar por correo/ }).click();
  await expect(form.getByText(/Un asesor te responderá a ana@empresa.com/)).toBeVisible();
  expect(sent!.kind).toBe("cotizacion");
  expect(sent!.subject).toContain("Solicitud de cotización");
  expect(sent!.fields).toMatchObject({
    Origen: "Chapinero",
    Nombre: "Ana Prueba",
    Correo: "ana@empresa.com",
    "Autorización de datos": "Sí",
  });
});

test("la política de datos carga con la tabla de canales y el formulario", async ({ page }) => {
  await page.goto("/privacidad");
  await expect(page.locator("h1")).toHaveText("Política de tratamiento de datos personales");
  await expect(page.getByText(/mediante Brevo/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Abrir el formulario de contacto" }).first(),
  ).toHaveAttribute("href", "#contacto?motivo=datos");
});
