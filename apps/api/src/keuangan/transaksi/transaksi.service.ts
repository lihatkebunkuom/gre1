import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';

@Injectable()
export class TransaksiService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTransaksiDto) {
    return this.prisma.transaksi.create({
      data: {
        ...createDto,
        tanggalTransaksi: new Date(createDto.tanggalTransaksi),
      },
    });
  }

  async findAll() {
    return this.prisma.transaksi.findMany({
      orderBy: { tanggalTransaksi: 'desc' },
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.transaksi.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException(`Transaksi with ID ${id} not found`);
    return data;
  }

  async update(id: string, updateDto: UpdateTransaksiDto) {
    const data: any = { ...updateDto };
    if (updateDto.tanggalTransaksi) {
      data.tanggalTransaksi = new Date(updateDto.tanggalTransaksi);
    }
    return this.prisma.transaksi.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.transaksi.delete({
      where: { id },
    });
  }
}
