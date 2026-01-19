import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRenunganDto } from './dto/create-renungan.dto';
import { UpdateRenunganDto } from './dto/update-renungan.dto';

@Injectable()
export class RenunganService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateRenunganDto) {
    return this.prisma.renungan.create({
      data: {
        ...createDto,
        tanggal: new Date(createDto.tanggal),
      },
    });
  }

  async findAll() {
    return this.prisma.renungan.findMany({
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(id: string) {
    const renungan = await this.prisma.renungan.findUnique({
      where: { id },
    });

    if (!renungan) {
      throw new NotFoundException(`Renungan with ID ${id} not found`);
    }

    return renungan;
  }

  async update(id: string, updateDto: UpdateRenunganDto) {
    const data: any = { ...updateDto };
    if (updateDto.tanggal) {
      data.tanggal = new Date(updateDto.tanggal);
    }

    return this.prisma.renungan.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.renungan.delete({
      where: { id },
    });
  }
}