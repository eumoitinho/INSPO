"use client"

import TwoIaContent, { type ChatMessage } from "../../../../components/two-ia-content"

// TODO: A conversa inicial pode vir da API ou ser um estado padrão
const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "ia",
    content: (
      <p>Olá! Sou a Two IA, sua assistente de análise de dados. Como posso ajudar a otimizar suas campanhas hoje?</p>
    ),
  },
  {
    id: 2,
    role: "user",
    content: <p>Como está a performance da Catalisti este mês?</p>,
  },
  {
    id: 3,
    role: "ia",
    content: (
      <div className="space-y-4">
        <p>Baseado nos dados mais recentes, a Catalisti Holding está com excelente performance:</p>
        <div>
          <h4 className="font-semibold mb-1">Resumo Executivo:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Investimento: R$ 1.996,65 (+5.1% vs período anterior)</li>
            <li>Leads: 18 (+15.3% vs período anterior)</li>
            <li>ROAS: 1.35x (dentro da meta de 1.2x)</li>
            <li>CTR: 0.92% (acima da média do segmento: 0.65%)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Recomendações:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Aumentar budget da campanha "PESQUISA - SITE" em 20%</li>
            <li>Pausar campanha "BRANDING" com 0 conversões</li>
            <li>Testar anúncios em vídeo para mobile</li>
          </ul>
        </div>
      </div>
    ),
  },
]

const quickSuggestions = [
  "Analise o ROAS da Catalisti",
  "Compare performance mês anterior",
  "Otimize budget do Dr. Victor",
  "Identifique campanhas problemáticas",
  "Tendências dos últimos 90 dias",
  "Melhores horários para anúncios",
]

export default function TwoIaPage() {
  return <TwoIaContent initialMessages={initialMessages} quickSuggestions={quickSuggestions} />
}
