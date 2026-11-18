"use client";

import React, { useEffect, useState } from "react";

interface TypeRevealHeadlineProps {
  lines: string[];
  active: boolean;
  delayMs?: number;
  className?: string;
  textColor?: string;
}

export const TypeRevealHeadline: React.FC<TypeRevealHeadlineProps> = ({
  lines,
  active,
  delayMs = 200,
  className = "",
  textColor = "#F4F1EA",
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active) {
      setRevealed(false);
      return;
    }
    const timer = setTimeout(() => {
      setRevealed(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return (
    <h1
      className={`font-sans font-extrabold tracking-[-0.02em] leading-[1.02] transition-colors duration-400 ${className}`}
      style={{ color: textColor }}
    >
      {lines.map((line, idx) => (
        <span
          key={idx}
          className="block overflow-hidden pb-1"
          style={{ willChange: "transform, opacity" }}
        >
          <span
            className="block transition-all duration-[700ms]"
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${idx * 120}ms`,
              transform: revealed ? "translateY(0)" : "translateY(110%)",
              opacity: revealed ? 1 : 0,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
};

interface TypeRevealSublineProps {
  text: string;
  active: boolean;
  delayMs?: number;
  className?: string;
  textColor?: string;
}

export const TypeRevealSubline: React.FC<TypeRevealSublineProps> = ({
  text,
  active,
  delayMs = 320,
  className = "",
  textColor = "#F4F1EA",
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active) {
      setRevealed(false);
      return;
    }
    const timer = setTimeout(() => {
      setRevealed(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return (
    <p
      className={`font-sans font-normal leading-[1.4] transition-all duration-[600ms] transition-colors duration-400 ${className}`}
      style={{
        color: textColor,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transform: revealed ? "translateY(0)" : "translateY(12px)",
        opacity: revealed ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {text}
    </p>
  );
};

interface WordmarkStaggerProps {
  text: string;
  active: boolean;
  className?: string;
  textColor?: string;
  prefersReducedMotion?: boolean;
}

export const WordmarkStagger: React.FC<WordmarkStaggerProps> = ({
  text,
  active,
  className = "",
  textColor = "#F4F1EA",
  prefersReducedMotion = false,
}) => {
  const [revealed, setRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }
    if (active) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  }, [active, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <p
        className={`font-sans font-extrabold tracking-[-0.02em] leading-none transition-colors duration-400 ${className}`}
        style={{ color: textColor }}
      >
        {text}
      </p>
    );
  }

  const letters = Array.from(text);

  return (
    <p
      className={`font-sans font-extrabold tracking-[-0.02em] leading-none flex justify-center items-center overflow-hidden transition-colors duration-400 ${className}`}
      style={{ color: textColor }}
      aria-label={text}
    >
      {letters.map((char, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-[800ms]"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${index * 40}ms`,
            transform: revealed ? "translateY(0)" : "translateY(100%)",
            opacity: revealed ? 1 : 0,
            whiteSpace: char === " " ? "pre" : "normal",
            willChange: "transform, opacity",
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
};
