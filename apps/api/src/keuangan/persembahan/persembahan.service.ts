import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersembahanDto } from './dto/create-persembahan.dto';
import { UpdatePersembahanDto } from './dto/update-persembahan.dto';

@Injectable()
export class PersembahanService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePersembahanDto) {
    return this.prisma.persembahan.create({
      data: {
        ...createDto,
        tanggalPersembahan: new Date(createDto.tanggalPersembahan),
      },
    });
  }

  async findAll() {
    return this.prisma.persembahan.findMany({
      orderBy: { tanggalPersembahan: 'desc' },
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.persembahan.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException(`Persembahan with ID ${id} not found`);
    return data;
  }

  async update(id: string, updateDto: UpdatePersembahanDto) {
    const data: any = { ...updateDto };
    if (updateDto.tanggalPersembahan) {
      data.tanggalPersembahan = new Date(updateDto.tanggalPersembahan);
    }
    return this.prisma.persembahan.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.persembahan.delete({
      where: { id },
    });
  }
}
