import { AuthHeader } from "@/components/layout/AuthHeader";
import { ForgotPasswordContent } from "./components/ForgotPasswordContent";

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <ForgotPasswordContent />
    </div>
  );
}

