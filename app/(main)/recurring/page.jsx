import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { RecurringTable } from "../account/_components/recurring-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecurringPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  const recurringTransactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      isRecurring: true,
    },
    orderBy: {
      nextRecurringDate: "asc",
    },
  });

  // Calculate stats
  const incomeTransactions = recurringTransactions.filter((t) => t.type === "INCOME");
  const expenseTransactions = recurringTransactions.filter((t) => t.type === "EXPENSE");

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);
  const netMonthly = totalIncome - totalExpenses;

  // We need to serialize Decimal values for client components
  const serializeTransactions = (transactions) => 
    transactions.map((t) => ({
      ...t,
      amount: t.amount.toNumber(),
    }));

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title">
            Recurring
          </h1>
          <p className="text-muted-foreground">
            Manage your subscriptions and recurring payments
          </p>
        </div>
        <div className="pb-2">
          <Link href="/transaction/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
              <Plus size={16} />
              Add Recurring
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-green-100 dark:border-green-900/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Income</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                <span>$</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{incomeTransactions.length} sources</p>
          </CardContent>
        </Card>

        <Card className="border border-red-100 dark:border-red-900/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Expenses</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-500">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                <span>💳</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{expenseTransactions.length} active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Net Monthly</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{netMonthly.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <span>⏱️</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {netMonthly > 0 ? "Healthy balance" : "Deficit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recurring Income</h2>
        {incomeTransactions.length > 0 ? (
          <RecurringTable transactions={serializeTransactions(incomeTransactions)} />
        ) : (
          <div className="text-center py-8 border rounded-lg text-muted-foreground border-dashed">
            No recurring income found
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="pb-10">
        <h2 className="text-xl font-semibold mb-4">Recurring Payments</h2>
        {expenseTransactions.length > 0 ? (
          <RecurringTable transactions={serializeTransactions(expenseTransactions)} />
        ) : (
          <div className="text-center py-8 border rounded-lg text-muted-foreground border-dashed">
            No recurring payments found
          </div>
        )}
      </div>
    </div>
  );
}
