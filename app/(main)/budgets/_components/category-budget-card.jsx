import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultCategories } from "@/data/categories";
import { Edit, Trash } from "lucide-react";
import { CreateCategoryBudgetDrawer } from "./create-category-budget-drawer";

export function CategoryBudgetCard({ budget }) {
  const categoryInfo = defaultCategories.find((c) => c.id === budget.category);
  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - budget.spent;
  
  // Choose color based on percentage
  let progressColor = "bg-green-500";
  let alertText = "";
  
  if (percentage >= 100) {
    progressColor = "bg-red-500";
    alertText = `Over limit - ₹${Math.abs(remaining)} extra spent`;
  } else if (percentage >= 80) {
    progressColor = "bg-yellow-500";
    alertText = `Approaching limit - ₹${remaining} left`;
  } else {
    progressColor = "bg-green-500";
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: categoryInfo?.color || "#cbd5e1" }}
          >
            {/* Using first letter as a simple icon fallback */}
            <span className="font-bold">{categoryInfo?.name?.charAt(0) || "?"}</span>
          </div>
          <div>
            <CardTitle className="text-base">{categoryInfo?.name || budget.category}</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly</p>
          </div>
        </div>
        <div className="flex gap-2 text-muted-foreground">
          <CreateCategoryBudgetDrawer>
            <button className="hover:text-foreground">
              <Edit size={14} />
            </button>
          </CreateCategoryBudgetDrawer>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">₹{budget.spent.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">of ₹{budget.amount.toLocaleString()}</p>
          </div>
          <p className="font-medium" style={{ color: percentage >= 80 ? (percentage >= 100 ? "#ef4444" : "#eab308") : "#22c55e" }}>
            {percentage.toFixed(0)}%
          </p>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${progressColor} transition-all duration-500`} 
            style={{ width: `${Math.min(percentage, 100)}%` }} 
          />
        </div>

        {alertText ? (
          <div className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 text-xs py-2 px-3 rounded-md flex items-center gap-2">
            <span>⚡</span> {alertText}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground pt-1">
            Remaining: <span className="font-medium text-foreground">₹{remaining.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
