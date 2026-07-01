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
import { MapScreen } from "../components/MapScreen";

export const SceneMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phoneSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1.0 },
  });

  const titleReveal = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const subtitleReveal = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.9 },
  });

  const highlightPulse = interpolate(
    frame,
    [50, 65, 80, 95],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const fadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0A0E1A 0%, #0D1B2A 50%, #0A1628 100%)`,
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "8%",
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
          Explore les œuvres
          <br />
          <span style={{ color: BRAND_BLUE }}>autour de toi</span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: `translate(-50%, 0) translateY(${(1 - subtitleReveal) * 20}px)`,
          opacity: subtitleReveal * 0.7,
          textAlign: "center",
          width: "80%",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Découvre la carte interactive et les créations AR près de toi
        </div>
      </div>

      {/* Phone */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: `translate(-50%, 0) translateY(${(1 - phoneSlide) * 200}px) scale(${0.8 + phoneSlide * 0.2})`,
          opacity: phoneSlide,
        }}
      >
        <PhoneMockup scale={1.15}>
          <MapScreen scale={1.15} />
        </PhoneMockup>
      </div>

      {/* Feature callouts */}
      {/* Recenter button highlight */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          right: "4%",
          opacity: highlightPulse,
          transform: `scale(${0.8 + highlightPulse * 0.2})`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(45,139,250,0.15)",
            border: `2px solid ${BRAND_BLUE}`,
            borderRadius: 16,
            padding: "10px 16px",
            maxWidth: 160,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: BRAND_BLUE,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Recentrer
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "system-ui, sans-serif",
              marginTop: 2,
            }}
          >
            la carte
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
