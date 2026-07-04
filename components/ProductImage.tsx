'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

interface ProductImageProps {
  src: string;
  alt: string;
  eager?: boolean;
  sizes?: string;
  className?: string;
}

const FALLBACK_IMAGE = '/images/products/fallback.svg';

export default function ProductImage({
  src,
  alt,
  eager = false,
  sizes = '(max-width: 672px) 100vw, 672px',
  className = 'object-contain p-6 sm:p-8',
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const imageSrc = !src || failedSrc === src ? FALLBACK_IMAGE : src;

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 via-white to-stone-200 transition-opacity duration-300',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      />
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={clsx(className, 'transition-opacity duration-200', loaded ? 'opacity-100' : 'opacity-0')}
        priority={eager}
        loading={eager ? undefined : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (imageSrc !== FALLBACK_IMAGE) {
            setLoaded(false);
            setFailedSrc(src);
          } else {
            setLoaded(true);
          }
        }}
        unoptimized={imageSrc.endsWith('.svg')}
      />
    </>
  );
}
