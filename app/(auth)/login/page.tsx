import { LoginHeader } from "@/components/layout/LoginHeader";
import { LoginContent } from "./components/LoginContent";
import { LoginFooter } from "./components/LoginFooter";

export default function LoginPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      <LoginHeader />
      <LoginContent />
      <LoginFooter />
    </div>
  );
}

