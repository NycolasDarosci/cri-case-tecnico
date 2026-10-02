# 📋 Gestão de Leads — CRI Soluções Imobiliárias

Solução desenvolvida para o **Case Técnico de Desenvolvedor(a) Jr em Agentes de IA da CRI Soluções Imobiliárias**. 
A aplicação consiste em uma ferramenta interna de captação, gestão e engajamento automático de leads para o mercado imobiliário.

link: https://cri-gestao-leads.lovable.app/

---

## 🚀 1. O que foi construído

Foi desenvolvida uma interface CRM/Dashboard interna conectada a um banco de dados em tempo real e a um modelo de Inteligência Artificial:

* **Dashboard Comercial**: Exibição de KPIs dinâmicos (Total de Leads, Novos, Em Contato, Qualificados, Perdidos).
* **Gerenciamento e Filtros**: Listagem de leads com busca em tempo real por nome/imóvel e filtros por status e origem.
* **Sincronização em Tempo Real**: Estado do frontend sincronizado com o banco de dados (novos registros alimentam automaticamente o dashboard).
* **Agente de IA Integrado**: Botão *"Gerar mensagem"* em cada lead que aciona um modelo LLM para criar uma abordagem comercial personalizada via WhatsApp o outro canal de preferencia, considerando o nome do cliente e o imóvel de interesse.

---

## 🛠️ 2. Tecnologias Escolhidas e Justificativas

| Tecnologia                                   | Função no Projeto         | Justificativa                                                                                                                                     |
| :------------------------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lovable (React, Vite, Tailwind)**          | Frontend / Dashboard      | Permitiu a construção rápida de uma interface moderna, responsiva e fiel à identidade visual da CRI (paleta de cores, tipografia e espaçamentos). |
| **Supabase (PostgreSQL)**                    | Banco de Dados Relacional | Banco robusto, de fácil integração com React/JS client e suporte nativo a consultas e políticas de acesso.                                        |
| **Google Gemini AI (gemini-3.1-flash-lite)** | Agente de IA / LLM        | Excelente custo-benefício na camada gratuita, velocidade de resposta ideal para mensagens curtas e alta estabilidade de servidor.                 |

---

## 🛠️ 3. Dificuldades Encontradas e Soluções

### 1. **Permissões de Leitura no Supabase (RLS - Row-Level Security)**

* **Desafio**: Ao conectar o frontend, as consultas falhavam devido à proteção de RLS sem regra ativa para a chave pública (`anon`).
* **Solução**: Criação e habilitação de uma política de leitura (`SELECT`) direcionada para a tabela `leads`, permitindo a exibição pública controlada no dashboard.

### 2. **Escolha e Estabilidade do Provedor de LLM (Custo x Disponibilidade)**

* **Desafio**: A API da OpenAI não possui camada gratuita (*free tier*). Ao testar o Google Gemini, modelos padrão como `gemini-1.5-flash` apresentavam instabilidade temporária (`503 Service Unavailable`) devido ao volume de requisições globais.
* **Solução**: Análise da documentação da OpenAI e Google AI, optando pela migração para o modelo **`gemini-3.1-flash-lite`**. A mudança garantiu requisições estáveis, sem erros 503 e mantendo alta qualidade nas respostas.

### 3. **Engenharia de Prompt no Lovable**

* **Desafio**: Sendo uma ferramenta potente de geração de código, prompts genéricos geravam componentes indesejados, desvios de layout e falhas de seguranca.
* **Solução**: Estruturação de prompts detalhados e declarativos, especificando esquemas de dados, códigos hexadecimais de cores e comportamentos de modais.

---

## 🔮 4. O que faria diferente com mais tempo (Evoluções Futuras)

### Paginação e Lazy Loading (Infinite Scroll)

* Implementar busca paginada no Supabase (ex: 10 leads por página ou *infinite scroll*) para otimizar o consumo de memória e performance da rede em cenários com milhares de leads.

### Arquitetura Desacoplada de Backend (Python / Edge Functions)

* Mover a chamada do agente de IA do cliente para um microserviço isolado em Python (FastAPI) ou Supabase Edge Functions. Isso garante a separação clara de responsabilidades entre frontend e backend, alem de futuras integrações externas.

### Gerenciamento Seguro de API Keys

* Isolar e gerenciar as chaves de API exclusivamente no ambiente de servidor backend, evitando a exposição de variáveis no lado do cliente.

### Agendamento e Webhooks de WhatsApp

* Integrar a mensagem gerada diretamente com uma API oficial de WhatsApp (ex: Evolution API / Z-API) para envio automático ao mudar o status do lead para "Em Contato".

### Métricas de conversão por origem

* Adicionar gráficos e relatórios visuais  comparando a taxa de conversão (% de leads qualificados) por origem (`Site`, `WhatsApp`, `Indicação`). Isso permitiria à gestão da CRI identificar rapidamente qual canal traz os leads de maior valor e otimizar o investimento de marketing.
