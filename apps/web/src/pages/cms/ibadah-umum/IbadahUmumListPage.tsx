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

interface IbadahUmum {
  id: string;
  judul?: string;
  waktuMulai?: string;
  lokasi?: string;
  keterangan?: string;
  createdAt: string;
}

const IbadahUmumListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ibadahList, isLoading } = useQuery({
    queryKey: ['ibadah-umum', searchQuery],
    queryFn: async () => {
      return await apiClient.get<IbadahUmum[]>(`/ibadah-umum${searchQuery ? `?search=${searchQuery}` : ''}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/ibadah-umum/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-umum'] });
      toast.success("Data ibadah umum berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Ibadah Umum" description="Manajemen jadwal ibadah umum gereja.">
        <Link to="/ibadah-umum/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Ibadah</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul atau lokasi..." 
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
              <TableHead className="w-[80px]">Icon</TableHead>
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
            ) : ibadahList?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada data ibadah.</TableCell></TableRow>
            ) : (
              ibadahList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-base">{item.judul || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">
                        {item.waktuMulai || '-'} WIB
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.lokasi || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/ibadah-umum/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
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

export default IbadahUmumListPage;