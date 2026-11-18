"use client";

import React from "react";
import { STAGE_3_STATS } from "@/lib/stages";
import { TypeRevealHeadline, TypeRevealSubline, WordmarkStagger } from "./TypeReveal";
import { StatPanel } from "./StatPanel";

interface HeroOverlayProps {
  progress: number;
  currentStageIndex: number;
  isInitialReady: boolean;
  textColor?: string;
  brandName?: string;
  prefersReducedMotion?: boolean;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  progress,
  currentStageIndex,
  isInitialReady,
  textColor = "#F4F1EA",
  brandName = "VERDANT",
  prefersReducedMotion = false,
}) => {
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-[6vw]">
        <div className="w-full flex justify-between items-start" />
        <div className="flex flex-col items-center justify-center text-center">
          <p
            className="font-sans font-extrabold tracking-[-0.02em] leading-none text-[56px] md:text-[96px] transition-colors duration-400"
            style={{ color: textColor }}
          >
            {brandName}
          </p>
          <p
            className="font-sans font-normal text-lg md:text-2xl mt-4 transition-colors duration-400"
            style={{ color: textColor }}
          >
            Built for the lawn you already have.
          </p>
        </div>
        <div className="w-full" />
      </div>
    );
  }

  // Stage 01 progress [0.00, 0.20]
  const isStage1 = progress >= 0.0 && progress < 0.2;
  const stage1Progress = Math.min(1, Math.max(0, progress / 0.2));
  // Moves 40px upward and fades out as p moves across the stage
  const stage1DriftY = -40 * stage1Progress;
  const stage1Opacity = isStage1
    ? Math.max(0, 1 - Math.pow(stage1Progress, 1.8))
    : 0;

  // Stage 03 [0.40, 0.80]
  const isStage3 = progress >= 0.4 && progress < 0.8;
  const stage3Progress = isStage3 ? (progress - 0.4) / 0.4 : 0;
  const activeStatIndex = isStage3
    ? Math.min(2, Math.floor(stage3Progress * 3))
    : -1;

  // Stage 04 [0.80, 1.00]
  const isStage4 = progress >= 0.8;
  const stage4Opacity = isStage4
    ? Math.min(1, (progress - 0.8) / 0.04)
    : 0;

  const scrollCueOpacity = progress < 0.05 ? Math.max(0, 1 - progress / 0.05) : 0;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {/* STAGE 01: Headline & Subline drifting 40px upward & fading out */}
      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-start md:justify-center px-[6vw] pt-[15vh] md:pt-0"
        style={{
          opacity: stage1Opacity,
          transform: `translateY(${stage1DriftY}px)`,
          pointerEvents: isStage1 ? "auto" : "none",
          willChange: "transform, opacity",
        }}
      >
        <div className="w-full md:w-[26vw] max-w-[440px] flex flex-col gap-4">
          <TypeRevealHeadline
            lines={["Your lawn,", "cut clean."]}
            active={isInitialReady && isStage1}
            delayMs={200}
            textColor={textColor}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px]"
          />
          <TypeRevealSubline
            text="A quieter, faster way to keep the grass even."
            active={isInitialReady && isStage1}
            delayMs={400}
            textColor={textColor}
            className="text-base sm:text-lg md:text-[22px] max-w-sm"
          />
        </div>
      </div>

      {/* STAGE 03: Stat Panels (Right Column) */}
      <div
        className="absolute top-0 right-0 w-full h-full flex flex-col justify-start md:justify-center items-start md:items-end px-[6vw] pt-[15vh] md:pt-0"
        style={{
          pointerEvents: isStage3 ? "auto" : "none",
        }}
      >
        <div className="w-full md:w-[22vw] min-w-[280px] max-w-[360px] relative h-[180px]">
          {STAGE_3_STATS.map((stat, idx) => (
            <StatPanel
              key={stat.id}
              stat={stat}
              active={isStage3 && activeStatIndex === idx}
              textColor={textColor}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>

      {/* STAGE 04: Wordmark & Subline */}
      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start md:justify-center px-[6vw] pt-[16vh] md:pt-0 transition-opacity duration-500"
        style={{
          opacity: stage4Opacity,
          pointerEvents: isStage4 ? "auto" : "none",
        }}
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto md:-translate-y-24">
          <WordmarkStagger
            text={brandName}
            active={isStage4}
            textColor={textColor}
            className="text-[56px] sm:text-[76px] md:text-[96px]"
            prefersReducedMotion={prefersReducedMotion}
          />
          <div
            className="transition-all duration-700 ease-out mt-3 md:mt-4"
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: "380ms",
              transform: isStage4 ? "translateY(0)" : "translateY(14px)",
              opacity: isStage4 ? 1 : 0,
            }}
          >
            <p
              className="font-sans font-normal text-base sm:text-lg md:text-[22px] transition-colors duration-400"
              style={{ color: textColor }}
            >
              Built for the lawn you already have.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollCueOpacity }}
        aria-hidden="true"
      >
        <span
          className="text-[12px] uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-400"
          style={{ color: textColor }}
        >
          Scroll
        </span>
        <div
          className="w-[1px] h-[40px] transition-colors duration-400"
          style={{ backgroundColor: textColor === "#14190F" ? "#14190F" : "#A9B79A" }}
        />
      </div>
    </div>
  );
};
