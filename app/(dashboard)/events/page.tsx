import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EventsPageContent } from "./components/EventsPageContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function EventsPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <EventsPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}










