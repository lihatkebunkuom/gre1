import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScanQrDto } from './dto/scan-qr.dto';
import { QrSessionService } from '../qr-session/qr-session.service';

@Injectable()
export class KehadiranService {
  constructor(
    private prisma: PrismaService,
    private qrSessionService: QrSessionService,
  ) {}

  async scan(scanQrDto: ScanQrDto) {
    const { kodeQr, jemaatId } = scanQrDto;

    // 1. Cari sesi
    const session = await this.qrSessionService.findByKodeQr(kodeQr);
    if (!session) {
      throw new NotFoundException('QR Code tidak valid');
    }

    // 2. Validasi status aktif
    if (!session.statusAktif) {
      throw new BadRequestException('Sesi kehadiran sudah tidak aktif');
    }

    // 3. Validasi rentang waktu
    const now = new Date();
    if (now < session.waktuMulai) {
      throw new BadRequestException('Sesi kehadiran belum dimulai');
    }
    if (now > session.waktuSelesai) {
      throw new BadRequestException('Sesi kehadiran sudah berakhir');
    }

    // 4. Cek Jemaat
    const jemaat = await this.prisma.jemaat.findUnique({
      where: { id: jemaatId },
    });
    if (!jemaat) {
      throw new NotFoundException('Data Jemaat tidak ditemukan');
    }

    // 5. Cek absensi ganda
    const existing = await this.prisma.kehadiran.findUnique({
      where: {
        jemaatId_qrSessionId: {
          jemaatId,
          qrSessionId: session.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Anda sudah melakukan absensi untuk sesi ini');
    }

    // 6. Catat kehadiran
    const kehadiran = await this.prisma.kehadiran.create({
      data: {
        jemaatId,
        qrSessionId: session.id,
        metode: 'QR_CODE',
      },
      include: {
        qrSession: true,
      },
    });

    return {
      success: true,
      message: 'Kehadiran berhasil dicatat',
      data: {
        nama_kegiatan: kehadiran.qrSession.namaKegiatan,
        waktu_hadir: kehadiran.waktuHadir,
      },
    };
  }

  async findByJemaat(jemaatId: string) {
    return this.prisma.kehadiran.findMany({
      where: { jemaatId },
      include: {
        qrSession: true,
      },
      orderBy: { waktuHadir: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.kehadiran.findMany({
      include: {
        jemaat: true,
        qrSession: true,
      },
      orderBy: { waktuHadir: 'desc' },
    });
  }
}
