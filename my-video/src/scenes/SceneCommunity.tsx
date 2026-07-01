import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { BRAND_BLUE } from "../constants";

export const SceneCommunity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleReveal = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const fadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pins = [
    { x: 25, y: 30, delay: 20, color: "#FF6B6B", label: "Street Art" },
    { x: 65, y: 25, delay: 28, color: BRAND_BLUE, label: "Photo" },
    { x: 40, y: 50, delay: 36, color: "#4CAF50", label: "Affiche" },
    { x: 75, y: 55, delay: 44, color: "#FF9800", label: "Vidéo" },
    { x: 20, y: 65, delay: 52, color: "#9C27B0", label: "Art" },
    { x: 55, y: 70, delay: 60, color: BRAND_BLUE, label: "Poster" },
    { x: 85, y: 40, delay: 68, color: "#E91E63", label: "Dessin" },
    { x: 35, y: 80, delay: 76, color: "#00BCD4", label: "Photo" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0A0E1A 0%, #0D1B2A 100%)`,
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "6%",
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
          Une communauté
          <br />
          <span style={{ color: BRAND_BLUE }}>créative</span>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "system-ui, sans-serif",
            marginTop: 12,
          }}
        >
          Partage et découvre des œuvres dans ta ville
        </div>
      </div>

      {/* Map background */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "5%",
          right: "5%",
          bottom: "10%",
          borderRadius: 30,
          overflow: "hidden",
          border: "1px solid rgba(45,139,250,0.2)",
        }}
      >
        {/* Map grid */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#1A2332",
            position: "relative",
          }}
        >
          {/* Grid lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  top: `${(i + 1) * 7}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: "rgba(45,139,250,0.06)",
                  transform: `rotate(${(i % 5) * 3 - 6}deg)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${(i + 1) * 7}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: "rgba(45,139,250,0.06)",
                  transform: `rotate(${(i % 4) * 2 - 3}deg)`,
                }}
              />
            </React.Fragment>
          ))}

          {/* Animated pins */}
          {pins.map((pin, i) => {
            const pinReveal = spring({
              frame: frame - pin.delay,
              fps,
              config: { damping: 10, stiffness: 200, mass: 0.4 },
            });

            const ripple = interpolate(
              (frame - pin.delay) % 60,
              [0, 60],
              [0, 1],
              { extrapolateLeft: "clamp" }
            );

            return (
              <React.Fragment key={i}>
                {/* Ripple */}
                {frame > pin.delay && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: 60 * ripple,
                      height: 60 * ripple,
                      borderRadius: "50%",
                      border: `1px solid ${pin.color}`,
                      opacity: (1 - ripple) * 0.4 * pinReveal,
                    }}
                  />
                )}
                {/* Pin */}
                <div
                  style={{
                    position: "absolute",
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: `translate(-50%, -50%) scale(${pinReveal})`,
                    opacity: pinReveal,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: pin.color,
                      border: "3px solid rgba(255,255,255,0.3)",
                      boxShadow: `0 0 20px ${pin.color}66`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "system-ui, sans-serif",
                      marginTop: 4,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {pin.label}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
