import React from "react";
import { BRAND_BLUE } from "../constants";

export const MapScreen: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const s = (v: number) => v * scale;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#EAE6DE",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fake map grid - streets */}
      {[0.15, 0.3, 0.5, 0.65, 0.8].map((y, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            top: `${y * 100}%`,
            left: 0,
            right: 0,
            height: s(3),
            backgroundColor: "#fff",
            transform: `rotate(${(i % 3) * 5 - 5}deg)`,
          }}
        />
      ))}
      {[0.1, 0.25, 0.45, 0.6, 0.75, 0.9].map((x, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: 0,
            bottom: 0,
            width: s(3),
            backgroundColor: "#fff",
            transform: `rotate(${(i % 3) * 3 - 3}deg)`,
          }}
        />
      ))}

      {/* Green park areas */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "15%",
          width: s(45),
          height: s(35),
          backgroundColor: "#C8E6C0",
          borderRadius: s(8),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "55%",
          width: s(30),
          height: s(25),
          backgroundColor: "#C8E6C0",
          borderRadius: s(6),
        }}
      />

      {/* Recenter button - top right */}
      <div
        style={{
          position: "absolute",
          top: s(55),
          right: s(15),
          width: s(44),
          height: s(44),
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${s(2)}px ${s(8)}px rgba(0,0,0,0.15)`,
        }}
      >
        <svg width={s(22)} height={s(22)} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11L12 3L21 11"
            stroke={BRAND_BLUE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M12 3L12 21"
            stroke={BRAND_BLUE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* AR Camera button */}
      <div
        style={{
          position: "absolute",
          top: s(110),
          right: s(15),
          width: s(44),
          height: s(44),
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 ${s(2)}px ${s(8)}px rgba(0,0,0,0.15)`,
        }}
      >
        <svg width={s(22)} height={s(22)} viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            stroke="#333"
            strokeWidth="2"
            fill="none"
            rx="1"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            stroke="#333"
            strokeWidth="2"
            fill="none"
            rx="1"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            stroke="#333"
            strokeWidth="2"
            fill="none"
            rx="1"
          />
          <circle cx="17.5" cy="17.5" r="3" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* User location pin */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: s(36),
            height: s(36),
            borderRadius: "50%",
            backgroundColor: "rgba(255,80,80,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: s(14),
            fontWeight: "bold",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          A
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: s(11),
            fontWeight: 600,
            color: "#333",
            marginTop: s(2),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Alex
        </div>
      </div>

      {/* AR creation pins */}
      {[
        { top: "30%", left: "35%", color: "#FF9800" },
        { top: "65%", left: "70%", color: BRAND_BLUE },
        { top: "20%", left: "75%", color: "#4CAF50" },
      ].map((pin, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: pin.top,
            left: pin.left,
            width: s(24),
            height: s(24),
            borderRadius: "50%",
            backgroundColor: pin.color,
            border: `${s(2)}px solid #fff`,
            boxShadow: `0 ${s(2)}px ${s(6)}px rgba(0,0,0,0.2)`,
          }}
        />
      ))}

      {/* Bottom bar with "2 œuvres autour de toi" */}
      <div
        style={{
          position: "absolute",
          bottom: s(65),
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: s(20),
          padding: `${s(8)}px ${s(20)}px`,
          fontSize: s(12),
          color: "#555",
          fontFamily: "system-ui, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        2 œuvres autour de toi
      </div>

      {/* Bottom tab bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: s(55),
          backgroundColor: "rgba(255,255,255,0.97)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${s(12)}px`,
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: s(4),
            flex: 1,
          }}
        >
          {[
            { label: "Tout", active: true },
            { label: "Art", active: false },
            { label: "Affiche", active: false },
            { label: "Photo", active: false },
          ].map((tab) => (
            <div
              key={tab.label}
              style={{
                padding: `${s(6)}px ${s(12)}px`,
                borderRadius: s(16),
                backgroundColor: tab.active ? BRAND_BLUE : "transparent",
                color: tab.active ? "#fff" : "#666",
                fontSize: s(11),
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        {/* Plus button */}
        <div
          style={{
            width: s(44),
            height: s(44),
            borderRadius: "50%",
            backgroundColor: BRAND_BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: s(24),
            fontWeight: 300,
            boxShadow: `0 ${s(3)}px ${s(10)}px rgba(45,139,250,0.4)`,
          }}
        >
          +
        </div>
      </div>
    </div>
  );
};
