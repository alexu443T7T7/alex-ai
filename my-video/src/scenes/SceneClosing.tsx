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

export const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoReveal = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  const titleReveal = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.8 },
  });

  const ctaReveal = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const badgesReveal = spring({
    frame: frame - 65,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.7 },
  });

  const glowPulse = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.7, 0.3]
  );

  const floatY = interpolate(
    frame % 120,
    [0, 60, 120],
    [-5, 5, -5]
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, #0D1B2A 0%, #000510 100%)`,
        opacity: fadeIn,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(45,139,250,${glowPulse * 0.15}) 0%, transparent 70%)`,
        }}
      />

      {/* Floating circles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (frame * 0.5 + i * 72) * (Math.PI / 180);
        const radius = 250 + i * 30;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `calc(35% + ${cy}px)`,
              left: `calc(50% + ${cx}px)`,
              width: 8 + i * 3,
              height: 8 + i * 3,
              borderRadius: "50%",
              backgroundColor: BRAND_BLUE,
              opacity: 0.1 + i * 0.03,
            }}
          />
        );
      })}

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoReveal}) translateY(${floatY}px)`,
          opacity: logoReveal,
          filter: `drop-shadow(0 0 40px rgba(45,139,250,${glowPulse}))`,
        }}
      >
        <Logo size={220} color="#fff" />
      </div>

      {/* App name */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${(1 - titleReveal) * 30}px)`,
          opacity: titleReveal,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -1,
          }}
        >
          Street Go
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: BRAND_BLUE,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 8,
            marginTop: 4,
          }}
        >
          — AR —
        </div>
      </div>

      {/* Features recap */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, 0)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: badgesReveal,
        }}
      >
        {[
          "Crée des œuvres en réalité augmentée",
          "Place-les n'importe où dans le monde",
          "Partage avec la communauté",
          "Découvre les créations autour de toi",
        ].map((text, i) => {
          const itemReveal = spring({
            frame: frame - 65 - i * 8,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.5 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: itemReveal,
                transform: `translateX(${(1 - itemReveal) * 30}px)`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: BRAND_BLUE,
                  boxShadow: `0 0 10px ${BRAND_BLUE}`,
                }}
              />
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Download CTA */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${ctaReveal})`,
          opacity: ctaReveal,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "system-ui, sans-serif",
            marginBottom: 16,
          }}
        >
          Disponible gratuitement sur
        </div>
        {/* App Store button */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: "16px 36px",
            boxShadow: `0 4px 30px rgba(45,139,250,0.3)`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M22.5 26.8C21.2 28.1 19.8 27.9 18.5 27.3C17.1 26.7 15.8 26.7 14.3 27.3C12.5 28.1 11.5 27.8 10.4 26.8C4.3 20.5 5.2 11.1 12 10.8C13.7 10.9 14.9 11.7 15.9 11.8C17.4 11.5 18.8 10.6 20.4 10.7C22.4 10.9 23.9 11.7 24.8 13.1C20.8 15.4 21.7 20.7 25.4 22.1C24.6 24 23.6 25.9 22.5 26.8ZM15.8 10.7C15.6 8 17.8 5.8 20.3 5.6C20.6 8.7 17.5 11 15.8 10.7Z"
              fill="#000"
            />
          </svg>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 11,
                color: "#666",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              Télécharger sur l'
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#000",
                fontFamily: "system-ui, sans-serif",
                marginTop: -2,
              }}
            >
              App Store
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
