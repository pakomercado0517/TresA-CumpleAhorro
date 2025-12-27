"use client";

import React from "react";

interface TresABrandGreenProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TresABrandGreen({
  width = 24,
  height = 24,
  className = "",
}: TresABrandGreenProps): React.ReactNode {
  return (
    <img
      src="/tresa-brand-green.svg"
      alt="TresA Design"
      width={width}
      height={height}
      className={className}
    />
  );
}

