"use client";

import React from "react";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsPageContent } from "./components/SettingsPageContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Settings } from "lucide-react";

export default function SettingsPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="bg-[#f8faf8] h-full flex flex-col md:min-h-screen overflow-hidden md:overflow-visible overflow-x-hidden">
          <DynamicHeader title="Configuración" icon={Settings} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pt-4 md:pt-6">
            <SettingsPageContent />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

