"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { BottomNavigation } from "./BottomNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps): React.ReactNode {
  return (
    <div className="flex h-screen md:min-h-screen bg-[#f8faf8] overflow-hidden md:overflow-visible overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-0 overflow-hidden md:overflow-visible overflow-x-hidden h-full flex flex-col min-w-0">{children}</main>
      {/* Bottom Navigation solo en mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
