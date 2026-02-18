import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, format } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfCurMonth = startOfMonth(now);
    const endOfCurMonth = endOfMonth(now);
    
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // 1. Total Jemaat
    const totalJemaat = await this.prisma.jemaat.count({ where: { statusAktif: true } });
    const totalJemaatLastMonth = await this.prisma.jemaat.count({
      where: { 
        statusAktif: true,
        createdAt: { lt: startOfCurMonth }
      }
    });
    const jemaatChange = totalJemaatLastMonth === 0 ? 0 : Math.round(((totalJemaat - totalJemaatLastMonth) / totalJemaatLastMonth) * 100);

    // 2. Persembahan Bulan Ini
    const persembahanBulanIni = await this.prisma.persembahan.aggregate({
      _sum: { nominal: true },
      where: {
        tanggalPersembahan: {
          gte: startOfCurMonth,
          lte: endOfCurMonth,
        }
      }
    });

    const persembahanBulanLalu = await this.prisma.persembahan.aggregate({
      _sum: { nominal: true },
      where: {
        tanggalPersembahan: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        }
      }
    });

    const valBulanIni = persembahanBulanIni._sum.nominal || 0;
    const valBulanLalu = persembahanBulanLalu._sum.nominal || 0;
    const persembahanChange = valBulanLalu === 0 ? 0 : Math.round(((valBulanIni - valBulanLalu) / valBulanLalu) * 100);

    // 3. Rata-rata Kehadiran (5 Ibadah Terakhir)
    const last5Services = await this.prisma.jadwalIbadah.findMany({
      take: 5,
      orderBy: { tanggal: 'desc' },
      include: {
        _count: {
          select: { absensi: true }
        }
      }
    });

    const avgKehadiran = last5Services.length > 0 
      ? Math.round(last5Services.reduce((acc, curr) => acc + curr._count.absensi, 0) / last5Services.length)
      : 0;
    
    // Simple logic for trend: compare last service with the one before it
    const lastServiceCount = last5Services[0]?._count.absensi || 0;
    const prevServiceCount = last5Services[1]?._count.absensi || 0;
    const attendanceChange = prevServiceCount === 0 ? 0 : Math.round(((lastServiceCount - prevServiceCount) / prevServiceCount) * 100);

    // 4. Jemaat Baru Minggu Ini
    const startOfCurWeek = startOfWeek(now);
    const endOfCurWeek = endOfWeek(now);
    const jemaatBaru = await this.prisma.jemaat.count({
      where: {
        tanggalBergabung: {
          gte: startOfCurWeek,
          lte: endOfCurWeek,
        }
      }
    });

    return [
      {
        title: "Total Jemaat",
        value: totalJemaat.toLocaleString(),
        change: `${jemaatChange >= 0 ? '+' : ''}${jemaatChange}% bulan ini`,
        trend: jemaatChange >= 0 ? "up" : "down",
      },
      {
        title: "Persembahan (Bulan Ini)",
        value: `Rp ${(valBulanIni / 1000000).toFixed(1)} jt`,
        change: `${persembahanChange >= 0 ? '+' : ''}${persembahanChange}% dari bln lalu`,
        trend: persembahanChange >= 0 ? "up" : "down",
      },
      {
        title: "Rata-rata Kehadiran",
        value: avgKehadiran.toLocaleString(),
        change: `${attendanceChange >= 0 ? '+' : ''}${attendanceChange}% ibadah terakhir`,
        trend: attendanceChange >= 0 ? "up" : "down",
      },
      {
        title: "Jemaat Baru",
        value: jemaatBaru.toString(),
        change: "Minggu ini",
        trend: "neutral",
      },
    ];
  }

  async getAttendanceTrend() {
    const last5Services = await this.prisma.jadwalIbadah.findMany({
      take: 5,
      orderBy: { tanggal: 'asc' }, // Ascending for chart
      include: {
        _count: {
          select: { absensi: true }
        }
      }
    });

    return {
      categories: last5Services.map(s => format(s.tanggal, 'dd MMM')),
      data: last5Services.map(s => s._count.absensi)
    };
  }

  async getFinanceTrend() {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(new Date(), i);
      const start = startOfMonth(targetDate);
      const end = endOfMonth(targetDate);

      months.push(format(targetDate, 'MMM'));

      const income = await this.prisma.transaksi.aggregate({
        _sum: { nominal: true },
        where: {
          jenisTransaksi: 'PEMASUKAN',
          tanggalTransaksi: { gte: start, lte: end }
        }
      });

      const expense = await this.prisma.transaksi.aggregate({
        _sum: { nominal: true },
        where: {
          jenisTransaksi: 'PENGELUARAN',
          tanggalTransaksi: { gte: start, lte: end }
        }
      });

      incomeData.push((income._sum.nominal || 0) / 1000000);
      expenseData.push((expense._sum.nominal || 0) / 1000000);
    }

    return {
      categories: months,
      income: incomeData,
      expense: expenseData
    };
  }

  async getUpcomingServices() {
    const now = new Date();
    const services = await this.prisma.jadwalIbadah.findMany({
      where: {
        tanggal: { gte: now }
      },
      take: 3,
      orderBy: { tanggal: 'asc' }
    });

    return services.map(s => ({
      name: s.namaIbadah,
      time: `${format(s.tanggal, 'EEEE')}, ${format(s.waktuMulai, 'HH:mm')}`,
      theme: s.tema || 'N/A',
      speaker: s.pembicara
    }));
  }

  async getRecentActivities() {
    // Aggregating from multiple tables as a proxy for "activities"
    const recentJemaat = await this.prisma.jemaat.findMany({
      take: 2,
      orderBy: { updatedAt: 'desc' },
      select: { nama: true, updatedAt: true }
    });

    const recentTransaksi = await this.prisma.transaksi.findMany({
      take: 2,
      orderBy: { updatedAt: 'desc' },
      select: { deskripsiTransaksi: true, updatedAt: true }
    });

    const activities = [
      ...recentJemaat.map(j => ({
        user: "Admin",
        action: `Memperbarui data jemaat ${j.nama}`,
        time: j.updatedAt
      })),
      ...recentTransaksi.map(t => ({
        user: "Bendahara",
        action: `Transaksi: ${t.deskripsiTransaksi}`,
        time: t.updatedAt
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime());

    // Format time to relative string (simplified)
    return activities.map(a => {
        const diffMs = new Date().getTime() - a.time.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        let timeStr = `${diffHours} jam lalu`;
        if (diffHours === 0) timeStr = "Baru saja";
        if (diffHours >= 24) timeStr = `${Math.floor(diffHours / 24)} hari lalu`;
        
        return {
            user: a.user,
            action: a.action,
            time: timeStr
        };
    });
  }

  async getDashboardData() {
    const [stats, attendanceTrend, financeTrend, upcomingServices, recentActivities] = await Promise.all([
      this.getStats(),
      this.getAttendanceTrend(),
      this.getFinanceTrend(),
      this.getUpcomingServices(),
      this.getRecentActivities(),
    ]);

    return {
      stats,
      attendanceTrend,
      financeTrend,
      upcomingServices,
      recentActivities
    };
  }
}
