"use client";

import React from "react";
import { StatItem } from "@/lib/stages";
import { useCountUp } from "@/lib/useCountUp";

interface StatPanelProps {
  stat: StatItem;
  active: boolean;
  textColor?: string;
  prefersReducedMotion?: boolean;
}

export const StatPanel: React.FC<StatPanelProps> = ({
  stat,
  active,
  textColor = "#F4F1EA",
  prefersReducedMotion = false,
}) => {
  const animatedNumber = useCountUp(
    stat.value,
    900,
    active,
    prefersReducedMotion
  );

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        active
          ? "opacity-100 pointer-events-auto translate-x-0"
          : "opacity-0 pointer-events-none absolute inset-0 translate-x-6"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform, opacity",
      }}
      aria-hidden={!active}
    >
      <div className="flex flex-col items-start gap-2">
        <div
          className="flex items-baseline gap-1.5 font-sans font-bold tracking-tight transition-colors duration-400"
          style={{ color: textColor }}
        >
          <span className="text-5xl md:text-6xl tabular-nums leading-none">
            {animatedNumber}
          </span>
          <span className="text-2xl md:text-3xl font-medium opacity-75">
            {stat.unit}
          </span>
        </div>

        <h2
          className="text-lg md:text-xl font-normal tracking-[-0.01em] leading-snug transition-colors duration-400"
          style={{ color: textColor }}
        >
          {stat.label}
        </h2>

        {stat.footnote && (
          <p
            className="text-xs font-sans tracking-wide mt-1 transition-colors duration-400 opacity-60"
            style={{ color: textColor }}
          >
            {stat.footnote}
          </p>
        )}
      </div>
    </div>
  );
};
