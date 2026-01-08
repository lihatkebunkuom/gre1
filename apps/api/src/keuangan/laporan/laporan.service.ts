import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLaporanKeuanganDto } from './dto/create-laporan.dto';
import { UpdateLaporanKeuanganDto } from './dto/update-laporan.dto';

@Injectable()
export class LaporanKeuanganService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLaporanKeuanganDto) {
    return this.prisma.laporanKeuangan.create({
      data: {
        ...createDto,
        tanggalMulai: new Date(createDto.tanggalMulai),
        tanggalSelesai: new Date(createDto.tanggalSelesai),
      },
    });
  }

  async findAll() {
    return this.prisma.laporanKeuangan.findMany({
      orderBy: { tanggalMulai: 'desc' },
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.laporanKeuangan.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException(`Laporan Keuangan with ID ${id} not found`);
    return data;
  }

  async update(id: string, updateDto: UpdateLaporanKeuanganDto) {
    const data: any = { ...updateDto };
    if (updateDto.tanggalMulai) {
      data.tanggalMulai = new Date(updateDto.tanggalMulai);
    }
    if (updateDto.tanggalSelesai) {
      data.tanggalSelesai = new Date(updateDto.tanggalSelesai);
    }
    return this.prisma.laporanKeuangan.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.laporanKeuangan.delete({
      where: { id },
    });
  }
}
