import React from "react";

export const PhoneMockup: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({ children, scale = 0.65 }) => {
  return (
    <div
      style={{
        width: 390 * scale,
        height: 844 * scale,
        borderRadius: 50 * scale,
        overflow: "hidden",
        border: `${3 * scale}px solid #333`,
        backgroundColor: "#fff",
        position: "relative",
        boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.3), 0 ${5 * scale}px ${15 * scale}px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160 * scale,
          height: 34 * scale,
          backgroundColor: "#000",
          borderRadius: `0 0 ${20 * scale}px ${20 * scale}px`,
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
