import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Cpu, 
  Zap, 
  Table2, 
  RotateCcw, 
  Filter, 
  Layers, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DatasetId, FilterState, PageView } from '../../types';

interface StreamlitSidebarProps {
  currentDataset: DatasetId;
  onSelectDataset: (id: DatasetId) => void;
  currentPage: PageView;
  onSelectPage: (page: PageView) => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const StreamlitSidebar: React.FC<StreamlitSidebarProps> = ({
  currentDataset,
  onSelectDataset,
  currentPage,
  onSelectPage,
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onToggleSidebar,
}) => {
  const pages: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Executive Overview & KPIs', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'eda', label: '2. Exploratory Analysis (EDA)', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'model', label: '3. Machine Learning Models', icon: <Cpu className="h-4 w-4" /> },
    { id: 'predict', label: '4. Live Churn Predictor', icon: <Zap className="h-4 w-4" /> },
    { id: 'raw_data', label: '5. Raw Data & CSV Export', icon: <Table2 className="h-4 w-4" /> },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggleSidebar}
        title="Open Streamlit Sidebar"
        className="fixed bottom-6 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4b4b] text-white shadow-lg hover:bg-[#e03a3a] transition-transform hover:scale-105"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside className="relative flex h-[calc(100vh-3.5rem)] w-72 shrink-0 flex-col border-r border-slate-200 bg-[#f8f9fb] p-4 overflow-y-auto dark:border-slate-800 dark:bg-slate-900/90 text-sm">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#ff4b4b]" />
          <span className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            st.sidebar Controls
          </span>
        </div>
        <button
          onClick={onToggleSidebar}
          title="Collapse Sidebar"
          className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Dataset Picker: st.selectbox */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#ff4b4b]" />
          <span>Select Data Science Project</span>
        </label>
        <select
          value={currentDataset}
          onChange={(e) => onSelectDataset(e.target.value as DatasetId)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-[#ff4b4b] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 shadow-sm"
        >
          <option value="churn">📊 Telco Customer Churn (Primary)</option>
          <option value="superstore">🛒 Superstore Sales & Profit</option>
          <option value="penguins">🐧 Palmer Penguins Dataset</option>
        </select>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Streamlit cache: <code className="font-mono text-[#ff4b4b]">@st.cache_data</code> active
        </p>
      </div>

      {/* Page Navigation: st.radio */}
      <div className="mt-5">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          Navigation ({pages.length} Pages)
        </label>
        <div className="space-y-1">
          {pages.map((page) => {
            const isActive = currentPage === page.id;
            return (
              <button
                key={page.id}
                onClick={() => onSelectPage(page.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#ff4b4b]/10 text-[#ff4b4b] font-semibold dark:bg-[#ff4b4b]/20'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className={isActive ? 'text-[#ff4b4b]' : 'text-slate-400'}>{page.icon}</span>
                <span className="truncate">{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cohort Filters: st.multiselect & st.slider */}
      {currentDataset === 'churn' && (
        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Filter className="h-3.5 w-3.5 text-[#ff4b4b]" />
              <span>Interactive Filters</span>
            </span>
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#ff4b4b] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Contract Multiselect */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Contract Agreement:
            </label>
            <div className="space-y-1.5">
              {(['Month-to-month', 'One year', 'Two year'] as const).map((type) => {
                const checked = filters.contractTypes.includes(type);
                return (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.contractTypes, type]
                          : filters.contractTypes.filter((t) => t !== type);
                        onFilterChange({ contractTypes: next.length > 0 ? next : [type] });
                      }}
                      className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
                    />
                    <span>{type}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Internet Service Filter */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Internet Service Tier:
            </label>
            <div className="space-y-1.5">
              {(['Fiber optic', 'DSL', 'No'] as const).map((service) => {
                const checked = filters.internetServices.includes(service);
                return (
                  <label key={service} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.internetServices, service]
                          : filters.internetServices.filter((s) => s !== service);
                        onFilterChange({ internetServices: next.length > 0 ? next : [service] });
                      }}
                      className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
                    />
                    <span>{service === 'No' ? 'No Internet Service' : service}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tenure Range Slider: st.slider */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>Tenure Range</span>
              <span className="font-mono text-[#ff4b4b]">{filters.tenureRange[0]} - {filters.tenureRange[1]} mos</span>
            </div>
            <input
              type="range"
              min="1"
              max="72"
              value={filters.tenureRange[1]}
              onChange={(e) => onFilterChange({ tenureRange: [filters.tenureRange[0], Number(e.target.value)] })}
              className="w-full accent-[#ff4b4b]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 mo</span>
              <span>72 mos</span>
            </div>
          </div>

          {/* Monthly Charges Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>Monthly Charges</span>
              <span className="font-mono text-[#ff4b4b]">${filters.monthlyChargesRange[0]} - ${filters.monthlyChargesRange[1]}/mo</span>
            </div>
            <input
              type="range"
              min="20"
              max="125"
              value={filters.monthlyChargesRange[1]}
              onChange={(e) => onFilterChange({ monthlyChargesRange: [filters.monthlyChargesRange[0], Number(e.target.value)] })}
              className="w-full accent-[#ff4b4b]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$20</span>
              <span>$125</span>
            </div>
          </div>

          {/* Senior Citizen Toggle */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filters.onlySeniorCitizens}
                onChange={(e) => onFilterChange({ onlySeniorCitizens: e.target.checked })}
                className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
              />
              <span>Senior Citizens Cohort Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Streamlit execution tip */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="rounded-md bg-slate-100 p-2.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">💡 Streamlit Principle</p>
          <p>Every widget interaction dynamically triggers reactive top-to-bottom recomputation with optimized state caching.</p>
        </div>
      </div>
    </aside>
  );
};
