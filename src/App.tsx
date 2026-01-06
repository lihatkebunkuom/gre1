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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper untuk mencegah user yang sudah login masuk ke halaman login
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-storage">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* PROTECTED ROUTES (Semua User Login) */}
            <Route element={<AuthGuard />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardOverview />} />
                
                <Route path="/jemaat" element={<div className="p-4">Halaman Data Jemaat</div>} />
                <Route path="/jadwal" element={<div className="p-4">Halaman Jadwal Ibadah</div>} />
                
                {/* ROLE SPECIFIC ROUTES (Contoh: Hanya Admin & Bendahara) */}
                <Route element={<AuthGuard allowedRoles={['ADMIN', 'BENDAHARA']} />}>
                   <Route path="/keuangan" element={<div className="p-4">Halaman Keuangan (Restricted)</div>} />
                </Route>

                <Route path="/laporan" element={<div className="p-4">Halaman Laporan</div>} />
                <Route path="/pengaturan" element={<div className="p-4">Halaman Pengaturan</div>} />
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