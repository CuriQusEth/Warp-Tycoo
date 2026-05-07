import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    let isOfflineProcessed = false;

    const loop = () => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      
      // Calculate offline progress on first run if needed
      // (Simplified: we just let the first delta be large and tick handles it)
      if (!isOfflineProcessed) {
         // Optionally you can cap the max offline time, e.g. 24 hours
         const maxOfflineTime = 1000 * 60 * 60 * 24; 
         const actualDelta = Math.min(delta, maxOfflineTime);
         tick(actualDelta);
         isOfflineProcessed = true;
      } else {
         tick(delta);
      }

      lastUpdateRef.current = now;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [tick]);
}
