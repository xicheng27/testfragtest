'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

interface QuizChoiceImageProps {
  src: string;
  sizes: string;
  alt: string;
  productImage?: boolean; // packshot on white, use object-contain
  immediate?: boolean; // current question images should not wait for viewport lazy-loading
  eager?: boolean; // high-priority hero/current-above-fold image
  className?: string;
}

const isLocal = (src: string) => src.startsWith('/');

type Status = 'loading' | 'loaded' | 'error';

export default function QuizChoiceImage({
  src,
  sizes,
  alt,
  productImage = false,
  immediate = false,
  eager = false,
  className,
}: QuizChoiceImageProps) {
  const [status, setStatus] = useState<Status>('loading');
  // Bumped on retry to force a fresh <img> element and a genuine reload attempt.
  const [attempt, setAttempt] = useState(0);

  // Reset load/error state whenever the source changes so a recycled card never
  // shows the previous image's state (React's render-time reset pattern).
  const [renderedSrc, setRenderedSrc] = useState(src);
  if (src !== renderedSrc) {
    setRenderedSrc(src);
    setStatus('loading');
    setAttempt(0);
  }

  // Cached images can finish before React attaches onLoad; detect the already
  // complete case on mount so a successfully downloaded image is never left
  // hidden behind the skeleton.
  const measureRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, []);

  const retry = () => {
    setStatus('loading');
    setAttempt(count => count + 1);
  };

  const loaded = status === 'loaded';
  const failed = status === 'error';

  return (
    <div className={clsx('absolute inset-0 overflow-hidden', productImage ? 'bg-white' : 'bg-stone-200', className)}>
      {/* Skeleton shimmer sits BEHIND the image and only shows while loading;
          it never hides an image that has actually painted. */}
      {!loaded && !failed && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 motion-safe:animate-pulse"
          aria-hidden="true"
        />
      )}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-50 px-3 text-center">
          <span aria-hidden="true" className="text-xl text-stone-400">⛰️</span>
          <span className="text-xs font-medium text-stone-500">Image unavailable</span>
          <button
            type="button"
            onClick={retry}
            className="min-h-[32px] rounded-full border border-stone-300 px-3 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100"
          >
            Retry
          </button>
        </div>
      ) : (
        <Image
          key={attempt}
          ref={measureRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={isLocal(src)}
          loading={immediate || eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : immediate ? 'low' : 'auto'}
          quality={productImage ? 72 : 62}
          className={clsx(productImage ? 'object-contain p-3' : 'object-cover')}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}
