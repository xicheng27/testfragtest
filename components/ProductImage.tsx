'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  eager?: boolean;
}

const FALLBACK_IMAGE = '/images/products/fallback.svg';

export default function ProductImage({ src, alt, eager = false }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = !src || failedSrc === src ? FALLBACK_IMAGE : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 672px) 100vw, 672px"
      className="object-contain p-6 sm:p-8"
      loading={eager ? 'eager' : 'lazy'}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) setFailedSrc(src);
      }}
      unoptimized={imageSrc.endsWith('.svg')}
    />
  );
}
