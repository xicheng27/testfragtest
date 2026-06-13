'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

interface QuizChoiceImageProps {
  src: string;
  sizes: string;
  alt: string;
  productImage?: boolean;
  eager?: boolean;
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
      <div
        className={clsx(
          'absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 transition-opacity',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      />
      {!productImage && (
        <>
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className="scale-110 object-cover opacity-45 blur-xl"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-white/10" />
        </>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        className={clsx(
          'object-contain transition-opacity duration-200',
          loaded ? 'opacity-100' : 'opacity-0',
          productImage ? 'p-2.5 sm:p-3' : 'p-0.5',
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
