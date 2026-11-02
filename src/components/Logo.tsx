"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "light" | "markOnly";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "default", className = "", size = "md" }: LogoProps) {
  const isLight = variant === "light";
  const isMarkOnly = variant === "markOnly";

  // Aspect ratio is 1600 x 641 (~2.496)
  const sizes = {
    sm: {
      width: 140,
      height: 56,
      containerClass: "h-9 sm:h-10 w-auto"
    },
    md: {
      width: 175,
      height: 70,
      containerClass: "h-11 sm:h-12 w-auto"
    },
    lg: {
      width: 220,
      height: 88,
      containerClass: "h-14 sm:h-16 w-auto"
    }
  };

  const selectedSize = sizes[size];

  if (isMarkOnly) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center transition-transform hover:scale-[1.02] ${className}`}
        aria-label="Jayaxis Company Ltd"
      >
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200/80 flex items-center justify-center p-0.5">
          <Image
            src="/logo.jpeg"
            alt="Jayaxis Mark"
            width={40}
            height={40}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </Link>
    );
  }

  if (isLight) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center transition-transform hover:scale-[1.02] ${className}`}
        aria-label="Jayaxis Company Ltd"
      >
        <div className="bg-white rounded-xl py-2 px-3 shadow-md border border-slate-200/40 inline-flex items-center">
          <Image
            src="/logo.jpeg"
            alt="Jayaxis Company Ltd - Civil | Structural | Water"
            width={selectedSize.width}
            height={selectedSize.height}
            className={`${selectedSize.containerClass} object-contain`}
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-transform hover:scale-[1.02] ${className}`}
      aria-label="Jayaxis Company Ltd"
    >
      <div className="inline-flex items-center py-0.5">
        <Image
          src="/logo.jpeg"
          alt="Jayaxis Company Ltd - Civil | Structural | Water"
          width={selectedSize.width}
          height={selectedSize.height}
          className={`${selectedSize.containerClass} object-contain`}
          priority
        />
      </div>
    </Link>
  );
}
