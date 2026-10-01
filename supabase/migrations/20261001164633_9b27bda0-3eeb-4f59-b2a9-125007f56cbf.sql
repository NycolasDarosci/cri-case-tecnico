CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone_contato text NOT NULL,
  imovel_interesse text NOT NULL,
  origem text NOT NULL CHECK (origem IN ('site','whatsapp','indicacao')),
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_contato','qualificado','perdido')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leads are readable" ON public.leads FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.leads (nome, telefone_contato, imovel_interesse, origem, status, created_at) VALUES
('Mariana Souza','47997654321','Cobertura Duplex – Praia Brava','site','novo', now() - interval '1 day'),
('Rafael Lima','47988123456','Apartamento 3 suítes – Balneário Camboriú','whatsapp','em_contato', now() - interval '2 days'),
('Juliana Martins','47999887766','Studio – Itajaí Centro','indicacao','qualificado', now() - interval '3 days'),
('Carlos Pereira','47991234567','Apartamento na planta – Itapema','site','perdido', now() - interval '5 days'),
('Fernanda Rocha','47996543210','Garden 2 quartos – Porto Belo','whatsapp','novo', now() - interval '6 hours'),
('Bruno Alves','47984561237','Frente mar – Balneário Camboriú','indicacao','em_contato', now() - interval '4 days'),
('Patrícia Gomes','47993216549','Apartamento 2 suítes – Praia Brava','site','qualificado', now() - interval '7 days'),
('Lucas Ferreira','47987452136','Cobertura – Itapema','whatsapp','novo', now() - interval '12 hours'),
('Aline Castro','47995874123','Apartamento 4 suítes – Balneário Camboriú','site','em_contato', now() - interval '8 days'),
('Thiago Ribeiro','47982365478','Loft – Itajaí Fazenda','indicacao','perdido', now() - interval '10 days');