import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahWilayahDto } from './dto/create-ibadah-wilayah.dto';
import { UpdateIbadahWilayahDto } from './dto/update-ibadah-wilayah.dto';

@Injectable()
export class IbadahWilayahService {
  constructor(private prisma: PrismaService) {}

  async create(createIbadahWilayahDto: CreateIbadahWilayahDto) {
    return this.prisma.ibadahWilayah.create({
      data: createIbadahWilayahDto,
      include: { wilayah: true },
    });
  }

  async findAll() {
    return this.prisma.ibadahWilayah.findMany({
      include: { wilayah: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.ibadahWilayah.findUnique({
      where: { id },
      include: { wilayah: true },
    });
  }

  async update(id: string, updateIbadahWilayahDto: UpdateIbadahWilayahDto) {
    return this.prisma.ibadahWilayah.update({
      where: { id },
      data: updateIbadahWilayahDto,
      include: { wilayah: true },
    });
  }

  async remove(id: string) {
    return this.prisma.ibadahWilayah.delete({
      where: { id },
    });
  }
}
