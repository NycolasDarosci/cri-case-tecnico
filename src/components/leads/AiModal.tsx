import { useEffect, useState } from "react";
import { Copy, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateMessage, whatsappLink, type AiMessagePayload, type Lead } from "@/lib/leads";

export function AiModal({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (l: Lead) => {
    const payload: AiMessagePayload = { nome: l.nome, imovel_interesse: l.imovel_interesse };
    setLoading(true);
    try {
      setMessage(await generateMessage(payload));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      toast.error(
        msg.includes("429")
          ? "A conta do Gemini atingiu o limite de requisições. Aguarde um instante e tente novamente."
          : "Não foi possível gerar a mensagem.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lead) run(lead);
    else setMessage("");
  }, [lead]);

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    toast.success("Mensagem copiada!");
  };

  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sugestão de Resposta com IA</DialogTitle>
          <DialogDescription>Mensagem personalizada para iniciar o contato.</DialogDescription>
        </DialogHeader>
        {lead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 text-sm">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="truncate font-semibold">{lead.nome}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Imóvel de Interesse</p>
                <p className="truncate font-semibold">{lead.imovel_interesse}</p>
              </div>
            </div>
            <div className="relative min-h-32 rounded-lg border-l-4 border-l-primary bg-accent/50 p-4 text-sm leading-relaxed">
              {loading ? (
                <div className="flex h-24 items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Gerando mensagem…
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={copy} disabled={loading || !message} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-navy-foreground transition hover:bg-navy/90 disabled:opacity-50">
                <Copy className="h-4 w-4" /> Copiar Mensagem
              </button>
              <a
                href={message ? whatsappLink(lead.telefone_contato, message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={loading || !message}
              >
                <MessageCircle className="h-4 w-4" /> Abrir no WhatsApp
              </a>
            </div>
            <button onClick={() => run(lead)} disabled={loading} className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary">
              <RefreshCw className="h-3 w-3" /> Gerar outra sugestão
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
