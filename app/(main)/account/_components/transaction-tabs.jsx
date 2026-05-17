"use client";

import { useState } from "react";
import { TransactionTable } from "./transaction-table";
import { RecurringTable } from "./recurring-table";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function TransactionTabs({ regularTransactions, allTransactions }) {
  const [tab, setTab] = useState("transactions");

  const recurringCount = allTransactions.filter((t) => t.isRecurring).length;

  // Exclude backfilled occurrences from the one-time tab
  const oneTimeTransactions = regularTransactions.filter(
    (t) => !t.description?.endsWith("(Recurring)")
  );

  const handleExport = (timeframe) => {
    const now = new Date();
    let startDate = new Date(0); // All time default

    if (timeframe === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === "3months") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    } else if (timeframe === "year") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    const transactionsToExport = (tab === "transactions" ? oneTimeTransactions : allTransactions).filter(
      (t) => new Date(t.date) >= startDate
    );

    if (transactionsToExport.length === 0) {
      alert("No transactions found for the selected timeframe.");
      return;
    }

    const csvRows = [
      ["Date", "Description", "Category", "Type", "Amount", "Status"],
      ...transactionsToExport.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description || "N/A",
        t.category,
        t.type,
        t.amount,
        t.status,
      ]),
    ];

    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${timeframe}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b justify-between items-center pr-2">
        <div className="flex gap-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("month")}>
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("3months")}>
              Past 3 Months
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("year")}>
              Last 1 Year
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport("all")}>
              All Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tab === "transactions" ? (
        <TransactionTable transactions={oneTimeTransactions} />
      ) : (
        <RecurringTable transactions={allTransactions} />
      )}
    </div>
  );
}
