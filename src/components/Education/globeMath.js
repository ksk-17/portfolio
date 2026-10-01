const TAU = Math.PI * 2;
export const GLOBE_RADIUS_RATIO = 0.4; // calibrate against the rendered cobe disc

export function focusAngles(lat, lng, fromPhi = 0) {
  const raw = 1.5 * Math.PI - (lng * Math.PI) / 180;
  const phi = raw + TAU * Math.round((fromPhi - raw) / TAU);
  return { phi, theta: (lat * Math.PI) / 180 };
}

export function projectPin(lat, lng, phi, theta) {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180 - Math.PI;
  const x0 = -Math.cos(la) * Math.cos(lo);
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.sin(lo);
  const x1 = x0 * Math.cos(phi) + z0 * Math.sin(phi);
  const z1 = -x0 * Math.sin(phi) + z0 * Math.cos(phi);
  const y2 = y0 * Math.cos(theta) - z1 * Math.sin(theta);
  const z2 = y0 * Math.sin(theta) + z1 * Math.cos(theta);
  return { x: x1, y: y2, visible: z2 > 0 };
}
