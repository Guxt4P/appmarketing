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

document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const splash = document.getElementById('splash-screen');
    const segmentButtons = document.querySelectorAll('.segment-btn');
    const checklistContainer = document.getElementById('checklist-tasks');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentText = document.getElementById('progress-percent');
    const nextRewardText = document.getElementById('next-reward');
    const bannerTitle = document.getElementById('banner-title');
    const bannerDesc = document.getElementById('banner-desc');
    const segmentNameDisplay = document.getElementById('segment-name-display');

    // IDs das Ferramentas para troca de texto
    const toolTexts = {
        reels: document.getElementById('tool-reels-title'),
        calendar: document.getElementById('tool-calendar-title'),
        promo: document.getElementById('tool-promo-title'),
        wa: document.getElementById('tool-wa-title'),
        ads: document.getElementById('tool-ads-title')
    };

    // 1. Lógica da Splash Screen (2.5 segundos)
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.visibility = 'hidden';
        }, 600);
    }, 2500);

    // 2. Função de Renderização
    function renderSegment(id) {
        const data = appData[id];

        // Atualiza Segmento no Título
        segmentNameDisplay.innerText = data.name;

        // Atualiza Banner
        bannerTitle.innerText = data.banner;
        bannerDesc.innerText = data.desc;

        // Atualiza Textos das Ferramentas
        toolTexts.reels.innerText = data.tools.reels;
        toolTexts.calendar.innerText = data.tools.calendar;
        toolTexts.promo.innerText = data.tools.promo;
        toolTexts.wa.innerText = data.tools.wa;
        toolTexts.ads.innerText = data.tools.ads;

        // Renderiza Checklist
        checklistContainer.innerHTML = '';
        data.checklist.forEach((task, index) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `
                <input type="checkbox" id="task-${index}">
                <label for="task-${index}">${task}</label>
            `;
            checklistContainer.appendChild(li);
        });

        // Reatribui eventos aos novos checkboxes
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));

        resetProgressUI();
    }

    // 3. Lógica da Barra de Progresso
    function updateProgress() {
        const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(c => c.checked).length;
        const percentage = (checked / total) * 100;

        progressBar.style.width = `${percentage}%`;
        progressPercentText.innerText = `${Math.round(percentage)}%`;

        if (percentage === 100) {
            nextRewardText.innerHTML = "<strong>🏆 100%! Você liberou 10% OFF e a Plaquinha!</strong>";
            nextRewardText.style.color = "var(--green-success)";
            triggerWinEffect();
        } else {
            nextRewardText.innerText = `Faltam ${total - checked} ações para concluir`;
            nextRewardText.style.color = "var(--text-muted)";
        }
    }

    function resetProgressUI() {
        progressBar.style.width = '0%';
        progressPercentText.innerText = '0%';
        nextRewardText.innerText = "Faltam 5 tarefas para os 10% OFF";
    }

    function triggerWinEffect() {
        const box = document.querySelector('.gamification-box');
        box.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.4)";
        setTimeout(() => { box.style.boxShadow = "var(--shadow-md)"; }, 2000);
    }

    // 4. Eventos de Clique nos Segmentos
    segmentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSegment(btn.getAttribute('data-id'));
        });
    });

    // Inicializa com Roupas
    renderSegment('roupas');
});

/* --- LÓGICA DO WIZARD (Inteligência Guiada) --- */

const modal = document.getElementById('ai-modal');
const wizardBody = document.getElementById('wizard-body');
const wizardFooter = document.getElementById('wizard-footer');
const wizardDots = document.getElementById('wizard-dots');

let currentTool = '';
let currentStep = 1;
let userSelections = {
    objective: null,
    tone: null
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

function openTool(toolType) {
    currentTool = toolType;
    currentStep = 1;
    userSelections = { objective: null, tone: null };

    modal.classList.add('active');
    renderWizard();
}

function closeModal() {
    modal.classList.remove('active');
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function renderWizard() {
    updateDots();

    const config = toolConfigs[currentTool] || toolConfigs['default'];

    // RENDER PASSOS
    if (currentStep === 1) {
        renderOptionsStep(config.step1.question, config.step1.options, 'objective');
    } else if (currentStep === 2) {
        renderOptionsStep(config.step2.question, config.step2.options, 'tone');
    } else if (currentStep === 3) {
        renderLoadingAndResult();
    }
}

function renderOptionsStep(question, options, selectionKey) {
    wizardBody.innerHTML = `
        <div class="step-container active">
            <h3 class="step-title">${question}</h3>
            <div class="options-grid">
                ${options.map(opt => `
                    <div class="option-card" onclick="selectOption('${selectionKey}', '${opt.id}')">
                        <div class="option-icon">${opt.icon}</div>
                        <div class="option-info">
                            <h4>${opt.title}</h4>
                            <p>${opt.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Footer apenas com voltar se for passo 2
    wizardFooter.innerHTML = currentStep > 1 ? `<button class="btn-back" onclick="prevStep()">Voltar</button>` : '';
}

function selectOption(key, value) {
    userSelections[key] = value;
    nextStep();
}

function nextStep() {
    currentStep++;
    renderWizard();
}

function prevStep() {
    currentStep--;
    renderWizard();
}

function updateDots() {
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx + 1 === currentStep);
    });
}

function renderLoadingAndResult() {
    // 1. Loading State
    wizardBody.innerHTML = `
        <div class="wizard-loading">
            <div class="brain-loader">🧠</div>
            <h3>Criando mágica...</h3>
            <p>Conectando ideias para sua loja</p>
        </div>
    `;
    wizardFooter.innerHTML = '';

    // 2. Simulação de processamento (1.5s)
    setTimeout(() => {
        const resultText = generateMockAIResult();

        wizardBody.innerHTML = `
            <div class="step-container active">
                <div class="ai-result visible" style="display:block; margin-top:0;">
                    <h4><i class="fas fa-check-circle" style="color:var(--green-success)"></i> Resultado IA</h4>
                    <div class="result-content">${resultText}</div>
                </div>
            </div>
        `;

        wizardFooter.innerHTML = `
            <button class="btn-back" onclick="currentStep=1; renderWizard()">Nova Criação</button>
            <button class="btn-generate" onclick="copyToClipboard('${resultText.replace(/\n/g, '\\n')}')">Copiar Texto</button>
        `;
    }, 1500);
}

function generateMockAIResult() {
    // Lógica básica de combinação (mock)
    const { objective, tone } = userSelections;

    if (currentTool === 'reels') {
        if (objective === 'venda') return "🎥 **Roteiro Venda Rápida**\n\n1. (0-3s) Segure a peça na frente da câmera e diga: 'Olha o que acabou de chegar!'\n2. (3-6s) Zoom no detalhe do tecido.\n3. (6s+) 'Só tenho 3 unidades. Link na bio!'\n\n🔥 Legenda: Corre antes que acabe! #modafeminina";
        if (objective === 'engajar') return "🎥 **Roteiro Engajamento**\n\n1. Enquete visual: 'Qual look você usaria no primeiro encontro?'\n2. Mostre Look A (Romântico).\n3. Mostre Look B (Sexy).\n4. 'Comenta A ou B aqui embaixo!' ⬇️";
        return "🎥 **Roteiro Genérico**\n\nMostre os bastidores da loja chegando caixas novas. Isso gera curiosidade!";
    }

    if (currentTool === 'calendar') {
        if (objective === 'lancamento') return "📅 **Semana de Lançamento**\n\n- Seg: Spoiler (foto borrada)\n- Ter: Revelação do tema\n- Qua: Live de provador\n- Qui: Depoimentos de quem comprou\n- Sex: Vídeo 'Arrume-se Comigo'";
        return "📅 **Semana Mix**\n\n- Seg: Bom dia com café\n- Ter: Dica de look\n- Qua: Meme sobre pagar boletos\n- Qui: Produto estrela\n- Sex: Sextou com oferta!";
    }

    return "✨ **Resultado Inteligente**\n\nAqui está sua estratégia personalizada baseada em vender mais com um tom amigável. Use fotos claras e poste às 18h.";
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
}
