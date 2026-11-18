"use client";

import React from "react";

interface StageCounterProps {
  currentStageNumber: string;
  totalStages?: string;
  className?: string;
  prefersReducedMotion?: boolean;
}

export const StageCounter: React.FC<StageCounterProps> = ({
  currentStageNumber,
  totalStages = "04",
  className = "",
  prefersReducedMotion = false,
}) => {
  return (
    <div
      className={`hidden md:flex items-center text-xs tracking-[0.2em] font-sans font-medium text-[#A9B79A] uppercase select-none ${className}`}
      aria-label={`Current stage ${currentStageNumber} of ${totalStages}`}
    >
      <div className="relative w-6 h-5 overflow-hidden flex items-center justify-start">
        <span
          key={currentStageNumber}
          className={`inline-block ${
            prefersReducedMotion
              ? ""
              : "transition-opacity duration-300 ease-out"
          }`}
          style={{ willChange: "opacity" }}
        >
          {currentStageNumber}
        </span>
      </div>
      <span className="mx-1 text-[#A9B79A]/50">/</span>
      <span>{totalStages}</span>
    </div>
  );
};
