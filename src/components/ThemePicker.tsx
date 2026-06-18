'use client';

import { ThemeColors } from '@/lib/types';

interface ThemePickerProps {
  theme: ThemeColors;
  onChange: (theme: ThemeColors) => void;
  onLogout: () => void;
}

const PRESETS = [
  { name: 'Steel Dark', fg: '#e4e5e7', bg: '#1a1d23' },
  { name: 'Gunmetal', fg: '#d1d5db', bg: '#111418' },
  { name: 'Concrete', fg: '#374151', bg: '#f3f4f6' },
  { name: 'Blueprint', fg: '#e0e7ff', bg: '#1e2a3a' },
];

export default function ThemePicker({ theme, onChange, onLogout }: ThemePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs opacity-50">FG</label>
        <input
          type="color"
          value={theme.foreground}
          onChange={e => onChange({ ...theme, foreground: e.target.value })}
          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs opacity-50">BG</label>
        <input
          type="color"
          value={theme.background}
          onChange={e => onChange({ ...theme, background: e.target.value })}
          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
        />
      </div>
      <div className="h-5 w-px opacity-20" style={{ background: theme.foreground }} />
      {PRESETS.map(preset => (
        <button
          key={preset.name}
          onClick={() => onChange({ foreground: preset.fg, background: preset.bg })}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded overflow-hidden transition-all hover:scale-110"
          style={{ border: `1px solid ${theme.foreground}33` }}
          title={preset.name}
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0" style={{ background: preset.bg }} />
            <div className="absolute inset-[30%] rounded-sm" style={{ background: preset.fg }} />
          </div>
        </button>
      ))}
      <div className="h-5 w-px opacity-20" style={{ background: theme.foreground }} />
      <button
        onClick={onLogout}
        className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
        style={{ background: '#dc262622', color: '#f87171' }}
      >
        Logout
      </button>
    </div>
  );
}
