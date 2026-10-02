import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY não configurada");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      systemInstruction: systemPrompt,
    });
    const userPrompt = `Lead: ${data.nome}, Imóvel de Interesse: ${data.imovel_interesse}`.trim();
    let text = "";
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const result = await model.generateContent(userPrompt);
        text = result.response.text().trim();
        break;
      } catch (error) {
        const isTemporary = error instanceof Error && /503|high demand|unavailable/i.test(error.message);
        if (!isTemporary || attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
      }
    }
    if (!text) throw new Error("Resposta vazia da IA");
    return { message: text };
  });
