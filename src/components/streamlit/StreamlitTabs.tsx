import React from 'react';

interface StreamlitTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const StreamlitTabs: React.FC<StreamlitTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar mb-6">
      {tabs.map((tab, idx) => {
        const isActive = activeTab === idx;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(idx)}
            className={`relative py-2.5 px-4 text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'text-[#ff4b4b] dark:text-[#ff4b4b]'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b4b]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
