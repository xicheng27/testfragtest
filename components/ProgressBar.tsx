'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  tone?: 'light' | 'dark';
  compact?: boolean;
}

export default function ProgressBar({ current, total, tone = 'light', compact = false }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  const dark = tone === 'dark';

  return (
    <div className="w-full">
      {!compact && (
        <div className={`mb-2 flex justify-between text-xs font-light uppercase tracking-widest ${dark ? 'text-stone-500' : 'text-stone-400'}`}>
          <span>Question {current} of {total}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        className={`relative w-full overflow-hidden rounded-full ${compact ? 'h-1.5' : 'h-1'} ${dark ? 'bg-white/15' : 'bg-stone-200'}`}
        role="progressbar"
        aria-label={`Quiz progress: question ${current} of ${total}`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`${percent}% complete`}
      >
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${dark ? 'bg-white' : 'bg-gradient-to-r from-[#1c1917] via-[#8a6a34] to-[#b08d57]'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
