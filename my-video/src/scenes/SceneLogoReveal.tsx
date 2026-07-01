import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { BRAND_BLUE } from "../constants";
import { Logo } from "../components/Logo";

export const SceneLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
  });

  const titleSlide = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const subtitleSlide = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.9 },
  });

  const taglineSlide = spring({
    frame: frame - 50,
    fps,
    config: { damping: 16, stiffness: 60, mass: 1.0 },
  });

  const shimmer = interpolate(frame, [40, 80], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #0D1B2A 0%, #000510 100%)`,
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Background floating shapes */}
      {[0, 1, 2, 3, 4].map((i) => {
        const floatY = interpolate(
          frame,
          [0, 140],
          [0, -30 - i * 10],
          { extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${25 + i * 15}%`,
              left: `${10 + i * 18}%`,
              width: 60 + i * 20,
              height: 60 + i * 20,
              borderRadius: i % 2 === 0 ? "50%" : "30%",
              border: `1px solid rgba(45, 139, 250, ${0.05 + i * 0.02})`,
              transform: `translateY(${floatY}px) rotate(${frame * 0.3 + i * 30}deg)`,
            }}
          />
        );
      })}

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          filter: `drop-shadow(0 0 30px rgba(45, 139, 250, 0.5))`,
        }}
      >
        <Logo size={280} color="#fff" />
      </div>

      {/* App name */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${(1 - titleSlide) * 40}px)`,
          opacity: titleSlide,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -1,
            position: "relative",
          }}
        >
          Street Go
          {/* Shimmer effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent ${shimmer - 30}%, rgba(255,255,255,0.3) ${shimmer}%, transparent ${shimmer + 30}%)`,
              WebkitBackgroundClip: "text",
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>

      {/* AR badge */}
      <div
        style={{
          position: "absolute",
          top: "59%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${subtitleSlide})`,
          opacity: subtitleSlide,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: BRAND_BLUE,
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "rgba(45,139,250,0.12)",
            padding: "8px 28px",
            borderRadius: 30,
            letterSpacing: 6,
          }}
        >
          — AR —
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${(1 - taglineSlide) * 30}px)`,
          opacity: taglineSlide,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          L'art en réalité augmentée.
          <br />
          Partout autour de toi.
        </div>
      </div>
    </AbsoluteFill>
  );
};
