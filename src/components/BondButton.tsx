"use client";

import Link from "next/link";
import { CtaBlob } from "./icons";
import { cn } from "@/lib/utils";

interface BondButtonProps {
  href?: string;
  label?: string;
  className?: string;
  blobClass?: string;
  textClass?: string;
}

export function BondButton({
  href = "/contact",
  label = "Let's bond",
  className,
  blobClass = "text-copula-blue",
  textClass = "text-copula-white",
}: BondButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex aspect-square min-h-32 w-max min-w-32 items-center justify-center",
        className
      )}
    >
      <CtaBlob
        className={cn(
          "absolute inset-0 z-0 h-full w-full transition-all duration-1000 group-hover:scale-105 group-hover:rotate-45",
          blobClass
        )}
      />
      <span className={cn("h4 z-10 line-clamp-1 p-5 text-center", textClass)}>{label}</span>
    </Link>
  );
}
