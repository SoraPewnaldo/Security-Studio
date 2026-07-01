import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { searchIndex } from '@security-studio/core';
import type { SearchResult } from '@security-studio/core';
import type { ToolCategory } from '@security-studio/types';

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

function getIcon(name: string): LucideIconComponent {
  const icon = (Icons as unknown as Record<string, LucideIconComponent>)[name];
  return icon || Icons.Wrench;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    return searchIndex.search(query);
  }, [query]);

  // Group results by category
  const grouped = useMemo(() => {
    const groups = new Map<ToolCategory, SearchResult[]>();
    for (const result of results) {
      const cat = result.item.category;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(result);
    }
    return groups;
  }, [results]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    const flat: SearchResult[] = [];
    for (const items of grouped.values()) {
      flat.push(...items);
    }
    return flat;
  }, [grouped]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const selectTool = useCallback((toolId: string) => {
    onClose();
    navigate({ to: '/tools/$toolId', params: { toolId } });
  }, [onClose, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          selectTool(flatResults[selectedIndex].item.id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatResults, selectedIndex, selectTool, onClose]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[640px] z-50"
          >
            <div className="rounded-xl border border-border/50 bg-surface shadow-2xl overflow-hidden ring-1 ring-black/50">
              {/* Search input */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-border/30 bg-surface/50">
                <Search size={20} className="text-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tools or commands..."
                  className="flex-1 bg-transparent text-lg text-text placeholder:text-text-muted
                    outline-none border-none font-medium"
                />
                <kbd className="px-2 py-1 text-[11px] font-mono rounded border border-border/50
                  bg-bg text-text-muted font-medium">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2 p-2">
                {flatResults.length === 0 && query.trim() !== '' ? (
                  <div className="px-4 py-12 text-center text-[13px] text-text-muted">
                    No tools found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Array.from(grouped.entries()).map(([category, items]) => (
                    <div key={category} className="mb-2 last:mb-0">
                      <div className="px-3 py-2">
                        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                          {category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {items.map((result) => {
                          const idx = globalIndex++;
                          const IconComp = getIcon(result.item.icon);
                          return (
                            <button
                              key={result.item.id}
                              data-index={idx}
                              onClick={() => selectTool(result.item.id)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                transition-all duration-75 cursor-pointer
                                ${idx === selectedIndex
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-text-secondary hover:bg-surface-hover'
                                }`}
                            >
                              <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${idx === selectedIndex ? 'bg-primary/20 text-primary' : 'bg-surface text-text-muted border border-border/50'}`}>
                                <IconComp size={14} />
                              </div>
                              <div className="flex-1 text-left flex flex-col justify-center min-w-0">
                                <span className={`truncate text-[13px] leading-tight ${idx === selectedIndex ? 'text-primary font-medium' : 'text-text font-medium'}`}>
                                  {result.item.name}
                                </span>
                                <span className={`truncate text-[11px] leading-tight mt-0.5 ${idx === selectedIndex ? 'text-primary/70' : 'text-text-muted'}`}>
                                  {result.item.description}
                                </span>
                              </div>
                              {idx === selectedIndex && (
                                <ArrowRight size={14} className="flex-shrink-0 text-primary opacity-80" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-5 py-3 border-t border-border/30 bg-surface/50 text-[11px] text-text-muted font-medium">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1 py-0.5 rounded bg-surface border border-border/50 font-mono shadow-sm">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1 py-0.5 rounded bg-surface border border-border/50 font-mono shadow-sm">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1 py-0.5 rounded bg-surface border border-border/50 font-mono shadow-sm">esc</kbd>
                  close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
