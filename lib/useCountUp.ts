"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  targetValue: number,
  duration = 900,
  active = true,
  prefersReducedMotion = false
): string {
  const [displayValue, setDisplayValue] = useState<number>(
    prefersReducedMotion ? targetValue : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    if (!active) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const t = progress;
      const easeOut = 1 - Math.pow(1 - t, 3.2);

      const current = easeOut * targetValue;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, active, prefersReducedMotion]);

  const isDecimal = targetValue % 1 !== 0;
  return isDecimal ? displayValue.toFixed(1) : Math.round(displayValue).toString();
}
