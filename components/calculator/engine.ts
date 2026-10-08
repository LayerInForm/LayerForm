import { GAP, MAX_PART, PRICING, type Material, type Quality } from './pricing';

export interface PartData {
  id: number;
  name: string;
  file: File | null;       // Originaldatei für den Versand
  positions: Float32Array; // Dreiecke, Z oben, in mm
  volume: number;          // mm³
  area: number;            // mm²
  size: { x: number; y: number; z: number };
}
export interface Entry { part: number; plate: number; qty: number }
export interface Placement { part: PartData; cx: number; cy: number }

/* ---------- Dateien lesen ---------- */
export function parseSTL(buf: ArrayBuffer): Float32Array {
  const dv = new DataView(buf);
  const isBin = buf.byteLength > 84 && 84 + dv.getUint32(80, true) * 50 === buf.byteLength;
  if (isBin) {
    const n = dv.getUint32(80, true);
    const pos = new Float32Array(n * 9);
    for (let i = 0; i < n; i++) {
      const o = 84 + i * 50 + 12;
      for (let j = 0; j < 9; j++) pos[i * 9 + j] = dv.getFloat32(o + j * 4, true);
    }
    return pos;
  }
  const txt = new TextDecoder().decode(buf);
  const out: number[] = [];
  const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(txt))) out.push(+m[1], +m[2], +m[3]);
  return new Float32Array(out);
}

/** 3MF: jedes Objekt wird ein eigenes Teil */
export async function parse3MF(buf: ArrayBuffer): Promise<{ positions: Float32Array; label: string | null }[]> {
  const { default: JSZip } = await import('jszip');
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files);
  const file = names.find((n) => /3d\/.*\.model$/i.test(n)) || names.find((n) => /\.model$/i.test(n));
  if (!file) throw new Error('Kein Modell in der 3MF-Datei gefunden.');
  const xml = new DOMParser().parseFromString(await zip.file(file)!.async('string'), 'application/xml');
  const result: { positions: Float32Array; label: string | null }[] = [];
  xml.querySelectorAll('object').forEach((obj) => {
    const mesh = obj.querySelector('mesh');
    if (!mesh) return;
    const v = [...mesh.querySelectorAll('vertex')].map((e) => [+e.getAttribute('x')!, +e.getAttribute('y')!, +e.getAttribute('z')!]);
    const out: number[] = [];
    mesh.querySelectorAll('triangle').forEach((t) => (['v1', 'v2', 'v3'] as const).forEach((k) => out.push(...v[+t.getAttribute(k)!])));
    if (out.length) result.push({ positions: new Float32Array(out), label: obj.getAttribute('name') });
  });
  if (!result.length) throw new Error('Die 3MF-Datei enthält keine Geometrie.');
  return result;
}

export function measure(pos: Float32Array) {
  let vol = 0, area = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < pos.length; i += 9) {
    const ax = pos[i], ay = pos[i + 1], az = pos[i + 2];
    const bx = pos[i + 3], by = pos[i + 4], bz = pos[i + 5];
    const cx = pos[i + 6], cy = pos[i + 7], cz = pos[i + 8];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    const ux = bx - ax, uy = by - ay, uz = bz - az, wx = cx - ax, wy = cy - ay, wz = cz - az;
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    area += Math.sqrt(nx * nx + ny * ny + nz * nz) / 2;
    for (let k = 0; k < 9; k += 3) {
      const x = pos[i + k], y = pos[i + k + 1], z = pos[i + k + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
  }
  return { volume: Math.abs(vol), area, min: { x: minX, y: minY, z: minZ }, size: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ } };
}

/** Teil zentrieren und auf Z=0 stellen */
export function normalize(pos: Float32Array, min: { x: number; y: number; z: number }, size: { x: number; y: number }) {
  const ox = min.x + size.x / 2, oy = min.y + size.y / 2, oz = min.z;
  for (let i = 0; i < pos.length; i += 3) { pos[i] -= ox; pos[i + 1] -= oy; pos[i + 2] -= oz; }
}

/* ---------- Platten belegen ---------- */
/** Reihen-Packen der Grundflächen mit GAP Abstand, die Belegung sitzt mittig auf der Platte */
export function pack(list: PartData[]): { ok: boolean; places: Placement[] } {
  const items = list.map((p) => ({ p, w: p.size.x, d: p.size.y })).sort((a, b) => b.d - a.d || b.w - a.w);
  const rows: { items: typeof items; w: number; d: number }[] = [];
  let cur: (typeof rows)[number] | null = null;
  for (const it of items) {
    if (!cur || cur.w + GAP + it.w > MAX_PART) { cur = { items: [], w: -GAP, d: 0 }; rows.push(cur); }
    cur.items.push(it); cur.w += GAP + it.w; cur.d = Math.max(cur.d, it.d);
  }
  const totalD = rows.reduce((s, r) => s + r.d, 0) + GAP * Math.max(0, rows.length - 1);
  const totalW = rows.reduce((m, r) => Math.max(m, r.w), 0);
  const ok = totalW <= MAX_PART && totalD <= MAX_PART;
  const places: Placement[] = [];
  let y = -totalD / 2;
  for (const r of rows) {
    let x = -r.w / 2;
    for (const it of r.items) { places.push({ part: it.p, cx: x + it.w / 2, cy: y + r.d / 2 }); x += it.w + GAP; }
    y += r.d + GAP;
  }
  return { ok, places };
}

export const instancesOn = (plate: number, entries: Entry[], parts: PartData[]) =>
  entries.filter((e) => e.plate === plate).flatMap((e) => Array<PartData>(e.qty).fill(parts.find((p) => p.id === e.part)!));

export function addEntry(entries: Entry[], part: number, plate: number, n = 1): Entry[] {
  const i = entries.findIndex((e) => e.part === part && e.plate === plate);
  if (i >= 0) return entries.map((e, k) => (k === i ? { ...e, qty: e.qty + n } : e));
  return [...entries, { part, plate, qty: n }];
}

/** neues Teil auf die erste Platte mit Platz legen, sonst neue Platte */
export function placeNew(part: PartData, entries: Entry[], parts: PartData[], plateCount: number) {
  for (let i = 0; i < plateCount; i++) {
    if (pack([...instancesOn(i, entries, parts), part]).ok) return { entries: addEntry(entries, part.id, i), plateCount, plate: i };
  }
  return { entries: addEntry(entries, part.id, plateCount), plateCount: plateCount + 1, plate: plateCount };
}

/** alles neu und möglichst dicht verteilen */
export function autoDistribute(entries: Entry[], parts: PartData[]) {
  const all = entries.flatMap((e) => Array<PartData>(e.qty).fill(parts.find((p) => p.id === e.part)!))
    .sort((a, b) => b.size.x * b.size.y - a.size.x * a.size.y);
  let next: Entry[] = [];
  let count = 1;
  for (const p of all) {
    let done = false;
    for (let i = 0; i < count && !done; i++) {
      if (pack([...instancesOn(i, next, parts), p]).ok) { next = addEntry(next, p.id, i); done = true; }
    }
    if (!done) { if (instancesOn(count - 1, next, parts).length) count++; next = addEntry(next, p.id, count - 1); }
  }
  return { entries: next, plateCount: count };
}

/* ---------- Richtpreis ---------- */
function partCost(p: PartData, m: Material, q: Quality, infill: number) {
  const f = infill / 100;
  const shell = Math.min(p.volume, p.area * 0.9);              // Wände und Deckschichten ca. 0,9 mm
  const solid = shell + Math.max(0, p.volume - shell) * f;      // tatsächlich gedrucktes Volumen in mm³
  const grams = (solid / 1000) * m.density * 1.05;               // +5 % für Ränder und Stützen
  const hours = (solid / (q.flow * m.speed) + (p.size.z / q.lh) * 3) / 3600;
  return { grams, hours };
}

export function estimate(entries: Entry[], parts: PartData[], plateCount: number, m: Material, q: Quality, infill: number) {
  let grams = 0, hours = 0;
  for (let i = 0; i < plateCount; i++) {
    const inst = instancesOn(i, entries, parts);
    if (!inst.length) continue;
    hours += 0.1; // Aufheizen und Vorbereitung je Platte
    inst.forEach((p) => { const c = partCost(p, m, q, infill); grams += c.grams; hours += c.hours; });
  }
  const material = grams * (m.perKg / 1000);
  const power = hours * PRICING.printerKw * PRICING.kwh;
  let total = (material + power) * (1 + PRICING.markup);
  total = Math.ceil(total * 2) / 2; // auf 0,50 € aufrunden
  return Math.max(PRICING.minimum, total);
}
