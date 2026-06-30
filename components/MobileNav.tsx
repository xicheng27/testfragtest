'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import clsx from 'clsx';
import { useDialog } from '@/lib/use-dialog';

export interface MobileNavItem {
  label: string;
  /** Internal route or in-page anchor. */
  href?: string;
  /** Action handler (used for in-app view switches like Shelf / Sign out). */
  onClick?: () => void;
  /** Opens in a new tab when true. */
  external?: boolean;
}

interface MobileNavProps {
  items: MobileNavItem[];
  /** Optional emphasised call-to-action rendered at the bottom of the sheet. */
  cta?: { label: string; href?: string; onClick?: () => void };
  /**
   * Width at which the desktop inline nav takes over and this button hides.
   * Must match the breakpoint the host header uses to reveal its inline links.
   */
  breakpoint?: 'sm' | 'md';
  /** Accessible label for the trigger button. */
  label?: string;
}

export default function MobileNav({
  items,
  cta,
  breakpoint = 'md',
  label = 'Open menu',
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const dialogRef = useDialog<HTMLDivElement>(open, () => setOpen(false));

  // Close the sheet on route/anchor navigation so it never lingers over content.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [open]);

  const runItem = (item: MobileNavItem) => {
    setOpen(false);
    item.onClick?.();
  };

  return (
    <div className={breakpoint === 'sm' ? 'sm:hidden' : 'md:hidden'} data-ui="mobile-nav">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-800 shadow-sm transition-colors hover:border-stone-400 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-stone-950/40 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col gap-1 overflow-y-auto border-l border-stone-200 bg-stone-50 p-5 shadow-[0_0_60px_rgba(28,25,23,0.25)] outline-none [padding-top:calc(1.25rem+env(safe-area-inset-top))]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-black tracking-[-0.03em] text-stone-950">ScentMatch</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col" aria-label="Site menu">
              {items.map(item => {
                const className =
                  'flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-stone-700 transition-colors hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950';
                if (item.href) {
                  return item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className={className}>
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button key={item.label} type="button" onClick={() => runItem(item)} className={clsx(className, 'text-left')}>
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {cta && (
              <div className="mt-auto pt-4">
                {cta.href ? (
                  <Link
                    href={cta.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center justify-center rounded-full bg-stone-950 px-5 text-base font-semibold text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                  >
                    {cta.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      cta.onClick?.();
                    }}
                    className="flex min-h-12 w-full items-center justify-center rounded-full bg-stone-950 px-5 text-base font-semibold text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                  >
                    {cta.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
