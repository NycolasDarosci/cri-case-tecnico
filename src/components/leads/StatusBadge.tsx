import { cn } from "@/lib/utils";
import { ORIGEM_LABEL, STATUS_LABEL, type LeadOrigem, type LeadStatus } from "@/lib/leads";

const statusStyles: Record<LeadStatus, string> = {
  novo: "bg-status-novo/12 text-status-novo",
  em_contato: "bg-status-contato/15 text-[color-mix(in_oklab,var(--status-contato),black_35%)]",
  qualificado: "bg-status-qualificado/12 text-status-qualificado",
  perdido: "bg-status-perdido/10 text-status-perdido",
};
const dotStyles: Record<LeadStatus, string> = {
  novo: "bg-status-novo",
  em_contato: "bg-status-contato",
  qualificado: "bg-status-qualificado",
  perdido: "bg-status-perdido",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OrigemBadge({ origem }: { origem: LeadOrigem }) {
  return (
    <span className={cn(
      "inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
      origem === "whatsapp" ? "border-whatsapp/30 text-whatsapp" : "border-border text-muted-foreground",
    )}>
      {ORIGEM_LABEL[origem]}
    </span>
  );
}
