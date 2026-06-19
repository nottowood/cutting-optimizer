'use client';

import { CuttingPattern } from '@/lib/types';
import { getCutColor } from '@/lib/colors';

interface CuttingDiagramProps {
  pattern: CuttingPattern;
  index: number;
}

export default function CuttingDiagram({ pattern, index }: CuttingDiagramProps) {
  const padding = 10;
  const svgW = 500;
  const scale = (svgW - padding * 2) / pattern.stockWidth;
  const svgH = pattern.stockLength * scale + padding * 2;

  const efficiency = (pattern.usedArea / pattern.sheetCount) / (pattern.stockWidth * pattern.stockLength) * 100;

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#22252b', border: '1px solid #2e3138' }}>
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: '#282b32', borderBottom: '1px solid #2e3138' }}
      >
        <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#e4e5e7' }}>
          Pattern #{index + 1}
          <span
            className="ml-2 px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: '#5b9bd520', color: '#5b9bd5' }}
          >
            x{pattern.sheetCount} sheet{pattern.sheetCount > 1 ? 's' : ''}
          </span>
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#a0a8b6' }}>
          <span>{pattern.stockWidth} x {pattern.stockLength}</span>
          <span
            className="px-2 py-0.5 rounded"
            style={{
              background: efficiency > 70 ? '#70ad4720' : '#e8a63120',
              color: efficiency > 70 ? '#70ad47' : '#e8a631',
            }}
          >
            {efficiency.toFixed(1)}% used
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-lg"
          style={{ maxHeight: '400px' }}
        >
          {/* Stock background */}
          <rect
            x={padding}
            y={padding}
            width={pattern.stockWidth * scale}
            height={pattern.stockLength * scale}
            fill="#1a1d23"
            stroke="#3a3d45"
            strokeWidth="1"
          />

          {/* Grid lines */}
          {Array.from({ length: Math.floor(pattern.stockWidth / 100) }, (_, i) => (
            <line
              key={`vg${i}`}
              x1={padding + (i + 1) * 100 * scale}
              y1={padding}
              x2={padding + (i + 1) * 100 * scale}
              y2={padding + pattern.stockLength * scale}
              stroke="#2e3138"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: Math.floor(pattern.stockLength / 100) }, (_, i) => (
            <line
              key={`hg${i}`}
              x1={padding}
              y1={padding + (i + 1) * 100 * scale}
              x2={padding + pattern.stockWidth * scale}
              y2={padding + (i + 1) * 100 * scale}
              stroke="#2e3138"
              strokeWidth="0.5"
            />
          ))}

          {/* Cut pieces */}
          {pattern.cuts.map((cut, i) => {
            const color = getCutColor(cut.colorIndex);
            const cx = padding + cut.x * scale;
            const cy = padding + cut.y * scale;
            const cw = cut.width * scale;
            const ch = cut.length * scale;
            const fontSize = Math.min(12, Math.min(cw, ch) * 0.25);

            return (
              <g key={i}>
                <rect
                  x={cx}
                  y={cy}
                  width={cw}
                  height={ch}
                  fill={color}
                  fillOpacity="0.85"
                  stroke="#1a1d23"
                  strokeWidth="1"
                />
                {fontSize >= 5 && (
                  <>
                    <text
                      x={cx + cw / 2}
                      y={cy + ch / 2 - fontSize * 0.3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      fontWeight="bold"
                      fill="#1a1d23"
                    >
                      {cut.label}
                    </text>
                    <text
                      x={cx + cw / 2}
                      y={cy + ch / 2 + fontSize * 0.8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize * 0.75}
                      fill="#1a1d23"
                      fillOpacity="0.7"
                    >
                      {cut.width}x{cut.length}
                      {cut.rotated ? ' R' : ''}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {Array.from(
          new Map(pattern.cuts.map(c => [c.colorIndex, c])).values()
        ).map(cut => (
          <span
            key={cut.colorIndex}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs"
            style={{ background: '#1a1d23', border: '1px solid #2e3138', color: '#9ca3af' }}
          >
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: getCutColor(cut.colorIndex) }}
            />
            {cut.label}
          </span>
        ))}
      </div>
    </div>
  );
}
