'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  tone?: 'light' | 'dark';
}

export default function ProgressBar({ current, total, tone = 'light' }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  const dark = tone === 'dark';

  return (
    <div className="w-full">
      <div className={`mb-2 flex justify-between text-xs font-light uppercase tracking-widest ${dark ? 'text-stone-500' : 'text-stone-400'}`}>
        <span>Question {current} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div
        className={`relative h-1 w-full overflow-hidden rounded-full ${dark ? 'bg-white/15' : 'bg-stone-200'}`}
        role="progressbar"
        aria-label={`Quiz progress: question ${current} of ${total}`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`${percent}% complete`}
      >
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${dark ? 'bg-white' : 'bg-gradient-to-r from-stone-950 via-fuchsia-500 to-amber-400'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
