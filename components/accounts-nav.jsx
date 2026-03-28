"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Landmark } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function AccountsNav({ accounts }) {
  const [open, setOpen] = useState(false);

  if (!accounts?.length) return null;

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <Landmark size={18} />
        <span className="hidden md:inline">Accounts</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 min-w-[180px] rounded-md border bg-background shadow-md py-1">
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/account/${account.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <span className="font-medium">{account.name}</span>
                <span className="text-xs text-muted-foreground ml-4">
                  ₹{parseFloat(account.balance).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
