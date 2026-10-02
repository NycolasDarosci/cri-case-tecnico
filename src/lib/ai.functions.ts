import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import OpenAI from "openai";

const systemPrompt = `
Você é um corretor de imóveis consultivo e atencioso da CRI Soluções Imobiliárias, especialista no mercado imobiliário de alto padrão do litoral de Santa Catarina (Itajaí, Praia Brava, Balneário Camboriú, Itapema e Porto Belo).
Sua tarefa é escrever a primeira mensagem de contato via WhatsApp para um novo lead.
Regras de Comunicação:
- Seja cordial, profissional e acolhedor.
- Mencione o nome do lead e o imóvel de interesse específico.
- Apresente-se brevemente como especialista da CRI Soluções Imobiliárias.
- Finalize com uma pergunta aberta / Chamada para Ação (CTA) suave para iniciar o diálogo (ex: perguntando se ele gostaria de receber o material completo ou agendar uma conversa).
- Mantenha o texto objetivo (no máximo 3 a 4 parágrafos curtos, ideal para leitura rápida no WhatsApp).
- Não invente preços ou dados técnicos que não foram fornecidos.
`.trim();

export const generateLeadMessage = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ nome: z.string().min(1).max(200), imovel_interesse: z.string().min(1).max(500) }).parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["OPENAI_API_KEY"];
    if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");
    const openai = new OpenAI({ apiKey });
    const userPrompt = `Lead: ${data.nome}, Imóvel de Interesse: ${data.imovel_interesse}`.trim();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("Resposta vazia da IA");
    return { message: text };
  });
