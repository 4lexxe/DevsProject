import React from "react"
import { cn } from "../utils/util" // Asegúrate de que tienes una función para concatenar clases

interface ProgressBarProps {
  progress: number // Número entre 0 y 100
  color?: "blue" | "green" | "red" | "yellow"
  showLabel?: boolean
  className?: string
}

export default function ProgressBar({
  progress,
  color = "blue",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const colorVariants = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  }

  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-4", className)}>
      <div
        className={cn(
          "h-4 rounded-full transition-all duration-300 ease-in-out",
          colorVariants[color]
        )}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      >
        {showLabel && (
          <span className="text-white text-xs font-bold block text-center">
            {progress}%
          </span>
        )}
      </div>
    </div>
  )
}
