export interface StockPanel {
  id: string;
  width: number;
  length: number;
  quantity: number;
}

export interface CutPanel {
  id: string;
  width: number;
  length: number;
  quantity: number;
  label?: string;
}

export interface PlacedCut {
  x: number;
  y: number;
  width: number;
  length: number;
  rotated: boolean;
  label: string;
  colorIndex: number;
}

export interface CuttingPattern {
  stockWidth: number;
  stockLength: number;
  cuts: PlacedCut[];
  sheetCount: number;
  usedArea: number;
  wasteArea: number;
}

export interface OptimizationResult {
  patterns: CuttingPattern[];
  totalStockArea: number;
  totalCutArea: number;
  scrapRate: number;
  unplacedCuts: CutPanel[];
}

export interface ThemeColors {
  foreground: string;
  background: string;
}
