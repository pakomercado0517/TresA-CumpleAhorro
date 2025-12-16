"use client";

import React from "react";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./components/DashboardContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-[#f8faf8] overflow-x-hidden">
          <DynamicHeader title="Dashboard" icon={LayoutDashboard} />
          <main className="pt-4 md:pt-6 max-w-full overflow-x-hidden">
            <DashboardContent />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
