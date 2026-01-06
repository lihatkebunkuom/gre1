import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Settings,
  FileText,
  LogOut,
  Church
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Data Jemaat", href: "/jemaat" },
  { icon: Calendar, label: "Jadwal Ibadah", href: "/jadwal" },
  { icon: Wallet, label: "Keuangan", href: "/keuangan" },
  { icon: FileText, label: "Laporan", href: "/laporan" },
  { icon: Settings, label: "Pengaturan", href: "/pengaturan" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border flex items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <Church className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Gereja Digital</h1>
          <p className="text-xs text-muted-foreground">Admin CMS</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
};