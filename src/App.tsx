/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CustomerRecord, DatasetId, FilterState, PageView } from './types';
import { INITIAL_TELCO_DATA, calculateSummaryMetrics } from './data/telcoDataset';
import { StreamlitHeader } from './components/streamlit/StreamlitHeader';
import { StreamlitSidebar } from './components/streamlit/StreamlitSidebar';
import { OverviewPage } from './components/pages/OverviewPage';
import { EdaPage } from './components/pages/EdaPage';
import { ModelEvaluationPage } from './components/pages/ModelEvaluationPage';
import { PredictionSimulatorPage } from './components/pages/PredictionSimulatorPage';
import { DataExplorerPage } from './components/pages/DataExplorerPage';
import { PythonCodeModal } from './components/PythonCodeModal';

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<DatasetId>('churn');
  const [currentPage, setCurrentPage] = useState<PageView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Active Cohort Filter State
  const [filters, setFilters] = useState<FilterState>({
    contractTypes: ['Month-to-month', 'One year', 'Two year'],
    internetServices: ['DSL', 'Fiber optic', 'No'],
    tenureRange: [1, 72],
    monthlyChargesRange: [20, 125],
    onlySeniorCitizens: false,
    searchQuery: '',
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Streamlit Hotkey: Press 'R' to rerun
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        triggerRerun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter application
  const filteredData = useMemo(() => {
    return INITIAL_TELCO_DATA.filter((item: CustomerRecord) => {
      if (!filters.contractTypes.includes(item.contract)) return false;
      if (!filters.internetServices.includes(item.internetService)) return false;
      if (item.tenure < filters.tenureRange[0] || item.tenure > filters.tenureRange[1]) return false;
      if (item.monthlyCharges < filters.monthlyChargesRange[0] || item.monthlyCharges > filters.monthlyChargesRange[1]) return false;
      if (filters.onlySeniorCitizens && !item.seniorCitizen) return false;
      return true;
    });
  }, [filters]);

  // Aggregate metrics
  const summaryMetrics = useMemo(() => {
    return calculateSummaryMetrics(filteredData);
  }, [filteredData]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      contractTypes: ['Month-to-month', 'One year', 'Two year'],
      internetServices: ['DSL', 'Fiber optic', 'No'],
      tenureRange: [1, 72],
      monthlyChargesRange: [20, 125],
      onlySeniorCitizens: false,
      searchQuery: '',
    });
  };

  const triggerRerun = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 450);
  }, []);

  const triggerBalloons = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4b4b', '#0068c9', '#ffbd45', '#00d4b2'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Streamlit Top Navigation Bar */}
      <StreamlitHeader
        isRunning={isRunning}
        onRerun={triggerRerun}
        onToggleCode={() => setIsCodeModalOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onBalloons={triggerBalloons}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Streamlit Collapsible Sidebar */}
        <StreamlitSidebar
          currentDataset={currentDataset}
          onSelectDataset={setCurrentDataset}
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Streamlit Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-12 transition-opacity duration-200">
          <div className="mx-auto max-w-6xl">
            {isRunning ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff4b4b] border-t-transparent" />
                <span className="font-mono text-xs text-slate-500">
                  st.rerun(): Re-evaluating reactive pipeline...
                </span>
              </div>
            ) : (
              <>
                {currentPage === 'overview' && (
                  <OverviewPage
                    data={filteredData}
                    metrics={summaryMetrics}
                    onNavigateToPredict={() => setCurrentPage('predict')}
                    onNavigateToEda={() => setCurrentPage('eda')}
                  />
                )}
                {currentPage === 'eda' && <EdaPage data={filteredData} />}
                {currentPage === 'model' && <ModelEvaluationPage data={filteredData} />}
                {currentPage === 'predict' && <PredictionSimulatorPage />}
                {currentPage === 'raw_data' && (
                  <DataExplorerPage
                    currentDataset={currentDataset}
                    telcoData={filteredData}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Python Code Modal */}
      <PythonCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
