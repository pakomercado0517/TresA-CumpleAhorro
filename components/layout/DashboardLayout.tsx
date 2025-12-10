"use client";

import { Sidebar } from "./Sidebar";
import { BottomNavigation } from "./BottomNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="flex min-h-screen bg-[#f8faf8]">
      <Sidebar />
      <main className="flex-1 md:ml-0">
        {children}
      </main>
      {/* Bottom Navigation solo en mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}

