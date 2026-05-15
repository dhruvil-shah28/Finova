"use client";

import { useState, useMemo, useEffect } from "react";
import React from "react";
import { ChevronDown, ChevronRight, RefreshCw, Trash, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
  DAILY: "Daily", WEEKLY: "Weekly", MONTHLY: "Monthly", YEARLY: "Yearly",
};

export function RecurringTable({ transactions }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState({});

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transaction deleted successfully");
    }
  }, [deleted, deleteLoading]);

  // Group: parent recurring transactions + their generated children
  const { parents, childrenMap } = useMemo(() => {
    const parents = transactions.filter((t) => t.isRecurring);
    const childrenMap = {};

    parents.forEach((parent) => {
      // Children: non-recurring entries whose description matches "(Recurring)" suffix
      // and same category/type/accountId, ordered by date desc
      childrenMap[parent.id] = transactions
        .filter(
          (t) =>
            !t.isRecurring &&
            t.category === parent.category &&
            t.type === parent.type &&
            t.accountId === parent.accountId &&
            t.description === `${parent.description} (Recurring)`
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return { parents, childrenMap };
  }, [transactions]);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (parents.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No recurring transactions
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {deleteLoading && <BarLoader width="100%" color="#9333ea" />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Next Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents.map((parent) => {
              const children = childrenMap[parent.id] || [];
              const isOpen = expanded[parent.id];

              return (
                <React.Fragment key={parent.id}>
                  {/* Parent row */}
                  <TableRow
                    key={parent.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => children.length > 0 && toggleExpand(parent.id)}
                  >
                    <TableCell>
                      {children.length > 0 ? (
                        isOpen
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{parent.description}</div>
                      {children.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {children.length} past occurrence{children.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{ background: categoryColors[parent.category] }}
                        className="px-2 py-1 rounded text-white text-sm capitalize"
                      >
                        {parent.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700">
                        <RefreshCw className="h-3 w-3" />
                        {RECURRING_INTERVALS[parent.recurringInterval]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {parent.nextRecurringDate
                        ? format(new Date(parent.nextRecurringDate), "PP")
                        : "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        parent.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                      )}
                    >
                      {parent.type === "EXPENSE" ? "-" : "+"}₹{parent.amount.toFixed(2)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/transaction/create?edit=${parent.id}`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteFn([parent.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Children rows */}
                  {isOpen &&
                    children.map((child) => (
                      <TableRow key={child.id} className="bg-muted/30">
                        <TableCell />
                        <TableCell className="pl-8 text-sm text-muted-foreground">
                          {format(new Date(child.date), "PP")}
                        </TableCell>
                        <TableCell>
                          <span
                            style={{ background: categoryColors[child.category] }}
                            className="px-2 py-1 rounded text-white text-sm capitalize"
                          >
                            {child.category}
                          </span>
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell
                          className={cn(
                            "text-right font-medium text-sm",
                            child.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                          )}
                        >
                          {child.type === "EXPENSE" ? "-" : "+"}₹{child.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteFn([child.id])}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
