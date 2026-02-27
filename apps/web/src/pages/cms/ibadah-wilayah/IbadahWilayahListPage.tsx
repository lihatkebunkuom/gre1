import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { apiClient } from "@/services/api-client";

interface Wilayah {
  nama: string;
}

interface IbadahWilayah {
  id: string;
  judul: string;
  waktu: string;
  lokasi?: string;
  keterangan?: string;
  wilayah: Wilayah;
  createdAt: string;
}

const IbadahWilayahListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ibadahWilayahList, isLoading } = useQuery({
    queryKey: ['ibadah-wilayah', searchQuery],
    queryFn: async () => {
      return await apiClient.get<IbadahWilayah[]>(`/ibadah-wilayah${searchQuery ? `?search=${searchQuery}` : ''}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/ibadah-wilayah/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-wilayah'] });
      toast.success("Jadwal ibadah wilayah berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const formatWaktu = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Ibadah Wilayah" description="Manajemen jadwal ibadah rutin di setiap wilayah.">
        <Link to="/ibadah-wilayah/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Ibadah Wilayah</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul ibadah..." 
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
              <TableHead>Wilayah</TableHead>
              <TableHead>Judul Ibadah</TableHead>
              <TableHead>Waktu Pelaksanaan</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : ibadahWilayahList?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada jadwal ibadah wilayah.</TableCell></TableRow>
            ) : (
              ibadahWilayahList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-sm">{item.wilayah?.nama || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{item.judul}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{formatWaktu(item.waktu)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.lokasi || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate block">{item.keterangan || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/ibadah-wilayah/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Ibadah Wilayah"
                        description={`Hapus jadwal ${item.judul} di ${item.wilayah?.nama}?`}
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

export default IbadahWilayahListPage;
