
export enum View {
  HOME = 'home',
  ADS = 'ads',
  ACHIEVEMENTS = 'achievements',
  SETTINGS = 'settings'
}

export interface Segment {
  id: string;
  name: string;
  banner: string;
  desc: string;
  icon: string;
  tools: {
    reels: string;
    calendar: string;
    promo: string;
    wa: string;
    ads: string;
  };
  checklist: string[];
}

export interface Option {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface StepConfig {
  question: string;
  options: Option[];
}

export interface ToolConfig {
  title: string;
  step1: StepConfig;
  step2: StepConfig;
}

export interface UserSelections {
  objective: string | null;
  objectiveTitle: string;
  tone: string | null;
  toneTitle: string;
}

export interface AppStats {
  tasksCompleted: number;
  aiUsages: number;
  streak: number;
  segmentsExplored: string[];
  toolsUsed: string[];
  financialPotential: number;
  adsCampaign: {
    status: 'idle' | 'active' | 'ready';
    startTime: number | null;
    level: string | null;
  };
}
