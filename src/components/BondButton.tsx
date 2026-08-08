"use client";

import Link from "next/link";
import { CtaBlob } from "./icons";
import { cn } from "@/lib/utils";

interface BondButtonProps {
  /**
   * Optional link destination. When omitted, the CTA renders as a `<button>`
   * and calls {@link BondButtonProps.onClick} instead of navigating — this
   * avoids pointing at routes that do not exist.
   */
  href?: string;
  /** Click handler used when the CTA renders as a button (no `href`). */
  onClick?: () => void;
  label?: string;
  className?: string;
  blobClass?: string;
  textClass?: string;
}

export function BondButton({
  href,
  onClick,
  label = "Let's bond",
  className,
  blobClass = "text-copula-blue",
  textClass = "text-copula-white",
}: BondButtonProps) {
  // Identical classes for both renderings so the visual output never changes.
  const rootClass = cn(
    "group relative inline-flex aspect-square min-h-32 w-max min-w-32 items-center justify-center",
    className
  );

  const content = (
    <>
      <CtaBlob
        className={cn(
          "absolute inset-0 z-0 h-full w-full transition-all duration-1000 group-hover:scale-105 group-hover:rotate-45",
          blobClass
        )}
      />
      <span className={cn("h4 z-10 line-clamp-1 p-5 text-center", textClass)}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rootClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rootClass}>
      {content}
    </button>
  );
}
