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

test("cambio de idioma conserva la página", async ({ page, isMobile }) => {
  test.skip(isMobile, "En celular la franja de idiomas se oculta al desplazarse");
  await page.goto("/servicios/bodegaje");
  await page.getByRole("button", { name: "Elegir región e idioma" }).click();
  await page.getByRole("option", { name: /International/ }).click();
  await expect(page).toHaveURL(/\/en\/services\//);
  await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
});
