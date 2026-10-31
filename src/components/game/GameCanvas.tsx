import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { GameScene } from '@/components/game/GameScene';
import type { InputState } from '@/game/input';
import { PALETTE } from '@/game/palette';
import type { SimEvent } from '@/game/types';

interface GameCanvasProps {
  active: boolean;
  runId: number;
  input: InputState;
  onEvent: (event: SimEvent) => void;
}

export function GameCanvas({ active, runId, input, onEvent }: GameCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 3.4, 10.5], fov: 46, near: 0.1, far: 300 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[PALETTE.sky]} />
      <fog attach="fog" args={[PALETTE.fog, 38, 120]} />
      <hemisphereLight args={['#eafcff', '#4d7d3a', 1.2]} />
      <directionalLight position={[8, 18, 12]} intensity={1.3} color="#fff4d9" />
      <Sky distance={450000} sunPosition={[60, 25, -40]} turbidity={3} rayleigh={1.4} />
      <GameScene key={runId} active={active} input={input} onEvent={onEvent} />
    </Canvas>
  );
}
