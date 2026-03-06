import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  FileText,
  Printer,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch Data from API
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: analyticsService.getSummary,
  });

  const { data: financeTrend, isLoading: isLoadingFinance } = useQuery({
    queryKey: ["analytics-finance"],
    queryFn: analyticsService.getFinanceTrend,
  });

  const { data: demographics, isLoading: isLoadingDemo } = useQuery({
    queryKey: ["analytics-demo"],
    queryFn: analyticsService.getDemographics,
  });

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    const toastId = toast.loading("Menyiapkan dokumen PDF...");

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Laporan-Gereja-Digital-${new Date().toLocaleDateString()}.pdf`);
      
      toast.success("Laporan berhasil diunduh", { id: toastId });
      setIsPreviewOpen(false);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Gagal mengekspor laporan", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = isLoadingSummary || isLoadingFinance || isLoadingDemo;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Memuat laporan...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h1>
          <p className="text-muted-foreground">
            Ringkasan data operasional dan pertumbuhan jemaat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button size="sm" onClick={() => setIsPreviewOpen(true)}>
            <FileText className="mr-2 h-4 w-4" /> Preview PDF
          </Button>
        </div>
      </div>

      {/* Konten Dashboard Utama (Yang akan diekspor) */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jemaat</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalJemaat?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Aktif
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kas Bersih</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {(summary?.kasBersih || 0).toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Saldo Riil
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.rerataKehadiran || 0}%</div>
              <p className="text-xs text-muted-foreground">Rerata sesi aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kegiatan</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalKegiatan || 0}</div>
              <p className="text-xs text-muted-foreground">Bulan berjalan</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tren Arus Kas Bulanan</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financeTrend}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(v) => `${v/1000000}jt`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="pemasukan" stroke="#0ea5e9" fill="url(#colorIn)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pengeluaran" stroke="#f43f5e" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Komposisi Jemaat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demographics} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                      {demographics?.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Preview PDF */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Pratinjau Laporan</span>
              <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {/* Area yang akan di-capture (A4 Style) */}
          <div className="bg-muted p-8 flex justify-center">
            <div 
              ref={reportRef} 
              className="bg-white text-black p-10 shadow-2xl w-[794px] min-h-[1123px] flex flex-col"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {/* Header Laporan */}
              <div className="flex items-center justify-between border-b-2 border-primary pb-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Gereja Digital</h2>
                  <p className="text-sm text-gray-500">Sistem Manajemen Gereja Terpadu</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Tanggal Laporan: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                  <p>ID Laporan: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>

              <h1 className="text-xl font-bold mb-6 text-center uppercase tracking-widest">Laporan Analitik & Pertumbuhan</h1>

              {/* Grid Data di PDF */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Total Jemaat Aktif</p>
                  <p className="text-2xl font-bold">{summary?.totalJemaat} Jiwa</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Total Saldo Kas</p>
                  <p className="text-2xl font-bold text-emerald-600">Rp {summary?.kasBersih?.toLocaleString('id-ID')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Rerata Kehadiran</p>
                  <p className="text-2xl font-bold">{summary?.rerataKehadiran}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Kegiatan Terlaksana</p>
                  <p className="text-2xl font-bold">{summary?.totalKegiatan} Sesi</p>
                </div>
              </div>

              {/* Grafik di PDF (Kita gunakan data yang sama tapi versi static/img jika diperlukan, 
                  tapi html2canvas akan meng-capture ResponsiveContainer dengan baik selama ukurannya fix) */}
              <div className="mb-8 flex-1">
                <h3 className="text-sm font-bold mb-4 border-l-4 border-primary pl-2 uppercase">Analisis Tren Bulanan</h3>
                <div className="h-[250px] w-full border rounded-lg p-2 bg-white">
                  {/* Recharts akan di-capture oleh html2canvas */}
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financeTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} tickFormatter={(v) => `${v/1000000}jt`} />
                      <Area type="monotone" dataKey="pemasukan" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="pengeluaran" stroke="#f43f5e" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Footer Laporan */}
              <div className="mt-auto pt-8 border-t text-[10px] text-gray-400 flex justify-between">
                <p>Dicetak secara otomatis oleh Sistem Gereja Digital pada {new Date().toLocaleString()}</p>
                <p>Halaman 1 dari 1</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" />
                  Cetak PDF Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
