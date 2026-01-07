import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageBreadcrumb } from "../common/PageBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile"; 
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { FullPageLoader } from "../common/LoadingSpinner";

const DashboardLayout = () => {
  // Menggunakan Global Store
  const { sidebarCollapsed, setSidebarCollapsed, isLoading } = useUIStore();
  const isMobile = useIsMobile();

  // Auto collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, setSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row transition-colors duration-300">
      {/* Global Loader Overlay */}
      {isLoading && <FullPageLoader />}

      {/* Sidebar Area - Controlled by Store */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Header />
        
        <main className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
            <PageBreadcrumb />
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;