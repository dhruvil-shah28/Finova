import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { getUserAccounts } from "@/actions/dashboard";

const MainLayout = async ({ children }) => {
  const accounts = await getUserAccounts().catch(() => []);
  
  return (
    <div className="flex min-h-screen pt-[73px]">
      <AppSidebar accounts={accounts} />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
