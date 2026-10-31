import { PLATFORM_DEPTH, PLATFORM_THICKNESS } from '@/game/constants';
import { PALETTE } from '@/game/palette';
import type { Platform } from '@/game/types';

const GRASS_THICKNESS = 0.35;
const BODY_DEPTH = 3;

export function Platforms({ platforms }: { platforms: Platform[] }) {
  return (
    <>
      {platforms.map((platform, i) => (
        <Island key={i} platform={platform} seed={i} />
      ))}
    </>
  );
}

function Island({ platform, seed }: { platform: Platform; seed: number }) {
  const bodyHeight = BODY_DEPTH + PLATFORM_THICKNESS;
  const rockX = platform.x + (seed % 2 === 0 ? -1 : 1) * platform.w * 0.25;

  return (
    <group>
      <mesh position={[platform.x, platform.y - GRASS_THICKNESS - bodyHeight / 2, 0]}>
        <boxGeometry args={[platform.w, bodyHeight, PLATFORM_DEPTH]} />
        <meshStandardMaterial color={PALETTE.dirt} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[platform.x, platform.y - GRASS_THICKNESS / 2, 0]}>
        <boxGeometry args={[platform.w + 0.15, GRASS_THICKNESS, PLATFORM_DEPTH + 0.15]} />
        <meshStandardMaterial color={PALETTE.grass} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[rockX, platform.y - bodyHeight - 0.4, -0.6]} rotation={[0.3, seed, 0.2]}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color={PALETTE.stone} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
