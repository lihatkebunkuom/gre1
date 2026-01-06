import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/Overview";
import LoginPage from "./pages/auth/Login";
import UnauthorizedPage from "./pages/auth/Unauthorized";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/auth/AuthGuard";
import { useAuthStore } from "./stores/auth-store";
import { EmptyState } from "@/components/common/EmptyState";
import { Church, Users, Wallet, Calendar } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Generic Placeholder Component
const ModulePlaceholder = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="p-4 animate-in fade-in duration-300">
    <EmptyState 
      title={`Modul ${title}`}
      description="Modul ini sedang dalam pengembangan."
      icon={Icon ? <Icon className="h-10 w-10 text-muted-foreground" /> : undefined}
    />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-storage">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<AuthGuard />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardOverview />} />
                
                {/* Manajemen Data */}
                <Route path="/jemaat" element={<ModulePlaceholder title="Data Jemaat" icon={Users} />} />
                <Route path="/jemaat/create" element={<ModulePlaceholder title="Tambah Jemaat" icon={Users} />} />
                <Route path="/jemaat/wilayah" element={<ModulePlaceholder title="Wilayah" icon={Users} />} />
                <Route path="/pelayan" element={<ModulePlaceholder title="Pelayan" icon={Users} />} />
                <Route path="/pelayan/penugasan" element={<ModulePlaceholder title="Penugasan Pelayan" icon={Users} />} />

                {/* Pelayanan & Ibadah */}
                <Route path="/event/kalender" element={<ModulePlaceholder title="Kalender Event" icon={Calendar} />} />
                <Route path="/ibadah" element={<ModulePlaceholder title="Jadwal Ibadah" icon={Church} />} />
                <Route path="/ibadah/kehadiran" element={<ModulePlaceholder title="Absensi" icon={Users} />} />
                <Route path="/pelayanan/anggota" element={<ModulePlaceholder title="Anggota Tim" icon={Users} />} />

                {/* Konten */}
                <Route path="/konten/artikel" element={<ModulePlaceholder title="Artikel" />} />
                <Route path="/konten/media" element={<ModulePlaceholder title="Media" />} />
                
                {/* Alkitab & Doa */}
                <Route path="/alkitab" element={<ModulePlaceholder title="Alkitab Digital" />} />
                <Route path="/doa" element={<ModulePlaceholder title="Pokok Doa" />} />

                {/* Keuangan - Restricted */}
                <Route element={<AuthGuard allowedRoles={['ADMIN', 'BENDAHARA']} />}>
                   <Route path="/keuangan/transaksi" element={<ModulePlaceholder title="Transaksi Keuangan" icon={Wallet} />} />
                   <Route path="/keuangan/persembahan" element={<ModulePlaceholder title="Data Persembahan" icon={Wallet} />} />
                   <Route path="/keuangan/laporan" element={<ModulePlaceholder title="Laporan Keuangan" icon={Wallet} />} />
                </Route>

                <Route path="/laporan" element={<ModulePlaceholder title="Laporan & Analitik" />} />
                <Route path="/pengaturan" element={<ModulePlaceholder title="Pengaturan Sistem" />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;