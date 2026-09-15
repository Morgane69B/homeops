export type BottleShape = "tall" | "round" | "faceted" | "flask";

export type BottleStyle = {
  shape: BottleShape;
  glass: string;
  liquid: string;
  cap: string;
  capRoughness: number;
};

const SHAPES: BottleShape[] = ["tall", "round", "faceted", "flask"];

const FAMILY_PALETTES: Record<
  string,
  { glass: string; liquid: string; cap: string; capRoughness: number }
> = {
  florale: { glass: "#f6eef2", liquid: "#e39cb8", cap: "#d4af37", capRoughness: 0.25 },
  boisee: { glass: "#efe7da", liquid: "#8a5a2b", cap: "#d4af37", capRoughness: 0.3 },
  "orientale-ambree": {
    glass: "#f4ecdd",
    liquid: "#c9781f",
    cap: "#d4af37",
    capRoughness: 0.25,
  },
  "hesperidee-agrumes": {
    glass: "#f3f7e8",
    liquid: "#c7d445",
    cap: "#e0c68a",
    capRoughness: 0.2,
  },
  fougere: { glass: "#eef4ee", liquid: "#6f9e6a", cap: "#d4af37", capRoughness: 0.28 },
  chypree: { glass: "#f1ece0", liquid: "#b98a3e", cap: "#d4af37", capRoughness: 0.25 },
  cuir: { glass: "#e6ded3", liquid: "#4a2f22", cap: "#8a6a45", capRoughness: 0.4 },
};

const DEFAULT_PALETTE = FAMILY_PALETTES.boisee;

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getBottleStyle(slug: string, familySlug: string): BottleStyle {
  const hash = hashString(slug);
  const shape = SHAPES[hash % SHAPES.length];
  const palette = FAMILY_PALETTES[familySlug] ?? DEFAULT_PALETTE;

  return { shape, ...palette };
}
