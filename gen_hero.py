with open('components/Hero.tsx', 'w', encoding='utf-8') as f:
    f.write('''" use client\;

import React, { useEffect, useRef, useState, useCallback } from \react\;
import gsap from \gsap\;
import { ScrollTrigger } from \gsap/ScrollTrigger\;
import { STAGES, getCurrentStageIndex } from \@/lib/stages\;
import { useReducedMotion } from \@/lib/useReducedMotion\;
import { FrameCanvas } from \./FrameCanvas\;
import { HeroOverlay } from \./HeroOverlay\;
import { StageCounter } from \./StageCounter\;
import { ProgressLine } from \./ProgressLine\;
import { StageDots } from \./StageDots\;

if (typeof window !== \undefined\) {
 gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
 brandName?: string;
}

export const Hero: React.FC<HeroProps> = ({ brandName = \SILVERCLAD\ }) => {
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

 const trigger = ScrollTrigger.create({
 trigger: container,
 start: \top top\,
 end: \bottom bottom\,
 scrub: true,
 onUpdate: (self) => {
 const p = self.progress;
 setProgress(p);
 setCurrentStageIdx(getCurrentStageIndex(p));
 },
 });

 scrollTriggerRef.current = trigger;

 return () => {
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
 behavior: \smooth\,
 });
 }, []);

 const handleInitialReady = useCallback(() => {
 setIsInitialReady(true);
 }, []);

 return (
 <section
 ref={containerRef}
 className={elative w-full bg-[#14190F]}
 aria-label=\Interactive Hero Presentation\
 >
 <div className=\sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between\>
 <FrameCanvas
 progress={progress}
 isReady={isInitialReady}
 onInitialReady={handleInitialReady}
 prefersReducedMotion={prefersReducedMotion}
 />

 {!prefersReducedMotion && (
 <div className=\absolute top-8 left-[6vw] z-30 pointer-events-none\>
 <StageCounter
 currentStageNumber={STAGES[currentStageIdx].label}
 totalStages=\04\
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

 <HeroOverlay
 progress={progress}
 currentStageIndex={currentStageIdx}
 isInitialReady={isInitialReady}
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
''')
print('generated hero.tsx successfully')
