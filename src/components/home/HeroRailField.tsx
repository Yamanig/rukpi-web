import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** 5x7 voxel glyphs for the word RUKPI. 1 = filled cell. */
const GLYPHS: Record<string, string[]> = {
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
};
const WORD = "RUKPI";

const CELL = 0.115; // world units per glyph cell
const LETTER_W = 5;
const LETTER_GAP = 2;
const DEPTH_LAYERS = 3; // cubic extrusion
const SUB = 2; // 2x2 dots per cell face

/** Deterministic seeded PRNG (stable layout across frames/renders). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface VoxelData {
  count: number;
  start: Float32Array; // scattered rail-field origins
  target: Float32Array; // voxel letter positions (local to group)
  swirlDir: Float32Array; // per-dot swirl direction during flight
  delay: Float32Array;
  dur: Float32Array;
  phase: Float32Array;
  colors: Float32Array;
}

function buildVoxelData(): VoxelData {
  const rand = mulberry32(20260912);
  const totalCellsWide = WORD.length * LETTER_W + (WORD.length - 1) * LETTER_GAP; // 33
  const originX = (-totalCellsWide * CELL) / 2;
  const originY = (7 * CELL) / 2;

  // collect filled cells
  const cells: { x: number; y: number }[] = [];
  for (let li = 0; li < WORD.length; li++) {
    const glyph = GLYPHS[WORD[li]];
    const letterOffset = li * (LETTER_W + LETTER_GAP);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < LETTER_W; col++) {
        if (glyph[row][col] === "1") {
          cells.push({
            x: originX + (letterOffset + col) * CELL,
            y: originY - row * CELL,
          });
        }
      }
    }
  }

  const count = cells.length * SUB * SUB * DEPTH_LAYERS;
  const start = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const swirlDir = new Float32Array(count * 3);
  const delay = new Float32Array(count);
  const dur = new Float32Array(count);
  const phase = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const teal = new THREE.Color("#00A3A1");
  const tealDim = new THREE.Color("#0B5C5B");
  const amber = new THREE.Color("#E5A93C");
  const tmp = new THREE.Color();

  let i = 0;
  for (const cell of cells) {
    for (let z = 0; z < DEPTH_LAYERS; z++) {
      for (let sy = 0; sy < SUB; sy++) {
        for (let sx = 0; sx < SUB; sx++) {
          const i3 = i * 3;
          // voxel target: sub-grid inside the cell, extruded in z
          target[i3] = cell.x + (sx - (SUB - 1) / 2) * CELL * 0.44;
          target[i3 + 1] = cell.y + (sy - (SUB - 1) / 2) * CELL * 0.44;
          target[i3 + 2] = (z - (DEPTH_LAYERS - 1) / 2) * CELL * 0.95;

          // scattered origin: the field hovering around the "Your Money" headline
          // (left side of the hero) — dots start there and fly right to form RUKPI
          start[i3] = -6.4 + rand() * 5.4; // x in [-6.4, -1.0]
          start[i3 + 1] = -1.4 + rand() * 3.6; // y in [-1.4, 2.2]
          start[i3 + 2] = -2.5 + rand() * 3;

          // normalized swirl direction for the flight arc
          let dx = rand() - 0.5;
          let dy = rand() - 0.5;
          let dz = rand() - 0.5;
          const len = Math.hypot(dx, dy, dz) || 1;
          swirlDir[i3] = dx / len;
          swirlDir[i3 + 1] = dy / len;
          swirlDir[i3 + 2] = dz / len;

          delay[i] = rand() * 0.9;
          dur[i] = 2.0 + rand() * 0.8;
          phase[i] = rand() * Math.PI * 2;

          // color: mostly teal, depth-dimmed, ~10% amber sparks
          const r = rand();
          if (r < 0.1) tmp.copy(amber);
          else tmp.copy(teal).lerp(tealDim, z / (DEPTH_LAYERS - 1) + rand() * 0.2 - 0.1);
          colors[i3] = tmp.r;
          colors[i3 + 1] = tmp.g;
          colors[i3 + 2] = tmp.b;

          i++;
        }
      }
    }
  }

  return { count, start, target, swirlDir, delay, dur, phase, colors };
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Continuous loop: drift at the headline → fly right → form RUKPI → hold → disperse back. */
const LOOP = 10.4; // seconds per cycle
const FLY_START = 1.4; // scatter drift before takeoff
const FLY_WINDOW = 3.4; // fly-in window (incl. stagger)
const HOLD_END = 7.6; // assembled hold ends
const DISPERSE_WINDOW = 2.8; // disperse window (incl. stagger)

function VoxelWord() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useMemo(buildVoxelData, []);
  const positions = useMemo(() => new Float32Array(data.count * 3), [data.count]);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const { pointer, viewport } = useThree();

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    const geo = points.geometry;
    if (!geo.getAttribute("position")) {
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    }
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const t = clock.elapsedTime;

    // layout: clear of the headline on wide screens, above the copy on narrow ones
    const narrow = viewport.aspect < 1.05;
    const gx = narrow ? 0 : 2.55;
    const gy = narrow ? 2.0 : 0.1;
    const gs = narrow ? 0.6 : 0.85;
    group.position.x += (gx - group.position.x) * 0.06;
    group.position.y += (gy - group.position.y) * 0.06;
    const s = group.scale.x + (gs - group.scale.x) * 0.06;
    group.scale.setScalar(s);

    // gentle rotation + mouse parallax on the formation
    const targetRotY = reduced ? 0 : Math.sin(t * 0.12) * 0.09 + pointer.x * 0.13;
    const targetRotX = reduced ? 0 : -pointer.y * 0.06;
    group.rotation.y += (targetRotY - group.rotation.y) * 0.045;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.045;

    const mat = points.material as THREE.PointsMaterial;
    const baseOpacity = narrow ? 0.55 : 0.9;
    mat.opacity = reduced ? baseOpacity : Math.min(baseOpacity, t * 1.1);

    // position inside the continuous cycle
    const tc = reduced ? HOLD_END - 0.1 : t % LOOP;

    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      const ph = data.phase[i];

      // assembly weight: 0 = scattered at the headline, 1 = formed as RUKPI
      let w: number;
      if (reduced) {
        w = 1;
      } else {
        const pf = Math.min(
          1,
          Math.max(0, (tc - FLY_START - data.delay[i] * 0.6) / (FLY_WINDOW - 0.6)),
        );
        const pd = Math.min(
          1,
          Math.max(0, (tc - HOLD_END - data.delay[i] * 0.6) / (DISPERSE_WINDOW - 0.6)),
        );
        w = easeInOutCubic(pf) * (1 - easeInOutCubic(pd));
      }

      let x = data.start[i3] + (data.target[i3] - data.start[i3]) * w;
      let y = data.start[i3 + 1] + (data.target[i3 + 1] - data.start[i3 + 1]) * w;
      let z = data.start[i3 + 2] + (data.target[i3 + 2] - data.start[i3 + 2]) * w;

      if (!reduced) {
        // flight swirl — peaks mid-transition (both directions), zero at rest
        const swirl = Math.sin(w * Math.PI) * 0.55;
        x += data.swirlDir[i3] * swirl;
        y += data.swirlDir[i3 + 1] * swirl * 0.7;
        z += data.swirlDir[i3 + 2] * swirl;

        // scattered: alive drift around the "Your Money" headline field
        const scatter = 1 - w;
        x += Math.sin(t * 0.5 + ph) * 0.28 * scatter;
        y += Math.cos(t * 0.4 + ph * 1.3) * 0.2 * scatter;
        z += Math.sin(t * 0.35 + ph * 0.7) * 0.15 * scatter;

        // formed: barely-there breathing so the cube stays alive
        x += Math.sin(t * 1.3 + ph) * 0.008 * w;
        y += Math.cos(t * 1.1 + ph) * 0.008 * w;
      }

      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[2.55, 0.1, -1.2]}>
      <points ref={pointsRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.042}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * Hero field — continuous loop: rail dots drift around the "Your Money"
 * headline, fly right, assemble into cubic 3D block letters spelling
 * RUKPI, hold, then disperse back to the headline and begin again.
 */
export default function HeroRailField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <VoxelWord />
    </Canvas>
  );
}
