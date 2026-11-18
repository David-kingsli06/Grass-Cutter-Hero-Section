export const TOTAL_FRAMES = 476;

export function getFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
  const padded = clamped.toString().padStart(3, "0");
  return `/frames/frame_${padded}.webp`;
}

export function progressToFrame(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  const smooth = clamped * clamped * (3 - 2 * clamped);
  const blended = clamped * 0.85 + smooth * 0.15;
  return Math.round(blended * (TOTAL_FRAMES - 1));
}
