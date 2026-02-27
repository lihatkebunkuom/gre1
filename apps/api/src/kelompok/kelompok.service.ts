import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKelompokDto } from './dto/create-kelompok.dto';
import { UpdateKelompokDto } from './dto/update-kelompok.dto';

@Injectable()
export class KelompokService {
  constructor(private prisma: PrismaService) {}

  async create(createKelompokDto: CreateKelompokDto) {
    return this.prisma.kelompok.create({
      data: createKelompokDto,
      include: { wilayah: true },
    });
  }

  async findAll() {
    return this.prisma.kelompok.findMany({
      include: { wilayah: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.kelompok.findUnique({
      where: { id },
      include: { wilayah: true },
    });
  }

  async update(id: string, updateKelompokDto: UpdateKelompokDto) {
    return this.prisma.kelompok.update({
      where: { id },
      data: updateKelompokDto,
      include: { wilayah: true },
    });
  }

  async remove(id: string) {
    return this.prisma.kelompok.delete({
      where: { id },
    });
  }
}
