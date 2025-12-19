import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EventDetailPageContent } from "./components/EventDetailPageContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function EventDetailPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <EventDetailPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}










