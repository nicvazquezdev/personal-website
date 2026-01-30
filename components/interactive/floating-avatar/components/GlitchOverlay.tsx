import Image from "next/image";

interface GlitchOverlayProps {
  currentImage: string;
  alternateImage: string;
  size: number;
  flipX?: boolean;
}

export function GlitchOverlay({ currentImage, alternateImage, size, flipX = true }: GlitchOverlayProps) {
  const flipClass = flipX ? "scale-x-[-1]" : "";

  return (
    <>
      <Image
        src={alternateImage}
        alt=""
        className={`absolute inset-0 ${flipClass} opacity-50 pointer-events-none animate-cyber-glitch`}
        style={{
          filter: "blur(2px) brightness(1.5) hue-rotate(180deg)",
          left: "4px",
          mixBlendMode: "screen",
        }}
        width={size}
        height={size}
        draggable={false}
      />
      <Image
        src={alternateImage}
        alt=""
        className={`absolute inset-0 ${flipClass} opacity-50 pointer-events-none animate-cyber-glitch`}
        style={{
          filter: "blur(2px) hue-rotate(280deg) brightness(1.5)",
          left: "-4px",
          mixBlendMode: "screen",
          animationDelay: "-0.1s",
        }}
        width={size}
        height={size}
        draggable={false}
      />
    </>
  );
}
