import React, { Suspense } from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { VerifyEmailContent } from "./components/VerifyEmailContent";

function VerifyEmailContentFallback(): React.ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <div className="w-full max-w-md animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <Suspense fallback={<VerifyEmailContentFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
