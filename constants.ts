
import { Segment, ToolConfig } from './types';

export const APP_DATA: Record<string, Segment> = {
  'roupas': {
    id: 'roupas',
    name: 'Loja de Roupas',
    banner: 'Gerador de Looks IA',
    desc: 'Crie roteiros de provador e tendências.',
    icon: '👗',
    tools: {
      reels: 'Reels de Moda',
      calendar: 'Calendário Fashion',
      promo: 'Liquidação de Estoque',
      wa: 'Script de Venda (Look)',
      ads: 'Anúncio de Coleção'
    },
    checklist: [
      'Postar 3 Stories de provador',
      'Responder directs de tamanho',
      'Criar cupom "MODA10"',
      'Gravar vídeo de recebidos',
      'Enviar pós-venda para 5 clientes'
    ]
  },
  'barbearia': {
    id: 'barbearia',
    name: 'Barbearia',
    banner: 'Agenda Lotada IA',
    desc: 'Atraia clientes para os horários vagos.',
    icon: '✂️',
    tools: {
      reels: 'Reels de Corte',
      calendar: 'Dias de Pico',
      promo: 'Combo Barba + Cabelo',
      wa: 'Lembrete de Retorno',
      ads: 'Anúncio de Localização'
    },
    checklist: [
      'Postar foto de um degradê',
      'Limpar cadeiras e espelhos',
      'Postar horários de amanhã',
      'Gravar Reels de "Antes e Depois"',
      'Organizar estoque de pomadas'
    ]
  },
  'pet': {
    id: 'pet',
    name: 'Pet Shop',
    banner: 'Pet Marketing IA',
    desc: 'Aumente os agendamentos de banho e tosa.',
    icon: '🐾',
    tools: {
      reels: 'Reels de Pet',
      calendar: 'Semana do Banho',
      promo: 'Pacote Mensal Pet',
      wa: 'Aviso de Vacina',
      ads: 'Anúncio de Ração/Acessórios'
    },
    checklist: [
      'Postar pet cheiroso do dia',
      'Enviar lembrete de banho agendado',
      'Postar Story de brinquedo novo',
      'Dica de cuidado animal',
      'Organizar área de banho'
    ]
  },
  'delivery': {
    id: 'delivery',
    name: 'Restaurante',
    banner: 'Cardápio Irresistível IA',
    desc: 'Descrições de pratos que dão fome.',
    icon: '🍕',
    tools: {
      reels: 'Reels de Prato',
      calendar: 'Datas de Delivery',
      promo: 'Combo Almoço',
      wa: 'Cardápio do Dia',
      ads: 'Anúncio Raio 5km'
    },
    checklist: [
      'Postar foto do prato principal',
      'Checar estoque de embalagens',
      'Atualizar status do WhatsApp',
      'Responder 3 avaliações',
      'Criar cupom "FOME10"'
    ]
  },
  'odonto': {
    id: 'odonto',
    name: 'Clínica Odonto',
    banner: 'Sorriso de Milhões IA',
    desc: 'Capte novos pacientes com autoridade.',
    icon: '🦷',
    tools: {
      reels: 'Reels de Dica Odonto',
      calendar: 'Mês da Prevenção',
      promo: 'Avaliação Estética',
      wa: 'Confirmação de Consulta',
      ads: 'Anúncio Clareamento'
    },
    checklist: [
      'Postar dica de higiene bucal',
      'Confirmar pacientes de amanhã',
      'Postar foto da sala higienizada',
      'Story sobre clareamento',
      'Organizar agenda da semana'
    ]
  },
  'salao': {
    id: 'salao',
    name: 'Salão de Cabelos',
    banner: 'Beauty Pro IA',
    desc: 'Transforme seguidoras em clientes.',
    icon: '💇‍♀️',
    tools: {
      reels: 'Reels de Coloração',
      calendar: 'Semana da Hidratação',
      promo: 'Dia de Rainha',
      wa: 'Script Agendamento',
      ads: 'Anúncio Transformação'
    },
    checklist: [
      'Postar resultado de mechas',
      'Dica de produto para casa',
      'Limpar e esterilizar escovas',
      'Postar vídeo de finalização',
      'Conferir estoque de tintas'
    ]
  }
};

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  'reels': {
    title: 'Gerador de Reels IA',
    step1: {
      question: "Qual o objetivo desse vídeo?",
      options: [
        { id: 'venda', icon: '💰', title: 'Vender Agora', desc: 'Foco total em preço e conversão imediata.' },
        { id: 'engajar', icon: '🔥', title: 'Engajar / Viralizar', desc: 'Trend, humor ou curiosidade para alcance.' },
        { id: 'ensinar', icon: '🎓', title: 'Ensinar / Dica', desc: 'Tutorial de look ou dica de estilo.' }
      ]
    },
    step2: {
      question: "Qual o tom da comunicação?",
      options: [
        { id: 'urgente', icon: '⏰', title: 'Urgente', desc: 'Últimas peças, corre antes que acabe!' },
        { id: 'amiga', icon: '💯', title: 'Amigável', desc: 'Papo de amiga para amiga, leve e próximo.' },
        { id: 'luxo', icon: '✨', title: 'Elegante', desc: 'Sofisticado, minimalista e premium.' }
      ]
    }
  },
  'calendar': {
    title: 'Calendário de Conteúdo',
    step1: {
      question: "Qual o foco da semana?",
      options: [
        { id: 'lancamento', icon: '🚀', title: 'Lançamento', desc: 'Nova coleção chegando, gerar expectativa.' },
        { id: 'off', icon: '🏷️', title: 'Promoção / Off', desc: 'Queima de estoque, liquidação.' },
        { id: 'mix', icon: '🔄', title: 'Mix Variado', desc: 'Um pouco de tudo, conteúdo balanceado.' }
      ]
    },
    step2: {
      question: "Intensidade de postagem?",
      options: [
        { id: 'leve', icon: '🍃', title: 'Leve', desc: '1 post/dia + 3 stories. Sustentável.' },
        { id: 'heavy', icon: '⚡', title: 'Intenso', desc: '3 posts + 10 stories/dia. Máximo alcance.' }
      ]
    }
  },
  'promo': {
    title: 'Estratégia de Promoção',
    step1: {
      question: "O que você precisa?",
      options: [
        { id: 'criar', icon: '✨', title: 'Criar Promoção', desc: 'Criar uma nova campanha do zero.' },
        { id: 'melhorar', icon: '🔧', title: 'Melhorar Existente', desc: 'Otimizar promoção que já existe.' }
      ]
    },
    step2: {
      question: "Tipo de desconto?",
      options: [
        { id: 'percentual', icon: '%', title: 'Percentual', desc: 'Desconto em % (ex: 30% OFF).' },
        { id: 'combo', icon: '🎁', title: 'Combo/Kit', desc: 'Leve X, pague Y (ex: Leve 3, pague 2).' }
      ]
    }
  },
  'wa': {
    title: 'Script de WhatsApp',
    step1: {
      question: "Momento da conversa?",
      options: [
        { id: 'inicial', icon: '👋', title: 'Primeiro Contato', desc: 'Cliente perguntou pela primeira vez.' },
        { id: 'retorno', icon: '🔄', title: 'Retorno/Follow-up', desc: 'Cliente demonstrou interesse antes.' }
      ]
    },
    step2: {
      question: "Abordagem de venda?",
      options: [
        { id: 'consultiva', icon: '💬', title: 'Consultiva', desc: 'Fazer perguntas, entender necessidade.' },
        { id: 'direta', icon: '🎯', title: 'Direta', desc: 'Ir direto ao ponto, foco em fechar.' }
      ]
    }
  },
  'ads': {
    title: 'Gestor de Tráfego IA',
    step1: {
      question: "Olá! Sou seu gestor de tráfego. Você já domina a gestão de anúncios?",
      options: [
        { id: 'expert', icon: '🚀', title: 'Sim, já domino', desc: 'Sei gerenciar campanhas.' },
        { id: 'beginner', icon: '👶', title: 'Não, sou iniciante', desc: 'Nunca anunciei ou estou começando.' }
      ]
    },
    step2: {
      question: "Você já possui uma conta de anúncios configurada?",
      options: [
        { id: 'yes_account', icon: '✅', title: 'Sim', desc: 'Tudo pronto para rodar.' },
        { id: 'no_account', icon: '❌', title: 'Não', desc: 'Preciso de ajuda para criar.' }
      ]
    }
  }
};
