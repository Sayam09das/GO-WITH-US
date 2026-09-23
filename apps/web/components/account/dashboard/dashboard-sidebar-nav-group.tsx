import { DashboardSidebarNavLink } from "@/components/account/dashboard/dashboard-sidebar-nav-link";
import type { DashboardSidebarNavGroup } from "@/lib/account";

interface DashboardSidebarNavGroupSectionProps {
  group: DashboardSidebarNavGroup;
}

function DashboardSidebarNavGroupSection({ group }: DashboardSidebarNavGroupSectionProps) {
  return (
    <section data-dash-reveal className="will-change-transform">
      <h2 className="label-text mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {group.label}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <li key={item.href}>
            <DashboardSidebarNavLink label={item.label} href={item.href} match={item.match} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export { DashboardSidebarNavGroupSection };
