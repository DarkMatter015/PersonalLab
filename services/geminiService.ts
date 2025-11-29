import { GoogleGenAI } from "@google/genai";
import { Employee, Message, SessionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generatePersonaResponse = async (
  employee: Employee, 
  history: Message[], 
  userMessage: string,
  sessionType: SessionType
): Promise<string> => {
  
  if (!ai) {
    console.warn("No API Key found. Using heuristic simulation.");
    return simulateHeuristicResponse(employee, userMessage, sessionType);
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const contextMap: Record<SessionType, string> = {
      'FEEDBACK': 'Reunião de feedback de desempenho. Você está ouvindo o que seu gestor tem a dizer sobre seu trabalho recente.',
      'FIRING': 'Reunião de desligamento. Você está sendo demitido. Reaja emocionalmente de acordo com seu nível de Neuroticismo.',
      'CONFLICT': 'Resolução de conflito. Você está sendo confrontado sobre um problema interpessoal com outro colega.',
      'PROMOTION': 'Reunião de carreira. Você tem expectativas sobre seu futuro e salário.',
      'COACHING': 'Sessão de mentoria. Você está aqui para aprender, mas pode ter resistências dependendo da sua Abertura.'
    };

    // Construct system instruction based on OCEAN traits
    const systemInstruction = `
      Você está interpretando um funcionário chamado ${employee.name}, cargo: ${employee.role}.
      Idioma: PORTUGUÊS (Brasil).
      
      CONTEXTO DA REUNIÃO: ${contextMap[sessionType]}
      
      SEU PERFIL DE PERSONALIDADE (Escala 0-100):
      - Abertura: ${employee.traits.openness} (Alto = criativo/curioso, Baixo = conservador/resistente a mudanças)
      - Conscienciosidade: ${employee.traits.conscientiousness} (Alto = organizado/eficiente, Baixo = desleixado/improvisador)
      - Extroversão: ${employee.traits.extraversion} (Alto = falante/energético, Baixo = reservado/tímido)
      - Amabilidade: ${employee.traits.agreeableness} (Alto = compassivo/dócil, Baixo = crítico/desafiador)
      - Neuroticismo: ${employee.traits.neuroticism} (Alto = ansioso/defensivo/instável, Baixo = calmo/seguro)

      INSTRUÇÕES CRÍTICAS DE ATUAÇÃO:
      1. Mantenha a resposta curta (máximo 40 palavras).
      2. Se Neuroticismo > 70: Aja defensivamente, gagueje se for pressionado, mostre ansiedade.
      3. Se Amabilidade < 30: Seja seco, direto, questione a autoridade ou o feedback.
      4. Se Abertura < 30: Rejeite novas ideias ou mudanças de processo.
      5. Se for DEMISSÃO (FIRING) e Neuroticismo alto: Pode chorar, ficar em choque ou implorar.
      6. Se for DEMISSÃO (FIRING) e Amabilidade baixa: Fique com raiva, ameace processos ou seja sarcástico.
      
      Responda naturalmente ao input do gerente.
    `;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "...";
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Estou tendo problemas de conexão no momento. Podemos continuar depois?";
  }
};

// Fallback "Mock" Logic translated and updated
const simulateHeuristicResponse = (employee: Employee, input: string, type: SessionType): string => {
  const { neuroticism, agreeableness } = employee.traits;
  const lowerInput = input.toLowerCase();

  // Special Handling for Firing
  if (type === 'FIRING') {
      if (neuroticism > 60) return "O quê? Como assim? Eu... eu não esperava por isso. O que eu vou fazer agora?";
      if (agreeableness < 40) return "Sério? Depois de tudo que fiz? Isso é um erro enorme da sua parte.";
      return "Entendo. É uma notícia difícil, mas... quando é meu último dia?";
  }

  // General Heuristics
  if (neuroticism > 70) {
    if (lowerInput.includes("prazo") || lowerInput.includes("erro") || lowerInput.includes("problema")) {
      return "Eu... eu não queria causar problemas. A pressão está muito grande ultimamente.";
    }
    return "Você acha que meu trabalho está ruim? Eu sinto que todos estão me julgando.";
  }

  if (agreeableness > 70) {
    if (lowerInput.includes("mudar") || lowerInput.includes("novo")) {
      return "Claro, o que for melhor para o time. Conte comigo.";
    }
    return "Obrigado pelo feedback, chefe. Agradeço muito o tempo.";
  }

  if (agreeableness < 30) {
    return "Eu discordo. O jeito que faço funciona e traz resultados. Por que mudar?";
  }

  return "Entendi. Podemos ver os detalhes disso.";
};