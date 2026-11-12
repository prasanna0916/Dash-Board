import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, BookOpen } from 'lucide-react';
import { PYTHON_STREAMLIT_CODE } from '../data/pythonStreamlitCode';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_STREAMLIT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([PYTHON_STREAMLIT_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'app.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ff4b4b]/10 text-[#ff4b4b]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Streamlit Python Code</span>
                <span className="font-mono text-xs text-[#ff4b4b] bg-[#ff4b4b]/10 px-1.5 py-0.5 rounded">
                  app.py
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Executable Streamlit application script for local data science prototyping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md bg-[#ff4b4b] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#e03a3a] transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download app.py</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 dark:border-slate-800 dark:bg-slate-950/60">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-[#ff4b4b] text-[#ff4b4b]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Python Source (app.py)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-[#ff4b4b] text-[#ff4b4b]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>How to Run Locally</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed">
          {activeTab === 'code' ? (
            <pre className="rounded-lg bg-slate-950 p-4 text-slate-100 overflow-x-auto shadow-inner selection:bg-[#ff4b4b]/30">
              <code>{PYTHON_STREAMLIT_CODE}</code>
            </pre>
          ) : (
            <div className="font-sans text-xs space-y-4 max-w-2xl text-slate-700 dark:text-slate-300">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                  Step 1: Install Dependencies
                </h4>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  pip install streamlit pandas numpy plotly scikit-learn
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                  Step 2: Save and Launch Streamlit
                </h4>
                <p className="mb-2 text-slate-600 dark:text-slate-400">
                  Save the code above as <code className="font-mono text-[#ff4b4b]">app.py</code> and execute in your terminal:
                </p>
                <div className="rounded bg-slate-900 p-2.5 font-mono text-xs text-emerald-400">
                  streamlit run app.py
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Streamlit will automatically spin up a local development server at <code className="font-mono">http://localhost:8501</code>.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                  Why Streamlit for Data Science?
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                  <li><strong>Zero Frontend Boilerplate:</strong> No HTML/CSS/JavaScript needed; pure Python scripts render directly as interactive web dashboards.</li>
                  <li><strong>Fast Caching:</strong> <code className="font-mono text-[#ff4b4b]">@st.cache_data</code> prevents re-downloading heavy datasets or re-training ML models on every interaction.</li>
                  <li><strong>Built for Data Scientists:</strong> Native support for Pandas DataFrames, Plotly Express, Altair, Matplotlib, and Scikit-Learn models.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
