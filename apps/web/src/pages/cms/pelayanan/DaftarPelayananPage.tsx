import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Briefcase, Users, Loader2, MoreHorizontal } from "lucide-react";
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
import { apiClient } from "@/services/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Pelayanan {
  id: string;
  nama_pelayanan: string;
  kategori_pelayanan: string;
  koordinator_pelayanan: string;
  jumlah_kebutuhan_personel: number;
  status_pelayanan: string;
  jadwal_pelayanan?: string;
}

const DaftarPelayananPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data
  const { data: pelayananList, isLoading } = useQuery({
    queryKey: ['pelayanan', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<Pelayanan[]>(`/pelayanan${searchQuery ? `?search=${searchQuery}` : ''}`);
      return response as unknown as Pelayanan[];
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pelayanan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pelayanan'] });
      toast.success("Unit pelayanan berhasil dihapus");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Pelayanan" description="Master data jenis dan unit pelayanan di gereja.">
        <Link to="/pelayan/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Tambah Pelayanan</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari pelayanan..." 
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
              <TableHead>Nama Pelayanan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Koordinator</TableHead>
              <TableHead className="text-center">Kebutuhan</TableHead>
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
            ) : pelayananList?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data pelayanan.</TableCell></TableRow>
            ) : (
              pelayananList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center gap-2">
                        <Briefcase className="h-3 w-3 text-primary" /> 
                        {item.nama_pelayanan}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{item.kategori_pelayanan}</Badge>
                  </TableCell>
                  <TableCell>{item.koordinator_pelayanan}</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                      <Users className="h-3 w-3" /> {item.jumlah_kebutuhan_personel}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.status_pelayanan === "AKTIF" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Non-Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/pelayan/edit/${item.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Pelayanan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                             <ConfirmDialog 
                                trigger={<div className="flex items-center w-full cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Hapus</div>}
                                onConfirm={() => handleDelete(item.id)}
                                variant="destructive"
                                title="Hapus Pelayanan"
                                description={`Hapus ${item.nama_pelayanan}? Data yang dihapus tidak dapat dikembalikan.`}
                             />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default DaftarPelayananPage;