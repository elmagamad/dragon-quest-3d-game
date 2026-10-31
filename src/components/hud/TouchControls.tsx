import type { PointerEvent, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Swords } from 'lucide-react';
import type { InputState } from '@/game/input';

interface TouchControlsProps {
  input: InputState;
}

export function TouchControls({ input }: TouchControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 grid grid-cols-4 gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
      <HoldButton
        label="Move left"
        onChange={(pressed) => {
          input.left = pressed;
        }}
      >
        <ArrowLeft className="h-6 w-6" />
        <span>LEFT</span>
      </HoldButton>
      <HoldButton
        label="Jump"
        primary
        onChange={(pressed) => {
          if (pressed) input.jump = true;
        }}
      >
        <ArrowUp className="h-6 w-6" />
        <span>JUMP</span>
      </HoldButton>
      <HoldButton
        label="Move right"
        onChange={(pressed) => {
          input.right = pressed;
        }}
      >
        <ArrowRight className="h-6 w-6" />
        <span>RIGHT</span>
      </HoldButton>
      <HoldButton
        label="Attack"
        danger
        onChange={(pressed) => {
          if (pressed) input.attack = true;
        }}
      >
        <Swords className="h-6 w-6" />
        <span>ATTACK</span>
      </HoldButton>
    </div>
  );
}

interface HoldButtonProps {
  label: string;
  primary?: boolean;
  danger?: boolean;
  onChange: (pressed: boolean) => void;
  children: ReactNode;
}

function HoldButton({ label, primary = false, danger = false, onChange, children }: HoldButtonProps) {
  const handleDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onChange(true);
  };

  const handleUp = () => onChange(false);

  const tone = primary
    ? 'border-emerald-300/60 bg-emerald-700/90 active:bg-emerald-600'
    : danger
      ? 'border-rose-300/60 bg-rose-700/90 active:bg-rose-600'
      : 'border-white/40 bg-slate-900/70 active:bg-slate-700';

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onLostPointerCapture={handleUp}
      onContextMenu={(event) => event.preventDefault()}
      className={`pointer-events-auto flex h-16 touch-none select-none flex-col items-center justify-center gap-1 rounded-2xl border text-[11px] font-bold tracking-[0.1em] text-white shadow-xl backdrop-blur-sm transition-transform duration-100 active:scale-95 sm:h-20 sm:text-xs ${tone}`}
    >
      {children}
    </button>
  );
}
