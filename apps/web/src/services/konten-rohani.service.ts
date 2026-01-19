import { apiClient } from './api-client';

export const artikelRenunganService = {
  findAll: () => apiClient.get('/artikel-renungan'),
  findOne: (id: string) => apiClient.get(`/artikel-renungan/${id}`),
  create: (data: any) => apiClient.post('/artikel-renungan', data),
  update: (id: string, data: any) => apiClient.patch(`/artikel-renungan/${id}`, data),
  remove: (id: string) => apiClient.delete(`/artikel-renungan/${id}`),
};

export const beritaKomselService = {
  findAll: () => apiClient.get('/berita-komsel'),
  findOne: (id: string) => apiClient.get(`/berita-komsel/${id}`),
  create: (data: any) => apiClient.post('/berita-komsel', data),
  update: (id: string, data: any) => apiClient.patch(`/berita-komsel/${id}`, data),
  remove: (id: string) => apiClient.delete(`/berita-komsel/${id}`),
};

export const buletinService = {
  findAll: () => apiClient.get('/buletin'),
  findOne: (id: string) => apiClient.get(`/buletin/${id}`),
  create: (data: any) => apiClient.post('/buletin', data),
  update: (id: string, data: any) => apiClient.patch(`/buletin/${id}`, data),
  remove: (id: string) => apiClient.delete(`/buletin/${id}`),
};

export const mediaGaleriService = {
  findAll: () => apiClient.get('/media-galeri'),
  findOne: (id: string) => apiClient.get(`/media-galeri/${id}`),
  create: (data: any) => apiClient.post('/media-galeri', data),
  update: (id: string, data: any) => apiClient.patch(`/media-galeri/${id}`, data),
  remove: (id: string) => apiClient.delete(`/media-galeri/${id}`),
};
