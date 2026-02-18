import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Loader2, Home } from "lucide-react";
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

interface Pepanthan {
  id: string;
  namaPepanthan: string;
  alamat?: string;
  keterangan?: string;
  createdAt: string;
}

const PepanthanListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pepanthanList, isLoading } = useQuery({
    queryKey: ['pepanthan', searchQuery],
    queryFn: async () => {
      return await apiClient.get<Pepanthan[]>(`/pepanthan${searchQuery ? `?search=${searchQuery}` : ''}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pepanthan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pepanthan'] });
      toast.success("Data pepanthan berhasil dihapus");
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
      <PageHeader title="Daftar Pepanthan" description="Manajemen data pepanthan / cabang gereja.">
        <Link to="/pepanthan/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Pepanthan</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama pepanthan..." 
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
              <TableHead>Nama Pepanthan</TableHead>
              <TableHead>Alamat</TableHead>
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
            ) : pepanthanList?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Tidak ada data pepanthan.</TableCell></TableRow>
            ) : (
              pepanthanList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit">
                        <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-base">{item.namaPepanthan}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.alamat || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/pepanthan/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Pepanthan"
                        description={`Hapus data ${item.namaPepanthan}?`}
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

export default PepanthanListPage;
