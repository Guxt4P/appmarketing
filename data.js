// Banco de dados ultra personalizado por segmento
const appData = {
    'roupas': {
        name: 'Loja de Roupas',
        banner: 'Gerador de Looks IA',
        desc: 'Crie roteiros de provador e tendências.',
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
        name: 'Barbearia',
        banner: 'Agenda Lotada IA',
        desc: 'Atraia clientes para os horários vagos.',
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
        name: 'Pet Shop',
        banner: 'Pet Marketing IA',
        desc: 'Aumente os agendamentos de banho e tosa.',
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
        name: 'Restaurante',
        banner: 'Cardápio Irresistível IA',
        desc: 'Descrições de pratos que dão fome.',
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
        name: 'Clínica Odonto',
        banner: 'Sorriso de Milhões IA',
        desc: 'Capte novos pacientes com autoridade.',
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
        name: 'Salão de Cabelos',
        banner: 'Beauty Pro IA',
        desc: 'Transforme seguidoras em clientes.',
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

// Configuração Rápida das Ferramentas (Micro-Brain)
const toolConfigs = {
    'reels': {
        title: 'Reels de Moda',
        step1: {
            question: "Qual o objetivo desse vídeo?",
            options: [
                { id: 'venda', icon: '💰', title: 'Vender Agora', desc: 'Foco total em preço e produto.' },
                { id: 'engajar', icon: '🔥', title: 'Engajar / Viralizar', desc: 'Trend, humor ou curiosidade.' },
                { id: 'ensinar', icon: '🎓', title: 'Ensinar / Dica', desc: 'Tutorial de look ou conservação.' }
            ]
        },
        step2: {
            question: "Qual o tom da legenda?",
            options: [
                { id: 'urgente', icon: '⏰', title: 'Urgente', desc: 'Últimas peças, corre!' },
                { id: 'amiga', icon: '👯‍♀️', title: 'Best Friend', desc: 'Papo de amiga pra amiga.' },
                { id: 'luxo', icon: '✨', title: 'Elegante / Luxo', desc: 'Sofisticado e minimalista.' }
            ]
        }
    },
    'calendar': {
        title: 'Calendário',
        step1: {
            question: "Qual o foco da semana?",
            options: [
                { id: 'lancamento', icon: '🚀', title: 'Lançamento', desc: 'Nova coleção chegando.' },
                { id: 'off', icon: '🏷️', title: 'Promoção / Off', desc: 'Queima de estoque.' },
                { id: 'mix', icon: '🔄', title: 'Mix de Conteúdo', desc: 'Um pouco de tudo.' }
            ]
        },
        step2: {
            question: "Intensidade de postagem?",
            options: [
                { id: 'leve', icon: '🍃', title: 'Leve', desc: '1 post por dia + 3 stories.' },
                { id: 'heavy', icon: '⚡', title: 'Intenso', desc: '3 posts + 10 stories/dia.' }
            ]
        }
    },
    // Fallback genérico para as outras ferramentas por enquanto
    'default': {
        title: 'Assistente IA',
        step1: {
            question: "O que você quer fazer?",
            options: [
                { id: 'criar', icon: '✨', title: 'Criar do Zero', desc: 'Me dê ideias novas.' },
                { id: 'melhorar', icon: '🔧', title: 'Melhorar Algo', desc: 'Já tenho uma, base.' }
            ]
        },
        step2: {
            question: "Estilo do texto?",
            options: [
                { id: 'curto', icon: '📝', title: 'Curto e Direto', desc: 'Pra quem não lê muito.' },
                { id: 'detalhado', icon: '📜', title: 'Detalhado', desc: 'Explicando tudo.' }
            ]
        }
    }
};
