import { WilayahService } from './wilayah.service';
import { CreateWilayahDto } from './dto/create-wilayah.dto';
import { UpdateWilayahDto } from './dto/update-wilayah.dto';
export declare class WilayahController {
    private readonly wilayahService;
    constructor(wilayahService: WilayahService);
    create(createWilayahDto: CreateWilayahDto): import("@prisma/client").Prisma.Prisma__WilayahClient<{
        id: string;
        nama: string;
        keterangan: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        kelompoks: {
            id: string;
            nama: string;
            createdAt: Date;
            updatedAt: Date;
            ketua: string | null;
            jadwal: string | null;
            catatan: string | null;
            wilayahId: string | null;
        }[];
    } & {
        id: string;
        nama: string;
        keterangan: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__WilayahClient<({
        kelompoks: {
            id: string;
            nama: string;
            createdAt: Date;
            updatedAt: Date;
            ketua: string | null;
            jadwal: string | null;
            catatan: string | null;
            wilayahId: string | null;
        }[];
    } & {
        id: string;
        nama: string;
        keterangan: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateWilayahDto: UpdateWilayahDto): import("@prisma/client").Prisma.Prisma__WilayahClient<{
        id: string;
        nama: string;
        keterangan: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__WilayahClient<{
        id: string;
        nama: string;
        keterangan: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
