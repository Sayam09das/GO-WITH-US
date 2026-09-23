"use client";

import { DashboardMainHeader } from "@/components/account/dashboard/dashboard-main-header";

function DashboardHeader() {
  return (
    <header className="bg-background">
      <div className="container-travel">
        <DashboardMainHeader />
      </div>
    </header>
  );
}

export { DashboardHeader };
