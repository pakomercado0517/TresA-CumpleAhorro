import { AuthHeader } from "@/components/layout/AuthHeader";
import { VerifyEmailContent } from "./components/VerifyEmailContent";

export default function VerifyEmailPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <VerifyEmailContent />
    </div>
  );
}

