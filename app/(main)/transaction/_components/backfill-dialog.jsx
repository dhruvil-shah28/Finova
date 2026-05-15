"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { backfillTransactions } from "@/actions/transaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function getOccurrences(startDate, interval) {
  const dates = [];
  const cursor = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  cursor.setHours(0, 0, 0, 0);
  advanceDate(cursor, interval);
  while (cursor < today) {
    dates.push(new Date(cursor));
    advanceDate(cursor, interval);
  }
  return dates;
}

function advanceDate(date, interval) {
  switch (interval) {
    case "DAILY":   date.setDate(date.getDate() + 1); break;
    case "WEEKLY":  date.setDate(date.getDate() + 7); break;
    case "MONTHLY": date.setMonth(date.getMonth() + 1); break;
    case "YEARLY":  date.setFullYear(date.getFullYear() + 1); break;
  }
}

export function BackfillDialog({ open, onOpenChange, transaction, onDone }) {
  const [excluded, setExcluded] = useState([]);
  const [loading, setLoading] = useState(false);

  const occurrences = useMemo(() => {
    if (!transaction) return [];
    return getOccurrences(transaction.date, transaction.recurringInterval);
  }, [transaction]);

  const toCreate = occurrences.length - excluded.length;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await backfillTransactions(transaction.id, excluded);
      toast.success(`Created ${result.count} past transaction${result.count !== 1 ? "s" : ""}`);
      onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    onDone();
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Backfill past transactions?</DialogTitle>
          <DialogDescription>
            This recurring transaction has a past start date.{" "}
            {occurrences.length > 0
              ? `We found ${occurrences.length} missed occurrence${occurrences.length !== 1 ? "s" : ""}.`
              : "No missed occurrences found."}
            {occurrences.length > 0 && " Click any dates you want to skip."}
          </DialogDescription>
        </DialogHeader>

        {occurrences.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <Calendar
              mode="multiple"
              selected={excluded}
              onSelect={setExcluded}
              disabled={(date) =>
                !occurrences.some((d) => d.toDateString() === date.toDateString())
              }
              modifiers={{ occurrence: occurrences }}
              modifiersClassNames={{ occurrence: "border border-primary/40 rounded-md" }}
              defaultMonth={occurrences[0]}
            />
            <p className="text-sm text-muted-foreground">
              {excluded.length > 0
                ? `Skipping ${excluded.length} date${excluded.length !== 1 ? "s" : ""} — will create ${toCreate} transaction${toCreate !== 1 ? "s" : ""}`
                : `Will create ${toCreate} transaction${toCreate !== 1 ? "s" : ""}`}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSkip} disabled={loading}>
            Skip backfill
          </Button>
          {occurrences.length > 0 && (
            <Button onClick={handleConfirm} disabled={loading || toCreate === 0}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : `Create ${toCreate} transaction${toCreate !== 1 ? "s" : ""}`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
