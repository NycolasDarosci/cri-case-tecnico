import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-navy text-navy-foreground",
  novo: "bg-card border-l-4 border-l-status-novo",
  contato: "bg-card border-l-4 border-l-status-contato",
  qualificado: "bg-card border-l-4 border-l-status-qualificado",
  perdido: "bg-card border-l-4 border-l-status-perdido",
} as const;

export function KpiCard({ label, value, tone }: { label: string; value: number; tone: keyof typeof tones }) {
  const dark = tone === "neutral";
  return (
    <div className={cn("rounded-xl p-5 shadow-card", tones[tone])}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider", dark ? "text-navy-foreground/70" : "text-muted-foreground")}>{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
