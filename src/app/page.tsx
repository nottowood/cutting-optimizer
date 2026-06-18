'use client';

import { useState, useCallback } from 'react';
import { StockPanel, CutPanel, ThemeColors, OptimizationResult } from '@/lib/types';
import { optimize } from '@/lib/optimizer';
import { parseStockCSV, parseCutCSV } from '@/lib/csv';
import LoginPage from '@/components/LoginPage';
import PanelInput from '@/components/PanelInput';
import CuttingDiagram from '@/components/CuttingDiagram';
import StatsPanel from '@/components/StatsPanel';
import ThemePicker from '@/components/ThemePicker';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState<ThemeColors>({
    foreground: '#e4e5e7',
    background: '#1a1d23',
  });
  const [stocks, setStocks] = useState<StockPanel[]>([]);
  const [cuts, setCuts] = useState<CutPanel[]>([]);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleStockCSV = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseStockCSV(text);
      if (parsed.length > 0) setStocks(prev => [...prev, ...parsed]);
    };
    reader.readAsText(file);
  }, []);

  const handleCutCSV = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCutCSV(text);
      if (parsed.length > 0) setCuts(prev => [...prev, ...parsed]);
    };
    reader.readAsText(file);
  }, []);

  const runOptimizer = useCallback(() => {
    const validStocks = stocks.filter(s => s.width > 0 && s.length > 0 && s.quantity > 0);
    const validCuts = cuts.filter(c => c.width > 0 && c.length > 0 && c.quantity > 0);
    if (validStocks.length === 0 || validCuts.length === 0) return;

    setIsOptimizing(true);
    setTimeout(() => {
      const res = optimize(validStocks, validCuts);
      setResult(res);
      setIsOptimizing(false);
    }, 100);
  }, [stocks, cuts]);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    const { exportPDF } = await import('@/lib/pdf');
    exportPDF(result);
  }, [result]);

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setStocks([]);
    setCuts([]);
    setResult(null);
  }, []);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const validStocks = stocks.filter(s => s.width > 0 && s.length > 0);
  const validCuts = cuts.filter(c => c.width > 0 && c.length > 0);
  const canOptimize = validStocks.length > 0 && validCuts.length > 0;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: theme.background, color: theme.foreground }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{ background: '#22252b', borderBottom: '1px solid #2e3138' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: '#2a2d35', border: '1px solid #3a3d45' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8a631" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <path d="M8.12 8.12L12 12" />
                <path d="M20 4L8.12 15.88" />
                <circle cx="6" cy="18" r="3" />
                <path d="M14.8 14.8L20 20" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: '#e4e5e7' }}>
                2D Cutting Optimizer
              </h1>
              <p className="text-xs" style={{ color: '#6b7280' }}>Industrial Panel Optimization</p>
            </div>
          </div>
          <ThemePicker theme={theme} onChange={setTheme} onLogout={handleLogout} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-5 sm:space-y-6">
        {/* Input panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <PanelInput
            title="Stock Panels"
            panels={stocks}
            onUpdate={setStocks}
            onCSVImport={handleStockCSV}
            accentColor="#5b9bd5"
          />
          <PanelInput
            title="Cut List"
            panels={cuts}
            onUpdate={setCuts}
            onCSVImport={handleCutCSV}
            showLabel
            accentColor="#e8a631"
          />
        </div>

        {/* CSV format hint */}
        <div className="text-center text-xs" style={{ color: '#4b5563' }}>
          CSV format: <code className="px-1.5 py-0.5 rounded" style={{ background: '#22252b', border: '1px solid #2e3138' }}>width, length, quantity [, label]</code> — one row per panel type
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={runOptimizer}
            disabled={!canOptimize || isOptimizing}
            className="w-full sm:w-auto px-8 py-2.5 rounded font-semibold text-sm sm:text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canOptimize ? '#e8a631' : '#3a3d45',
              color: canOptimize ? '#1a1d23' : '#6b7280',
            }}
          >
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </button>

          {result && (
            <button
              onClick={handleExportPDF}
              className="w-full sm:w-auto px-6 py-2.5 rounded font-semibold text-sm sm:text-base transition-all"
              style={{ background: '#5b9bd5', color: '#fff' }}
            >
              Export PDF
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-5 sm:space-y-6">
            <StatsPanel result={result} />

            {result.unplacedCuts.length > 0 && (
              <div className="rounded-lg p-4" style={{ background: '#3b1a1a', border: '1px solid #5c2626' }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#f87171' }}>Unplaced Cuts</h3>
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  The following cuts could not fit in the available stock panels:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.unplacedCuts.map(c => (
                    <span key={c.id} className="px-2 py-1 rounded text-xs" style={{ background: '#5c262640', color: '#f87171' }}>
                      {c.width}x{c.length} x{c.quantity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                Cutting Patterns
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
                {result.patterns.map((pattern, i) => (
                  <CuttingDiagram
                    key={i}
                    pattern={pattern}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs" style={{ color: '#4b5563', borderTop: '1px solid #2e3138' }}>
        2D Cutting Optimizer v1.0 — Industrial Panel Optimization System
      </footer>
    </div>
  );
}
