import { AuthHeader } from "@/components/layout/AuthHeader";
import { ResetPasswordContent } from "./components/ResetPasswordContent";

export default function ResetPasswordPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <ResetPasswordContent />
    </div>
  );
}

