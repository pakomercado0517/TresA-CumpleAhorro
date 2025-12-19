import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GroupsPageContent } from "./components/GroupsPageContent";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function GroupsPage(): React.ReactNode {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-[#f8faf8]">
          <GroupsPageContent />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}











