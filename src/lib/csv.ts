import { StockPanel, CutPanel } from './types';

export function parseStockCSV(text: string): StockPanel[] {
  const lines = text.trim().split('\n');
  const panels: StockPanel[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(/[,;\t]+/).map(s => s.trim());
    // Skip header row
    if (i === 0 && isNaN(Number(parts[0]))) continue;

    const width = parseFloat(parts[0]);
    const length = parseFloat(parts[1]);
    const quantity = parseInt(parts[2]) || 1;

    if (!isNaN(width) && !isNaN(length) && width > 0 && length > 0) {
      panels.push({ id: crypto.randomUUID(), width, length, quantity });
    }
  }

  return panels;
}

export function parseCutCSV(text: string): CutPanel[] {
  const lines = text.trim().split('\n');
  const panels: CutPanel[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(/[,;\t]+/).map(s => s.trim());
    if (i === 0 && isNaN(Number(parts[0]))) continue;

    const width = parseFloat(parts[0]);
    const length = parseFloat(parts[1]);
    const quantity = parseInt(parts[2]) || 1;
    const label = parts[3] || undefined;

    if (!isNaN(width) && !isNaN(length) && width > 0 && length > 0) {
      panels.push({ id: crypto.randomUUID(), width, length, quantity, label });
    }
  }

  return panels;
}
