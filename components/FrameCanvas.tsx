"use client";

import React, { useEffect, useRef, useState } from "react";
import { TOTAL_FRAMES, getFramePath, progressToFrame } from "@/lib/frames";

interface FrameCanvasProps {
  progress: number;
  onInitialReady?: () => void;
  isReady: boolean;
  prefersReducedMotion?: boolean;
}

export const FrameCanvas: React.FC<FrameCanvasProps> = ({
  progress,
  onInitialReady,
  isReady,
  prefersReducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const [loadPercentage, setLoadPercentage] = useState<number>(0);

  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    let loadedCount = 0;
    let initialTenLoaded = false;

    const handleSingleLoad = () => {
      loadedCount++;
      setLoadPercentage(Math.round((loadedCount / TOTAL_FRAMES) * 100));

      if (!initialTenLoaded && loadedCount >= 10) {
        let first10Ready = true;
        for (let i = 0; i < 10; i++) {
          if (!images[i] || !images[i]?.complete || images[i]?.naturalWidth === 0) {
            first10Ready = false;
            break;
          }
        }
        if (first10Ready) {
          initialTenLoaded = true;
          onInitialReady?.();
        }
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        images[i] = img;
        handleSingleLoad();
      };
      img.onerror = () => {
        handleSingleLoad();
      };
    }

    return () => {
      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, [onInitialReady]);

  useEffect(() => {
    if (prefersReducedMotion) {
      targetFrameRef.current = TOTAL_FRAMES - 1;
      currentFrameRef.current = TOTAL_FRAMES - 1;
      return;
    }

    let calculated = progressToFrame(progress);

    const isLowEnd =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency < 4;

    if (isLowEnd) {
      calculated = Math.round(calculated / 2) * 2;
    }

    targetFrameRef.current = calculated;
  }, [progress, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Allow transparency so the stage gradient crossfades underneath
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isActive = true;

    const drawFrame = (frameIdx: number) => {
      const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));
      const img = imagesRef.current[clampedIdx];

      const width = canvas.width;
      const height = canvas.height;

      if (!img || !img.complete || img.naturalWidth === 0) {
        let fallbackImg: HTMLImageElement | null = null;
        for (let delta = 1; delta < 30; delta++) {
          const prev = imagesRef.current[clampedIdx - delta];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            fallbackImg = prev;
            break;
          }
          const next = imagesRef.current[clampedIdx + delta];
          if (next && next.complete && next.naturalWidth > 0) {
            fallbackImg = next;
            break;
          }
        }

        if (fallbackImg) {
          ctx.clearRect(0, 0, width, height);
          renderCover(ctx, fallbackImg, width, height);
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);
      renderCover(ctx, img, width, height);
    };

    const renderCover = (
      context: CanvasRenderingContext2D,
      image: HTMLImageElement,
      cw: number,
      ch: number
    ) => {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const iw = image.naturalWidth || 1216;
      const ih = image.naturalHeight || 684;

      const canvasRatio = cw / ch;
      const imageRatio = iw / ih;

      let drawWidth = cw;
      let drawHeight = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imageRatio) {
        drawWidth = cw;
        drawHeight = cw / imageRatio;
        offsetX = 0;
        offsetY = (ch - drawHeight) / 2;
      } else {
        drawHeight = ch;
        drawWidth = ch * imageRatio;
        offsetX = (cw - drawWidth) / 2;
        offsetY = 0;
      }

      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    let lastDrawnFrame = -1;

    const renderLoop = () => {
      if (!isActive) return;

      if (prefersReducedMotion) {
        drawFrame(TOTAL_FRAMES - 1);
        return;
      }

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.12;
        if (Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.5) {
          currentFrameRef.current = targetFrameRef.current;
        }
      }

      const roundedFrame = Math.round(currentFrameRef.current);
      if (roundedFrame !== lastDrawnFrame) {
        drawFrame(roundedFrame);
        lastDrawnFrame = roundedFrame;
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isActive = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (
        canvas.width !== Math.round(displayWidth * dpr) ||
        canvas.height !== Math.round(displayHeight * dpr)
      ) {
        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {!isReady && loadPercentage < 100 && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#A9B79A] z-40 transition-transform duration-300 ease-out origin-left pointer-events-none"
          style={{ transform: `scaleX(${loadPercentage / 100})` }}
          aria-hidden="true"
        />
      )}

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Silver lawn mower cutting a clean stripe across a green lawn, then stopping in golden-hour light as the camera zooms into the grass."
        className="w-full h-full block object-cover transition-opacity duration-[1200ms] mix-blend-normal"
        style={{
          opacity: isReady ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
};
