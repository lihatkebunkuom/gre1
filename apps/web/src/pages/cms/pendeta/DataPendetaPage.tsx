import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { apiClient } from "@/services/api-client";
import { EmptyState } from "@/components/common/EmptyState";

const DataPendetaPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: pendetaList, isLoading } = useQuery({
    queryKey: ['pendeta'],
    queryFn: () => apiClient.get('/pendeta'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pendeta/${id}`),
    onSuccess: () => {
      toast.success("Data pendeta berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ['pendeta'] });
    },
    onError: () => {
      toast.error("Gagal menghapus data pendeta");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredData = Array.isArray(pendetaList) 
    ? pendetaList.filter((item: any) => 
        item.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
        item.jabatanPelayanan.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Pendeta" description="Kelola data hamba tuhan dan staf rohani gereja.">
        <Button onClick={() => navigate("/pendeta/create")}><Plus className="mr-2 h-4 w-4" /> Tambah Pendeta</Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau jabatan..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nama & Gelar</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">Memuat data...</TableCell></TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data pendeta ditemukan.</TableCell></TableRow>
            ) : (
              filteredData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.fotoPendeta} />
                      <AvatarFallback>{item.namaLengkap.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.namaLengkap} {item.gelar && `, ${item.gelar}`}</span>
                      <span className="text-xs text-muted-foreground">{item.nomorIndukPendeta || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {item.jabatanPelayanan.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground gap-1">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.noHandphone}</span>
                      {item.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.statusAktif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Non-Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/pendeta/edit/${item.id}`)}><Edit className="mr-2 h-4 w-4" /> Edit Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                           <ConfirmDialog 
                              trigger={<div className="flex items-center w-full cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Hapus</div>}
                              onConfirm={() => handleDelete(item.id)}
                              variant="destructive"
                              title="Hapus Data"
                              description="Data ini akan dihapus permanen."
                           />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default DataPendetaPage;