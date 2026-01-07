import { Injectable } from '@nestjs/common';
import { CreateJemaatDto } from './dto/create-jemaat.dto';
import { UpdateJemaatDto } from './dto/update-jemaat.dto';
import { CreateJemaatWithRelationsDto } from './dto/create-jemaat-with-relations.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JemaatService {
  constructor(private prisma: PrismaService) {}

  async create(createJemaatDto: CreateJemaatDto) {
    // Generate nomor induk otomatis jika kosong
    if (!createJemaatDto.nomorInduk) {
      const now = new Date();
      const dateStr = now.getFullYear().toString().slice(-2);
      const timeStr = now.getTime().toString().slice(-4); // Ambil 4 digit terakhir timestamp
      createJemaatDto.nomorInduk = `GM-${dateStr}${timeStr}`;
    }

    return this.prisma.jemaat.create({
      data: createJemaatDto as any,
    });
  }

  async createJemaatWithRelations(data: CreateJemaatWithRelationsDto) {
    let wilayahId: string | undefined = data.wilayahId;
    let kelompokId: string | undefined = data.kelompokId;

    if (data.wilayah) {
      if (data.wilayah.id) {
        wilayahId = data.wilayah.id;
      } else {
        const newWilayah = await this.prisma.wilayah.create({ data: data.wilayah });
        wilayahId = newWilayah.id;
      }
    }

    if (data.kelompok) {
      if (data.kelompok.id) {
        kelompokId = data.kelompok.id;
      } else {
        const { wilayahId: kelompokWilayahId, ...kelompokData } = data.kelompok; // Destrukturisasi untuk menghapus wilayahId dari kelompokData
        const newKelompok = await this.prisma.kelompok.create({
          data: {
            ...kelompokData,
            wilayah: wilayahId ? { connect: { id: wilayahId } } : undefined,
          },
        });
        kelompokId = newKelompok.id;
      }
    }

    const { wilayah, kelompok, ...jemaatData } = data; 

    if (!jemaatData.nomorInduk) {
      const now = new Date();
      const dateStr = now.getFullYear().toString().slice(-2);
      const timeStr = now.getTime().toString().slice(-4);
      jemaatData.nomorInduk = `GM-${dateStr}${timeStr}`;
    }

    return this.prisma.jemaat.create({
      data: {
        ...(jemaatData as any),
        wilayah: wilayahId ? { connect: { id: wilayahId } } : undefined,
        kelompok: kelompokId ? { connect: { id: kelompokId } } : undefined,
      },
      include: { wilayah: true, kelompok: true },
    });
  }

  findAll(search?: string) {
    if (search) {
      return this.prisma.jemaat.findMany({
        where: {
          OR: [
            { nama: { contains: search, mode: 'insensitive' } },
            { nomorInduk: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: { wilayah: true, kelompok: true },
        orderBy: { nama: 'asc' },
      });
    }
    return this.prisma.jemaat.findMany({
      include: { wilayah: true, kelompok: true },
      orderBy: { nama: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.jemaat.findUnique({
      where: { id },
      include: { wilayah: true, kelompok: true },
    });
  }

  update(id: string, updateJemaatDto: UpdateJemaatDto) {
    return this.prisma.jemaat.update({
      where: { id },
      data: updateJemaatDto,
    });
  }

  remove(id: string) {
    return this.prisma.jemaat.delete({
      where: { id },
    });
  }
}