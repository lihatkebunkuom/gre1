import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, BannerPosition } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        tanggal: createBannerDto.tanggal ? new Date(createBannerDto.tanggal) : null,
      },
    });
  }

  async findAll(position?: BannerPosition) {
    return this.prisma.banner.findMany({
      where: position ? { position } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    const data: any = { ...updateBannerDto };
    
    if (updateBannerDto.tanggal) {
      data.tanggal = new Date(updateBannerDto.tanggal);
    }

    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
