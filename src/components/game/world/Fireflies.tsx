import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { PALETTE } from '@/game/palette';
import { createRandom } from '@/game/random';

const FIREFLY_COUNT = 28;

interface FireflySpec {
  x: number;
  y: number;
  z: number;
  seed: number;
}

function buildFireflies(): FireflySpec[] {
  const rand = createRandom(314);
  return Array.from({ length: FIREFLY_COUNT }, () => ({
    x: -8 + rand() * 130,
    y: 1 + rand() * 4,
    z: -3 + rand() * 6,
    seed: rand() * Math.PI * 2,
  }));
}

const FIREFLIES = buildFireflies();

function Firefly({ spec }: { spec: FireflySpec }) {
  const root = useRef<Group>(null);

  useFrame(({ clock }) => {
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime + spec.seed;
    g.position.set(
      spec.x + Math.sin(t * 0.5) * 1.2,
      spec.y + Math.sin(t * 0.8) * 0.5,
      spec.z + Math.cos(t * 0.4) * 0.8
    );
  });

  return (
    <group ref={root}>
      <mesh>
        <sphereGeometry args={[0.06, 6, 5]} />
        <meshBasicMaterial color={PALETTE.firefly} />
      </mesh>
    </group>
  );
}

export function Fireflies() {
  return (
    <>
      {FIREFLIES.map((spec, i) => (
        <Firefly key={i} spec={spec} />
      ))}
    </>
  );
}
