import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BED } from './pricing';
import type { PartData, Placement } from './engine';

interface Props {
  placements: Placement[];
  viewKey: string;       // ändert sich, wenn die Kamera neu ausgerichtet werden soll
  highlight: boolean;    // Material gewählt: Teile etwas heller
}

/** 3D-Ansicht einer Druckplatte, drehen per Ziehen, zoomen per Mausrad oder zwei Fingern */
export const PlateViewer: React.FC<Props> = ({ placements, viewKey, highlight }) => {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{
    scene: THREE.Scene; group: THREE.Group; orbit: { theta: number; phi: number; r: number; target: THREE.Vector3 };
    geos: Map<number, THREE.BufferGeometry>; mat: THREE.MeshStandardMaterial;
  } | null>(null);

  // Szene einmalig aufbauen
  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:grab';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);
    scene.add(new THREE.HemisphereLight(0xcfe9ff, 0x0a1731, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(1, 1.4, 0.8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x00e5ff, 1.1); rim.position.set(-1, 0.6, -1); scene.add(rim);

    const grid = new THREE.GridHelper(BED, 16, 0x1d4f8f, 0x15305e);
    (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.7;
    scene.add(grid);
    scene.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(BED, BED).rotateX(-Math.PI / 2)),
      new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35 })
    ));
    const group = new THREE.Group(); scene.add(group);
    const orbit = { theta: 0.8, phi: 1.05, r: 460, target: new THREE.Vector3() };
    const mat = new THREE.MeshStandardMaterial({ color: 0x8fa3b8, roughness: 0.5, metalness: 0.05 });
    api.current = { scene, group, orbit, geos: new Map(), mat };

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    // Bedienung
    const pts = new Map<number, { x: number; y: number }>(); let pinch = 0;
    const cv = renderer.domElement;
    const down = (e: PointerEvent) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); cv.style.cursor = 'grabbing'; };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId); if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { orbit.theta -= dx * 0.008; orbit.phi = Math.min(1.5, Math.max(0.15, orbit.phi - dy * 0.008)); }
      else if (pts.size === 2) {
        const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) orbit.r = Math.min(2000, Math.max(30, (orbit.r * pinch) / d)); pinch = d;
      }
    };
    const up = (e: PointerEvent) => { pts.delete(e.pointerId); pinch = 0; cv.style.cursor = 'grab'; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); orbit.r = Math.min(2000, Math.max(30, orbit.r * (1 + Math.sign(e.deltaY) * 0.1))); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', wheel, { passive: false });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idle = 0, raf = 0;
    const loop = () => {
      if (group.children.length && !reduce && pts.size === 0) { idle++; if (idle > 90) orbit.theta += 0.0025; } else idle = 0;
      const { theta, phi, r, target } = orbit;
      camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move);
      cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); cv.removeEventListener('wheel', wheel);
      api.current?.geos.forEach((g) => g.dispose()); mat.dispose(); renderer.dispose(); el.removeChild(cv);
      api.current = null;
    };
  }, []);

  // Teile der aktiven Platte anzeigen
  useEffect(() => {
    const a = api.current; if (!a) return;
    const geoFor = (p: PartData) => {
      let g = a.geos.get(p.id);
      if (!g) {
        g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(p.positions.slice(), 3));
        g.rotateX(-Math.PI / 2); // Datei: Z oben, Ansicht: Y oben
        g.computeVertexNormals();
        a.geos.set(p.id, g);
      }
      return g;
    };
    a.group.clear();
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxH = 0;
    placements.forEach(({ part, cx, cy }) => {
      const m = new THREE.Mesh(geoFor(part), a.mat);
      m.position.set(cx, 0, cy);
      a.group.add(m);
      minX = Math.min(minX, cx - part.size.x / 2); maxX = Math.max(maxX, cx + part.size.x / 2);
      minZ = Math.min(minZ, cy - part.size.y / 2); maxZ = Math.max(maxZ, cy + part.size.y / 2);
      maxH = Math.max(maxH, part.size.z);
    });
    // nicht mehr benötigte Geometrien freigeben
    const used = new Set(placements.map((p) => p.part.id));
    a.geos.forEach((g, id) => { if (!used.has(id)) { g.dispose(); a.geos.delete(id); } });
    return () => {};
    // Kamera wird im nächsten Effekt gesetzt
  }, [placements]);

  useEffect(() => {
    const a = api.current; if (!a) return;
    if (!placements.length) { a.orbit.target.set(0, 0, 0); a.orbit.r = 460; a.orbit.theta = 0.8; a.orbit.phi = 1.05; return; }
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxH = 0;
    placements.forEach(({ part, cx, cy }) => {
      minX = Math.min(minX, cx - part.size.x / 2); maxX = Math.max(maxX, cx + part.size.x / 2);
      minZ = Math.min(minZ, cy - part.size.y / 2); maxZ = Math.max(maxZ, cy + part.size.y / 2);
      maxH = Math.max(maxH, part.size.z);
    });
    const span = Math.max(maxX - minX, maxZ - minZ, maxH);
    a.orbit.target.set((minX + maxX) / 2, maxH / 2, (minZ + maxZ) / 2);
    a.orbit.r = Math.max(span * 2.4, 90); a.orbit.theta = 0.8; a.orbit.phi = 1.05;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey]);

  useEffect(() => { api.current?.mat.color.set(highlight ? 0xa9bccf : 0x8fa3b8); }, [highlight]);

  return <div ref={host} className="absolute inset-0" />;
};
