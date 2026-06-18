import { StockPanel, CutPanel, PlacedCut, CuttingPattern, OptimizationResult } from './types';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function findBestFit(
  freeRects: Rect[],
  w: number,
  h: number
): { rectIndex: number; x: number; y: number; rotated: boolean } | null {
  let bestScore = Infinity;
  let best: { rectIndex: number; x: number; y: number; rotated: boolean } | null = null;

  for (let i = 0; i < freeRects.length; i++) {
    const r = freeRects[i];
    // Try normal orientation
    if (w <= r.width && h <= r.height) {
      const score = Math.min(r.width - w, r.height - h);
      if (score < bestScore) {
        bestScore = score;
        best = { rectIndex: i, x: r.x, y: r.y, rotated: false };
      }
    }
    // Try rotated
    if (h <= r.width && w <= r.height) {
      const score = Math.min(r.width - h, r.height - w);
      if (score < bestScore) {
        bestScore = score;
        best = { rectIndex: i, x: r.x, y: r.y, rotated: true };
      }
    }
  }

  return best;
}

function splitFreeRect(freeRect: Rect, placed: Rect): Rect[] {
  const result: Rect[] = [];

  // Right remainder
  if (placed.x + placed.width < freeRect.x + freeRect.width) {
    result.push({
      x: placed.x + placed.width,
      y: freeRect.y,
      width: freeRect.x + freeRect.width - (placed.x + placed.width),
      height: freeRect.height,
    });
  }

  // Bottom remainder
  if (placed.y + placed.height < freeRect.y + freeRect.height) {
    result.push({
      x: freeRect.x,
      y: placed.y + placed.height,
      width: freeRect.width,
      height: freeRect.y + freeRect.height - (placed.y + placed.height),
    });
  }

  return result;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function removeCoveredRects(freeRects: Rect[], placed: Rect): Rect[] {
  const newFree: Rect[] = [];

  for (const fr of freeRects) {
    if (!rectsOverlap(fr, placed)) {
      newFree.push(fr);
      continue;
    }
    newFree.push(...splitFreeRect(fr, placed));
  }

  // Remove rects contained by other rects
  const filtered: Rect[] = [];
  for (let i = 0; i < newFree.length; i++) {
    let contained = false;
    for (let j = 0; j < newFree.length; j++) {
      if (i === j) continue;
      if (
        newFree[i].x >= newFree[j].x &&
        newFree[i].y >= newFree[j].y &&
        newFree[i].x + newFree[i].width <= newFree[j].x + newFree[j].width &&
        newFree[i].y + newFree[i].height <= newFree[j].y + newFree[j].height
      ) {
        contained = true;
        break;
      }
    }
    if (!contained) filtered.push(newFree[i]);
  }

  return filtered;
}

interface FlatCut {
  width: number;
  length: number;
  label: string;
  colorIndex: number;
}

function patternKey(cuts: PlacedCut[]): string {
  const sorted = [...cuts].sort((a, b) => a.x - b.x || a.y - b.y || a.width - b.width || a.length - b.length);
  return sorted.map(c => `${c.x},${c.y},${c.width},${c.length}`).join('|');
}

export function optimize(stocks: StockPanel[], cutList: CutPanel[]): OptimizationResult {
  // Expand cut list into flat array sorted by area (descending)
  const flatCuts: FlatCut[] = [];
  cutList.forEach((cut, idx) => {
    for (let i = 0; i < cut.quantity; i++) {
      flatCuts.push({
        width: cut.width,
        length: cut.length,
        label: cut.label || `${cut.width}×${cut.length}`,
        colorIndex: idx,
      });
    }
  });
  flatCuts.sort((a, b) => b.width * b.length - a.width * a.length);

  // Expand stocks
  const expandedStocks: { width: number; length: number }[] = [];
  for (const s of stocks) {
    for (let i = 0; i < s.quantity; i++) {
      expandedStocks.push({ width: s.width, length: s.length });
    }
  }
  // Sort stocks by area ascending (use smaller sheets first)
  expandedStocks.sort((a, b) => a.width * a.length - b.width * b.length);

  const remaining = [...flatCuts];
  const patterns: CuttingPattern[] = [];
  const unplacedCuts: CutPanel[] = [];
  let stockIdx = 0;

  while (remaining.length > 0 && stockIdx < expandedStocks.length) {
    const stock = expandedStocks[stockIdx];
    stockIdx++;

    let freeRects: Rect[] = [{ x: 0, y: 0, width: stock.width, height: stock.length }];
    const placedCuts: PlacedCut[] = [];
    const toRemove: number[] = [];

    for (let i = 0; i < remaining.length; i++) {
      const cut = remaining[i];
      const fit = findBestFit(freeRects, cut.width, cut.length);
      if (!fit) continue;

      const pw = fit.rotated ? cut.length : cut.width;
      const ph = fit.rotated ? cut.width : cut.length;

      placedCuts.push({
        x: fit.x,
        y: fit.y,
        width: pw,
        length: ph,
        rotated: fit.rotated,
        label: cut.label,
        colorIndex: cut.colorIndex,
      });

      const placedRect: Rect = { x: fit.x, y: fit.y, width: pw, height: ph };
      freeRects = removeCoveredRects(freeRects, placedRect);
      toRemove.push(i);
    }

    // Remove placed cuts from remaining (reverse order)
    for (let i = toRemove.length - 1; i >= 0; i--) {
      remaining.splice(toRemove[i], 1);
    }

    if (placedCuts.length > 0) {
      const usedArea = placedCuts.reduce((sum, c) => sum + c.width * c.length, 0);
      patterns.push({
        stockWidth: stock.width,
        stockLength: stock.length,
        cuts: placedCuts,
        sheetCount: 1,
        usedArea,
        wasteArea: stock.width * stock.length - usedArea,
      });
    }
  }

  // Convert remaining to unplaced
  if (remaining.length > 0) {
    const grouped = new Map<string, { width: number; length: number; count: number }>();
    for (const r of remaining) {
      const key = `${r.width}x${r.length}`;
      const existing = grouped.get(key);
      if (existing) existing.count++;
      else grouped.set(key, { width: r.width, length: r.length, count: 1 });
    }
    for (const [, v] of grouped) {
      unplacedCuts.push({ id: crypto.randomUUID(), width: v.width, length: v.length, quantity: v.count });
    }
  }

  // Group identical patterns
  const patternMap = new Map<string, CuttingPattern>();
  for (const p of patterns) {
    const key = `${p.stockWidth}x${p.stockLength}_` + patternKey(p.cuts);
    const existing = patternMap.get(key);
    if (existing) {
      existing.sheetCount++;
      existing.usedArea += p.usedArea;
      existing.wasteArea += p.wasteArea;
    } else {
      patternMap.set(key, { ...p });
    }
  }

  const groupedPatterns = Array.from(patternMap.values());

  const totalStockArea = groupedPatterns.reduce(
    (sum, p) => sum + p.stockWidth * p.stockLength * p.sheetCount,
    0
  );
  const totalCutArea = groupedPatterns.reduce((sum, p) => sum + p.usedArea, 0);
  const scrapRate = totalCutArea > 0 ? ((totalStockArea - totalCutArea) / totalCutArea) * 100 : 0;

  return { patterns: groupedPatterns, totalStockArea, totalCutArea, scrapRate, unplacedCuts };
}
