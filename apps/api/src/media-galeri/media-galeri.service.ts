import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaGaleriDto } from './dto/create-media-galeri.dto';
import { UpdateMediaGaleriDto } from './dto/update-media-galeri.dto';

@Injectable()
export class MediaGaleriService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMediaGaleriDto) {
    return this.prisma.mediaGaleri.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.mediaGaleri.findMany({
      orderBy: { tanggalUpload: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.mediaGaleri.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateMediaGaleriDto) {
    await this.findOne(id);
    return this.prisma.mediaGaleri.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mediaGaleri.delete({
      where: { id },
    });
  }
}
