import { useEffect } from 'react';

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
}

export function createInputState(): InputState {
  return { left: false, right: false, jump: false, attack: false };
}

const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA']);
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD']);
const JUMP_KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);
const ATTACK_KEYS = new Set(['KeyX']);

export function useGameControls(input: InputState) {
  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (LEFT_KEYS.has(event.code)) input.left = true;
      else if (RIGHT_KEYS.has(event.code)) input.right = true;
      else if (JUMP_KEYS.has(event.code)) {
        if (!event.repeat) input.jump = true;
      } else if (ATTACK_KEYS.has(event.code)) {
        if (!event.repeat) input.attack = true;
      } else return;
      event.preventDefault();
    };
    const handleUp = (event: KeyboardEvent) => {
      if (LEFT_KEYS.has(event.code)) input.left = false;
      else if (RIGHT_KEYS.has(event.code)) input.right = false;
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest('button')) return;
      input.attack = true;
    };
    const releaseAll = () => {
      input.left = false;
      input.right = false;
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('blur', releaseAll);
    };
  }, [input]);
}
