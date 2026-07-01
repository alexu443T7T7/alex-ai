import React from "react";
import { BRAND_BLUE } from "../constants";

export const ARScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const s = (v: number) => v * scale;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #87CEEB 0%, #65A8D4 30%, #5B9E4B 55%, #4A8E3B 100%)",
      }}
    >
      {/* Sky with clouds */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "20%",
          width: s(80),
          height: s(30),
          borderRadius: s(15),
          backgroundColor: "rgba(255,255,255,0.7)",
          filter: `blur(${s(5)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "15%",
          width: s(60),
          height: s(25),
          borderRadius: s(12),
          backgroundColor: "rgba(255,255,255,0.5)",
          filter: `blur(${s(4)}px)`,
        }}
      />

      {/* Trees silhouettes */}
      {[0.15, 0.35, 0.6, 0.8].map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: `${38 + (i % 2) * 5}%`,
            left: `${x * 100}%`,
            width: s(30 + i * 5),
            height: s(50 + i * 8),
            backgroundColor: `rgba(${50 + i * 15}, ${100 + i * 10}, ${40 + i * 10}, 0.7)`,
            borderRadius: `${s(15)}px ${s(15)}px 0 0`,
          }}
        />
      ))}

      {/* Ground/grass */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, #6BAF52 0%, #5A9E42 50%, #4D8E35 100%)",
        }}
      />

      {/* AR floating image - like a poster placed in AR */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "25%",
          width: s(140),
          height: s(100),
          backgroundColor: "rgba(45,139,250,0.15)",
          border: `${s(2)}px solid ${BRAND_BLUE}`,
          borderRadius: s(8),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "perspective(400px) rotateY(-8deg)",
          boxShadow: `0 ${s(4)}px ${s(20)}px rgba(45,139,250,0.3)`,
        }}
      >
        <svg width={s(40)} height={s(40)} viewBox="0 0 40 40" fill="none">
          <rect x="2" y="5" width="36" height="30" rx="4" stroke={BRAND_BLUE} strokeWidth="2" fill="rgba(45,139,250,0.1)" />
          <circle cx="14" cy="16" r="4" fill={BRAND_BLUE} opacity="0.5" />
          <path d="M5 30L14 22L22 27L30 20L36 28" stroke={BRAND_BLUE} strokeWidth="2" opacity="0.5" />
        </svg>
      </div>

      {/* Close button */}
      <div
        style={{
          position: "absolute",
          top: s(55),
          left: s(15),
          width: s(34),
          height: s(34),
          borderRadius: "50%",
          backgroundColor: "rgba(200,200,200,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_BLUE,
          fontSize: s(18),
          fontWeight: "bold",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        ×
      </div>

      {/* Bottom scan bar */}
      <div
        style={{
          position: "absolute",
          bottom: s(40),
          left: s(20),
          right: s(20),
          backgroundColor: "rgba(240,240,230,0.85)",
          borderRadius: s(16),
          padding: `${s(14)}px ${s(20)}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backdropFilter: `blur(${s(10)}px)`,
        }}
      >
        <svg width={s(28)} height={s(28)} viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="2" stroke="#666" strokeWidth="2" fill="none" />
          <rect x="18" y="2" width="8" height="8" rx="2" stroke="#666" strokeWidth="2" fill="none" />
          <rect x="2" y="18" width="8" height="8" rx="2" stroke="#666" strokeWidth="2" fill="none" />
          <circle cx="22" cy="22" r="4" stroke="#666" strokeWidth="2" fill="none" />
        </svg>
        <div
          style={{
            fontSize: s(14),
            fontWeight: 700,
            color: "#333",
            marginTop: s(6),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Scan de l'environnement
        </div>
        <div
          style={{
            fontSize: s(11),
            color: "#888",
            marginTop: s(3),
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          Balaye lentement autour de toi pour révéler les œuvres.
        </div>
      </div>
    </div>
  );
};
