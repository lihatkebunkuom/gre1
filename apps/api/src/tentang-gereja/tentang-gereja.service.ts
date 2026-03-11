import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertTentangGerejaDto } from './dto/upsert-tentang-gereja.dto';

@Injectable()
export class TentangGerejaService {
  constructor(private prisma: PrismaService) {}

  async getData() {
    const data = await this.prisma.tentangGereja.findFirst();
    return data;
  }

  async upsertData(dto: UpsertTentangGerejaDto) {
    const existing = await this.prisma.tentangGereja.findFirst();

    if (existing) {
      return this.prisma.tentangGereja.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.tentangGereja.create({
      data: dto,
    });
  }
}
