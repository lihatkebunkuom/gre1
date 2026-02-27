import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePendalamanAlkitabDto } from './dto/create-pendalaman-alkitab.dto';
import { UpdatePendalamanAlkitabDto } from './dto/update-pendalaman-alkitab.dto';

@Injectable()
export class PendalamanAlkitabService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreatePendalamanAlkitabDto) {
    return this.prisma.pendalamanAlkitab.create({
      data: createDto,
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
      orderBy: { waktu: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.pendalamanAlkitab.findUnique({
      where: { id },
      include: {
        pepanthan: true,
        wilayah: true,
        kelompok: true,
        komisi: true,
      },
    });
  }

  update(id: string, updateDto: UpdatePendalamanAlkitabDto) {
    return this.prisma.pendalamanAlkitab.update({
      where: { id },
      data: updateDto,
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
