import { AuthHeader } from "@/components/layout/AuthHeader";
import { ForgotPasswordContent } from "./components/ForgotPasswordContent";
import React from "react";

export default function ForgotPasswordPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <ForgotPasswordContent />
    </div>
  );
}
