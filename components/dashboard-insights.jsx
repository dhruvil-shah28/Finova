"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BrainCircuit } from "lucide-react";
import { getAIInsights } from "@/actions/dashboard";

export default function DashboardInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const data = await getAIInsights();
        setInsights(data);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Sparkles className="h-12 w-12 text-blue-500" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Spending Personality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
            {insights.personality}
          </p>
        </CardContent>
      </Card>

      <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <BrainCircuit className="h-12 w-12 text-purple-500" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-purple-500" />
            Smart Financial Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            "{insights.tip}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
