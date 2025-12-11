import React from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./components/DashboardContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-[#f8faf8]">
          <DashboardHeader />
          <main className="pt-4 md:pt-6">
            <DashboardContent />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
