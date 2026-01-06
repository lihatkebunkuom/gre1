import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SIDEBAR_GROUPS, NavItem } from "@/config/navigation";
import { Church, LogOut, ChevronLeft, ChevronRight, ChevronDown, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { UserRole } from "@/types";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();
  
  const userRole = user?.role || 'JEMAAT';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Helper untuk mengecek permission
  const hasAccess = (roles: UserRole[]) => {
    return roles.length === 0 || roles.includes(userRole as UserRole);
  };

  return (
    <aside 
      className={cn(
        "flex flex-col fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 ease-in-out z-20 shadow-sm",
        sidebarCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header Sidebar */}
      <div className={cn(
        "h-16 flex items-center border-b border-border px-4",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary p-2 rounded-lg shrink-0">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className={cn(
            "transition-all duration-300 whitespace-nowrap",
            sidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="font-bold text-sm tracking-tight text-foreground">Gereja Digital</h1>
          </div>
        </Link>
        
        {!sidebarCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground" 
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-2">
          {SIDEBAR_GROUPS.map((group, groupIndex) => {
            // Filter items based on role
            const visibleItems = group.items.filter(item => hasAccess(item.roles));
            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIndex} className="space-y-1">
                {/* Group Label */}
                {!sidebarCollapsed && group.groupLabel && (
                  <h4 className="px-2 text-xs font-semibold text-muted-foreground tracking-wider mb-2 uppercase">
                    {group.groupLabel}
                  </h4>
                )}
                
                {/* Separator untuk collapsed mode jika beda grup */}
                {sidebarCollapsed && group.groupLabel && groupIndex > 0 && (
                  <div className="mx-auto w-8 border-t border-border my-2" />
                )}

                {/* Items Loop */}
                {visibleItems.map((item, itemIndex) => (
                  <SidebarItem 
                    key={itemIndex} 
                    item={item} 
                    collapsed={sidebarCollapsed} 
                    pathname={location.pathname}
                    expandSidebar={() => setSidebarCollapsed(false)}
                    hasAccess={hasAccess}
                  />
                ))}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer / Toggle Button when Collapsed */}
      {sidebarCollapsed && (
        <div className="p-2 border-t bg-card">
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

      {/* User / Logout Section */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            }
            title="Konfirmasi Keluar"
            description="Apakah Anda yakin ingin keluar dari sistem?"
            confirmLabel="Ya, Keluar"
            variant="destructive"
            onConfirm={handleLogout}
          />
        </div>
      )}
    </aside>
  );
};

// --- Sub-Component untuk Item Sidebar ---

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  expandSidebar: () => void;
  hasAccess: (roles: UserRole[]) => boolean;
}

const SidebarItem = ({ item, collapsed, pathname, expandSidebar, hasAccess }: SidebarItemProps) => {
  // Cek apakah item ini aktif (atau anaknya aktif)
  const isSelfActive = item.href ? pathname === item.href : false;
  const isChildActive = item.items?.some(sub => pathname === sub.href) || false;
  const isActive = isSelfActive || isChildActive;
  
  const [isOpen, setIsOpen] = useState(isChildActive);

  // Auto open jika child aktif saat render pertama/navigasi
  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [pathname, isChildActive]);

  // Case 1: Item Tunggal (Link Langsung)
  if (!item.items || item.items.length === 0) {
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.href || "#"}
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
        to={item.href || "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </Link>
    );
  }

  // Case 2: Item dengan Submenu (Parent)
  
  // Jika collapsed, klik parent akan membuka sidebar
  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full h-10 p-0 flex items-center justify-center",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
            onClick={expandSidebar}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.title}</p>
          <p className="text-[10px] text-muted-foreground">Klik untuk melihat submenu</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between hover:bg-muted px-3 h-auto py-2",
            isActive ? "text-primary font-medium" : "text-muted-foreground font-normal"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span className="text-sm">{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
          />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pl-4 space-y-1 animate-accordion-down">
        {item.items.map((sub, index) => {
          if (!hasAccess(sub.roles)) return null;
          
          const isSubActive = pathname === sub.href;
          return (
            <Link
              key={index}
              to={sub.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors border-l border-transparent ml-2",
                isSubActive
                  ? "border-primary text-primary font-medium bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors", 
                isSubActive ? "bg-primary" : "bg-muted-foreground/30"
              )} />
              <span>{sub.title}</span>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};