"use client";

import { useState } from "react";
import { TransactionTable } from "./transaction-table";
import { RecurringTable } from "./recurring-table";
import { cn } from "@/lib/utils";

export function TransactionTabs({ regularTransactions, allTransactions }) {
  const [tab, setTab] = useState("transactions");

  const recurringCount = allTransactions.filter((t) => t.isRecurring).length;

  // Exclude backfilled occurrences from the one-time tab
  const oneTimeTransactions = regularTransactions.filter(
    (t) => !t.description?.endsWith("(Recurring)")
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab("transactions")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            tab === "transactions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Transactions
          <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
            {oneTimeTransactions.length}
          </span>
        </button>
        <button
          onClick={() => setTab("recurring")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            tab === "recurring"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Recurring
          <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
            {recurringCount}
          </span>
        </button>
      </div>

      {tab === "transactions" ? (
        <TransactionTable transactions={oneTimeTransactions} />
      ) : (
        <RecurringTable transactions={allTransactions} />
      )}
    </div>
  );
}
