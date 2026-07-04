'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

interface QuizChoiceImageProps {
  src: string;
  sizes: string;
  alt: string;
  productImage?: boolean; // packshot on white, use object-contain
  eager?: boolean; // current/visible question loads immediately
  className?: string;
}

export default function QuizChoiceImage({
  src,
  sizes,
  alt,
  productImage = false,
  eager = false,
  className,
}: QuizChoiceImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx('absolute inset-0 overflow-hidden', productImage ? 'bg-white' : 'bg-stone-200', className)}>
      {/* Skeleton shimmer while the image decodes, preventing a blank flash. */}
      <div
        className={clsx(
          'absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 transition-opacity duration-300',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={eager}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        className={clsx(
          'transition-opacity duration-200',
          loaded ? 'opacity-100' : 'opacity-0',
          productImage ? 'object-contain p-3' : 'object-cover',
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
