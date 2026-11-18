# Project Prompt: Scroll-Driven Cinematic Hero for Lawn Mower Product

Use this prompt to generate or recreate this exact high-performance, scroll-driven interactive hero presentation.

---

```markdown
Build a full-screen, scroll-driven hero for "[BRAND NAME]" (e.g. SILVERCLAD), a premium silver lawn mower. The hero plays one continuous 476-frame image sequence, transitioned smoothly across 4 discrete stages. The scene opens on an empty lawn, a mower rolls in and cuts a stripe, it stops on the right, and the camera zooms into the grass to reveal the product name. Keep everything photographic, calm, and cinematic. No cartoon effects, no bouncing, no overshoot.

### SKILLS & DESIGN PRINCIPLES
- **Taste (Visual Direction & Mood)**:
  - Palette: Warm off-white `#F4F1EA` for text on dark backgrounds, deep grass-green shadow `#14190F` as the base, and soft sage `#A9B79A` for the stage counter, dots, and progress line.
  - Stage Dynamic Background Gradients (with 600ms crossfade `cubic-bezier(0.22, 1, 0.36, 1)`):
    - Stage 01 (lawn): Morning tone, `#DCE8D0` to `#B9CBA8`.
    - Stage 02 (mower enters): Mid-morning tone, `#C9DCB8` to `#9FBA8C`.
    - Stage 03 (cutting): Deep green tone, `#5E7F48` to `#2F4A26`.
    - Stage 04 (product): Golden-hour tone, `#E8C98A` to `#8F5E2E`.
  - Dynamic contrast: Text color transitions to `#14190F` on light stages (01, 02) and `#F4F1EA` on dark stages (03, 04) with a 400ms transition.
- **Impeccable Design (Layout & Typography)**:
  - Inter Display grotesque sans-serif.
  - Headlines: weight 700 to 800, letter-spacing -0.02em, line-height 1.0 to 1.05.
  - Sublines: weight 400, 20 to 24px on desktop.
  - Spacing: 8px increments, minimum 6vw side gutters.
- **Emil Design Engineering (Motion & Interaction)**:
  - Damped scrubbing with no snapping overshoot, no bounce, and zero jitter.
  - Text moves strictly with transform and opacity.
  - Frame canvas redraws strictly on integer index changes (deduplicated RAF loop) to eliminate micro-stutters and lag.

### TECH STACK
- Next.js 15+ (App Router), TypeScript (strict), Tailwind CSS v4.
- Frame rendering: Single HTML5 `<canvas>` using `object-fit: cover` logic, transparent backing (`alpha: true`), backing store capped at DPR `[1, 2]`.
- GSAP + ScrollTrigger for scroll pinning and position tracking.
- Discrete Stage Snapping: One scroll gesture moves smoothly to the next discrete stage (Stage 1 -> Stage 2 -> Stage 3 -> Stage 4) with debounced wheel event locking to prevent accidental skips.

### STAGES SPECIFICATION
1. **Stage 01 — Empty Lawn** (`progress: 0.00 - 0.20`, frames 0 - 95):
   - Scene opens on calm lawn with swaying grass.
   - Headline and subline slide up with masked reveal on load, then drift 40px upward and fade as scroll advances.
2. **Stage 02 — Mower Enters** (`progress: 0.20 - 0.40`, frames 96 - 189):
   - The silver mower enters smoothly from the left edge and reaches 40% across screen.
3. **Stage 03 — Cutting** (`progress: 0.40 - 0.80`, frames 190 - 380):
   - Mower cuts a clean stripe to the right and comes to rest on the right third (75% across screen).
   - Stat panels slide in 24px from right with 300ms crossfade and animated number count-ups (`tabular-nums`).
4. **Stage 04 — Product Reveal** (`progress: 0.80 - 1.00`, frames 381 - 475):
   - Camera zooms into the grass, then rises to center the mower in golden-hour light.
   - Wordmark letters rise with a staggered delay (40ms per letter over 800ms), followed by subline reveal.

### FRAME ASSETS & OPTIMIZATION
- Sequence: 476 frames (`/public/frames/frame_000.webp` to `frame_475.webp`).
- Preload all frames on mount; show a thin sage hairline loading bar during prefetch.
- Canvas reveals immediately after the first 10 frames decode (300ms fade-in).
- Damped lerp factor (`0.12`) in RAF loop with frame deduplication (`roundedFrame !== lastDrawnFrame`) to ensure 60fps stutter-free rendering.
- Accessible fallbacks for `prefers-reduced-motion: reduce`.
```
