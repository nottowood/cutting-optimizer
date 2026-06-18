'use client';

import { useRef } from 'react';

interface PanelRow {
  id: string;
  width: number;
  length: number;
  quantity: number;
  label?: string;
}

interface PanelInputProps {
  title: string;
  panels: PanelRow[];
  onUpdate: (panels: PanelRow[]) => void;
  onCSVImport: (file: File) => void;
  showLabel?: boolean;
  accentColor: string;
}

export default function PanelInput({
  title,
  panels,
  onUpdate,
  onCSVImport,
  showLabel,
  accentColor,
}: PanelInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function addRow() {
    onUpdate([
      ...panels,
      { id: crypto.randomUUID(), width: 0, length: 0, quantity: 1, label: '' },
    ]);
  }

  function removeRow(id: string) {
    onUpdate(panels.filter(p => p.id !== id));
  }

  function updateRow(id: string, field: string, value: string) {
    onUpdate(
      panels.map(p => {
        if (p.id !== id) return p;
        if (field === 'label') return { ...p, label: value };
        const num = parseFloat(value);
        return { ...p, [field]: isNaN(num) ? 0 : num };
      })
    );
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onCSVImport(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2e3138', background: '#22252b' }}>
      <div
        className="px-4 py-3 sm:px-5 sm:py-3 flex items-center justify-between"
        style={{ background: '#282b32', borderBottom: '1px solid #2e3138' }}
      >
        <h2 className="text-sm sm:text-base font-semibold tracking-wide uppercase" style={{ color: accentColor }}>
          {title}
        </h2>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-medium transition-colors"
            style={{ background: '#1a1d23', border: '1px solid #3a3d45', color: '#9ca3af' }}
          >
            Import CSV
          </button>
          <button
            onClick={addRow}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-medium transition-colors"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
          >
            + Add Row
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        <div className={`grid gap-2 text-xs font-medium uppercase tracking-wider px-1 ${showLabel ? 'grid-cols-[1fr_1fr_0.7fr_1fr_auto]' : 'grid-cols-[1fr_1fr_0.7fr_auto]'}`} style={{ color: '#6b7280' }}>
          <span>Width</span>
          <span>Length</span>
          <span>Qty</span>
          {showLabel && <span>Label</span>}
          <span></span>
        </div>

        {panels.length === 0 && (
          <p className="text-center py-6 sm:py-8 text-sm" style={{ color: '#4b5563' }}>
            No panels added. Click <strong>+ Add Row</strong> or <strong>Import CSV</strong>.
          </p>
        )}

        {panels.map(panel => (
          <div
            key={panel.id}
            className={`grid gap-2 items-center ${showLabel ? 'grid-cols-[1fr_1fr_0.7fr_1fr_auto]' : 'grid-cols-[1fr_1fr_0.7fr_auto]'}`}
          >
            <input
              type="number"
              min="0"
              step="any"
              value={panel.width || ''}
              onChange={e => updateRow(panel.id, 'width', e.target.value)}
              placeholder="W"
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded text-sm outline-none transition-colors"
              style={{ background: '#1a1d23', border: '1px solid #3a3d45', color: '#e4e5e7' }}
            />
            <input
              type="number"
              min="0"
              step="any"
              value={panel.length || ''}
              onChange={e => updateRow(panel.id, 'length', e.target.value)}
              placeholder="L"
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded text-sm outline-none transition-colors"
              style={{ background: '#1a1d23', border: '1px solid #3a3d45', color: '#e4e5e7' }}
            />
            <input
              type="number"
              min="1"
              value={panel.quantity || ''}
              onChange={e => updateRow(panel.id, 'quantity', e.target.value)}
              placeholder="Q"
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded text-sm outline-none transition-colors"
              style={{ background: '#1a1d23', border: '1px solid #3a3d45', color: '#e4e5e7' }}
            />
            {showLabel && (
              <input
                type="text"
                value={panel.label || ''}
                onChange={e => updateRow(panel.id, 'label', e.target.value)}
                placeholder="Name"
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded text-sm outline-none transition-colors"
                style={{ background: '#1a1d23', border: '1px solid #3a3d45', color: '#e4e5e7' }}
              />
            )}
            <button
              onClick={() => removeRow(panel.id)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-sm transition-colors"
              style={{ background: '#3b1a1a', color: '#f87171', border: '1px solid #5c2626' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
