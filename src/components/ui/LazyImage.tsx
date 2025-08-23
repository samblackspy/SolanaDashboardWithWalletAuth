"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "./skeleton";

export type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LazyImage({ src, alt, className, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && <Skeleton className="absolute inset-0" />}

      {inView && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          {...props}
        />
      )}
    </div>
  );
}
