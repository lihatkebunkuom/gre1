import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Loader2, BookOpen, MapPin, Users, Home, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { apiClient } from "@/services/api-client";
import { Badge } from "@/components/ui/badge";

interface PendalamanAlkitab {
  id: string;
  judul?: string;
  waktuMulai?: string;
  tanggalpa?: string;
  lokasi?: string;
  keterangan?: string;
  pepanthan?: { namaPepanthan: string };
  wilayah?: { nama: string };
  kelompok?: { nama: string };
  komisi?: { namaKomisi: string };
}

const PendalamanAlkitabListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['pendalaman-alkitab'],
    queryFn: async () => {
      return await apiClient.get<any>('/pendalaman-alkitab');
    }
  });

  const paList = Array.isArray(apiResponse) 
    ? apiResponse 
    : (apiResponse as any)?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pendalaman-alkitab/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendalaman-alkitab'] });
      toast.success("Data pendalaman alkitab berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    }
  });

  const filteredList = (paList as PendalamanAlkitab[])?.filter(item => {
    const search = searchQuery.toLowerCase();
    return (
      item.judul?.toLowerCase().includes(search) || 
      item.lokasi?.toLowerCase().includes(search) ||
      item.pepanthan?.namaPepanthan.toLowerCase().includes(search) ||
      item.wilayah?.nama.toLowerCase().includes(search) ||
      item.kelompok?.nama.toLowerCase().includes(search) ||
      item.komisi?.namaKomisi.toLowerCase().includes(search)
    );
  });

  const formatWaktu = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return format(date, "EEEE, d MMMM yyyy", { locale: idLocale });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pendalaman Alkitab" description="Manajemen jadwal pendalaman alkitab (PA).">
        <Link to="/pendalaman-alkitab/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah PA</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul, lokasi, atau kelompok..." 
            className="pl-9" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target PA</TableHead>
              <TableHead>Judul & Waktu</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
            ) : filteredList?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Tidak ada data PA.</TableCell></TableRow>
            ) : (
              filteredList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-1">
                      {item.pepanthan && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                          <Home className="h-3 w-3" /> {item.pepanthan.namaPepanthan}
                        </div>
                      )}
                      {item.wilayah && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                          <MapPin className="h-3 w-3" /> {item.wilayah.nama}
                        </div>
                      )}
                      {item.kelompok && (
                        <div className="flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 w-fit px-2 py-0.5 rounded-full">
                          <Users className="h-3 w-3" /> {item.kelompok.nama}
                        </div>
                      )}
                      {item.komisi && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 w-fit px-2 py-0.5 rounded-full">
                          <LayoutGrid className="h-3 w-3" /> {item.komisi.namaKomisi}
                        </div>
                      )}
                      {!item.pepanthan && !item.wilayah && !item.kelompok && !item.komisi && (
                        <Badge variant="outline">Umum</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{item.judul || '-'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.tanggalpa ? format(new Date(item.tanggalpa), "EEEE, d MMM yyyy", { locale: idLocale }) : '-'}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
                          {item.waktuMulai || '-'} WIB
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm">{item.lokasi || '-'}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/pendalaman-alkitab/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate(item.id)} variant="destructive" title="Hapus PA" description={`Hapus data PA ${item.judul || ''}?`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendalamanAlkitabListPage;
