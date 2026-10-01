import { MapPin, Sparkles } from "lucide-react";
import { formatDate, formatPhone, splitImovel, type Lead } from "@/lib/leads";
import { OrigemBadge, StatusBadge } from "./StatusBadge";

function Imovel({ value }: { value: string }) {
  const { titulo, local } = splitImovel(value);
  return (
    <div className="min-w-0">
      <p className="truncate font-medium">{titulo}</p>
      {local && (
        <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-primary" /> {local}
        </span>
      )}
    </div>
  );
}

function ActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
      <Sparkles className="h-4 w-4" /> Gerar mensagem
    </button>
  );
}

export function LeadTable({ leads, onGenerate }: { leads: Lead[]; onGenerate: (l: Lead) => void }) {
  if (leads.length === 0) {
    return <div className="rounded-xl bg-card p-12 text-center text-muted-foreground shadow-card">Nenhum lead encontrado com esses filtros.</div>;
  }
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-xl bg-card shadow-card lg:block">
        <table className="w-full text-sm">
          <thead className="bg-navy text-left text-xs uppercase tracking-wider text-navy-foreground">
            <tr>
              {["Nome", "Telefone", "Imóvel de Interesse", "Origem", "Status", "Criado em", "Ações"].map((h) => (
                <th key={h} className="px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((l) => (
              <tr key={l.id} className="transition hover:bg-muted/50">
                <td className="px-5 py-4 font-semibold">{l.nome}</td>
                <td className="whitespace-nowrap px-5 py-4 tabular-nums text-muted-foreground">{formatPhone(l.telefone_contato)}</td>
                <td className="max-w-xs px-5 py-4"><Imovel value={l.imovel_interesse} /></td>
                <td className="px-5 py-4"><OrigemBadge origem={l.origem} /></td>
                <td className="px-5 py-4"><StatusBadge status={l.status} /></td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{formatDate(l.created_at)}</td>
                <td className="px-5 py-4"><ActionButton onClick={() => onGenerate(l)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="grid gap-3 lg:hidden">
        {leads.map((l) => (
          <div key={l.id} className="rounded-xl bg-card p-4 shadow-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{l.nome}</p>
                <p className="text-sm tabular-nums text-muted-foreground">{formatPhone(l.telefone_contato)}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
            <div className="mt-3 text-sm"><Imovel value={l.imovel_interesse} /></div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <OrigemBadge origem={l.origem} /> {formatDate(l.created_at)}
              </div>
              <ActionButton onClick={() => onGenerate(l)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
