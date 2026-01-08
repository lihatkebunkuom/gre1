import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateProdukDto) {
    return this.prisma.produk.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.produk.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const produk = await this.prisma.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      throw new NotFoundException(`Produk with ID ${id} not found`);
    }

    return produk;
  }

  async update(id: string, updateDto: UpdateProdukDto) {
    return this.prisma.produk.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.produk.delete({
      where: { id },
    });
  }
}
