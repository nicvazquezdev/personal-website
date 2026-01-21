import { useState, useEffect, useRef, useCallback } from "react";
import { ANIMATION } from "@/config";
import { MUZZLE_FLASH_COLORS, PARTICLE_CONFIG } from "../constants";
import type { MuzzleFlash } from "../types";

interface UseMuzzleFlashProps {
  isAttackMode: boolean;
}

export function useMuzzleFlash({ isAttackMode }: UseMuzzleFlashProps): MuzzleFlash[] {
  const [muzzleFlashes, setMuzzleFlashes] = useState<MuzzleFlash[]>([]);
  const flashIdRef = useRef(0);

  const createMuzzleFlash = useCallback((side: "left" | "right") => {
    const direction = side === "left" ? -1 : 1;
    const particles = Array.from({ length: PARTICLE_CONFIG.count }, () => ({
      x: 0,
      y: 0,
      vx: direction * (Math.random() * PARTICLE_CONFIG.velocityX.max + PARTICLE_CONFIG.velocityX.min),
      vy: -(Math.random() * PARTICLE_CONFIG.velocityY.max + PARTICLE_CONFIG.velocityY.min),
      size: Math.random() * PARTICLE_CONFIG.size.max + PARTICLE_CONFIG.size.min,
      opacity: 1,
      color: MUZZLE_FLASH_COLORS[Math.floor(Math.random() * MUZZLE_FLASH_COLORS.length)],
    }));

    const flash: MuzzleFlash = {
      id: flashIdRef.current++,
      side,
      particles,
    };

    setMuzzleFlashes((prev) => [...prev.slice(-PARTICLE_CONFIG.maxFlashes), flash]);

    let frame = 0;
    const animate = () => {
      frame++;
      setMuzzleFlashes((prev) =>
        prev.map((f) => {
          if (f.id !== flash.id) return f;
          return {
            ...f,
            particles: f.particles.map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              opacity: Math.max(0, p.opacity - PARTICLE_CONFIG.opacityDecay),
              size: Math.max(0, p.size - PARTICLE_CONFIG.sizeDecay),
            })),
          };
        })
      );

      if (frame < PARTICLE_CONFIG.maxFrames) {
        requestAnimationFrame(animate);
      } else {
        setMuzzleFlashes((prev) => prev.filter((f) => f.id !== flash.id));
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isAttackMode) {
      setMuzzleFlashes([]);
      return;
    }

    const shootBothGuns = () => {
      createMuzzleFlash("left");
      setTimeout(() => createMuzzleFlash("right"), 50);
    };

    const interval = setInterval(shootBothGuns, ANIMATION.floatingAvatar.laserInterval);
    shootBothGuns();

    return () => clearInterval(interval);
  }, [isAttackMode, createMuzzleFlash]);

  return muzzleFlashes;
}
