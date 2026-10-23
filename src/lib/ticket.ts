// Envía una solicitud a /api/ticket (función de Vercel → Zoho Desk: crea el
// contacto y el ticket). Mismo patrón que sendLead() (src/lib/leads.ts). Nunca
// se envía a servicios de terceros directos desde el navegador.

export type TicketInput = {
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
};
export type TicketResult =
  | { ok: true; ticketNumber: string | null }
  | { ok: false; error: string };

export async function sendTicket(input: TicketInput): Promise<TicketResult> {
  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      ticketNumber?: string | null;
      error?: string;
    };
    return res.ok && data.ok
      ? { ok: true, ticketNumber: data.ticketNumber ?? null }
      : { ok: false, error: data.error || `http-${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}
