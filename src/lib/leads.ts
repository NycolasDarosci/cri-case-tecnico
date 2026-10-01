export type LeadOrigem = "site" | "whatsapp" | "indicacao";
export type LeadStatus = "novo" | "em_contato" | "qualificado" | "perdido";

export interface Lead {
  id: string;
  nome: string;
  telefone_contato: string;
  imovel_interesse: string;
  origem: LeadOrigem;
  status: LeadStatus;
  created_at: string;
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em Contato",
  qualificado: "Qualificado",
  perdido: "Perdido",
};

export const ORIGEM_LABEL: Record<LeadOrigem, string> = {
  site: "Site",
  whatsapp: "WhatsApp",
  indicacao: "Indicação",
};

export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/** Splits "Apartamento X – Praia Brava" into title + location tag. */
export function splitImovel(value: string) {
  const parts = value.split(/\s[–-]\s/);
  return parts.length > 1
    ? { titulo: parts.slice(0, -1).join(" – "), local: parts[parts.length - 1] }
    : { titulo: value, local: null };
}

export function whatsappLink(phone: string, message: string) {
  const d = phone.replace(/\D/g, "");
  const full = d.startsWith("55") ? d : `55${d}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}

/** Payload sent to the external Python/FastAPI message generator. */
export interface AiMessagePayload {
  nome: string;
  imovel_interesse: string;
}

/**
 * Hook point for the external FastAPI service.
 * Replace the body with: fetch(`${API_URL}/gerar-mensagem`, { method: "POST", body: JSON.stringify(payload) })
 */
export async function generateMessage(payload: AiMessagePayload): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  const primeiroNome = payload.nome.split(" ")[0];
  return `Olá ${primeiroNome}! Tudo bem? Aqui é da CRI Soluções Imobiliárias. Vi que você tem interesse no imóvel ${payload.imovel_interesse} e separei algumas informações exclusivas para você. Posso te enviar fotos, valores e agendar uma visita no melhor horário?`;
}
