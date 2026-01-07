import { Injectable } from '@nestjs/common';
import { CreateWilayahDto } from './dto/create-wilayah.dto';
import { UpdateWilayahDto } from './dto/update-wilayah.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WilayahService {
  constructor(private prisma: PrismaService) {}

  create(createWilayahDto: CreateWilayahDto) {
    return this.prisma.wilayah.create({
      data: createWilayahDto,
    });
  }

  findAll() {
    return this.prisma.wilayah.findMany({
      include: { kelompoks: true },
    });
  }

  findOne(id: string) {
    return this.prisma.wilayah.findUnique({
      where: { id },
      include: { kelompoks: true },
    });
  }

  update(id: string, updateWilayahDto: UpdateWilayahDto) {
    return this.prisma.wilayah.update({
      where: { id },
      data: updateWilayahDto,
    });
  }

  remove(id: string) {
    return this.prisma.wilayah.delete({
      where: { id },
    });
  }
}