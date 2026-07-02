// ============================================================
// Playbook Type System
// ============================================================

export interface PlaybookStepInputMapping {
  [key: string]: string; // fieldName -> sourceField from previous step data
}

export interface PlaybookAutoAnalysis {
  risk: 'low' | 'medium' | 'high';
  notes: string[];
}

export interface PlaybookBranch {
  condition: (stepData: Record<string, any>) => boolean;
  skipToStep?: number;   // skip to a step index
  label?: string;         // label for UI display (e.g. "Already secure, skipping...")
}

export interface PlaybookStep {
  id: string;
  title: string;
  toolId: string;             // which tool to embed
  purpose: string;            // educational explanation (beginner mode)
  suspiciousIndicators: string[]; // checklist shown in beginner mode
  inputMapping?: PlaybookStepInputMapping; // how previous outputs flow into this tool's state
  branch?: PlaybookBranch;    // optional conditional branching
  estimatedSeconds?: number;
}

export interface Playbook {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'recon' | 'authentication' | 'web-security' | 'incident-response' | 'api-testing' | 'forensics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tags: string[];
  steps: PlaybookStep[];
}

export interface PlaybookSessionData {
  id: number;
  playbookId: string;
  workspaceId?: number;
  currentStep: number;
  stepData: string; // JSON string of { [stepId]: { inputs: any; output: any } }
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybookReport {
  id: number;
  sessionId: number;
  title: string;
  reportText: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export type PlaybookRisk = 'Low' | 'Medium' | 'High';
