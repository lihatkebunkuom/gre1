import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);
  
  try {
    // Jalankan raw query untuk melihat daftar kolom aktual pada database
    const columns: any[] = await prismaService.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jemaat';
    `;
    const dbColumns = columns.map(c => c.column_name);
    console.log("Kolom aktual di database:", dbColumns);
    
    // Bandingkan dengan field yang seharusnya ada (menurut Prisma Model)
    // Berdasarkan file schema.prisma:
    const expectedColumns = [
      'id', 'nomor_induk', 'nama', 'jenis_kelamin', 'tempat_lahir', 
      'tanggal_lahir', 'status_aktif', 'status_keanggotaan', 
      'tanggal_bergabung', 'foto_url', 'catatan_khusus', 'no_hp', 
      'email', 'alamat', 'kota', 'provinsi', 'status_pernikahan', 
      'nama_pasangan', 'jumlah_anak', 'is_kepala_keluarga', 'no_kk', 
      'status_baptis', 'tanggal_baptis', 'gereja_baptis', 'status_sidi', 
      'tanggal_sidi', 'pendeta_sidi', 'pendidikan', 'pekerjaan', 
      'instansi', 'minat_pelayanan', 'pelayanan_diikuti', 
      'peran_dalam_kelompok', 'wilayah_id', 'kelompok_id', 'createdAt', 'updatedAt'
    ];
    
    const missingInDb = expectedColumns.filter(c => !dbColumns.includes(c));
    const extraInDb = dbColumns.filter(c => !expectedColumns.includes(c));
    
    console.log("Kolom yang ada di Schema Prisma tapi TIDAK ADA di Database:", missingInDb);
    console.log("Kolom ekstra di Database yang tidak ada di Schema:", extraInDb);
    
  } catch (error) {
    console.error("Error dari DB:", error);
  } finally {
    await app.close();
  }
}

bootstrap();