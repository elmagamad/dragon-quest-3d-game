import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { PORTAL_RADIUS } from '@/game/constants';
import { PALETTE } from '@/game/palette';
import type { EnemyState, Vec2 } from '@/game/types';

const SPARKLE_COUNT = 8;

export function Portal({ position, enemies }: { position: Vec2; enemies: EnemyState[] }) {
  const glow = useRef<Mesh>(null);
  const ringMaterial = useRef<MeshStandardMaterial>(null);
  const sparkles = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const open = enemies.every((e) => !e.alive);
    if (glow.current) {
      const material = glow.current.material as MeshStandardMaterial;
      material.opacity = open ? 0.4 + Math.sin(t * 3) * 0.15 : 0.1;
      material.emissiveIntensity = open ? 0.8 : 0.1;
    }
    if (ringMaterial.current) {
      ringMaterial.current.color.set(open ? PALETTE.gold : PALETTE.stoneDark);
      ringMaterial.current.emissiveIntensity = open ? 0.4 : 0.02;
    }
    if (sparkles.current) {
      sparkles.current.visible = open;
      sparkles.current.rotation.z = t * 0.9;
    }
  });

  const ringY = position.y + PORTAL_RADIUS;

  return (
    <group position={[position.x, 0, 0]}>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, position.y + 1.4, -0.2]}>
          <cylinderGeometry args={[0.28, 0.34, 2.8, 8]} />
          <meshStandardMaterial color={PALETTE.stone} flatShading />
        </mesh>
      ))}
      <mesh ref={glow} position={[0, ringY, -0.2]}>
        <circleGeometry args={[PORTAL_RADIUS * 0.9, 32]} />
        <meshStandardMaterial
          color={PALETTE.portal}
          emissive={PALETTE.portalDeep}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, ringY, 0]}>
        <torusGeometry args={[PORTAL_RADIUS, 0.22, 10, 36]} />
        <meshStandardMaterial
          ref={ringMaterial}
          color={PALETTE.stoneDark}
          metalness={0.6}
          roughness={0.3}
          emissive={PALETTE.goldDeep}
          emissiveIntensity={0.02}
          flatShading
        />
      </mesh>
      <group ref={sparkles} position={[0, ringY, 0]}>
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => {
          const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * PORTAL_RADIUS, Math.sin(angle) * PORTAL_RADIUS, 0.1]}
            >
              <sphereGeometry args={[0.09, 6, 5]} />
              <meshStandardMaterial color={PALETTE.portal} emissive={PALETTE.portal} emissiveIntensity={1} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
