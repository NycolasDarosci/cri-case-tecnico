import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KpiCard } from "@/components/leads/KpiCard";
import { LeadTable } from "@/components/leads/LeadTable";
import { AiModal } from "@/components/leads/AiModal";
import { ORIGEM_LABEL, STATUS_LABEL, type Lead, type LeadOrigem, type LeadStatus } from "@/lib/leads";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gestão de Leads | CRI Soluções Imobiliárias" },
      { name: "description", content: "Painel interno para acompanhar e responder leads da CRI Soluções Imobiliárias." },
      { property: "og:title", content: "Gestão de Leads | CRI Soluções Imobiliárias" },
      { property: "og:description", content: "Painel interno para acompanhar e responder leads imobiliários." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-3xl font-extrabold italic tracking-tighter text-primary">CRI</span>
      <span className="text-[11px] font-semibold leading-tight">Soluções<br />Imobiliárias</span>
    </div>
  );
}

const selectCls = "h-11 rounded-xl border-0 bg-card px-4 text-sm font-medium shadow-card outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [status, setStatus] = useState<LeadStatus | "todos">("todos");
  const [origem, setOrigem] = useState<LeadOrigem | "todos">("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const counts = useMemo(() => {
    const c = { novo: 0, em_contato: 0, qualificado: 0, perdido: 0 };
    leads.forEach((l) => c[l.status]++);
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) =>
      (status === "todos" || l.status === status) &&
      (origem === "todos" || l.origem === origem) &&
      (!q || l.nome.toLowerCase().includes(q) || l.imovel_interesse.toLowerCase().includes(q)),
    );
  }, [leads, status, origem, search]);

  return (
    <div className="min-h-screen">
      <header className="bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <span className="hidden text-sm text-navy-foreground/70 sm:block">Painel interno</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-primary">CRM</p>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Leads</h1>
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1"><KpiCard label="Total Leads" value={leads.length} tone="neutral" /></div>
          <KpiCard label="Novos" value={counts.novo} tone="novo" />
          <KpiCard label="Em Contato" value={counts.em_contato} tone="contato" />
          <KpiCard label="Qualificados" value={counts.qualificado} tone="qualificado" />
          <KpiCard label="Perdidos" value={counts.perdido} tone="perdido" />
        </section>

        <section className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou imóvel…"
              maxLength={100}
              className={`${selectCls} w-full pl-11`}
            />
          </label>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "todos")} className={selectCls}>
            <option value="todos">Status: Todos</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select aria-label="Origem" value={origem} onChange={(e) => setOrigem(e.target.value as LeadOrigem | "todos")} className={selectCls}>
            <option value="todos">Origem: Todos</option>
            {Object.entries(ORIGEM_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </section>

        {isLoading ? (
          <div className="rounded-xl bg-card p-12 text-center text-muted-foreground shadow-card">Carregando leads…</div>
        ) : error ? (
          <div className="rounded-xl bg-card p-12 text-center text-destructive shadow-card">Erro ao carregar leads.</div>
        ) : (
          <LeadTable leads={filtered} onGenerate={setSelected} />
        )}
      </main>

      <AiModal lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
