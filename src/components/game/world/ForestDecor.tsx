import { useMemo } from 'react';
import { PALETTE } from '@/game/palette';
import { createRandom } from '@/game/random';
import type { Platform } from '@/game/types';

const FOREST_FLOOR_Y = -2.5;
const TREE_MIN_X = -16;
const TREE_MAX_X = 136;
const TREE_SPACING = 3.2;

interface TreeSpec {
  x: number;
  z: number;
  scale: number;
  kind: 'pine' | 'oak';
}

interface PlantSpec {
  kind: 'flower' | 'mushroom';
  x: number;
  y: number;
  z: number;
  color: string;
  scale: number;
}

const PINE_TIERS = [
  { y: 1.9, radius: 1.9, color: PALETTE.pine },
  { y: 2.9, radius: 1.5, color: PALETTE.pineLight },
  { y: 3.8, radius: 1.1, color: PALETTE.pine },
];

function buildTrees(): TreeSpec[] {
  const rand = createRandom(7);
  const trees: TreeSpec[] = [];
  for (let x = TREE_MIN_X; x < TREE_MAX_X; x += TREE_SPACING) {
    trees.push({
      x: x + rand() * 1.6,
      z: -6 - rand() * 9,
      scale: 0.9 + rand() * 0.9,
      kind: rand() > 0.45 ? 'pine' : 'oak',
    });
  }
  return trees;
}

function buildPlants(platforms: Platform[]): PlantSpec[] {
  const rand = createRandom(99);
  const flowerColors = [PALETTE.blossom, PALETTE.petal, PALETTE.mushroomCap];
  const plants: PlantSpec[] = [];
  platforms.forEach((p) => {
    const count = Math.max(2, Math.round(p.w / 2.5));
    for (let i = 0; i < count; i++) {
      const x = p.x - p.w / 2 + 0.8 + rand() * (p.w - 1.6);
      const z = -1.4 + rand() * 2.8;
      if (rand() > 0.7) {
        plants.push({ kind: 'mushroom', x, y: p.y, z, color: '', scale: 0.7 + rand() * 0.5 });
      } else {
        const color = flowerColors[Math.floor(rand() * flowerColors.length)];
        plants.push({ kind: 'flower', x, y: p.y, z, color, scale: 1 });
      }
    }
  });
  return plants;
}

function Pine({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 1.8, 6]} />
        <meshStandardMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {PINE_TIERS.map((tier) => (
        <mesh key={tier.y} position={[0, tier.y, 0]}>
          <coneGeometry args={[tier.radius, 1.8, 7]} />
          <meshStandardMaterial color={tier.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Oak({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 2, 6]} />
        <meshStandardMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={PALETTE.leaf} flatShading />
      </mesh>
      <mesh position={[0.7, 2.3, 0.3]}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={PALETTE.leafDark} flatShading />
      </mesh>
    </group>
  );
}

function Hills() {
  const hills = useMemo(() => {
    const rand = createRandom(21);
    const list: { x: number; y: number; r: number; color: string }[] = [];
    for (let x = -30; x < 170; x += 24) {
      list.push({
        x: x + rand() * 8,
        y: -6 + rand() * 2,
        r: 12 + rand() * 6,
        color: rand() > 0.5 ? PALETTE.hillNear : PALETTE.hillFar,
      });
    }
    return list;
  }, []);

  return (
    <>
      {hills.map((h, i) => (
        <mesh key={i} position={[h.x, h.y, -34]} scale={[1.4, 0.7, 1]}>
          <dodecahedronGeometry args={[h.r, 0]} />
          <meshStandardMaterial color={h.color} flatShading />
        </mesh>
      ))}
    </>
  );
}

function ForestFloor() {
  return (
    <mesh position={[60, FOREST_FLOOR_Y, -30]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[400, 80]} />
      <meshStandardMaterial color={PALETTE.grassDeep} flatShading />
    </mesh>
  );
}

function Flower({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 4]} />
        <meshStandardMaterial color={PALETTE.grassDeep} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.07, 6, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Mushroom({ x, y, z, scale }: { x: number; y: number; z: number; scale: number }) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.24, 6]} />
        <meshStandardMaterial color={PALETTE.mushroomStem} flatShading />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.17, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={PALETTE.mushroomCap} flatShading />
      </mesh>
    </group>
  );
}

export function ForestDecor({ platforms }: { platforms: Platform[] }) {
  const trees = useMemo(buildTrees, []);
  const plants = useMemo(() => buildPlants(platforms), [platforms]);

  return (
    <>
      <Hills />
      <ForestFloor />
      {trees.map((t, i) => (
        <group key={i} position={[t.x, FOREST_FLOOR_Y, t.z]}>
          {t.kind === 'pine' ? <Pine scale={t.scale} /> : <Oak scale={t.scale} />}
        </group>
      ))}
      {plants.map((plant, i) =>
        plant.kind === 'mushroom' ? (
          <Mushroom key={i} x={plant.x} y={plant.y} z={plant.z} scale={plant.scale} />
        ) : (
          <Flower key={i} x={plant.x} y={plant.y} z={plant.z} color={plant.color} />
        )
      )}
    </>
  );
}
