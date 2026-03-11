import { apiClient } from "./api-client";

export interface TentangGerejaData {
  id?: string;
  sejarah: string;
  visiMisi: string;
  susunanMajelis: string;
  susunanPengurusKomisi: string;
}

export const tentangGerejaService = {
  get: () => apiClient.get<TentangGerejaData>("/tentang-gereja"),
  upsert: (data: TentangGerejaData) => apiClient.post<TentangGerejaData>("/tentang-gereja", data),
};
