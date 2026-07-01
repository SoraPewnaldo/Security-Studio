import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function RootLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useKeyboardShortcut('k', () => setCommandPaletteOpen(true), { ctrl: true });

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
