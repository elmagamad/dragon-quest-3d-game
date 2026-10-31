import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { COIN_RADIUS } from '@/game/constants';
import { PALETTE } from '@/game/palette';
import type { CoinState } from '@/game/types';

const PICKUP_DURATION = 0.35;
const PICKUP_RISE = 0.9;
const PICKUP_POP = 0.6;

export function Coin({ coin }: { coin: CoinState }) {
  const root = useRef<Group>(null);
  const pickedAt = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime;

    if (!coin.collected) {
      g.visible = true;
      g.position.set(coin.x, coin.y + Math.sin(t * 2 + coin.x) * 0.08, 0);
      g.scale.setScalar(1);
      g.rotation.y = t * 2.5 + coin.x;
      return;
    }

    if (pickedAt.current === null) pickedAt.current = t;
    const progress = (t - pickedAt.current) / PICKUP_DURATION;
    g.visible = progress < 1;
    const eased = Math.min(1, progress);
    g.position.set(coin.x, coin.y + eased * PICKUP_RISE, 0);
    g.scale.setScalar(1 + Math.sin(eased * Math.PI) * PICKUP_POP);
    g.rotation.y = t * 8 + coin.x;
  });

  return (
    <group ref={root}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, 0.08, 14]} />
        <meshStandardMaterial
          color={PALETTE.gold}
          metalness={0.7}
          roughness={0.25}
          emissive={PALETTE.goldDeep}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[COIN_RADIUS, 0.035, 6, 18]} />
        <meshStandardMaterial color={PALETTE.goldDeep} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
