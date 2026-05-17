import { getCategoryBudgets } from "@/actions/budget";
import { CategoryBudgetCard } from "./_components/category-budget-card";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CreateCategoryBudgetDrawer } from "./_components/create-category-budget-drawer";

export const dynamic = "force-dynamic";

export default async function BudgetsPage() {
  const categoryBudgets = await getCategoryBudgets();

  const totalBudget = categoryBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = categoryBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title">
            Budgets
          </h1>
          <p className="text-muted-foreground">
            Set limits and track your spending by category
          </p>
        </div>
        <div className="pb-2">
          <CreateCategoryBudgetDrawer>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2">
              <Plus size={16} />
              Create Budget
            </button>
          </CreateCategoryBudgetDrawer>
        </div>
      </div>

      {/* Overall Summary Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 mb-1 text-sm font-medium">Total Budget</p>
              <p className="text-4xl font-bold">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1 text-sm font-medium">Total Spent</p>
              <p className="text-4xl font-bold">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1 text-sm font-medium">Remaining</p>
              <p className="text-4xl font-bold">₹{Math.max(0, totalRemaining).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm text-blue-100">
              <span>Overall Progress</span>
              <span>{overallProgress.toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(overallProgress, 100)}%` }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryBudgets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No category budgets found. Click &apos;Create Budget&apos; to start tracking.
          </div>
        ) : (
          categoryBudgets.map((budget) => (
            <CategoryBudgetCard key={budget.id} budget={budget} />
          ))
        )}
      </div>
    </div>
  );
}
