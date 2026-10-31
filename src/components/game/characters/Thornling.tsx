import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { PALETTE } from '@/game/palette';
import type { EnemyState } from '@/game/types';

const DEATH_DURATION = 0.35;

export function Thornling({ enemy }: { enemy: EnemyState }) {
  const root = useRef<Group>(null);

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    g.position.set(enemy.x, enemy.y, 0);
    g.rotation.y = enemy.dir > 0 ? 0 : Math.PI;

    if (enemy.alive) {
      g.visible = true;
      const bob = 1 + Math.sin(enemy.phase * 9) * 0.05;
      g.scale.set(1, bob, 1);
      return;
    }
    const t = Math.min(1, enemy.deadTime / DEATH_DURATION);
    g.visible = t < 1;
    g.scale.set(1 + t * 0.4, 1 - t * 0.9, 1 + t * 0.4);
  });

  return (
    <group ref={root}>
      <mesh position={[0, 0.4, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[0.4, 12, 9]} />
        <meshStandardMaterial color={PALETTE.thornBody} roughness={0.8} flatShading />
      </mesh>
      {[
        [-0.12, 0.74, 0],
        [0.1, 0.7, 0.14],
        [0.06, 0.7, -0.15],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <coneGeometry args={[0.09, 0.3, 5]} />
          <meshStandardMaterial color={PALETTE.thornSpike} flatShading />
        </mesh>
      ))}
      {[0.12, -0.12].map((z) => (
        <group key={z} position={[0.3, 0.5, z]}>
          <mesh>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color={PALETTE.thornEye} />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <sphereGeometry args={[0.05, 6, 5]} />
            <meshStandardMaterial color={PALETTE.thornPupil} />
          </mesh>
        </group>
      ))}
      {[0.2, -0.2].map((z) => (
        <mesh key={z} position={[0.12, 0.05, z]}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshStandardMaterial color={PALETTE.thornSpike} flatShading />
        </mesh>
      ))}
    </group>
  );
}
