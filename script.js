// appData carregado via data.js

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
const wizardDynamicTitle = document.getElementById('wizard-dynamic-title');

let currentTool = '';
let currentStep = 1;
let userSelections = {
    objective: null,
    tone: null
};

// toolConfigs carregado via data.js

function openTool(toolType) {
    currentTool = toolType;
    currentStep = 1;
    userSelections = { objective: null, tone: null };

    modal.classList.add('active');

    // Reset Title
    if (wizardDynamicTitle) {
        wizardDynamicTitle.innerText = '';
        wizardDynamicTitle.classList.remove('visible');
    }

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
                    <div class="option-card" onclick="selectOption('${selectionKey}', '${opt.id}', '${opt.title}')">
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

function selectOption(key, value, title) {
    userSelections[key] = value;

    // Update Dynamic Title
    if (wizardDynamicTitle && title) {
        // Fade out
        wizardDynamicTitle.classList.remove('visible');

        setTimeout(() => {
            wizardDynamicTitle.innerText = title;
            wizardDynamicTitle.classList.add('visible');
        }, 200); // Wait for fade out
    }

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
            <button class="btn-back" onclick="currentStep=1; renderWizard(); if(wizardDynamicTitle){wizardDynamicTitle.innerText=''; wizardDynamicTitle.classList.remove('visible');}">Nova Criação</button>
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
