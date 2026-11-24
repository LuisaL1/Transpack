import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QuoteWizard } from "@/components/home/QuoteWizard";

describe("Cotizador", () => {
  it("al elegir el servicio pasa al paso 2 con los campos de ese servicio", async () => {
    render(
      <MemoryRouter>
        <QuoteWizard />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Mudanza internacional/ }));
    expect(await screen.findByText("País de origen")).toBeInTheDocument();
    expect(screen.getByText(/Paso 2/)).toBeInTheDocument();
  });

  it("no avanza sin los datos obligatorios y explica qué falta", async () => {
    render(
      <MemoryRouter>
        <QuoteWizard initialService="internacional" />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByRole("button", { name: /Continuar/ }));
    expect(screen.getByText("Indica el país de origen.")).toBeInTheDocument();
  });

  it("acepta preselección por URL y muestra los textos en el idioma de la ruta", async () => {
    render(
      <MemoryRouter initialEntries={["/en"]}>
        <QuoteWizard initialService="bodegaje" />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/Step 2/)).toBeInTheDocument();
  });
});

