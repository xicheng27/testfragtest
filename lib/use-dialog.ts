'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Shared modal/drawer behaviour for accessible overlays (AuthModal, MobileNav).
 *
 * While `isOpen` is true this hook:
 *  - locks background scroll (and compensates for the scrollbar so the page
 *    underneath doesn't shift),
 *  - moves focus into the dialog,
 *  - traps Tab focus inside the dialog,
 *  - closes on Escape,
 *  - returns focus to whatever was focused before it opened (e.g. the trigger).
 *
 * Returns a ref to attach to the dialog container. Give that container
 * `tabIndex={-1}` so it can receive focus when there are no focusable children.
 */
export function useDialog<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest onClose without re-running the main effect on each render.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock background scroll without a visible layout jump.
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const getFocusable = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter(el => el.offsetParent !== null)
        : [];

    // Move focus into the dialog on open.
    const firstFocusable = getFocusable()[0];
    (firstFocusable ?? node)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === node) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      // Return focus to the trigger when the dialog closes.
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return ref;
}
