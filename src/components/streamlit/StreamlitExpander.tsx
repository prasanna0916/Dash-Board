import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StreamlitExpanderProps {
  label: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const StreamlitExpander: React.FC<StreamlitExpanderProps> = ({
  label,
  defaultExpanded = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-slate-800 hover:text-[#ff4b4b] dark:text-slate-200 dark:hover:text-[#ff4b4b] transition-colors"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4 text-[#ff4b4b]" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
          <span>{label}</span>
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 p-4 text-xs text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
};
