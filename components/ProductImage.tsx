'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  immediate?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
}

const FALLBACK_IMAGE = '/images/products/fallback.svg';
const isLocal = (src: string) => src.startsWith('/');

type Status = 'loading' | 'loaded' | 'error';

export default function ProductImage({
  src,
  alt,
  immediate = false,
  eager = false,
  sizes = '(max-width: 672px) 100vw, 672px',
  className = 'object-contain p-6 sm:p-8',
}: ProductImageProps) {
  const imageSrc = src || FALLBACK_IMAGE;
  const [status, setStatus] = useState<Status>('loading');
  // Bumped on retry to force a fresh <img> element and a genuine reload attempt.
  const [attempt, setAttempt] = useState(0);

  // Reset load/error state whenever the source changes (render-time reset).
  const [renderedSrc, setRenderedSrc] = useState(imageSrc);
  if (imageSrc !== renderedSrc) {
    setRenderedSrc(imageSrc);
    setStatus('loading');
    setAttempt(0);
  }

  // Handle images that are already complete before onLoad can attach (cache).
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
    <>
      {/* Skeleton sits behind the image and only while loading — it never hides
          an image that has already painted. */}
      {!loaded && !failed && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-100 via-white to-stone-200 motion-safe:animate-pulse"
          aria-hidden="true"
        />
      )}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-50 px-4 text-center">
          <span aria-hidden="true" className="text-2xl text-stone-400">⛰️</span>
          <span className="text-sm font-medium text-stone-500">Image unavailable</span>
          <button
            type="button"
            onClick={retry}
            className="min-h-[36px] rounded-full border border-stone-300 px-4 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100"
          >
            Retry
          </button>
        </div>
      ) : (
        <Image
          key={attempt}
          ref={measureRef}
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          loading={immediate || eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : immediate ? 'low' : 'auto'}
          quality={70}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          unoptimized={isLocal(imageSrc)}
        />
      )}
    </>
  );
}
