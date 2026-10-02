# Simplificar a geração de mensagens com Gemini

## Alterações
- Trocar o modelo para `gemini-3.1-flash-lite`.
- Remover o loop de tentativas e chamar `generateContent()` uma única vez.
- Remover a dependência e a validação Zod desta função, mantendo apenas a tipagem dos dados recebidos.

## Verificação
- Confirmar que a função continua retornando a mensagem gerada e que o app compila sem erros.
