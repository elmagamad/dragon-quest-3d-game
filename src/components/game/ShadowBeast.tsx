
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ShadowBeastProps {
  position?: [number, number, number];
  defeated?: boolean;
  hit?: boolean;
  health?: number;
  maxHealth?: number;
}

export function ShadowBeast({
  position = [0, 0, -8],
  defeated = false,
  hit = false,
  health = 150,
  maxHealth = 150,
}: ShadowBeastProps) {
  const beast = useRef<Group>(null);

  useFrame((state) => {
    if (!beast.current || defeated) return;

    const time = state.clock.elapsedTime;

    beast.current.rotation.y = Math.sin(time * 0.8) * 0.2;

    beast.current.position.y =
      position[1] + Math.sin(time * 2) * 0.2;

    beast.current.position.x = hit
      ? position[0] + Math.sin(time * 40) * 0.12
      : position[0];
  });

  const bodyColor = hit ? '#ff5555' : '#171323';
  const headColor = hit ? '#ff8888' : '#29203d';

  const healthPercent = Math.max(
    0,
    Math.min(100, (health / maxHealth) * 100)
  );

  return (
    <group ref={beast} position={position}>

      {/* Boss Health Bar Background */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[4.2, 0.25, 0.1]} />
        <meshBasicMaterial color="#100510" />
      </mesh>

      {/* Boss Health Bar */}
      <mesh
        position={[
          -2.1 + (healthPercent / 100) * 2.1,
          5.5,
          0.06,
        ]}
      >
        <boxGeometry
          args={[4.2 * (healthPercent / 100), 0.18, 0.12]}
        />
        <meshBasicMaterial color="#b000ff" />
      </mesh>

      {/* Massive Shadow Body */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.5, 2.4, 7]} />
        <meshStandardMaterial
          color={bodyColor}
          flatShading
          roughness={0.9}
        />
      </mesh>

      {/* Chest Armor */}
      <mesh position={[0, 2, 0.85]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.25]} />
        <meshStandardMaterial
          color="#44205f"
          emissive="#220044"
          emissiveIntensity={0.5}
          flatShading
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshStandardMaterial
          color={headColor}
          flatShading
          roughness={0.7}
        />
      </mesh>

      {/* Left Glowing Eye */}
      <mesh position={[-0.35, 3.55, 0.72]}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshBasicMaterial color="#cc00ff" />
      </mesh>

      {/* Right Glowing Eye */}
      <mesh position={[0.35, 3.55, 0.72]}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshBasicMaterial color="#cc00ff" />
      </mesh>

      {/* Left Horn */}
      <mesh
        position={[-0.65, 4.35, 0]}
        rotation={[0, 0, -0.45]}
        castShadow
      >
        <coneGeometry args={[0.3, 1.3, 5]} />
        <meshStandardMaterial
          color="#8b00ff"
          emissive="#4b0082"
          emissiveIntensity={0.7}
          flatShading
        />
      </mesh>

      {/* Right Horn */}
      <mesh
        position={[0.65, 4.35, 0]}
        rotation={[0, 0, 0.45]}
        castShadow
      >
        <coneGeometry args={[0.3, 1.3, 5]} />
        <meshStandardMaterial
          color="#8b00ff"
          emissive="#4b0082"
          emissiveIntensity={0.7}
          flatShading
        />
      </mesh>

      {/* Left Arm */}
      <mesh
        position={[-1.45, 2, 0]}
        rotation={[0, 0, -0.55]}
        castShadow
      >
        <boxGeometry args={[0.65, 2.2, 0.65]} />
        <meshStandardMaterial color="#21152d" flatShading />
      </mesh>

      {/* Right Arm */}
      <mesh
        position={[1.45, 2, 0]}
        rotation={[0, 0, 0.55]}
        castShadow
      >
        <boxGeometry args={[0.65, 2.2, 0.65]} />
        <meshStandardMaterial color="#21152d" flatShading />
      </mesh>

      {/* Left Claw */}
      <mesh position={[-1.65, 0.8, 0.3]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.22, 0.8, 4]} />
        <meshStandardMaterial color="#d6c7ff" flatShading />
      </mesh>

      {/* Right Claw */}
      <mesh position={[1.65, 0.8, 0.3]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.22, 0.8, 4]} />
        <meshStandardMaterial color="#d6c7ff" flatShading />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 1, 0.8]} />
        <meshStandardMaterial color="#120e1c" flatShading />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 1, 0.8]} />
        <meshStandardMaterial color="#120e1c" flatShading />
      </mesh>

      {/* Back Spikes */}
      <mesh
        position={[-0.5, 3, -0.65]}
        rotation={[0.5, 0, -0.3]}
        castShadow
      >
        <coneGeometry args={[0.35, 1.1, 5]} />
        <meshStandardMaterial color="#4b0082" flatShading />
      </mesh>

      <mesh
        position={[0.5, 3, -0.65]}
        rotation={[0.5, 0, 0.3]}
        castShadow
      >
        <coneGeometry args={[0.35, 1.1, 5]} />
        <meshStandardMaterial color="#4b0082" flatShading />
      </mesh>

    </group>
  );
}

export default ShadowBeast;

