import { apiClient } from './api-client';

export interface PenugasanPayload {
  pelayanan_id: string;
  petugas_id: string;
  peran_dalam_pelayanan: string;
  tanggal_mulai_penugasan: string; // YYYY-MM-DD
  tanggal_selesai_penugasan?: string;
  jadwal_tugas?: string;
  status_penugasan?: string;
  evaluasi_kinerja?: string;
  catatan_penugasan?: string;
}

export const PenugasanService = {
  getAll: () => apiClient.get('/penugasan'),
  getOne: (id: string) => apiClient.get(`/penugasan/${id}`),
  create: (data: PenugasanPayload) => apiClient.post('/penugasan', data),
  update: (id: string, data: Partial<PenugasanPayload>) => apiClient.patch(`/penugasan/${id}`, data),
  delete: (id: string) => apiClient.delete(`/penugasan/${id}`),
};
