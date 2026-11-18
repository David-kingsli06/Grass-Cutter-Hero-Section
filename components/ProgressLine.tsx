"use client";

import React from "react";

interface ProgressLineProps {
  progress: number;
  className?: string;
  prefersReducedMotion?: boolean;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({
  progress,
  className = "",
  prefersReducedMotion = false,
}) => {
  if (prefersReducedMotion) return null;

  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-[2px] w-full z-40 bg-[#A9B79A]/15 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#A9B79A] w-full origin-left will-change-transform"
        style={{
          transform: `scaleX(${clampedProgress})`,
          transition: "transform 40ms linear",
        }}
      />
    </div>
  );
};
