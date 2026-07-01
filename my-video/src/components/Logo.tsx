import React from "react";
import { BRAND_BLUE } from "../constants";

export const Logo: React.FC<{ size?: number; color?: string }> = ({
  size = 300,
  color = BRAND_BLUE,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Box / Cube base */}
      <path
        d="M100 145 L45 115 L45 75 L65 63"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M100 145 L155 115 L155 75 L135 63"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M100 145 L100 105"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Top corners - scan brackets */}
      <path
        d="M70 58 L85 50"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M115 50 L130 58"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Dot in center of scan area */}
      <circle cx="100" cy="68" r="4" fill={color} />
      {/* Location pin */}
      <path
        d="M100 55 C100 55 100 28 100 25"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="18"
        r="14"
        stroke={color}
        strokeWidth="10"
        fill="none"
      />
      <circle cx="100" cy="18" r="5" fill={color} />
    </svg>
  );
};
