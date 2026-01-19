import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, Filter, Briefcase, Users, Loader2, MoreHorizontal, Calendar, Info } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { apiClient } from "@/services/api-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  deskripsi_pelayanan?: string;
}

const DaftarPelayananPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data
  const { data: pelayananList, isLoading } = useQuery({
    queryKey: ['pelayanan', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<any>(`/pelayanan${searchQuery ? `?search=${searchQuery}` : ''}`);
      // The API might return the array directly or wrapped in a data property
      return Array.isArray(response) ? response : response.data || [];
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

  const filteredData = pelayananList || [];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Daftar Pelayanan" description="Kelola unit dan divisi pelayanan gereja secara terorganisir.">
        <Link to="/pelayan/create">
           <Button className="shadow-sm transition-all hover:shadow-md"><Plus className="mr-2 h-4 w-4" /> Tambah Pelayanan</Button>
        </Link>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari unit pelayanan (musik, multimedia...)" 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-primary/20" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-11 px-4 gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <div className="bg-muted/50 p-1 rounded-lg flex gap-1 border">
             <Button variant="ghost" size="sm" className="h-8 px-2 bg-background shadow-sm">Grid</Button>
             <Button variant="ghost" size="sm" className="h-8 px-2">Table</Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Menyiapkan data pelayanan...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
               <Briefcase className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">Tidak ada data pelayanan</p>
              <p className="text-sm text-muted-foreground max-w-xs">Mulai dengan menambahkan unit pelayanan baru atau periksa kata kunci pencarian Anda.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Lihat Semua Data</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
              <div className="h-1.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 font-medium bg-primary/10 text-primary border-none">
                    {item.kategori_pelayanan}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/pelayan/edit/${item.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Detail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Unit</div>}
                          onConfirm={() => handleDelete(item.id)}
                          variant="destructive"
                          title="Hapus Pelayanan"
                          description={`Yakin ingin menghapus ${item.nama_pelayanan}?`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{item.nama_pelayanan}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {item.deskripsi_pelayanan || "Unit pelayanan aktif untuk mendukung kegiatan gereja."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                   <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Koordinator</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary" /> {item.koordinator_pelayanan}
                      </span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Kebutuhan</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5 text-primary" /> {item.jumlah_kebutuhan_personel} Personel
                      </span>
                   </div>
                </div>
                
                {item.jadwal_pelayanan && (
                  <div className="bg-background/50 p-2.5 rounded-lg border flex items-center gap-2.5 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-muted-foreground line-clamp-1">{item.jadwal_pelayanan}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center border-t bg-muted/30 py-3">
                 <div className="flex items-center gap-2">
                    {item.status_pelayanan === "AKTIF" ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-700">Aktif</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Non-Aktif</span>
                      </div>
                    )}
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 text-primary font-semibold hover:bg-primary/5 hover:text-primary" onClick={() => navigate(`/pelayan/edit/${item.id}`)}>
                    Lihat Detail
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarPelayananPage;