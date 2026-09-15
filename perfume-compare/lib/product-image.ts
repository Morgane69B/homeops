/**
 * Curated, royalty-free perfume photography (Pexels License — free for
 * commercial use, no attribution required). Only generic/unbranded shots are
 * used here: none of these depict a specific real trademarked bottle, so
 * they're safe to pair with any listing regardless of brand.
 */
function pexels(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
}

// Every id below was inspected by hand: none show a legible brand name or an
// iconic trademarked silhouette, so they're safe to pair with any listing.
const FAMILY_IMAGES: Record<string, number[]> = {
  florale: [26600130, 33994391, 35977681],
  boisee: [30232707, 38949820, 21235002, 29903862],
  "orientale-ambree": [37127787, 29240451, 36389336, 10924522],
  "hesperidee-agrumes": [32645088, 29801355, 15574229, 15096784, 264819],
  fougere: [30990132, 38957386, 15007556],
  chypree: [16266295, 35237609, 4735929],
  cuir: [36834015, 16239693, 38721551],
};

const FALLBACK_IMAGES = Object.values(FAMILY_IMAGES).flat();

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getPerfumeImage(slug: string, familySlug: string): string {
  const pool = FAMILY_IMAGES[familySlug] ?? FALLBACK_IMAGES;
  const id = pool[hashString(slug) % pool.length];
  return pexels(id);
}
