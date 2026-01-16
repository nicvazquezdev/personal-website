"use client";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <span
      className={`glitch-text relative inline-block ${className}`}
      data-text={text}
    >
      {text}
      <style jsx>{`
        .glitch-text {
          position: relative;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          background: inherit;
        }

        .glitch-text::before {
          color: #0ff;
          z-index: -1;
        }

        .glitch-text::after {
          color: #f0f;
          z-index: -2;
        }

        .glitch-text:hover {
          animation: glitch-main 0.15s infinite linear;
          text-shadow:
            0 0 5px #fff,
            0 0 10px #0ff,
            0 0 20px #f0f,
            0 0 40px #0ff;
        }

        .glitch-text:hover::before,
        .glitch-text:hover::after {
          opacity: 1;
        }

        .glitch-text:hover::before {
          animation: glitch-1 0.1s infinite linear alternate-reverse;
          text-shadow: -3px 0 #f0f;
        }

        .glitch-text:hover::after {
          animation: glitch-2 0.1s infinite linear alternate-reverse;
          text-shadow: 3px 0 #0ff;
        }

        @keyframes glitch-main {
          0%, 100% {
            transform: translate(0);
            opacity: 1;
          }
          10% {
            transform: translate(-3px, 2px) skew(-5deg);
          }
          20% {
            transform: translate(3px, -2px) skew(3deg);
            opacity: 0.8;
          }
          30% {
            transform: translate(-2px, 1px);
          }
          40% {
            transform: translate(2px, -1px) skew(2deg);
            opacity: 0.9;
          }
          50% {
            transform: translate(-1px, 2px) skew(-3deg);
            opacity: 0.7;
          }
          60% {
            transform: translate(3px, 1px);
          }
          70% {
            transform: translate(-3px, -2px) skew(5deg);
            opacity: 0.85;
          }
          80% {
            transform: translate(2px, 3px) skew(-2deg);
          }
          90% {
            transform: translate(-2px, -1px);
            opacity: 0.95;
          }
        }

        @keyframes glitch-1 {
          0% {
            clip-path: inset(20% 0 30% 0);
            transform: translate(-5px, -3px) skew(-10deg);
          }
          10% {
            clip-path: inset(70% 0 5% 0);
            transform: translate(4px, 2px) skew(5deg);
          }
          20% {
            clip-path: inset(5% 0 70% 0);
            transform: translate(-3px, 4px);
          }
          30% {
            clip-path: inset(50% 0 20% 0);
            transform: translate(5px, -2px) skew(-8deg);
          }
          40% {
            clip-path: inset(15% 0 60% 0);
            transform: translate(-4px, 3px) skew(12deg);
          }
          50% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(3px, -4px);
          }
          60% {
            clip-path: inset(35% 0 40% 0);
            transform: translate(-5px, 2px) skew(-6deg);
          }
          70% {
            clip-path: inset(60% 0 15% 0);
            transform: translate(4px, -3px) skew(10deg);
          }
          80% {
            clip-path: inset(10% 0 75% 0);
            transform: translate(-2px, 5px);
          }
          90% {
            clip-path: inset(45% 0 30% 0);
            transform: translate(5px, -1px) skew(-4deg);
          }
          100% {
            clip-path: inset(25% 0 50% 0);
            transform: translate(-4px, 3px) skew(7deg);
          }
        }

        @keyframes glitch-2 {
          0% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(5px, 2px) skew(8deg);
          }
          10% {
            clip-path: inset(10% 0 65% 0);
            transform: translate(-4px, -3px) skew(-12deg);
          }
          20% {
            clip-path: inset(40% 0 35% 0);
            transform: translate(3px, 5px);
          }
          30% {
            clip-path: inset(75% 0 5% 0);
            transform: translate(-5px, -2px) skew(6deg);
          }
          40% {
            clip-path: inset(25% 0 55% 0);
            transform: translate(4px, 4px) skew(-10deg);
          }
          50% {
            clip-path: inset(5% 0 80% 0);
            transform: translate(-3px, -5px);
          }
          60% {
            clip-path: inset(55% 0 25% 0);
            transform: translate(5px, 3px) skew(4deg);
          }
          70% {
            clip-path: inset(30% 0 45% 0);
            transform: translate(-4px, -4px) skew(-8deg);
          }
          80% {
            clip-path: inset(85% 0 5% 0);
            transform: translate(2px, 5px);
          }
          90% {
            clip-path: inset(15% 0 70% 0);
            transform: translate(-5px, -2px) skew(10deg);
          }
          100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(4px, 3px) skew(-5deg);
          }
        }
      `}</style>
    </span>
  );
}
