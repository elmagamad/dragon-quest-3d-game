
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ForestGuardianProps {
  position?: [number, number, number];
  defeated?: boolean;
  hit?: boolean;
  health?: number;
  maxHealth?: number;
}

export function ForestGuardian({
  position = [0, 0, -8],
  defeated = false,
  hit = false,
  health = 100,
  maxHealth = 100,
}: ForestGuardianProps) {
  const guardian = useRef<Group>(null);

  useFrame((state) => {
    if (!guardian.current || defeated) return;

    const time = state.clock.elapsedTime;

    guardian.current.rotation.y = Math.sin(time * 0.5) * 0.15;
    guardian.current.position.y =
      position[1] + Math.sin(time * 1.5) * 0.15;

    guardian.current.position.x = hit
      ? position[0] + Math.sin(time * 35) * 0.08
      : position[0];
  });

  const bodyColor = hit ? '#ff7777' : '#315b35';
  const headColor = hit ? '#ffaaaa' : '#527c3e';
  const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
    <group ref={guardian} position={position}>
      {/* Boss Health Bar Background */}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[3.6, 0.22, 0.08]} />
        <meshBasicMaterial color="#1a0a0a" />
      </mesh>

      {/* Boss Health Bar */}
      <mesh position={[-1.8 + (healthPercent / 100) * 1.8, 5.2, 0.05]}>
        <boxGeometry args={[3.6 * (healthPercent / 100), 0.16, 0.1]} />
        <meshBasicMaterial color="#ff2020" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.2, 2, 6]} />
        <meshStandardMaterial color={bodyColor} flatShading />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <sphereGeometry args={[0.75, 8, 8]} />
        <meshStandardMaterial color={headColor} flatShading />
      </mesh>

      {/* Glowing eyes */}
      <mesh position={[-0.28, 3.2, 0.65]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshBasicMaterial color="#ff3300" />
      </mesh>

      <mesh position={[0.28, 3.2, 0.65]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshBasicMaterial color="#ff3300" />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.3, 2, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#654321" flatShading />
      </mesh>

      <mesh position={[1.3, 2, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#654321" flatShading />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.45, 0.5, 0]} castShadow>
        <boxGeometry args={[0.65, 1, 0.7]} />
        <meshStandardMaterial color="#3b4828" flatShading />
      </mesh>

      <mesh position={[0.45, 0.5, 0]} castShadow>
        <boxGeometry args={[0.65, 1, 0.7]} />
        <meshStandardMaterial color="#3b4828" flatShading />
      </mesh>

      {/* Crown branches */}
      <mesh position={[-0.5, 4, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.35, 1.2, 5]} />
        <meshStandardMaterial color="#244d20" flatShading />
      </mesh>

      <mesh position={[0.5, 4, 0]} rotation={[0, 0, 0.5]} castShadow>
        <coneGeometry args={[0.35, 1.2, 5]} />
        <meshStandardMaterial color="#244d20" flatShading />
      </mesh>
    </group>
  );
}

export default ForestGuardian;
