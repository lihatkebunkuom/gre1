import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Loader2, Calendar, Users } from "lucide-react";
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

interface IbadahKelompok {
  id: string;
  judul?: string;
  waktuMulai?: string;
  tanggalkelompok?: string;
  lokasi?: string;
  keterangan?: string;
  kelompokId: string;
  kelompok: {
    nama: string;
  };
  createdAt: string;
}

const IbadahKelompokListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['ibadah-kelompok'],
    queryFn: async () => {
      return await apiClient.get<any>('/ibadah-kelompok');
    }
  });

  const ibadahList = Array.isArray(apiResponse) 
    ? apiResponse 
    : (apiResponse as any)?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/ibadah-kelompok/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-kelompok'] });
      toast.success("Data ibadah kelompok berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredList = (ibadahList as IbadahKelompok[])?.filter(item => {
    const search = searchQuery.toLowerCase();
    return (
      item.judul?.toLowerCase().includes(search) || 
      item.kelompok?.nama?.toLowerCase().includes(search) ||
      item.lokasi?.toLowerCase().includes(search)
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

  const formatJam = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return format(date, "HH:mm");
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Ibadah Kelompok" description="Manajemen jadwal ibadah per kelompok jemaat.">
        <Link to="/ibadah-kelompok/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Ibadah</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari kelompok, judul atau lokasi..." 
            className="pl-9" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kelompok</TableHead>
              <TableHead>Judul Ibadah</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredList?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada data ibadah kelompok.</TableCell></TableRow>
            ) : (
              filteredList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold">{item.kelompok?.nama}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{item.judul || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {item.waktuMulai || '-'} WIB
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.lokasi || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/ibadah-kelompok/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Ibadah"
                        description={`Hapus data ibadah ${item.judul || ''}?`}
                      />
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

export default IbadahKelompokListPage;
