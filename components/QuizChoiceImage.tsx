'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

interface QuizChoiceImageProps {
  src: string;
  sizes: string;
  alt: string;
  productImage?: boolean; // packshot on white, use object-contain
  immediate?: boolean; // current question images should not wait for viewport lazy-loading
  eager?: boolean; // high-priority hero/current-above-fold image
  className?: string;
}

export default function QuizChoiceImage({
  src,
  sizes,
  alt,
  productImage = false,
  immediate = false,
  eager = false,
  className,
}: QuizChoiceImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  const loaded = loadedSrc === src || failed;

  return (
    <div className={clsx('absolute inset-0 overflow-hidden', productImage ? 'bg-white' : 'bg-stone-200', className)}>
      {/* Skeleton shimmer while the image decodes, preventing a blank flash. */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 transition-opacity duration-150 motion-safe:animate-pulse',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      />
      {failed ? (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.86),transparent_34%),linear-gradient(135deg,#f8f5ee,#e7dfd2_48%,#cfc3b3)]"
          aria-hidden="true"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={immediate || eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : immediate ? 'low' : 'auto'}
          quality={productImage ? 72 : 62}
          className={clsx(
            'transition-opacity duration-150',
            loaded ? 'opacity-100' : 'opacity-0',
            productImage ? 'object-contain p-3' : 'object-cover',
          )}
          onLoad={() => setLoadedSrc(src)}
          onError={() => {
            setFailedSrc(src);
            setLoadedSrc(src);
          }}
        />
      )}
    </div>
  );
}
