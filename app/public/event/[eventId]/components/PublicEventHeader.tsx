"use client";

import React from "react";

export function PublicEventHeader(): React.ReactNode {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#22c55e] rounded-full flex items-center justify-center">
            <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-[#22c55e] rounded-full"></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Tanda Cumpleañera
          </span>
        </div>
      </div>
    </header>
  );
}
