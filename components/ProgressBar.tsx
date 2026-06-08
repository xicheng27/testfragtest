'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-stone-400 mb-2 font-light tracking-widest uppercase">
        <span>Question {current} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-px bg-stone-200 w-full relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-stone-800 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
