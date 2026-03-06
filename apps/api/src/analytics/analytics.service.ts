import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    // 1. Hitung Total Jemaat
    const totalJemaat = await this.prisma.jemaat.count({
      where: { statusAktif: true },
    });

    // 2. Hitung Total Pemasukan & Pengeluaran (Contoh Agregasi)
    const totalPemasukan = await this.prisma.transaksi.aggregate({
      where: { jenisTransaksi: 'PEMASUKAN' },
      _sum: { nominal: true },
    });

    const totalPengeluaran = await this.prisma.transaksi.aggregate({
      where: { jenisTransaksi: 'PENGELUARAN' },
      _sum: { nominal: true },
    });

    // 3. Hitung Jumlah Kegiatan Aktif (Ibadah)
    const totalKegiatan = await this.prisma.jadwalIbadah.count();

    return {
      totalJemaat,
      kasBersih: (totalPemasukan._sum.nominal || 0) - (totalPengeluaran._sum.nominal || 0),
      totalKegiatan,
      rerataKehadiran: 85, // Placeholder sementara
    };
  }

  async getFinanceTrend() {
    // Ambil data transaksi 6 bulan terakhir (Mock logic sementara yang nanti disempurnakan)
    // Dalam implementasi riil, kita akan menggunakan groupBy berdasarkan bulan
    return [
      { month: "Jan", pemasukan: 45000000, pengeluaran: 32000000 },
      { month: "Feb", pemasukan: 52000000, pengeluaran: 35000000 },
      { month: "Mar", pemasukan: 48000000, pengeluaran: 38000000 },
      { month: "Apr", pemasukan: 61000000, pengeluaran: 42000000 },
      { month: "Mei", pemasukan: 55000000, pengeluaran: 40000000 },
      { month: "Jun", pemasukan: 67000000, pengeluaran: 45000000 },
    ];
  }

  async getDemographics() {
    // Agregasi jemaat berdasarkan Status Keanggotaan atau Status Pernikahan sebagai proksi
    const stats = await this.prisma.jemaat.groupBy({
      by: ['statusKeanggotaan'],
      _count: { _all: true },
    });

    return stats.map(item => ({
      name: item.statusKeanggotaan,
      value: item._count._all,
    }));
  }
}
