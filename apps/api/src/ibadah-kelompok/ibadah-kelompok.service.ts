import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahKelompokDto } from './dto/create-ibadah-kelompok.dto';
import { UpdateIbadahKelompokDto } from './dto/update-ibadah-kelompok.dto';

@Injectable()
export class IbadahKelompokService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateIbadahKelompokDto) {
    return this.prisma.ibadahKelompok.create({
      data: createDto,
      include: { kelompok: true },
    });
  }

  findAll() {
    return this.prisma.ibadahKelompok.findMany({
      include: { kelompok: true },
      orderBy: { waktu: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.ibadahKelompok.findUnique({
      where: { id },
      include: { kelompok: true },
    });
  }

  update(id: string, updateDto: UpdateIbadahKelompokDto) {
    return this.prisma.ibadahKelompok.update({
      where: { id },
      data: updateDto,
      include: { kelompok: true },
    });
  }

  remove(id: string) {
    return this.prisma.ibadahKelompok.delete({
      where: { id },
    });
  }
}
