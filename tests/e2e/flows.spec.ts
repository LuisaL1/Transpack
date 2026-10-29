import { expect, test, type Page } from "./fixtures";

// Botón flotante del chat (abre el widget de Zoho SalesIQ)
const launcher = (page: Page) =>
  page.getByRole("button", { name: /Hablar con Joelito, asesor virtual/ });

// Registro del Zoho simulado, dentro de la página aislada (#tp-zoho-frame)
const zohoLog = (page: Page) =>
  page.evaluate(
    () =>
      (
        (document.getElementById("tp-zoho-frame") as HTMLIFrameElement | null)
          ?.contentWindow as unknown as { __zoho?: { calls: string[]; sent: string[] } } | null
      )?.__zoho,
  );

// Chat con un asesor (Zoho SalesIQ) simulado: nunca se carga el script real
// (fixtures.ts lo bloquea; esta ruta lo reemplaza). Imita la API que usa
// src/lib/crmChat.ts y deja registro en window.__zoho de la página aislada.
const ZOHO_STUB = `(() => {
  const z = window.$zoho.salesiq, log = (window.__zoho = { calls: [], sent: [] }), cb = {};
  z.language = (l) => log.calls.push("language:" + l);
  z.floatbutton = { visible: (v) => log.calls.push("button:" + v) };
  z.floatwindow = {
    visible: (v) => { log.calls.push("window:" + v); if (v === "show") cb.open && cb.open(); if (v === "hide") cb.close && cb.close(); },
    open: (f) => (cb.open = f), close: (f) => (cb.close = f), minimize: (f) => (cb.min = f),
  };
  // Ventana de Zoho falsa (iframe del mismo origen, como la real): inicio con
  // "Chatee con nosotros ahora"; al pulsarlo, la conversación (campo de escribir).
  const f = document.createElement("iframe"); f.id = "siq_chatwindow"; document.body.appendChild(f);
  const d = f.contentDocument;
  d.body.innerHTML = '<div class="home-icon-optns"><em class="siqico-chat-start"></em>Chatee con nosotros ahora</div><div id="scroll-container"></div>';
  z.visitor = {
    // El bot proactivo saluda cuando el sitio avisa la acción personalizada
    customaction: (a) => {
      log.calls.push("action:" + a);
      setTimeout(() => {
        const g = d.createElement("div"); g.className = "siqcw-agentmsg-grp";
        g.innerHTML = '<div class="siqcw-name-div">Laura</div><div class="chat-bubble-cont" id="a1" data-zsqa="agent_msg message_bubble"><span data-zsqa="msg">¡Hola! Soy Laura. ¿En qué te ayudo?</span></div>';
        d.getElementById("scroll-container").appendChild(g);
      }, 300);
    },
    chat: (fn) => (cb.chat = fn),
  };
  d.querySelector(".home-icon-optns").addEventListener("click", () => {
    log.calls.push("new-conversation");
    const ta = d.createElement("textarea"); ta.className = "siqcw-textarea"; d.body.appendChild(ta);
    ta.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      log.sent.push(ta.value);
      cb.chat && cb.chat("v1", { question: ta.value });
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

test("portada: globo animado al lado del titular y botón para cotizar", async ({ page }) => {
  await page.goto("/");
  await closeCookies(page);
  await expect(
    page.getByRole("img", { name: "Mapa de destinos de Transpack desde Bogotá" }),
  ).toBeVisible();
  await expect(page.getByText("¿Qué necesitas hoy?")).toHaveCount(0);
  await page.getByRole("link", { name: "Cotiza tu mudanza" }).click();
  await expect(page).toHaveURL(/#cotizar/);
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
  await expect(page.getByRole("tab", { name: /Diplomático/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("chat: se precarga escondido y al tocar el ícono abre ya en la conversación", async ({
  page,
}) => {
  // Espera la precarga (cuando el navegador está libre) y abre y cierra el chat
  test.slow();
  const requests = await mockZoho(page);
  await page.goto("/");
  await closeCookies(page);
  // Precarga (el build de pruebas no lleva el aviso de cookies): Zoho se carga y
  // entra a una conversación sin mostrar la ventana ni enviar nada
  await expect.poll(() => requests.length).toBe(1);
  await expect
    .poll(async () => (await zohoLog(page))?.calls ?? [], { timeout: 15_000 })
    .toContain("new-conversation");
  await expect(page.locator("html")).not.toHaveClass(/tp-zoho-open/);
  const frame = page.locator("#tp-zoho-frame");
  await expect(frame).toHaveAttribute("aria-hidden", "true");

  // Al tocar el ícono: ventana a la vista, accesible, y el bot saluda
  await launcher(page).click();
  await expect(page.locator("html")).toHaveClass(/tp-zoho-open/);
  expect(await frame.getAttribute("aria-hidden")).toBeNull();
  const chat = page.frameLocator("#tp-zoho-frame").frameLocator("#siq_chatwindow");
  await expect(chat.locator("textarea")).toBeVisible();
  await expect(chat.getByText("¡Hola! Soy Laura. ¿En qué te ayudo?")).toBeVisible();
  const log = await zohoLog(page);
  expect(log?.calls).toEqual(
    expect.arrayContaining(["language:es", "button:hide", "action:abrir_chat_asesor"]),
  );
  expect(log?.sent).toEqual([]);

  // El botón flotante muestra la X y cierra la ventana
  await page.getByRole("button", { name: "Cerrar chat" }).click();
  await expect(page.locator("html")).not.toHaveClass(/tp-zoho-open/);
  await expect(frame).toHaveAttribute("aria-hidden", "true");

  // Reabrir: la conversación ya tiene mensajes, el bot no vuelve a saludar
  await launcher(page).click();
  await expect(page.locator("html")).toHaveClass(/tp-zoho-open/);
  expect((await zohoLog(page))?.calls.filter((c) => c.startsWith("action:"))).toHaveLength(1);
  expect(requests).toHaveLength(1);
});

test("si el chat con un asesor no carga, ofrece WhatsApp y el formulario", async ({ page }) => {
  // El script de Zoho no carga (bloqueado)
  await page.route("https://salesiq.zohopublic.com/**", (r) => r.abort());
  await page.goto("/");
  await closeCookies(page);
  await launcher(page).click();
  const chat = page.getByRole("region", { name: "Chat con Joelito" });
  await expect(chat.getByText("No pudimos abrir el chat con un asesor")).toBeVisible({
    timeout: 15_000,
  });
  await expect(chat.getByRole("link", { name: /Escribir por WhatsApp/ })).toHaveAttribute(
    "href",
    /wa\.me/,
  );
  await chat.getByRole("link", { name: /Dejar un mensaje/ }).click();
  await expect(page.getByRole("dialog", { name: "Escríbenos" })).toBeVisible();
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
    fields: {
      Motivo: "Peticiones, quejas, reclamos o sugerencias (PQRS)",
      "Autorización de datos": "Sí",
    },
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
  await expect(alert).toContainText("No pudimos enviar su mensaje");
  await expect(alert.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /wa\.me/);
  // Clic afuera cierra
  await page.mouse.click(5, 5);
  await expect(dlg).toBeHidden();
});

test("cotizador: exige autorización y envía la solicitud a un asesor (Zoho Desk)", async ({
  page,
}) => {
  let sent: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  } | null = null;
  await page.route("**/api/ticket", async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ json: { ok: true, ticketNumber: "101" } });
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

  // Al llegar al final, la solicitud se envía sola a un asesor y se confirma
  await expect(form.getByText(/Un asesor revisará su solicitud/)).toBeVisible();
  expect(sent).not.toBeNull();
  expect(sent!.name).toBe("Ana Prueba");
  expect(sent!.phone).toBe("3000000000");
  expect(sent!.email).toBe("ana@empresa.com");
  expect(sent!.subject).toContain("Solicitud de cotización");
  expect(sent!.message).toContain("Servicio: Mudanza local");
  expect(sent!.message).toContain("Nombre: Ana Prueba");
  expect(sent!.message).toContain("Autorización de datos: Sí");
});

test("la política de datos carga con la tabla de canales y el formulario", async ({ page }) => {
  await page.goto("/privacidad");
  await expect(page.locator("h1")).toHaveText("Política de tratamiento de datos personales");
  await expect(page.getByText(/mediante Brevo/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Abrir el formulario de contacto" }).first(),
  ).toHaveAttribute("href", "#contacto?motivo=datos");
});
