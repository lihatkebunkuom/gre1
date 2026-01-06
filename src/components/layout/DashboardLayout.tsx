import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-muted/20 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        <Header />
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;