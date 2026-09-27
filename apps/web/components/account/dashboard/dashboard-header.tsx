"use client";

import { DashboardMainHeader } from "@/components/account/dashboard/dashboard-main-header";
import { DashboardUtilityBar } from "@/components/account/dashboard/dashboard-utility-bar";

function DashboardHeader() {
  return (
    <header className="bg-background">
      <div className="container-travel">
        <div className="hidden lg:block">
          <DashboardUtilityBar />
        </div>
        <DashboardMainHeader />
      </div>
    </header>
  );
}

export { DashboardHeader };
