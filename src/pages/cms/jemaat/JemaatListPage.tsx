import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, User, Filter } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data Type
interface Jemaat {
  id: string;
  nomor_induk: string;
  nama_lengkap: string;
  jenis_kelamin: "L" | "P";
  wilayah: string;
  kelompok: string;
  status_aktif: boolean;
  no_hp: string;
}

const MOCK_DATA: Jemaat[] = [
  { id: "1", nomor_induk: "GM-001", nama_lengkap: "Andi Pratama", jenis_kelamin: "L", wilayah: "Jakarta Pusat", kelompok: "Efrata", status_aktif: true, no_hp: "08123456789" },
  { id: "2", nomor_induk: "GM-002", nama_lengkap: "Siti Nurhaliza", jenis_kelamin: "P", wilayah: "Jakarta Barat", kelompok: "Sion", status_aktif: true, no_hp: "08987654321" },
  { id: "3", nomor_induk: "GM-003", nama_lengkap: "Budi Santoso", jenis_kelamin: "L", wilayah: "Jakarta Selatan", kelompok: "Bethel", status_aktif: false, no_hp: "08111222333" },
];

const JemaatListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Jemaat[]>(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Data jemaat dihapus");
  };

  const filteredData = data.filter((item) =>
    item.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nomor_induk.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <TableHead>Wilayah / Komsel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data jemaat.</TableCell></TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.nama_lengkap}`} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.nama_lengkap}</span>
                      <span className="text-xs text-muted-foreground">{item.nomor_induk} • {item.no_hp}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{item.wilayah}</span>
                      <span className="text-xs text-muted-foreground">{item.kelompok}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.status_aktif ? (
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
                        description={`Hapus data ${item.nama_lengkap}? Data yang dihapus tidak dapat dikembalikan.`}
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