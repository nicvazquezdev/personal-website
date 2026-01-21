import { useState, useEffect, startTransition } from "react";
import { ANIMATION } from "@/config";
import type { Position } from "../types";

export function useParallax(): Position {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const factor = ANIMATION.floatingAvatar.parallaxFactor;
      const x = (e.clientX / window.innerWidth - 0.5) * factor;
      const y = (e.clientY / window.innerHeight - 0.5) * factor;

      startTransition(() => {
        setMousePosition({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}
