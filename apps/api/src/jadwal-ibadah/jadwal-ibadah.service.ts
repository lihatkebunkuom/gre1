import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalIbadahDto } from './dto/create-jadwal-ibadah.dto';
import { UpdateJadwalIbadahDto } from './dto/update-jadwal-ibadah.dto';

@Injectable()
export class JadwalIbadahService {
  constructor(private prisma: PrismaService) {}

  create(createJadwalIbadahDto: CreateJadwalIbadahDto) {
    return this.prisma.jadwalIbadah.create({
      data: createJadwalIbadahDto,
    });
  }

  findAll() {
    return this.prisma.jadwalIbadah.findMany();
  }

  findOne(id: string) {
    return this.prisma.jadwalIbadah.findUnique({
      where: { id },
    });
  }

  update(id: string, updateJadwalIbadahDto: UpdateJadwalIbadahDto) {
    return this.prisma.jadwalIbadah.update({
      where: { id },
      data: updateJadwalIbadahDto,
    });
  }

  remove(id: string) {
    return this.prisma.jadwalIbadah.delete({
      where: { id },
    });
  }
}
