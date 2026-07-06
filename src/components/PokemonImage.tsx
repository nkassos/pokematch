"use client";

import Image from "next/image";
import { useState } from "react";

export function PokemonImage({
  src,
  alt,
  sizes,
  loading,
}: {
  src: string;
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div
          role="status"
          aria-label="Loading"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        unoptimized
        className="object-contain"
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}