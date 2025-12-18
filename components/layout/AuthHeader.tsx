"use client";

import React from "react";

export function AuthHeader(): React.ReactNode {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-[#22c55e] rounded-md flex items-center justify-center">
          <div className="h-4 w-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-xl font-semibold text-gray-700">
          CumpleAhorro
        </span>
      </div>
    </header>
  );
}
