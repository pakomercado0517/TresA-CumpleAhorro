import { AuthHeader } from "@/components/layout/AuthHeader";
import { RegisterContent } from "./components/RegisterContent";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <AuthHeader />
      <RegisterContent />
    </div>
  );
}

