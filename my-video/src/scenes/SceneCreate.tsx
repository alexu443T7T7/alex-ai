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
import { CreateScreen } from "../components/CreateScreen";

export const SceneCreate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phoneSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.9 },
  });

  const titleReveal = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const step1 = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const step2 = spring({
    frame: frame - 55,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const step3 = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const fadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const steps = [
    { progress: step1, icon: "+", text: "Appuie sur +" },
    { progress: step2, icon: "📷", text: "Choisis ton média" },
    { progress: step3, icon: "⚙", text: "Règle la surface" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0A0E1A 0%, #0D1B2A 100%)`,
        opacity: fadeIn * fadeOut,
      }}
    >
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
          Crée ta
          <br />
          <span style={{ color: BRAND_BLUE }}>première œuvre</span>
        </div>
      </div>

      {/* Phone */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${phoneSlide})`,
          opacity: phoneSlide,
        }}
      >
        <PhoneMockup scale={1.0}>
          <CreateScreen scale={1.0} />
        </PhoneMockup>
      </div>

      {/* Steps */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "50%",
          transform: "translate(-50%, 0)",
          display: "flex",
          gap: 20,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              opacity: step.progress,
              transform: `translateY(${(1 - step.progress) * 30}px) scale(${0.8 + step.progress * 0.2})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: i === 0 ? BRAND_BLUE : "rgba(45,139,250,0.15)",
                border: `2px solid ${BRAND_BLUE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: i === 0 ? "#fff" : BRAND_BLUE,
                fontWeight: 700,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {step.icon}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "system-ui, sans-serif",
                textAlign: "center",
                maxWidth: 100,
              }}
            >
              {step.text}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
