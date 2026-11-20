export type Point = { x: number; y: number };

export const SUMMIT_ROUTE_POINTS = {
  p0: { x: 40, y: 140 },
  p1: { x: 500, y: -40 },
  p2: { x: 960, y: 140 },
} as const;

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function quadraticBezierPoint(p0: Point, p1: Point, p2: Point, tRaw: number): Point {
  const t = clamp01(tRaw);
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

export function formatSummitKm(tRaw: number, totalKm = 1900): string {
  const t = clamp01(tRaw);
  const km = Math.round(totalKm * t);
  return `${km.toLocaleString("en-US")} km`;
}
