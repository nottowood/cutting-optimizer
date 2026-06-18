'use client';

import { OptimizationResult } from '@/lib/types';

interface StatsPanelProps {
  result: OptimizationResult;
}

export default function StatsPanel({ result }: StatsPanelProps) {
  const totalSheets = result.patterns.reduce((s, p) => s + p.sheetCount, 0);
  const wasteArea = result.totalStockArea - result.totalCutArea;

  const stats = [
    {
      label: 'Stock Panels Used',
      value: totalSheets.toString(),
      color: '#5b9bd5',
    },
    {
      label: 'Total Stock Area',
      value: result.totalStockArea.toLocaleString(),
      unit: 'sq units',
      color: '#4472c4',
    },
    {
      label: 'Total Cut Area',
      value: result.totalCutArea.toLocaleString(),
      unit: 'sq units',
      color: '#70ad47',
    },
    {
      label: 'Waste Area',
      value: wasteArea.toLocaleString(),
      unit: 'sq units',
      color: '#c55a11',
    },
    {
      label: 'Scrap Rate',
      value: result.scrapRate.toFixed(2),
      unit: '%',
      color: result.scrapRate > 30 ? '#c55a11' : result.scrapRate > 15 ? '#e8a631' : '#70ad47',
    },
    {
      label: 'Patterns',
      value: result.patterns.length.toString(),
      color: '#44546a',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-lg p-3 sm:p-4 text-center"
          style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}30` }}
        >
          <div className="text-lg sm:text-xl font-bold" style={{ color: stat.color }}>
            {stat.value}
            {stat.unit && <span className="text-xs ml-1 opacity-60">{stat.unit}</span>}
          </div>
          <div className="text-xs opacity-50 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
