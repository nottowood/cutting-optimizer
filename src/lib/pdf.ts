import { jsPDF } from 'jspdf';
import { CuttingPattern, OptimizationResult } from './types';
import { getCutColor } from './colors';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function exportPDF(result: OptimizationResult) {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageW = 287;
  const pageH = 190;

  // Title page
  doc.setFontSize(24);
  doc.setTextColor(50, 50, 50);
  doc.text('2D Cutting Optimizer Report', pageW / 2, 30, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, 42, { align: 'center' });

  // Summary
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text('Summary', 20, 60);

  doc.setFontSize(11);
  const totalSheets = result.patterns.reduce((s, p) => s + p.sheetCount, 0);
  const lines = [
    `Total Stock Panels Used: ${totalSheets}`,
    `Total Stock Area: ${result.totalStockArea.toLocaleString()} sq units`,
    `Total Cut Area: ${result.totalCutArea.toLocaleString()} sq units`,
    `Waste Area: ${(result.totalStockArea - result.totalCutArea).toLocaleString()} sq units`,
    `Scrap Rate: ${result.scrapRate.toFixed(2)}%`,
  ];
  lines.forEach((l, i) => doc.text(l, 25, 72 + i * 8));

  if (result.unplacedCuts.length > 0) {
    doc.setTextColor(200, 50, 50);
    doc.text(`Unplaced cuts: ${result.unplacedCuts.length} type(s)`, 25, 72 + lines.length * 8 + 4);
  }

  // Pattern pages
  result.patterns.forEach((pattern, idx) => {
    doc.addPage('landscape');
    drawPattern(doc, pattern, idx, pageW, pageH);
  });

  doc.save('cutting-plan.pdf');
}

function drawPattern(doc: jsPDF, pattern: CuttingPattern, idx: number, pageW: number, pageH: number) {
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(
    `Pattern #${idx + 1} — ${pattern.stockWidth} × ${pattern.stockLength} (×${pattern.sheetCount} sheet${pattern.sheetCount > 1 ? 's' : ''})`,
    15,
    15
  );

  const margin = 20;
  const drawAreaW = pageW - margin * 2;
  const drawAreaH = pageH - margin - 10;
  const scale = Math.min(drawAreaW / pattern.stockWidth, drawAreaH / pattern.stockLength);
  const offsetX = margin + (drawAreaW - pattern.stockWidth * scale) / 2;
  const offsetY = 25;

  // Stock outline
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.setFillColor(240, 240, 240);
  doc.rect(offsetX, offsetY, pattern.stockWidth * scale, pattern.stockLength * scale, 'FD');

  // Cut pieces
  for (const cut of pattern.cuts) {
    const rgb = hexToRgb(getCutColor(cut.colorIndex));
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.3);
    doc.rect(
      offsetX + cut.x * scale,
      offsetY + cut.y * scale,
      cut.width * scale,
      cut.length * scale,
      'FD'
    );

    // Label
    const fontSize = Math.min(8, Math.min(cut.width * scale, cut.length * scale) * 0.3);
    if (fontSize >= 3) {
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 30, 30);
      doc.text(
        cut.label,
        offsetX + cut.x * scale + (cut.width * scale) / 2,
        offsetY + cut.y * scale + (cut.length * scale) / 2,
        { align: 'center', baseline: 'middle' }
      );
    }
  }

  // Stats
  const efficiency = ((pattern.usedArea / pattern.sheetCount) / (pattern.stockWidth * pattern.stockLength) * 100);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Efficiency: ${efficiency.toFixed(1)}%`, pageW - 15, pageH + 5, { align: 'right' });
}
