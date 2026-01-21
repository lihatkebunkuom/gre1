import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coins, Calendar, TrendingUp, Bell, ArrowRight, Activity, UserPlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUIStore } from '@/stores/ui-store';
import { dashboardService, DashboardData } from '@/services/dashboard.service';

// --- ECharts Configurations ---

const getAttendanceOption = (isDark: boolean, categories: string[] = [], data: number[] = []) => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark ? '#1f2937' : '#fff',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    textStyle: { color: isDark ? '#f3f4f6' : '#1f2937' }
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: categories.length > 0 ? categories : ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'],
    axisLine: { lineStyle: { color: isDark ? '#6b7280' : '#9ca3af' } }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb', type: 'dashed' } },
    axisLabel: { color: isDark ? '#6b7280' : '#9ca3af' }
  },
  series: [
    {
      name: 'Kehadiran',
      type: 'line',
      smooth: true,
      lineStyle: { width: 3, color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.0)' }
          ]
        }
      },
      data: data.length > 0 ? data : [0, 0, 0, 0, 0]
    }
  ]
});

const getFinanceOption = (isDark: boolean, categories: string[] = [], income: number[] = [], expense: number[] = []) => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { textStyle: { color: isDark ? '#9ca3af' : '#4b5563' }, bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: categories.length > 0 ? categories : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    axisLine: { lineStyle: { color: isDark ? '#6b7280' : '#9ca3af' } }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } },
    axisLabel: { formatter: '{value} Jt', color: isDark ? '#6b7280' : '#9ca3af' }
  },
  series: [
    {
      name: 'Pemasukan',
      type: 'bar',
      barGap: 0,
      itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
      data: income.length > 0 ? income : [0, 0, 0, 0, 0, 0]
    },
    {
      name: 'Pengeluaran',
      type: 'bar',
      itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] },
      data: expense.length > 0 ? expense : [0, 0, 0, 0, 0, 0]
    }
  ]
});

// --- Main Component ---

const DashboardOverview = () => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const statsConfig = [
    { icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: Coins, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { icon: Activity, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Dashboard" 
        description="Ringkasan performa dan aktivitas gereja minggu ini."
      >
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" /> Notifikasi
        </Button>
      </PageHeader>

      {/* 1. Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => {
          const config = statsConfig[index] || statsConfig[0];
          return (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#a855f7' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className={`p-2 rounded-full ${config.bg}`}>
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'} flex items-center gap-1`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Attendance Chart (Left - Wider) */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Tren Kehadiran Ibadah</CardTitle>
            <CardDescription>Grafik kehadiran jemaat dalam 5 minggu terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts 
              option={getAttendanceOption(isDark, data.attendanceTrend.categories, data.attendanceTrend.data)} 
              style={{ height: '350px', width: '100%' }} 
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>

        {/* Finance Chart (Right) */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Keuangan Semester Ini</CardTitle>
            <CardDescription>Perbandingan pemasukan vs pengeluaran.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts 
              option={getFinanceOption(isDark, data.financeTrend.categories, data.financeTrend.income, data.financeTrend.expense)} 
              style={{ height: '350px', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. Bottom Section: Upcoming & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Jadwal Ibadah */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Jadwal Ibadah Minggu Ini</CardTitle>
              <CardDescription>Persiapan pelayanan minggu ini.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">Lihat Semua <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.upcomingServices.map((service, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{service.time}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base">{service.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">"{service.theme}"</p>
                  </div>
                  <div className="mt-auto pt-2 border-t text-xs text-muted-foreground flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.speaker}`} />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    {service.speaker}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifikasi Ringkas */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentActivities.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative">
                    <span className="absolute left-[9px] top-8 h-full w-[2px] bg-muted last:hidden"></span>
                    <div className="h-5 w-5 rounded-full border-2 border-primary bg-background z-10 relative" />
                  </div>
                  <div className="space-y-1 pb-1">
                    <p className="text-sm font-medium leading-none">{act.action}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{act.user}</span> • {act.time}
                    </p>
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
