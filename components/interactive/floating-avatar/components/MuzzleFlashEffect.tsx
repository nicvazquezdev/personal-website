import type { MuzzleFlash, GunPositions } from "../types";

interface MuzzleFlashEffectProps {
  muzzleFlashes: MuzzleFlash[];
  gunPositions: GunPositions;
}

export function MuzzleFlashEffect({ muzzleFlashes, gunPositions }: MuzzleFlashEffectProps) {
  if (muzzleFlashes.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {muzzleFlashes.map((flash) => {
        const pos = gunPositions[flash.side];
        return (
          <div
            key={flash.id}
            className="absolute"
            style={{
              left: pos.x,
              top: pos.y,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 28,
                height: 28,
                left: -14,
                top: -14,
                background:
                  "radial-gradient(circle, #fff 0%, #ffd166 30%, #ff6b35 60%, #ff4500 80%, transparent 100%)",
                boxShadow:
                  "0 0 30px #ff6b35, 0 0 50px #ff8c42, 0 0 70px rgba(255, 69, 0, 0.5)",
                opacity: flash.particles[0]?.opacity ?? 0,
              }}
            />
            {flash.particles.map((particle, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: particle.x - particle.size / 2,
                  top: particle.y - particle.size / 2,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 3}px ${particle.color}`,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
