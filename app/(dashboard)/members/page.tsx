import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MembersPageContent } from "./components/MembersPageContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MembersPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <MembersPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

