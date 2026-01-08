import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKalenderEventDto } from './dto/create-kalender-event.dto';
import { UpdateKalenderEventDto } from './dto/update-kalender-event.dto';

@Injectable()
export class KalenderEventService {
  constructor(private prisma: PrismaService) {}

  create(createKalenderEventDto: CreateKalenderEventDto) {
    return this.prisma.kalenderEvent.create({
      data: createKalenderEventDto,
    });
  }

  findAll() {
    return this.prisma.kalenderEvent.findMany();
  }

  findOne(id: string) {
    return this.prisma.kalenderEvent.findUnique({
      where: { id },
    });
  }

  update(id: string, updateKalenderEventDto: UpdateKalenderEventDto) {
    return this.prisma.kalenderEvent.update({
      where: { id },
      data: updateKalenderEventDto,
    });
  }

  remove(id: string) {
    return this.prisma.kalenderEvent.delete({
      where: { id },
    });
  }
}
