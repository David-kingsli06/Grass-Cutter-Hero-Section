export interface StatItem {
  id: string;
  value: number;
  unit: string;
  label: string;
  footnote?: string;
}

export interface StageDefinition {
  id: number;
  label: string;
  name: string;
  range: [number, number];
  frameRange: [number, number];
  description: string;
}

export const STAGES: StageDefinition[] = [
  {
    id: 1,
    label: "01",
    name: "Empty lawn",
    range: [0.0, 0.2],
    frameRange: [0, 95],
    description: "The lawn with grass swaying softly in calm natural light.",
  },
  {
    id: 2,
    label: "02",
    name: "Mower enters",
    range: [0.2, 0.4],
    frameRange: [96, 189],
    description: "The mower rolls in quietly from the left.",
  },
  {
    id: 3,
    label: "03",
    name: "Cutting",
    range: [0.4, 0.8],
    frameRange: [190, 380],
    description: "The mower cuts a clean stripe to the right and comes to rest on the right third.",
  },
  {
    id: 4,
    label: "04",
    name: "Product",
    range: [0.8, 1.0],
    frameRange: [381, 475],
    description: "Camera zooms into the grass, then rises to center the mower.",
  },
];

export const STAGE_3_STATS: StatItem[] = [
  {
    id: "stat-time",
    value: 42,
    unit: "min",
    label: "Average cut time",
    footnote: "*Placeholder, replace with tested figure",
  },
  {
    id: "stat-height",
    value: 3.5,
    unit: "cm",
    label: "Cutting height, set once",
    footnote: "*Placeholder",
  },
  {
    id: "stat-evenness",
    value: 99,
    unit: "%",
    label: "Even cut, every pass",
    footnote: "*Placeholder",
  },
];

export function getCurrentStageIndex(p: number): number {
  if (p < 0.2) return 0;
  if (p < 0.4) return 1;
  if (p < 0.8) return 2;
  return 3;
}
