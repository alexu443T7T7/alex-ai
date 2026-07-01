import React from "react";
import { BRAND_BLUE } from "../constants";

export const CreateScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const s = (v: number) => v * scale;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#F2F2F7",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: `${s(14)}px ${s(14)}px 0 0`,
          padding: `${s(16)}px ${s(20)}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: s(45),
        }}
      >
        <div
          style={{
            padding: `${s(6)}px ${s(16)}px`,
            borderRadius: s(20),
            backgroundColor: "#F2F2F7",
            fontSize: s(14),
            color: "#333",
            fontWeight: 500,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Annuler
        </div>
        <div
          style={{
            fontSize: s(16),
            fontWeight: 700,
            color: "#000",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Nouvelle création
        </div>
        <div style={{ width: s(70) }} />
      </div>

      {/* Media section */}
      <div style={{ padding: `0 ${s(20)}px`, marginTop: s(5) }}>
        <div
          style={{
            fontSize: s(13),
            color: "#8E8E93",
            fontWeight: 600,
            marginBottom: s(8),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Média · obligatoire
        </div>
        <div
          style={{
            backgroundColor: "rgba(45,139,250,0.06)",
            borderRadius: s(16),
            padding: `${s(30)}px ${s(20)}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Image icon */}
          <svg width={s(50)} height={s(50)} viewBox="0 0 60 60" fill="none">
            <rect
              x="5"
              y="10"
              width="40"
              height="35"
              rx="6"
              stroke={BRAND_BLUE}
              strokeWidth="3"
              fill="none"
            />
            <circle cx="20" cy="24" r="4" fill={BRAND_BLUE} />
            <path d="M8 38L18 28L28 35L35 28L42 38" stroke={BRAND_BLUE} strokeWidth="2.5" />
            <circle
              cx="42"
              cy="15"
              r="10"
              fill={BRAND_BLUE}
              stroke="#fff"
              strokeWidth="2"
            />
            <path d="M42 10V20M37 15H47" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div
            style={{
              color: BRAND_BLUE,
              fontSize: s(15),
              fontWeight: 600,
              marginTop: s(10),
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Choisis une image ou une vidéo
          </div>
          <div
            style={{
              color: BRAND_BLUE,
              fontSize: s(11),
              opacity: 0.6,
              marginTop: s(4),
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Photo, affiche, dessin ou vidéo...
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: `${s(20)}px ${s(20)}px 0` }}>
        <div
          style={{
            fontSize: s(16),
            fontWeight: 700,
            color: "#000",
            marginBottom: s(10),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Description
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: s(14),
            padding: `${s(14)}px ${s(16)}px`,
          }}
        >
          <div
            style={{
              fontSize: s(14),
              color: "#C7C7CC",
              fontFamily: "system-ui, sans-serif",
              borderBottom: "1px solid #E5E5EA",
              paddingBottom: s(10),
              marginBottom: s(10),
            }}
          >
            Titre
          </div>
          <div
            style={{
              fontSize: s(13),
              color: "#C7C7CC",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Décris ta création...
          </div>
        </div>
      </div>

      {/* Surface */}
      <div style={{ padding: `${s(20)}px ${s(20)}px 0` }}>
        <div
          style={{
            fontSize: s(16),
            fontWeight: 700,
            color: "#000",
            marginBottom: s(10),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Surface
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: s(12),
            display: "flex",
            overflow: "hidden",
          }}
        >
          {["Mur", "Sol", "Espace"].map((label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: `${s(10)}px 0`,
                textAlign: "center",
                fontSize: s(14),
                fontWeight: 600,
                color: i === 0 ? "#000" : "#8E8E93",
                backgroundColor: i === 0 ? "#F2F2F7" : "transparent",
                borderRadius: i === 0 ? s(10) : 0,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: s(11),
            color: "#8E8E93",
            marginTop: s(8),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Tu règleras la taille directement en AR.
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: s(25),
          fontSize: s(15),
          color: "#C7C7CC",
          fontWeight: 600,
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: s(8),
        }}
      >
        Continuer en AR
      </div>
    </div>
  );
};
