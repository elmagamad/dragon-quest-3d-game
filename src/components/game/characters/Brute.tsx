import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Group, type Mesh, type MeshBasicMaterial, type MeshStandardMaterial } from 'three';
import {
  BRUTE_HEALTH,
  BRUTE_HEIGHT,
  BRUTE_WINDUP,
  HIT_FLASH_TIME,
} from '@/game/constants';
import { PALETTE } from '@/game/palette';
import type { EnemyState } from '@/game/types';

const DEATH_DURATION = 0.4;
const BAR_WIDTH = 1.2;
const BAR_HEIGHT = 0.14;

export function Brute({ enemy }: { enemy: EnemyState }) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const club = useRef<Group>(null);
  const bodyMaterial = useRef<MeshStandardMaterial>(null);
  const barFill = useRef<Mesh>(null);
  const impact = useRef<Mesh>(null);

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    g.position.set(enemy.x, enemy.y, 0);

    if (!enemy.alive) {
      const t = Math.min(1, enemy.deadTime / DEATH_DURATION);
      g.visible = t < 1;
      g.scale.set(1 + t * 0.4, 1 - t * 0.9, 1 + t * 0.4);
      return;
    }
    g.visible = true;
    g.scale.set(1, 1, 1);

    const ratio = Math.max(0, enemy.health / BRUTE_HEALTH);
    if (barFill.current) {
      barFill.current.scale.x = ratio;
      barFill.current.position.x = -BAR_WIDTH / 2 + (BAR_WIDTH * ratio) / 2;
    }

    if (body.current) {
      body.current.rotation.y = enemy.dir > 0 ? 0 : Math.PI;
      body.current.position.y = Math.sin(enemy.phase * 6) * 0.03;
    }

    const windupProgress = enemy.windup > 0 ? 1 - enemy.windup / BRUTE_WINDUP : 0;
    if (club.current) {
      club.current.rotation.z =
        enemy.windup > 0 ? 0.3 + windupProgress * 2.6 : 0.25 + Math.sin(enemy.phase * 6) * 0.12;
    }

    const flash = enemy.hitFlash / HIT_FLASH_TIME;
    if (bodyMaterial.current) {
      bodyMaterial.current.emissiveIntensity = flash * 1.2;
    }
    if (impact.current) {
      impact.current.visible = flash > 0;
      const grow = 1 + (1 - flash) * 1.2;
      impact.current.scale.setScalar(grow);
      (impact.current.material as MeshBasicMaterial).opacity = flash * 0.9;
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {[0.22, -0.22].map((z) => (
          <mesh key={z} position={[0, 0.3, z]}>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial color={PALETTE.briarBark} flatShading />
          </mesh>
        ))}
        <mesh position={[0, 0.95, 0]} scale={[1, 1.05, 0.9]}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            ref={bodyMaterial}
            color={PALETTE.briarBody}
            emissive="#ff6b5a"
            emissiveIntensity={0}
            roughness={0.85}
            flatShading
          />
        </mesh>
        {[
          [-0.15, 1.2, 0.42],
          [-0.2, 0.9, -0.42],
          [0.05, 1.45, 0.3],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, i === 1 ? 0.6 : -0.4]}>
            <coneGeometry args={[0.09, 0.32, 5]} />
            <meshStandardMaterial color={PALETTE.briarThorn} flatShading />
          </mesh>
        ))}
        <mesh position={[0.08, 1.6, 0]}>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color={PALETTE.briarBody} roughness={0.85} flatShading />
        </mesh>
        {[0.2, -0.2].map((z) => (
          <mesh key={z} position={[0.14, 1.9, z]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.07, 0.36, 5]} />
            <meshStandardMaterial color={PALETTE.briarThorn} flatShading />
          </mesh>
        ))}
        {[0.14, -0.14].map((z) => (
          <mesh key={z} position={[0.4, 1.66, z]}>
            <sphereGeometry args={[0.07, 8, 6]} />
            <meshBasicMaterial color={PALETTE.briarEye} />
          </mesh>
        ))}
        <mesh position={[-0.05, 1.0, -0.5]}>
          <boxGeometry args={[0.22, 0.6, 0.22]} />
          <meshStandardMaterial color={PALETTE.briarBark} flatShading />
        </mesh>
        <group ref={club} position={[0, 1.25, 0.5]}>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color={PALETTE.briarBark} flatShading />
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <icosahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial color={PALETTE.briarThorn} flatShading />
          </mesh>
        </group>
        <mesh ref={impact} position={[0.6, BRUTE_HEIGHT * 0.6, 0.2]} visible={false}>
          <ringGeometry args={[0.2, 0.3, 14]} />
          <meshBasicMaterial color={PALETTE.impact} transparent depthWrite={false} side={DoubleSide} />
        </mesh>
      </group>

      <mesh position={[0, BRUTE_HEIGHT + 0.45, 0.05]}>
        <planeGeometry args={[BAR_WIDTH + 0.08, BAR_HEIGHT + 0.08]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh ref={barFill} position={[0, BRUTE_HEIGHT + 0.45, 0.06]}>
        <planeGeometry args={[BAR_WIDTH, BAR_HEIGHT]} />
        <meshBasicMaterial color="#84cc16" />
      </mesh>
    </group>
  );
}
