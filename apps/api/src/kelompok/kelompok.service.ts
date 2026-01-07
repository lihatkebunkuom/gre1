import { Injectable } from '@nestjs/common';
import { CreateKelompokDto } from './dto/create-kelompok.dto';
import { UpdateKelompokDto } from './dto/update-kelompok.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KelompokService {
  constructor(private prisma: PrismaService) {}

  create(createKelompokDto: CreateKelompokDto) {
    return this.prisma.kelompok.create({
      data: createKelompokDto,
    });
  }

  findAll() {
    return this.prisma.kelompok.findMany({
      include: { wilayah: true },
    });
  }

  findOne(id: string) {
    return this.prisma.kelompok.findUnique({
      where: { id },
      include: { wilayah: true, jemaats: true },
    });
  }

  update(id: string, updateKelompokDto: UpdateKelompokDto) {
    return this.prisma.kelompok.update({
      where: { id },
      data: updateKelompokDto,
    });
  }

  remove(id: string) {
    return this.prisma.kelompok.delete({
      where: { id },
    });
  }
}