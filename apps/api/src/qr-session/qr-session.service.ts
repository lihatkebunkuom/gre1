import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQrSessionDto } from './dto/create-qr-session.dto';
import { UpdateQrSessionDto } from './dto/update-qr-session.dto';
import * as crypto from 'crypto';

@Injectable()
export class QrSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createQrSessionDto: CreateQrSessionDto) {
    const kodeQr = crypto.randomBytes(10).toString('hex').toUpperCase();
    
    return this.prisma.qrSession.create({
      data: {
        ...createQrSessionDto,
        kodeQr,
        tanggalKegiatan: new Date(createQrSessionDto.tanggalKegiatan),
        waktuMulai: new Date(createQrSessionDto.waktuMulai),
        waktuSelesai: new Date(createQrSessionDto.waktuSelesai),
      },
    });
  }

  async findAll() {
    return this.prisma.qrSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { kehadirans: true }
        }
      }
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.qrSession.findUnique({
      where: { id },
      include: {
        kehadirans: {
          include: {
            jemaat: true
          }
        }
      }
    });

    if (!session) {
      throw new NotFoundException(`QrSession with ID ${id} not found`);
    }

    return session;
  }

  async update(id: string, updateQrSessionDto: UpdateQrSessionDto) {
    const data: any = { ...updateQrSessionDto };
    
    if (updateQrSessionDto.tanggalKegiatan) {
      data.tanggalKegiatan = new Date(updateQrSessionDto.tanggalKegiatan);
    }
    if (updateQrSessionDto.waktuMulai) {
      data.waktuMulai = new Date(updateQrSessionDto.waktuMulai);
    }
    if (updateQrSessionDto.waktuSelesai) {
      data.waktuSelesai = new Date(updateQrSessionDto.waktuSelesai);
    }

    return this.prisma.qrSession.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.qrSession.delete({
      where: { id },
    });
  }

  async findByKodeQr(kodeQr: string) {
    return this.prisma.qrSession.findUnique({
      where: { kodeQr },
    });
  }
}
