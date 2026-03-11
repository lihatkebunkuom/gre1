import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePendalamanAlkitabDto } from './dto/create-pendalaman-alkitab.dto';
import { UpdatePendalamanAlkitabDto } from './dto/update-pendalaman-alkitab.dto';

@Injectable()
export class PendalamanAlkitabService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePendalamanAlkitabDto) {
    const { tanggalpa, ...rest } = createDto;
    return this.prisma.pendalamanAlkitab.create({
      data: {
        ...rest,
        tanggalpa: tanggalpa ? new Date(tanggalpa) : null,
      },
      include: {
        pepanthan: true,
        wilayah: true,
        kelompok: true,
        komisi: true,
      },
    });
  }

  findAll() {
    return this.prisma.pendalamanAlkitab.findMany({
      include: {
        pepanthan: true,
        wilayah: true,
        kelompok: true,
        komisi: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ibadah = await this.prisma.pendalamanAlkitab.findUnique({
      where: { id },
      include: {
        pepanthan: true,
        wilayah: true,
        kelompok: true,
        komisi: true,
      },
    });
    if (!ibadah) {
      throw new NotFoundException(`PA with ID ${id} not found`);
    }
    return ibadah;
  }

  async update(id: string, updateDto: UpdatePendalamanAlkitabDto) {
    await this.findOne(id);
    const { tanggalpa, ...rest } = updateDto;
    
    return this.prisma.pendalamanAlkitab.update({
      where: { id },
      data: {
        ...rest,
        tanggalpa: tanggalpa ? new Date(tanggalpa) : undefined,
      },
      include: {
        pepanthan: true,
        wilayah: true,
        kelompok: true,
        komisi: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.pendalamanAlkitab.delete({
      where: { id },
    });
  }
}
