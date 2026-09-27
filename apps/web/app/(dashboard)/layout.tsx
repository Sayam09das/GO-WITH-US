import { DashboardShell } from "@/components/account";
import { requireAuthUser } from "@/lib/api/auth.server";
import { mapPublicUserToDashboardUser } from "@/lib/api/dashboard-mappers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authUser = await requireAuthUser();
  const user = mapPublicUserToDashboardUser(authUser);

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
