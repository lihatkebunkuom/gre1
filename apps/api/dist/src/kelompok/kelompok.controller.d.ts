import { KelompokService } from './kelompok.service';
import { CreateKelompokDto } from './dto/create-kelompok.dto';
import { UpdateKelompokDto } from './dto/update-kelompok.dto';
export declare class KelompokController {
    private readonly kelompokService;
    constructor(kelompokService: KelompokService);
    create(createKelompokDto: CreateKelompokDto): import("@prisma/client").Prisma.Prisma__KelompokClient<{
        id: string;
        nama: string;
        createdAt: Date;
        updatedAt: Date;
        ketua: string | null;
        jadwal: string | null;
        catatan: string | null;
        wilayahId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        wilayah: {
            id: string;
            nama: string;
            keterangan: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        nama: string;
        createdAt: Date;
        updatedAt: Date;
        ketua: string | null;
        jadwal: string | null;
        catatan: string | null;
        wilayahId: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__KelompokClient<({
        wilayah: {
            id: string;
            nama: string;
            keterangan: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        jemaats: {
            id: string;
            nama: string;
            createdAt: Date;
            updatedAt: Date;
            wilayahId: string | null;
            nomorInduk: string;
            jenisKelamin: import("@prisma/client").$Enums.JenisKelamin;
            tempatLahir: string | null;
            tanggalLahir: Date;
            statusAktif: boolean;
            statusKeanggotaan: import("@prisma/client").$Enums.StatusKeanggotaan;
            tanggalBergabung: Date;
            fotoUrl: string | null;
            catatanKhusus: string | null;
            noHp: string | null;
            email: string | null;
            alamat: string | null;
            kota: string | null;
            provinsi: string | null;
            statusPernikahan: import("@prisma/client").$Enums.StatusPernikahan;
            namaPasangan: string | null;
            jumlahAnak: number;
            isKepalaKeluarga: boolean;
            noKK: string | null;
            statusBaptis: import("@prisma/client").$Enums.StatusSakramen;
            tanggalBaptis: Date | null;
            gerejaBaptis: string | null;
            statusSidi: import("@prisma/client").$Enums.StatusSakramen;
            tanggalSidi: Date | null;
            pendetaSidi: string | null;
            pendidikan: string | null;
            pekerjaan: string | null;
            instansi: string | null;
            minatPelayanan: string | null;
            pelayananDiikuti: string | null;
            peranDalamKelompok: string | null;
            kelompokId: string | null;
        }[];
    } & {
        id: string;
        nama: string;
        createdAt: Date;
        updatedAt: Date;
        ketua: string | null;
        jadwal: string | null;
        catatan: string | null;
        wilayahId: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateKelompokDto: UpdateKelompokDto): import("@prisma/client").Prisma.Prisma__KelompokClient<{
        id: string;
        nama: string;
        createdAt: Date;
        updatedAt: Date;
        ketua: string | null;
        jadwal: string | null;
        catatan: string | null;
        wilayahId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__KelompokClient<{
        id: string;
        nama: string;
        createdAt: Date;
        updatedAt: Date;
        ketua: string | null;
        jadwal: string | null;
        catatan: string | null;
        wilayahId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
