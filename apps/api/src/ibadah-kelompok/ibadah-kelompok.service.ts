import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahKelompokDto } from './dto/create-ibadah-kelompok.dto';
import { UpdateIbadahKelompokDto } from './dto/update-ibadah-kelompok.dto';

@Injectable()
export class IbadahKelompokService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateIbadahKelompokDto) {
    const { tanggalkelompok, ...rest } = createDto;
    return this.prisma.ibadahKelompok.create({
      data: {
        ...rest,
        tanggalkelompok: tanggalkelompok ? new Date(tanggalkelompok) : null,
      },
      include: { kelompok: true },
    });
  }

  findAll() {
    return this.prisma.ibadahKelompok.findMany({
      include: { kelompok: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ibadah = await this.prisma.ibadahKelompok.findUnique({
      where: { id },
      include: { kelompok: true },
    });
    if (!ibadah) {
      throw new NotFoundException(`Ibadah Kelompok with ID ${id} not found`);
    }
    return ibadah;
  }

  async update(id: string, updateDto: UpdateIbadahKelompokDto) {
    await this.findOne(id);
    const { tanggalkelompok, ...rest } = updateDto;
    
    return this.prisma.ibadahKelompok.update({
      where: { id },
      data: {
        ...rest,
        tanggalkelompok: tanggalkelompok ? new Date(tanggalkelompok) : undefined,
      },
      include: { kelompok: true },
    });
  }

  remove(id: string) {
    return this.prisma.ibadahKelompok.delete({
      where: { id },
    });
  }
}
