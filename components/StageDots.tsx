"use client";

import React from "react";

import { STAGES } from "@/lib/stages";

interface StageDotsProps {
  currentStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
  className?: string;
  prefersReducedMotion?: boolean;
}

export const StageDots: React.FC<StageDotsProps> = ({
  currentStageIndex,
  onSelectStage,
  className = "",
  prefersReducedMotion = false,
}) => {
  if (prefersReducedMotion) return null;

  return (
    <nav
      aria-label="Stage timeline navigation"
      className={`hidden md:flex flex-col gap-2 fixed right-2 top-1/2 -translate-y-1/2 z-40 p-2 ${className}`}
    >
      {STAGES.map((stage, idx) => {
        const isActive = currentStageIndex === idx;
        return (
          <button
            key={stage.id}
            onClick={() => onSelectStage(idx)}
            className="w-3 h-3 flex items-center justify-center rounded-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B79A] transition-all duration-200"
            aria-label={`Go to stage ${stage.label}, ${stage.name}`}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "w-2.5 h-2.5 bg-[#A9B79A] scale-100"
                  : "w-2 h-2 border border-[#A9B79A] bg-transparent opacity-60 group-hover:opacity-100 group-hover:scale-110"
            }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
