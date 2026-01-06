import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, CalendarCheck, TrendingUp, ArrowUpRight, Download, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

// Mock Data
const stats = [
  {
    title: "Total Jemaat",
    value: "1,248",
    change: "+12% bulan ini",
    icon: Users,
    trend: "up"
  },
  {
    title: "Persembahan Minggu Ini",
    value: "Rp 45.200.000",
    change: "+5% dari minggu lalu",
    icon: CreditCard,
    trend: "up"
  },
  {
    title: "Kehadiran Ibadah",
    value: "892",
    change: "Rata-rata kehadiran",
    icon: CalendarCheck,
    trend: "neutral"
  },
];

const attendanceData = [
  { name: 'Minggu 1', total: 750 },
  { name: 'Minggu 2', total: 820 },
  { name: 'Minggu 3', total: 780 },
  { name: 'Minggu 4', total: 890 },
  { name: 'Minggu 5', total: 950 },
];

const recentActivities = [
  { action: "Pendaftaran Jemaat Baru", user: "Budi Santoso", time: "2 jam yang lalu", status: "success" },
  { action: "Input Persembahan Minggu", user: "Bendahara", time: "5 jam yang lalu", status: "info" },
  { action: "Update Jadwal Ibadah", user: "Sekretariat", time: "Kemarin", status: "warning" },
  { action: "Export Laporan Bulanan", user: "Ketua Majelis", time: "2 hari lalu", status: "neutral" },
];

const DashboardOverview = () => {
  const handleDownload = () => {
    toast.success("Laporan sedang diunduh...");
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header Component */}
      <PageHeader 
        title="Dashboard Overview" 
        description="Ringkasan aktivitas gereja dan statistik jemaat terkini."
      >
        <ConfirmDialog
          trigger={<Button variant="outline"><Download className="mr-2 h-4 w-4"/> Unduh Laporan</Button>}
          title="Unduh Laporan Bulanan?"
          description="Laporan akan diunduh dalam format PDF. Proses ini mungkin memakan waktu beberapa detik."
          confirmLabel="Unduh Sekarang"
          onConfirm={handleDownload}
        />
        <Button>
          <Plus className="mr-2 h-4 w-4"/> Tambah Jemaat
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren Kehadiran Ibadah</CardTitle>
            <CardDescription>
              Statistik kehadiran jemaat dalam 5 minggu terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Log aktivitas sistem terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium leading-none mb-1">{item.action}</p>
                      {/* 2. Status Badge Usage */}
                      <StatusBadge variant={item.status as any} className="text-[10px] px-1.5 py-0 h-5">
                        {item.status.toUpperCase()}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Oleh <span className="font-medium text-foreground">{item.user}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;