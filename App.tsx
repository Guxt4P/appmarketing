
import React, { useState, useEffect, useCallback } from 'react';
import { View, Segment, AppStats, UserSelections, View as ViewEnum } from './types';
import { APP_DATA, TOOL_CONFIGS } from './constants';
import { generateMarketingContent } from './services/gemini';

// --- HELPER COMPONENTS ---

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-rose-500 animate-in fade-out duration-500">
      <div className="text-center">
        <div className="mb-4 animate-bounce">
          <i className="fas fa-rocket text-6xl text-white"></i>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wider">Marketing Hub</h1>
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 bg-white rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <header className="bg-[#1a1f3a] p-4 shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <i className="fas fa-rocket text-blue-500"></i>
        <span>Marketing Hub / <strong>Gustavo</strong></span>
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden">
        <img src="https://ui-avatars.com/api/?name=Gustavo&background=0066ff&color=fff" alt="Perfil" />
      </div>
    </div>
    <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
      <i className="fas fa-search text-gray-400"></i>
      <input type="text" placeholder="O que sua marca precisa hoje?" className="bg-transparent border-none outline-none flex-1 text-sm" />
    </div>
  </header>
);

const BottomNav: React.FC<{ active: ViewEnum; onChange: (v: ViewEnum) => void }> = ({ active, onChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#1a1f3a] border-t border-white/10 py-3 flex justify-around z-50">
    {[
      { id: ViewEnum.HOME, icon: 'fa-home', label: 'Início' },
      { id: ViewEnum.ADS, icon: 'fa-robot', label: 'IA Ads' },
      { id: ViewEnum.ACHIEVEMENTS, icon: 'fa-medal', label: 'Conquistas' },
      { id: ViewEnum.SETTINGS, icon: 'fa-cog', label: 'Ajustes' },
    ].map(item => (
      <button
        key={item.id}
        onClick={() => onChange(item.id)}
        className={`flex flex-col items-center gap-1 transition-colors ${active === item.id ? 'text-blue-500' : 'text-gray-500'}`}
      >
        <i className={`fas ${item.icon} text-lg`}></i>
        <span className="text-[10px] font-medium">{item.label}</span>
      </button>
    ))}
  </nav>
);

const SegmentNav: React.FC<{ activeId: string; onSelect: (id: string) => void }> = ({ activeId, onSelect }) => (
  <div className="px-4 py-6">
    <h3 className="text-gray-400 font-medium mb-4">Seu Segmento</h3>
    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
      {Object.values(APP_DATA).map(seg => (
        <button
          key={seg.id}
          onClick={() => onSelect(seg.id)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 min-w-[100px] transition-all
            ${activeId === seg.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-[#1a1f3a] hover:translate-y-[-4px]'}`}
        >
          <span className="text-3xl">{seg.icon}</span>
          <span className="text-xs whitespace-nowrap">{seg.name.split(' ')[1] || seg.name}</span>
        </button>
      ))}
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<ViewEnum>(ViewEnum.HOME);
  const [currentSegmentId, setCurrentSegmentId] = useState('roupas');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, number[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [selections, setSelections] = useState<UserSelections>({
    objective: null, objectiveTitle: '', tone: null, toneTitle: ''
  });
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [stats, setStats] = useState<AppStats>(() => {
    const saved = localStorage.getItem('marketing_hub_stats');
    if (saved) return JSON.parse(saved);
    return {
      tasksCompleted: 0,
      aiUsages: 0,
      streak: 1,
      segmentsExplored: ['roupas'],
      toolsUsed: [],
      financialPotential: 0,
      adsCampaign: { status: 'idle', startTime: null, level: null }
    };
  });

  useEffect(() => {
    localStorage.setItem('marketing_hub_stats', JSON.stringify(stats));
  }, [stats]);

  const currentSegment = APP_DATA[currentSegmentId];

  const handleTaskToggle = (index: number) => {
    const current = checkedTasks[currentSegmentId] || [];
    let next;
    if (current.includes(index)) {
      next = current.filter(i => i !== index);
      setStats(prev => ({ ...prev, tasksCompleted: Math.max(0, prev.tasksCompleted - 1) }));
    } else {
      next = [...current, index];
      setStats(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
    }
    
    setCheckedTasks({ ...checkedTasks, [currentSegmentId]: next });
  };

  const progress = ((checkedTasks[currentSegmentId]?.length || 0) / currentSegment.checklist.length) * 100;

  const openTool = (tool: string) => {
    setCurrentTool(tool);
    setWizardStep(1);
    setAiResult(null);
    setSelections({ objective: null, objectiveTitle: '', tone: null, toneTitle: '' });
    setIsModalOpen(true);
  };

  const nextStep = (selection: { key: 'objective' | 'tone', id: string, title: string }) => {
    const newSelections = {
      ...selections,
      [`${selection.key}`]: selection.id,
      [`${selection.key}Title`]: selection.title
    };
    setSelections(newSelections);

    if (wizardStep === 2) {
      handleGenerate(newSelections);
    } else {
      setWizardStep(prev => prev + 1);
    }
  };

  const handleGenerate = async (finalSelections: UserSelections) => {
    setLoadingAi(true);
    setWizardStep(3);
    
    const result = await generateMarketingContent(
      currentSegment.name,
      currentTool || 'Geral',
      finalSelections.objectiveTitle,
      finalSelections.toneTitle
    );
    
    setAiResult(result);
    setLoadingAi(false);
    setStats(prev => ({ 
      ...prev, 
      aiUsages: prev.aiUsages + 1,
      toolsUsed: Array.from(new Set([...prev.toolsUsed, currentTool!]))
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado com sucesso!');
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen max-w-lg mx-auto relative bg-[#0a0e27] shadow-2xl">
      <Header />

      <main className="pb-24">
        {activeView === ViewEnum.HOME && (
          <div className="animate-in slide-in-from-bottom-4">
            <SegmentNav activeId={currentSegmentId} onSelect={(id) => {
                setCurrentSegmentId(id);
                setStats(prev => ({ ...prev, segmentsExplored: Array.from(new Set([...prev.segmentsExplored, id])) }));
            }} />

            {/* Banner IA */}
            <div className="px-4 mb-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-rose-500 rounded-3xl p-6 shadow-xl">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold mb-2">NOVIDADE</span>
                <h2 className="text-xl font-bold mb-1">{currentSegment.banner}</h2>
                <p className="text-sm text-white/80">{currentSegment.desc}</p>
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-20">
                    <i className="fas fa-magic text-6xl"></i>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="px-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Ferramentas <span className="text-blue-500">{currentSegment.name.split(' ')[1]}</span></h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ToolCard 
                  title={currentSegment.tools.reels} 
                  icon="fa-video" 
                  color="bg-rose-500" 
                  onClick={() => openTool('reels')} 
                />
                <ToolCard 
                  title={currentSegment.tools.calendar} 
                  icon="fa-calendar-alt" 
                  color="bg-orange-500" 
                  onClick={() => openTool('calendar')} 
                />
                <ToolCard 
                  title={currentSegment.tools.promo} 
                  icon="fa-percentage" 
                  color="bg-green-500" 
                  onClick={() => openTool('promo')} 
                />
                <ToolCard 
                  title={currentSegment.tools.wa} 
                  icon="fa-whatsapp" 
                  color="bg-green-600" 
                  onClick={() => openTool('wa')} 
                />
                <div className="col-span-2">
                  <ToolCard 
                    title={currentSegment.tools.ads} 
                    icon="fa-ad" 
                    color="bg-blue-500" 
                    onClick={() => openTool('ads')} 
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {/* Gamification */}
            <div className="px-4">
              <div className="bg-[#1a1f3a] rounded-3xl p-6 shadow-lg border border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg">Checklist de Crescimento</h3>
                    <p className="text-xs text-gray-400">Complete para ganhar recompensas</p>
                  </div>
                  <i className="fas fa-trophy text-2xl text-yellow-500"></i>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span>{Math.round(progress)}% concluído</span>
                        <span>Faltam {currentSegment.checklist.length - (checkedTasks[currentSegmentId]?.length || 0)} tarefas</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <ul className="space-y-4">
                  {currentSegment.checklist.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id={`task-${idx}`}
                        checked={(checkedTasks[currentSegmentId] || []).includes(idx)}
                        onChange={() => handleTaskToggle(idx)}
                        className="w-5 h-5 rounded-md accent-green-500 bg-[#0a0e27] border-white/20"
                      />
                      <label htmlFor={`task-${idx}`} className="text-sm cursor-pointer select-none">
                        {task}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeView === ViewEnum.ADS && <AdsView stats={stats} openTool={() => openTool('ads')} />}
        {activeView === ViewEnum.ACHIEVEMENTS && <AchievementsView stats={stats} />}
        {activeView === ViewEnum.SETTINGS && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <i className="fas fa-tools text-5xl mb-4"></i>
                <h2 className="text-xl font-bold">Ajustes em Desenvolvimento</h2>
                <p className="text-sm">Em breve você poderá personalizar sua conta.</p>
            </div>
        )}
      </main>

      {/* Navigation */}
      <BottomNav active={activeView} onChange={setActiveView} />

      {/* Wizard Modal */}
      {isModalOpen && currentTool && (
        <WizardModal 
          tool={currentTool} 
          step={wizardStep} 
          onClose={() => setIsModalOpen(false)}
          onNext={nextStep}
          onPrev={() => setWizardStep(prev => prev - 1)}
          selections={selections}
          loading={loadingAi}
          result={aiResult}
          onReset={() => { setWizardStep(1); setAiResult(null); }}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}

// --- SUB-VIEWS AND HELPERS ---

interface ToolCardProps {
    title: string;
    icon: string;
    color: string;
    onClick: () => void;
    fullWidth?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, icon, color, onClick, fullWidth }) => (
  <button 
    onClick={onClick}
    className={`bg-[#1a1f3a] p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 text-left border border-white/5 ${fullWidth ? 'w-full' : ''}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>
        <i className={`fas ${icon}`}></i>
    </div>
    <div>
        <h4 className="font-bold text-sm leading-tight">{title}</h4>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Gerar IA</p>
    </div>
  </button>
);

const AdsView: React.FC<{ stats: AppStats; openTool: () => void }> = ({ stats, openTool }) => (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
                <i className="fas fa-robot text-blue-500"></i> Consultor IA
            </h2>
            <p className="text-gray-400 text-sm">Sua agência de tráfego 24h</p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                <i className="fas fa-wifi"></i>
            </div>
            <div>
                <h4 className="font-bold text-green-500">IA Conectada</h4>
                <p className="text-xs text-gray-400">Pronto para analisar seu negócio e criar campanhas.</p>
            </div>
        </div>

        <button 
            onClick={openTool}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl flex items-center justify-between group transition-all hover:scale-[1.01]"
        >
            <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                    <i className="fas fa-magic"></i>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Gerar Campanha</h3>
                    <p className="text-xs text-white/70">Criar anúncio focado em vendas</p>
                </div>
            </div>
            <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
        </button>

        <div className="mt-8">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-yellow-500"></i> Em Andamento
            </h4>
            <div className="bg-[#1a1f3a] p-8 rounded-2xl text-center border border-dashed border-white/10">
                <p className="text-gray-500 text-sm">Nenhuma campanha ativa no momento.</p>
            </div>
        </div>
    </div>
);

const AchievementsView: React.FC<{ stats: AppStats }> = ({ stats }) => {
    const achievements = [
        { id: '1', title: 'Primeira Missão', desc: 'Complete 1 tarefa', condition: stats.tasksCompleted >= 1, icon: 'fa-check-circle' },
        { id: '2', title: 'Checklist Master', desc: 'Frequência ativa', condition: stats.tasksCompleted >= 5, icon: 'fa-trophy' },
        { id: '3', title: 'Criador IA', desc: 'Use a IA 5 vezes', condition: stats.aiUsages >= 5, icon: 'fa-magic' },
        { id: '4', title: 'Dedicação Total', desc: '7 dias de sequência', condition: stats.streak >= 7, icon: 'fa-fire' },
        { id: '5', title: 'Explorador', desc: 'Teste 3 segmentos', condition: stats.segmentsExplored.length >= 3, icon: 'fa-compass' },
        { id: '6', title: 'Mago do Marketing', desc: 'Use 3 ferramentas', condition: stats.toolsUsed.length >= 3, icon: 'fa-hat-wizard' },
    ];

    return (
        <div className="p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
                    <i className="fas fa-medal text-rose-500"></i> Conquistas
                </h2>
                <p className="text-gray-400 text-sm">Desbloqueie troféus completando desafios</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {achievements.map(a => (
                    <div key={a.id} className={`p-6 rounded-2xl text-center border-2 transition-all ${a.condition ? 'bg-[#1a1f3a] border-green-500/50' : 'bg-white/5 border-transparent opacity-40'}`}>
                        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-3 ${a.condition ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-white/10'}`}>
                            <i className={`fas ${a.icon}`}></i>
                        </div>
                        <h4 className="font-bold text-sm mb-1">{a.title}</h4>
                        <p className="text-[10px] text-gray-500">{a.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WizardModal: React.FC<{ 
    tool: string, 
    step: number, 
    onClose: () => void, 
    onNext: (s: any) => void,
    onPrev: () => void,
    selections: UserSelections,
    loading: boolean,
    result: string | null,
    onReset: () => void,
    onCopy: (t: string) => void
}> = ({ tool, step, onClose, onNext, onPrev, selections, loading, result, onReset, onCopy }) => {
    const config = TOOL_CONFIGS[tool] || TOOL_CONFIGS['reels'];
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1a1f3a] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{config.title}</h3>
                        <div className="flex gap-1.5 mt-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'bg-blue-500 w-8' : 'bg-white/10 w-4'}`}></div>
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step < 3 ? (
                        <div className="animate-in fade-in duration-300">
                            <h4 className="text-xl font-bold mb-6 text-center">{step === 1 ? config.step1.question : config.step2.question}</h4>
                            <div className="space-y-3">
                                {(step === 1 ? config.step1.options : config.step2.options).map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => onNext({ key: step === 1 ? 'objective' : 'tone', id: opt.id, title: opt.title })}
                                        className="w-full p-5 bg-white/5 border-2 border-transparent hover:border-blue-500 hover:bg-blue-500/5 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-95"
                                    >
                                        <span className="text-3xl shrink-0">{opt.icon}</span>
                                        <div>
                                            <h5 className="font-bold">{opt.title}</h5>
                                            <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            {loading ? (
                                <div className="py-12 text-center">
                                    <div className="text-5xl mb-4 animate-bounce">🧠</div>
                                    <h4 className="text-lg font-bold">Criando mágica...</h4>
                                    <p className="text-sm text-gray-400">Consultando o especialista IA</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
                                        <h4 className="font-bold text-green-500 flex items-center gap-2 mb-2">
                                            <i className="fas fa-check-circle"></i> Resultado Gerado
                                        </h4>
                                        <div className="bg-black/40 p-4 rounded-xl text-xs font-mono text-gray-200 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                                            {result}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={onReset}
                                            className="flex-1 bg-white/5 p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-redo"></i> Novo
                                        </button>
                                        <button 
                                            onClick={() => onCopy(result || '')}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-rose-500 p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                                        >
                                            <i className="fas fa-copy"></i> Copiar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {step > 1 && step < 3 && (
                    <div className="p-6 border-t border-white/10">
                        <button onClick={onPrev} className="text-sm text-gray-400 font-bold flex items-center gap-2">
                            <i className="fas fa-arrow-left"></i> Voltar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
