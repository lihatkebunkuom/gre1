import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, User, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/services/api-client";

interface Jemaat {
  id: string;
  nomorInduk: string;
  nama: string;
  jenisKelamin: "L" | "P";
  statusAktif: boolean;
  noHp: string;
  wilayah?: { nama: string };
  kelompok?: { nama: string };
  fotoUrl?: string;
}

const JemaatListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data from API
  const { data: jemaatList, isLoading } = useQuery({
    queryKey: ['jemaat', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<Jemaat[]>(`/jemaat${searchQuery ? `?search=${searchQuery}` : ''}`);
      return response as unknown as Jemaat[]; // apiClient interceptor returns response.data
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/jemaat/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jemaat'] });
      toast.success("Data jemaat berhasil dihapus");
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
      <PageHeader title="Data Jemaat" description="Database lengkap anggota jemaat gereja.">
        <Link to="/jemaat/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Jemaat</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau no induk..." 
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
              <TableHead className="w-[50px]">Foto</TableHead>
              <TableHead>Info Jemaat</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
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
            ) : jemaatList?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data jemaat.</TableCell></TableRow>
            ) : (
              jemaatList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={item.fotoUrl ? item.fotoUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.nama}`} 
                        alt={item.nama}
                        className="object-cover"
                      />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.nama}</span>
                      <span className="text-xs text-muted-foreground">{item.nomorInduk} • {item.noHp || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                  <TableCell>
                    {item.statusAktif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Tidak Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/jemaat/edit/${item.id}`)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Jemaat"
                        description={`Hapus data ${item.nama}? Data yang dihapus tidak dapat dikembalikan.`}
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

export default JemaatListPage;