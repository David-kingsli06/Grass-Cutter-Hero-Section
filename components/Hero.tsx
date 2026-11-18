"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGES, getCurrentStageIndex } from "@/lib/stages";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FrameCanvas } from "./FrameCanvas";
import { HeroOverlay } from "./HeroOverlay";
import { StageCounter } from "./StageCounter";
import { ProgressLine } from "./ProgressLine";
import { StageDots } from "./StageDots";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  brandName?: string;
}

// Stage background gradient definitions
const STAGE_GRADIENTS = [
  {
    id: 0,
    gradient: "linear-gradient(180deg, #DCE8D0 0%, #B9CBA8 100%)",
    isLight: true,
  },
  {
    id: 1,
    gradient: "linear-gradient(180deg, #C9DCB8 0%, #9FBA8C 100%)",
    isLight: true,
  },
  {
    id: 2,
    gradient: "linear-gradient(180deg, #5E7F48 0%, #2F4A26 100%)",
    isLight: false,
  },
  {
    id: 3,
    gradient: "linear-gradient(180deg, #E8C98A 0%, #8F5E2E 100%)",
    isLight: false,
  },
];

export const Hero: React.FC<HeroProps> = ({ brandName = "SILVERCLAD" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion) {
      setProgress(1.0);
      setCurrentStageIdx(3);
      setIsInitialReady(true);
      return;
    }

    const stageSnapPoints = [0, 0.3, 0.6, 1.0];
    let isTransitioning = false;
    let targetStageIndex = 0;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        setCurrentStageIdx(getCurrentStageIndex(p));
      },
    });

    scrollTriggerRef.current = trigger;

    const scrollToStage = (index: number) => {
      const clampedIndex = Math.max(0, Math.min(stageSnapPoints.length - 1, index));
      targetStageIndex = clampedIndex;
      isTransitioning = true;

      const totalDist = container.offsetHeight - window.innerHeight;
      const targetScroll = container.offsetTop + stageSnapPoints[clampedIndex] * totalDist;

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      setTimeout(() => {
        isTransitioning = false;
      }, 1000);
    };

    const handleWheel = (e: WheelEvent) => {
      // Determine if the scroll is within the hero container
      const rect = container.getBoundingClientRect();
      const inHero = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!inHero) return;

      // Allow natural scrolling out at edges
      if (targetStageIndex === 0 && e.deltaY < 0 && window.scrollY <= container.offsetTop) {
        return;
      }
      if (
        targetStageIndex === stageSnapPoints.length - 1 &&
        e.deltaY > 0 &&
        window.scrollY >= container.offsetTop + container.offsetHeight - window.innerHeight
      ) {
        return;
      }

      e.preventDefault();

      if (isTransitioning) return;
      if (Math.abs(e.deltaY) < 18) return; // Ignore slight micro-jitters

      if (e.deltaY > 0) {
        if (targetStageIndex < stageSnapPoints.length - 1) {
          scrollToStage(targetStageIndex + 1);
        }
      } else if (e.deltaY < 0) {
        if (targetStageIndex > 0) {
          scrollToStage(targetStageIndex - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      trigger.kill();
      scrollTriggerRef.current = null;
    };
  }, [prefersReducedMotion]);

  const handleSelectStage = useCallback((index: number) => {
    if (!containerRef.current) return;
    const targetProgress = STAGES[index].range[0];
    const totalScrollableDistance =
      containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY =
      containerRef.current.offsetTop + targetProgress * totalScrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }, []);

  const handleInitialReady = useCallback(() => {
    setIsInitialReady(true);
  }, []);

  // Text color adaptation: light stages (01, 02) switch to #14190F, dark stages (03, 04) use #F4F1EA
  const currentStageLight = STAGE_GRADIENTS[currentStageIdx]?.isLight ?? false;
  const textColor = currentStageLight ? "#14190F" : "#F4F1EA";

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${
        prefersReducedMotion ? "h-screen" : "h-[400vh]"
      } bg-[#14190F]`}
      aria-label="Interactive Hero Presentation"
    >
      {/* Stage Background Gradient Layers with 600ms crossfade cubic-bezier(0.22, 1, 0.36, 1) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
          {STAGE_GRADIENTS.map((stage) => (
            <div
              key={stage.id}
              className="absolute inset-0 w-full h-full transition-opacity duration-[600ms]"
              style={{
                background: stage.gradient,
                opacity: currentStageIdx === stage.id ? 1 : 0,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ))}
        </div>

        {/* Frame Canvas with smooth 476-frame scrubbing */}
        <FrameCanvas
          progress={progress}
          isReady={isInitialReady}
          onInitialReady={handleInitialReady}
          prefersReducedMotion={prefersReducedMotion}
        />

        {!prefersReducedMotion && (
          <div className="absolute top-8 left-[6vw] z-30 pointer-events-none">
            <StageCounter
              currentStageNumber={STAGES[currentStageIdx].label}
              totalStages="04"
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )}

        {!prefersReducedMotion && (
          <StageDots
            currentStageIndex={currentStageIdx}
            onSelectStage={handleSelectStage}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        {/* HeroOverlay with 40px text drift, 24px stat slide, and stage text contrast */}
        <HeroOverlay
          progress={progress}
          currentStageIndex={currentStageIdx}
          isInitialReady={isInitialReady}
          textColor={textColor}
          brandName={brandName}
          prefersReducedMotion={prefersReducedMotion}
        />

        {!prefersReducedMotion && (
          <ProgressLine
            progress={progress}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </section>
  );
};
