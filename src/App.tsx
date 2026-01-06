import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/Overview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optimasi: jangan refetch saat ganti tab browser
      retry: 1, // Coba lagi 1x jika gagal sebelum error
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-storage">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardOverview />} />
              {/* Placeholder routes for navigation items */}
              <Route path="/jemaat" element={<div className="p-4">Halaman Data Jemaat (Segera Hadir)</div>} />
              <Route path="/jadwal" element={<div className="p-4">Halaman Jadwal Ibadah (Segera Hadir)</div>} />
              <Route path="/keuangan" element={<div className="p-4">Halaman Keuangan (Segera Hadir)</div>} />
              <Route path="/laporan" element={<div className="p-4">Halaman Laporan (Segera Hadir)</div>} />
              <Route path="/pengaturan" element={<div className="p-4">Halaman Pengaturan (Segera Hadir)</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;