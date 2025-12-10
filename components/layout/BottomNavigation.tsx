"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wallet, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/groups",
    label: "Grupos",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/payments",
    label: "Pagos",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    href: "/members",
    label: "Miembros",
    icon: <User className="h-5 w-5" />,
  },
  {
    href: "/settings",
    label: "Ajustes",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function BottomNavigation(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-[#22c55e]"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  isActive && "text-[#22c55e]"
                )}
              >
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

