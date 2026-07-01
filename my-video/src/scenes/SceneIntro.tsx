import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { BRAND_BLUE } from "../constants";

const Particle: React.FC<{
  delay: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}> = ({ delay, x, y, size, speed }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 60 / speed], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.8, 0.6, 0]);
  const translateY = interpolate(progress, [0, 1], [0, -150 * speed]);
  const translateX = interpolate(
    progress,
    [0, 1],
    [0, (x > 50 ? 1 : -1) * 30 * speed]
  );
  const scale = interpolate(progress, [0, 0.5, 1], [0, 1, 0.3]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: BRAND_BLUE,
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        boxShadow: `0 0 ${size * 2}px ${BRAND_BLUE}`,
      }}
    />
  );
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lineScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  const glowPulse =
    interpolate(frame, [20, 50, 80], [0, 1, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * 0.6;

  const fadeOut = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = [
    { delay: 15, x: 50, y: 55, size: 8, speed: 1.2 },
    { delay: 20, x: 40, y: 60, size: 6, speed: 0.9 },
    { delay: 25, x: 60, y: 58, size: 10, speed: 1.0 },
    { delay: 18, x: 35, y: 52, size: 5, speed: 1.4 },
    { delay: 30, x: 65, y: 62, size: 7, speed: 0.8 },
    { delay: 22, x: 48, y: 48, size: 4, speed: 1.6 },
    { delay: 28, x: 55, y: 65, size: 9, speed: 1.1 },
    { delay: 35, x: 42, y: 50, size: 6, speed: 1.3 },
    { delay: 32, x: 58, y: 45, size: 5, speed: 1.5 },
    { delay: 40, x: 30, y: 55, size: 8, speed: 0.7 },
    { delay: 38, x: 70, y: 50, size: 7, speed: 1.0 },
    { delay: 45, x: 45, y: 42, size: 4, speed: 1.8 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, #0A1628 0%, #000510 100%)`,
        opacity: fadeOut,
      }}
    >
      {/* Animated glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_BLUE}${Math.round(glowPulse * 40).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          opacity: bgOpacity,
        }}
      />

      {/* Horizontal lines */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${50 + i * 8}%`,
            left: "10%",
            right: "10%",
            height: 1,
            backgroundColor: BRAND_BLUE,
            opacity: 0.1 * lineScale,
            transform: `scaleX(${lineScale})`,
            transformOrigin: "center",
          }}
        />
      ))}

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Center ring animation */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${lineScale})`,
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `2px solid ${BRAND_BLUE}`,
          opacity: 0.4 * lineScale,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${lineScale * 0.7})`,
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `1px solid ${BRAND_BLUE}`,
          opacity: 0.2 * lineScale,
        }}
      />
    </AbsoluteFill>
  );
};
