import { AuthHeader } from "@/components/layout/AuthHeader";
import { LoginContent } from "./components/LoginContent";
import { LoginFooter } from "./components/LoginFooter";
import React, { Suspense } from "react";

function LoginContentFallback(): React.ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <div className="w-full max-w-md animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function LoginPage(): React.ReactNode {
  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      <AuthHeader />
      <Suspense fallback={<LoginContentFallback />}>
        <LoginContent />
      </Suspense>
      <LoginFooter />
    </div>
  );
}
