import React from 'react';
import { Play, RotateCw, Code2, Sun, Moon, Sparkles, MoreVertical } from 'lucide-react';

interface StreamlitHeaderProps {
  isRunning: boolean;
  onRerun: () => void;
  onToggleCode: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onBalloons: () => void;
}

export const StreamlitHeader: React.FC<StreamlitHeaderProps> = ({
  isRunning,
  onRerun,
  onToggleCode,
  darkMode,
  onToggleTheme,
  onBalloons,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      {/* Brand & Status Zone */}
      <div className="flex items-center gap-3">
        {/* Streamlit Red Crown Mark */}
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-[#ff4b4b]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Streamlit <span className="text-xs font-normal text-slate-500 dark:text-slate-400">v1.39</span>
          </span>
        </div>

        {/* Live execution pill */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-[#ff4b4b] font-medium">
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
              <span>Running app.py...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Pipeline Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2">
        {/* Streamlit Celebratory Balloons */}
        <button
          onClick={onBalloons}
          title="Trigger Streamlit st.balloons()"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden md:inline">st.balloons()</span>
        </button>

        {/* View Python Code Modal Trigger */}
        <button
          onClick={onToggleCode}
          className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-[#ff4b4b]" />
          <span>View Python app.py</span>
        </button>

        {/* Rerun button mimicking Streamlit R key shortcut */}
        <button
          onClick={onRerun}
          disabled={isRunning}
          title="Re-run Streamlit application (Hotkey: R)"
          className="flex items-center gap-1.5 rounded-md bg-[#ff4b4b] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#e03a3a] disabled:opacity-50 transition-colors shadow-sm"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Rerun</span>
          <kbd className="hidden md:inline rounded bg-red-700 px-1 py-0.2 text-[10px] font-mono">R</kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Streamlit Context Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More options"
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
              <button
                onClick={() => {
                  onRerun();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear Cache & Recompute
              </button>
              <button
                onClick={() => {
                  window.print();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Print / Save Dashboard as PDF
              </button>
              <button
                onClick={() => {
                  onToggleCode();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Inspect Streamlit Source
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
