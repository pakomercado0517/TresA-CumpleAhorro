"use client";

import React from "react";

interface TresALogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TresALogo({
  width = 24,
  height = 24,
  className = "",
}: TresALogoProps): React.ReactNode {
  return (
    <img
      src="/tresa-brand.svg"
      alt="TresA Design"
      width={width}
      height={height}
      className={className}
    />
  );
}

