import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SIDEBAR_ITEMS } from "@/config/navigation";
import { Church, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  // Mengambil state dari Store Global
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();
  
  // Simulasi user role (dari Auth Store)
  const user = useAuthStore((state) => state.user);
  // Fallback sementara jika user null (saat development)
  const userRole = user?.role || 'ADMIN'; 

  const filteredItems = SIDEBAR_ITEMS.filter(
    (item) => item.roles.length === 0 || item.roles.includes(userRole as any)
  );

  return (
    <aside 
      className={cn(
        "flex flex-col fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 ease-in-out z-20",
        sidebarCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header Sidebar */}
      <div className={cn(
        "h-16 flex items-center border-b border-border px-4",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary p-2 rounded-lg shrink-0">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className={cn(
            "transition-all duration-300 whitespace-nowrap",
            sidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="font-bold text-sm tracking-tight">Gereja Digital</h1>
          </div>
        </div>
        
        {!sidebarCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center justify-center w-full h-10 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Trigger (Mobile/Tablet helper) */}
      {sidebarCollapsed && (
        <div className="p-2 border-t">
           <Button 
            variant="ghost" 
            size="icon" 
            className="w-full" 
            onClick={() => setSidebarCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Footer Sidebar (Logout) */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      )}
    </aside>
  );
};