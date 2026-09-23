import { DashboardHeader } from "@/components/account";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}
