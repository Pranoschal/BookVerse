"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface HamsterSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
  loadingText?: string
}

export default function HamsterSpinner({
  size = "md",
  className,
  showText = false,
  loadingText = "Loading...",
}: HamsterSpinnerProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* Hamster GIF Container */}
      <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])}>
        <Image
          src="/hamster-wheel.gif"
          alt="Cute hamster running in wheel"
          fill
          className="object-cover object-center rounded-full"
          unoptimized
          priority
        />
      </div>

      {/* Loading Text */}
      {showText && <p className={cn("font-medium text-purple-600 animate-pulse", textSizes[size])}>{loadingText}</p>}
    </div>
  )
}
