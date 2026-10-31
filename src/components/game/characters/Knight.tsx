import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Group, type Mesh, type MeshBasicMaterial } from 'three';
import {
  SWORD_ACTIVE_END,
  SWORD_ACTIVE_START,
  SWORD_SWING_DURATION,
} from '@/game/constants';
import { PALETTE } from '@/game/palette';
import type { PlayerState } from '@/game/types';

const WALK_SWING = 0.7;
const SHIELD_OFFSET = -0.12;
const ARM_IDLE = 0.9;
const ARM_WINDUP = 2.4;
const ARM_STRIKE = 0;
const ARC_OPACITY = 0.55;

function swordArmAngle(t: number) {
  if (t < SWORD_ACTIVE_START) {
    return ARM_IDLE + (ARM_WINDUP - ARM_IDLE) * (t / SWORD_ACTIVE_START);
  }
  if (t < SWORD_ACTIVE_END) {
    const k = (t - SWORD_ACTIVE_START) / (SWORD_ACTIVE_END - SWORD_ACTIVE_START);
    return ARM_WINDUP + (ARM_STRIKE - ARM_WINDUP) * k;
  }
  const k = (t - SWORD_ACTIVE_END) / (SWORD_SWING_DURATION - SWORD_ACTIVE_END);
  return ARM_STRIKE + (ARM_IDLE - ARM_STRIKE) * k;
}

export function Knight({ player }: { player: PlayerState }) {
  const root = useRef<Group>(null);
  const frontLeg = useRef<Group>(null);
  const backLeg = useRef<Group>(null);
  const swordArm = useRef<Group>(null);
  const shieldArm = useRef<Group>(null);
  const sword = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const arc = useRef<Mesh>(null);
  const heading = useRef(0);

  useFrame(({ clock }, delta) => {
    const g = root.current;
    if (!g) return;

    const running = player.onGround && Math.abs(player.vx) > 0.5;
    const airborne = !player.onGround;
    const stride = running ? Math.sin(player.anim * 14) : 0;

    g.position.set(player.x, player.y + Math.abs(stride) * 0.04, 0);
    const targetHeading = player.facing > 0 ? 0 : Math.PI;
    heading.current += (targetHeading - heading.current) * Math.min(1, delta * 14);
    g.rotation.y = heading.current;
    g.visible = player.invuln <= 0 || Math.floor(player.invuln * 12) % 2 === 0;

    if (shadow.current) {
      const height = Math.max(0, player.y - player.groundY);
      const scale = Math.max(0.35, 1 - height * 0.2);
      shadow.current.position.y = player.groundY - player.y + 0.02;
      shadow.current.scale.setScalar(scale);
      (shadow.current.material as MeshBasicMaterial).opacity = 0.28 * scale;
    }

    if (frontLeg.current) frontLeg.current.rotation.z = airborne ? 0.6 : stride * WALK_SWING;
    if (backLeg.current) backLeg.current.rotation.z = airborne ? -0.4 : -stride * WALK_SWING;
    const swinging = player.swingTime >= 0;
    if (swordArm.current) {
      swordArm.current.rotation.z = swinging
        ? swordArmAngle(player.swingTime)
        : airborne
          ? 1.5
          : ARM_IDLE + stride * 0.15;
    }
    if (arc.current) {
      const active = swinging && player.swingTime >= SWORD_ACTIVE_START && player.swingTime <= SWORD_ACTIVE_END;
      arc.current.visible = active;
      (arc.current.material as MeshBasicMaterial).opacity = ARC_OPACITY;
    }
    if (shieldArm.current) {
      shieldArm.current.rotation.z = airborne ? -0.3 : -0.2 - stride * 0.25;
    }
    if (sword.current) {
      sword.current.rotation.z = -1.6 + Math.sin(clock.elapsedTime * 2.4) * 0.06;
    }
  });

  return (
    <group ref={root}>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="#0b2a1f" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <group ref={backLeg} position={[0, 0.62, -0.12]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={PALETTE.steelDark} flatShading />
        </mesh>
        <mesh position={[0.03, -0.58, 0]}>
          <boxGeometry args={[0.26, 0.14, 0.24]} />
          <meshStandardMaterial color={PALETTE.leather} flatShading />
        </mesh>
      </group>

      <group ref={frontLeg} position={[0, 0.62, 0.12]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={PALETTE.steelDark} flatShading />
        </mesh>
        <mesh position={[0.03, -0.58, 0]}>
          <boxGeometry args={[0.26, 0.14, 0.24]} />
          <meshStandardMaterial color={PALETTE.leather} flatShading />
        </mesh>
      </group>

      <mesh position={[0, 0.66, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.52]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.5} roughness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.46, 0.55, 0.5]} />
        <meshStandardMaterial color={PALETTE.steel} metalness={0.4} roughness={0.35} flatShading />
      </mesh>
      <mesh position={[0.25, 0.85, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.3]} />
        <meshStandardMaterial color={PALETTE.tabard} flatShading />
      </mesh>
      <mesh position={[-0.26, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.46]} />
        <meshStandardMaterial color={PALETTE.tabard} flatShading />
      </mesh>

      <mesh position={[0.02, 1.5, 0]}>
        <sphereGeometry args={[0.23, 14, 10]} />
        <meshStandardMaterial color={PALETTE.skin} flatShading />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.265, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={PALETTE.steel} metalness={0.5} roughness={0.3} flatShading />
      </mesh>
      <mesh position={[0.2, 1.46, 0]}>
        <boxGeometry args={[0.07, 0.1, 0.34]} />
        <meshStandardMaterial color={PALETTE.visor} flatShading />
      </mesh>
      <mesh position={[-0.05, 1.88, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0, 0.1, 0.4, 6]} />
        <meshStandardMaterial color={PALETTE.tabard} flatShading />
      </mesh>

      <group ref={shieldArm} position={[0, 1.2, -0.28]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.16, 0.5, 0.16]} />
          <meshStandardMaterial color={PALETTE.steel} flatShading />
        </mesh>
        <mesh position={[0.02, -0.3, SHIELD_OFFSET]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.06, 10]} />
          <meshStandardMaterial color={PALETTE.tabard} flatShading />
        </mesh>
        <mesh position={[0.02, -0.3, SHIELD_OFFSET + 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.025, 6, 16]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.6} roughness={0.3} flatShading />
        </mesh>
      </group>

      <mesh ref={arc} position={[0, 1.2, 0.3]} visible={false}>
        <ringGeometry args={[1.1, 1.6, 20, 1, -Math.PI * 0.45, Math.PI * 0.9]} />
        <meshBasicMaterial color={PALETTE.impact} transparent opacity={ARC_OPACITY} depthWrite={false} side={DoubleSide} />
      </mesh>

      <group ref={swordArm} position={[0, 1.2, 0.28]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.16, 0.5, 0.16]} />
          <meshStandardMaterial color={PALETTE.steel} flatShading />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color={PALETTE.skin} flatShading />
        </mesh>
        <group ref={sword} position={[0, -0.5, 0]}>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
            <meshStandardMaterial color={PALETTE.leather} flatShading />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.05, 0.32]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.6} roughness={0.3} flatShading />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.07, 0.95, 0.025]} />
            <meshStandardMaterial
              color={PALETTE.steel}
              metalness={0.7}
              roughness={0.2}
              emissive={PALETTE.portal}
              emissiveIntensity={0.08}
              flatShading
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
