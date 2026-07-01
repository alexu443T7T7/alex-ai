import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { BRAND_BLUE } from "../constants";
import { PhoneMockup } from "../components/PhoneMockup";
import { ARScreen } from "../components/ARScreen";

export const SceneAR: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phoneScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 60, mass: 1.0 },
  });

  const titleReveal = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const badgeReveal = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const scanPulse = interpolate(frame % 40, [0, 20, 40], [0.8, 1.2, 0.8]);

  const fadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #050A15 0%, #0A1628 50%, #0D1B2A 100%)`,
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Scan lines effect */}
      {Array.from({ length: 8 }).map((_, i) => {
        const lineProgress = interpolate(
          (frame + i * 12) % 100,
          [0, 100],
          [0, 1]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${lineProgress * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: BRAND_BLUE,
              opacity: 0.05,
            }}
          />
        );
      })}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: `translate(-50%, 0) translateY(${(1 - titleReveal) * 40}px)`,
          opacity: titleReveal,
          textAlign: "center",
          width: "90%",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.2,
          }}
        >
          Place ton art
          <br />
          <span style={{ color: BRAND_BLUE }}>en réalité augmentée</span>
        </div>
      </div>

      {/* Phone with AR view */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${phoneScale})`,
          opacity: phoneScale,
        }}
      >
        {/* Scan ring around phone */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${scanPulse})`,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `2px solid rgba(45,139,250,${0.15 * scanPulse})`,
            pointerEvents: "none",
          }}
        />
        <PhoneMockup scale={1.15}>
          <ARScreen scale={1.15} />
        </PhoneMockup>
      </div>

      {/* Feature badges */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translate(-50%, 0)",
          display: "flex",
          gap: 16,
          opacity: badgeReveal,
        }}
      >
        {[
          { label: "Mur", desc: "Affiche sur les murs" },
          { label: "Sol", desc: "Place au sol" },
          { label: "Espace", desc: "Flottant dans l'air" },
        ].map((item, i) => {
          const itemReveal = spring({
            frame: frame - 50 - i * 8,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.5 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: itemReveal,
                transform: `translateY(${(1 - itemReveal) * 20}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  backgroundColor: "rgba(45,139,250,0.12)",
                  border: `1.5px solid rgba(45,139,250,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: BRAND_BLUE,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "system-ui, sans-serif",
                  textAlign: "center",
                  maxWidth: 100,
                }}
              >
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
