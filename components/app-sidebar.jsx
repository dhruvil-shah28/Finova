"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Landmark, PiggyBank, Repeat } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function AppSidebar({ accounts }) {
  const pathname = usePathname();
  const [accountsOpen, setAccountsOpen] = useState(true);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { name: "Budgets", href: "/budgets", icon: PiggyBank, color: "text-pink-500" },
    { name: "Recurring", href: "/recurring", icon: Repeat, color: "text-green-500" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-gradient-to-b from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background backdrop-blur-sm h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto hidden md:block">
      <div className="py-8 px-4 space-y-6 flex flex-col">
        <div className="space-y-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </p>
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <link.icon size={20} className={isActive ? link.color : "opacity-70"} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Accounts
          </p>
          <nav className="space-y-2">
            <button
              onClick={() => setAccountsOpen(!accountsOpen)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200",
                pathname.startsWith("/account")
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
              )}
            >
              <div className="flex items-center gap-3">
                <Landmark size={20} className={pathname.startsWith("/account") ? "text-orange-500" : "opacity-70"} />
                Accounts
              </div>
              <ChevronDown
                size={18}
                className={cn("transition-transform duration-200", accountsOpen && "rotate-180")}
              />
            </button>
            {accountsOpen && accounts?.length > 0 && (
              <div className="mt-2 ml-4 pl-4 border-l-2 border-primary/10 space-y-1">
                {accounts.map((account) => (
                  <Link
                    key={account.id}
                    href={`/account/${account.id}`}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      pathname === `/account/${account.id}`
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="truncate">{account.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}
