import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuletinDto } from './dto/create-buletin.dto';
import { UpdateBuletinDto } from './dto/update-buletin.dto';

@Injectable()
export class BuletinService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateBuletinDto) {
    return this.prisma.buletin.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.buletin.findMany({
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.buletin.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Buletin with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateBuletinDto) {
    await this.findOne(id);
    return this.prisma.buletin.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.buletin.delete({
      where: { id },
    });
  }
}
