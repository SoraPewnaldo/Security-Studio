import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, ChevronRight, ChevronLeft, BookOpen, Zap, CheckCircle, Circle, Clock, Flag, Download, RotateCcw } from 'lucide-react';
import { PLAYBOOKS } from './playbook-registry';
import type { Playbook, PlaybookStep } from '@security-studio/types';
import { toolRegistry } from '@security-studio/tool-sdk';

// ============================================================
// Playbook Dashboard — /playbooks
// ============================================================

const CATEGORY_LABELS: Record<string, string> = {
  recon: 'Recon & OSINT',
  authentication: 'Authentication',
  'web-security': 'Web Security',
  'incident-response': 'Incident Response',
  'api-testing': 'API Testing',
  forensics: 'Forensics',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-success bg-success/10',
  intermediate: 'text-warning bg-warning/10',
  advanced: 'text-danger bg-danger/10',
};

export function PlaybooksDashboard() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text">Security Playbooks</h1>
          <p className="text-[14px] text-text-secondary mt-1.5">
            Step-by-step guided methodologies for common cybersecurity tasks. Learn how professionals perform each assessment.
          </p>
        </div>

        {/* Playbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAYBOOKS.map((playbook) => (
            <Link
              key={playbook.id}
              to={`/playbooks/${playbook.id}` as any}
              className="group block rounded-xl border border-border bg-surface p-5 hover:border-primary/50 transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{playbook.icon}</span>
                  <div>
                    <h2 className="text-[15px] font-semibold text-text group-hover:text-primary transition-colors">{playbook.name}</h2>
                    <p className="text-[12px] text-text-secondary mt-0.5">{CATEGORY_LABELS[playbook.category] ?? playbook.category}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>

              <p className="text-[13px] text-text-secondary mt-3 leading-relaxed">{playbook.description}</p>

              <div className="flex items-center gap-3 mt-4">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${DIFFICULTY_COLORS[playbook.difficulty]}`}>
                  {playbook.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-text-muted">
                  <Clock size={11} /> ~{playbook.estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1 text-[12px] text-text-muted">
                  <BookOpen size={11} /> {playbook.steps.length} steps
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {playbook.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-border/50 text-text-muted">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-6 rounded-xl border border-border border-dashed p-6 text-center">
          <p className="text-[14px] text-text-secondary">
            More playbooks coming in v1.3 — Incident Response, OSINT Deep Dive, Cloud Security Audit, and API Fuzzing.
          </p>
          <p className="text-[12px] text-text-muted mt-1">Plugin authors will also be able to contribute playbooks.</p>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Playbook Runner — /playbooks/:playbookId
// ============================================================

interface StepData {
  inputs?: Record<string, any>;
  output?: any;
  completed?: boolean;
}

const RISK_STYLES = {
  Low: 'text-success bg-success/10 border-success/20',
  Medium: 'text-warning bg-warning/10 border-warning/20',
  High: 'text-danger bg-danger/10 border-danger/20',
};

export function PlaybookRunner({ playbookId }: { playbookId: string }) {
  const navigate = useNavigate();
  const playbook = PLAYBOOKS.find((p) => p.id === playbookId);

  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, StepData>>({});
  const [expertMode, setExpertMode] = useState(() => localStorage.getItem('playbook_expert_mode') === 'true');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Restore progress from localStorage
    const saved = localStorage.getItem(`playbook_progress_${playbookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentStep(parsed.currentStep ?? 0);
        setStepData(parsed.stepData ?? {});
      } catch {}
    }
  }, [playbookId]);

  const saveProgress = useCallback((step: number, data: Record<string, StepData>) => {
    localStorage.setItem(`playbook_progress_${playbookId}`, JSON.stringify({ currentStep: step, stepData: data }));
  }, [playbookId]);

  const toggleExpert = () => {
    const next = !expertMode;
    setExpertMode(next);
    localStorage.setItem('playbook_expert_mode', String(next));
  };

  if (!playbook) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text font-medium">Playbook not found</p>
          <Link to="/playbooks" className="text-primary text-[13px] mt-2 inline-block hover:underline">← Back to Playbooks</Link>
        </div>
      </div>
    );
  }

  const step = playbook.steps[currentStep];
  if (!step) return null;
  const totalSteps = playbook.steps.length;
  const progressPct = Math.round(((currentStep) / totalSteps) * 100);
  const completedSteps = Object.values(stepData).filter((s) => s.completed).length;

  const goNext = () => {
    const newData = { ...stepData, [step.id]: { ...stepData[step.id], completed: true } };
    const nextStep = Math.min(currentStep + 1, totalSteps - 1);
    setStepData(newData);
    setCurrentStep(nextStep);
    saveProgress(nextStep, newData);
    if (currentStep === totalSteps - 1) setShowReport(true);
  };

  const goPrev = () => {
    const prev = Math.max(currentStep - 1, 0);
    setCurrentStep(prev);
    saveProgress(prev, stepData);
  };

  const resetPlaybook = () => {
    localStorage.removeItem(`playbook_progress_${playbookId}`);
    setCurrentStep(0);
    setStepData({});
    setShowReport(false);
  };

  const openTool = (toolId: string) => {
    navigate({ to: `/tools/${toolId}` });
  };

  const generateReport = () => {
    const lines: string[] = [
      `# ${playbook.name} — Security Assessment Report`,
      `**Date**: ${new Date().toLocaleDateString()}`,
      `**Playbook**: ${playbook.id}`,
      '',
      '---',
      '',
      '## Executive Summary',
      '',
      `Completed a guided ${playbook.name} assessment using Security Studio v1.2. ${completedSteps} of ${totalSteps} steps completed.`,
      '',
      '## Findings',
      '',
    ];
    playbook.steps.forEach((s, i) => {
      const data = stepData[s.id];
      lines.push(`### Step ${i + 1}: ${s.title}`);
      lines.push(`**Status**: ${data?.completed ? '✅ Completed' : '⏳ Pending'}`);
      lines.push(`**Purpose**: ${s.purpose}`);
      lines.push('');
    });
    lines.push('---');
    lines.push('*Report generated by Security Studio v1.2*');

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playbook.id}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ToolComponent for current step
  const toolEntry = toolRegistry.getById(step.toolId);
  const ToolComponent = toolEntry?.component;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* TOP BAR */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-border bg-surface flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/playbooks" className="text-text-secondary hover:text-text transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-[13px] font-semibold text-text">{playbook.icon} {playbook.name}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-40 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[12px] text-text-muted font-mono">{currentStep}/{totalSteps}</span>
          </div>

          {/* Expert toggle */}
          <button
            onClick={toggleExpert}
            className={`flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-full border transition-colors ${
              expertMode ? 'bg-border text-text border-border' : 'bg-success/10 text-success border-success/30'
            }`}
          >
            <Zap size={11} />
            {expertMode ? 'Expert' : 'Beginner'}
          </button>

          {/* Reset */}
          <button onClick={resetPlaybook} title="Reset progress" className="text-text-muted hover:text-danger transition-colors">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* STEP TIMELINE */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-border flex items-center gap-1 overflow-x-auto">
        {playbook.steps.map((s, i) => {
          const done = stepData[s.id]?.completed;
          const active = i === currentStep;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => { setCurrentStep(i); saveProgress(i, stepData); }}
                className={`flex items-center gap-1.5 text-[12px] whitespace-nowrap px-2 py-1 rounded transition-colors ${
                  active ? 'text-primary font-medium' : done ? 'text-success' : 'text-text-muted hover:text-text'
                }`}
              >
                {done ? <CheckCircle size={12} /> : active ? <Flag size={12} /> : <Circle size={12} />}
                {s.title}
              </button>
              {i < totalSteps - 1 && <ChevronRight size={12} className="text-border flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto flex gap-0 min-h-0">
        {/* LEFT — Tool Panel */}
        <div className="flex-1 min-h-0 overflow-auto flex flex-col border-r border-border">
          {/* Step header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-border">
            <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Step {currentStep + 1} of {totalSteps}</p>
            <h2 className="text-[16px] font-semibold text-text mt-0.5">{step.title}</h2>
            {step.estimatedSeconds && (
              <span className="flex items-center gap-1 text-[12px] text-text-muted mt-1">
                <Clock size={11} /> ~{step.estimatedSeconds}s
              </span>
            )}
          </div>

          {/* Embedded Tool */}
          <div className="flex-1 min-h-0 overflow-auto">
            {ToolComponent ? (
              <React.Suspense fallback={<div className="flex items-center justify-center h-full text-text-muted text-sm">Loading tool...</div>}>
                <ToolComponent />
              </React.Suspense>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                <p className="text-text-secondary text-[14px] text-center">
                  Tool <strong className="text-text font-mono">{step.toolId}</strong> is not registered.
                </p>
                <button
                  onClick={() => openTool(step.toolId)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[13px] rounded-lg"
                >
                  Open {step.title} →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Guide Panel */}
        <div className="w-72 flex-shrink-0 flex flex-col overflow-auto bg-surface">
          <div className="p-5 space-y-5">
            {/* Purpose */}
            {!expertMode && (
              <div>
                <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-2">Why this step?</p>
                <p className="text-[13px] text-text leading-relaxed">{step.purpose}</p>
              </div>
            )}

            {/* Suspicious Indicators */}
            {!expertMode && step.suspiciousIndicators.length > 0 && (
              <div>
                <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-2">What to look for</p>
                <ul className="space-y-1.5">
                  {step.suspiciousIndicators.map((indicator, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary leading-relaxed">
                      <span className="text-warning mt-0.5 flex-shrink-0">•</span>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Completed steps summary */}
            <div>
              <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-2">Progress</p>
              <div className="space-y-1">
                {playbook.steps.map((s, i) => {
                  const done = stepData[s.id]?.completed;
                  const active = i === currentStep;
                  return (
                    <div key={s.id} className={`flex items-center gap-2 text-[12px] ${active ? 'text-primary' : done ? 'text-success' : 'text-text-muted'}`}>
                      {done ? <CheckCircle size={11} /> : active ? <Flag size={11} /> : <Circle size={11} />}
                      {s.title}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Report */}
            {completedSteps > 0 && (
              <button
                onClick={generateReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-[13px] text-text-secondary hover:text-text hover:border-primary/50 transition-colors"
              >
                <Download size={13} /> Export Report (.md)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="flex-shrink-0 px-6 py-3 border-t border-border flex items-center justify-between bg-surface">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-[13px] text-text-secondary hover:text-text rounded-lg border border-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        <span className="text-[12px] text-text-muted">
          {completedSteps} of {totalSteps} completed
        </span>

        <button
          onClick={goNext}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[13px] font-medium rounded-lg transition-colors"
        >
          {currentStep === totalSteps - 1 ? 'Complete & Export' : 'Mark Done & Continue'}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
