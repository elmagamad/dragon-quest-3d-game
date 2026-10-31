import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ForestGuardianProps {
  position?: [number, number, number];
  defeated?: boolean;
}

export function ForestGuardian({
  position = [0, 0, -8],
  defeated = false,
}: ForestGuardianProps) {
  const guardian = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!guardian.current || defeated) return;

    guardian.current.rotation.y += delta * 0.4;
    guardian.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });

  return (
    <group ref={guardian} position={position}>
      {/* Body */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.2, 2, 6]} />
        <meshStandardMaterial color="#315b35" flatShading />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <sphereGeometry args={[0.75, 8, 8]} />
        <meshStandardMaterial color="#527c3e" flatShading />
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

      {/* Crown / branches */}
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
