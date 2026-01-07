import { apiClient } from "@/services/api-client";
import { Jemaat } from "../types";
import { PaginatedResponse } from "@/types";

export const getJemaatList = async (page = 1, limit = 10) => {
  // Contoh pemanggilan API
  // return apiClient.get<PaginatedResponse<Jemaat>>(`/jemaat?page=${page}&limit=${limit}`);
  
  // Mock Data sementara
  return new Promise<PaginatedResponse<Jemaat>>((resolve) => {
    setTimeout(() => {
      resolve({
        status: true,
        message: "Success",
        data: Array(5).fill(null).map((_, i) => ({
          id: `${i}`,
          nomorAnggota: `GM-00${i+1}`,
          namaLengkap: `Jemaat Contoh ${i+1}`,
          jenisKelamin: i % 2 === 0 ? 'L' : 'P',
          tanggalLahir: '1990-01-01',
          alamat: 'Jl. Contoh No. 1',
          statusBaptis: true,
          statusPernikahan: 'MENIKAH',
          noTelepon: '08123456789'
        })),
        meta: {
          page, limit, total: 50, totalPages: 5
        }
      });
    }, 500);
  });
};