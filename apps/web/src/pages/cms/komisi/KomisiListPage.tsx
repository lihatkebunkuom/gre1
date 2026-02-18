import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Loader2, LayoutGrid } from "lucide-react";
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

interface Komisi {
  id: string;
  namaKomisi: string;
  keterangan?: string;
  createdAt: string;
}

const KomisiListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: komisiList, isLoading } = useQuery({
    queryKey: ['komisi', searchQuery],
    queryFn: async () => {
      return await apiClient.get<Komisi[]>(`/komisi${searchQuery ? `?search=${searchQuery}` : ''}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/komisi/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['komisi'] });
      toast.success("Data komisi berhasil dihapus");
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
      <PageHeader title="Daftar Komisi" description="Manajemen komisi dan kategori pelayanan gereja.">
        <Link to="/komisi/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Komisi</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama komisi..." 
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
              <TableHead>Nama Komisi</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : komisiList?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Tidak ada data komisi.</TableCell></TableRow>
            ) : (
              komisiList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <LayoutGrid className="h-5 w-5 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-base">{item.namaKomisi}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.keterangan || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/komisi/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Komisi"
                        description={`Hapus data ${item.namaKomisi}?`}
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

export default KomisiListPage;
