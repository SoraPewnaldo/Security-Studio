import { useState } from 'react';
import { Search, Github, RotateCcw, ExternalLink, Menu } from 'lucide-react';
import { useMatchRoute } from '@tanstack/react-router';
import logo from '@/assets/logo.png';

interface TopbarProps {
  onOpenCommandPalette: () => void;
  onToggleSidebar?: () => void;
}

export function Topbar({ onOpenCommandPalette, onToggleSidebar }: TopbarProps) {
  const matchRoute = useMatchRoute();
  
  const isHome = !!matchRoute({ to: '/' });
  const isFavorites = !!matchRoute({ to: '/favorites' });
  const isHistory = !!matchRoute({ to: '/history' });
  
  let currentTab = 'Overview';
  if (isFavorites) currentTab = 'Favorites';
  if (isHistory) currentTab = 'History';

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-bg flex-shrink-0">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden p-1.5 text-text-secondary hover:text-text rounded-md transition-colors"
          onClick={onToggleSidebar}
        >
          <Menu size={16} />
        </button>
        
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <div className="w-8 h-8 rounded-md flex items-center justify-center mr-1">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain brightness-0 invert opacity-90" />
          </div>
          <span className="text-text hover:text-primary transition-colors cursor-pointer">Security Studio</span>
        </div>
      </div>

      {/* Center: Tabs */}
      <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1">
          <button className={`px-3 py-1 text-[13px] rounded-md transition-colors cursor-pointer font-medium
            ${currentTab === 'Overview' ? 'bg-surface-hover text-text' : 'text-text-secondary hover:text-text'}`}>
            Overview
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
      </div>

    </header>
  );
}
