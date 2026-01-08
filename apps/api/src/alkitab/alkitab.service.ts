import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAyatAlkitabDto } from './dto/create-ayat-alkitab.dto';
import { UpdateAyatAlkitabDto } from './dto/update-ayat-alkitab.dto';

@Injectable()
export class AlkitabService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAyatAlkitabDto) {
    return this.prisma.ayatAlkitab.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.ayatAlkitab.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ayat = await this.prisma.ayatAlkitab.findUnique({
      where: { id },
    });

    if (!ayat) {
      throw new NotFoundException(`Ayat with ID ${id} not found`);
    }

    return ayat;
  }

  async update(id: string, updateDto: UpdateAyatAlkitabDto) {
    return this.prisma.ayatAlkitab.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.ayatAlkitab.delete({
      where: { id },
    });
  }
}
