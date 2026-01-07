import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, Briefcase, Users, Search, Filter } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

// --- Schema ---
const formSchema = z.object({
  kode_pelayanan: z.string().min(1, "Kode wajib diisi"),
  nama_pelayanan: z.string().min(3, "Nama pelayanan minimal 3 karakter"),
  kategori_pelayanan: z.string().min(1, "Pilih kategori"),
  deskripsi_pelayanan: z.string().optional(),
  koordinator_pelayanan: z.string().min(1, "Pilih koordinator"),
  jumlah_kebutuhan_personel: z.coerce.number().min(0),
  status_pelayanan: z.string().default("AKTIF"),
  jadwal_pelayanan: z.string().optional(),
  catatan_pelayanan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Pelayanan extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Pelayanan[] = [
  { 
    id: "1", kode_pelayanan: "MIN-01", nama_pelayanan: "Tim Musik & Pujian", kategori_pelayanan: "Musik", 
    deskripsi_pelayanan: "Melayani pujian penyembahan ibadah raya.", koordinator_pelayanan: "Sdr. David", 
    jumlah_kebutuhan_personel: 15, status_pelayanan: "AKTIF", jadwal_pelayanan: "Minggu, 07:00 & 10:00", catatan_pelayanan: "" 
  },
  { 
    id: "2", kode_pelayanan: "MIN-02", nama_pelayanan: "Multimedia & Broadcasting", kategori_pelayanan: "Multimedia", 
    deskripsi_pelayanan: "Mengelola visual, sound, dan live streaming.", koordinator_pelayanan: "Sdr. Kevin", 
    jumlah_kebutuhan_personel: 8, status_pelayanan: "AKTIF", jadwal_pelayanan: "Setiap Ibadah", catatan_pelayanan: "Butuh upgrade PC" 
  },
  { 
    id: "3", kode_pelayanan: "MIN-03", nama_pelayanan: "Sekolah Minggu", kategori_pelayanan: "Pendidikan", 
    deskripsi_pelayanan: "Mendidik anak-anak jemaat.", koordinator_pelayanan: "Ibu Sarah", 
    jumlah_kebutuhan_personel: 20, status_pelayanan: "AKTIF", jadwal_pelayanan: "Minggu, 08:00", catatan_pelayanan: "" 
  },
];

const KATEGORI_OPTIONS = ["Ibadah", "Musik", "Multimedia", "Diakonia", "Pendidikan", "Administrasi", "Keamanan", "Lainnya"];

const DaftarPelayananPage = () => {
  const [data, setData] = useState<Pelayanan[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_pelayanan: "", nama_pelayanan: "", kategori_pelayanan: "", deskripsi_pelayanan: "",
      koordinator_pelayanan: "", jumlah_kebutuhan_personel: 0, status_pelayanan: "AKTIF",
      jadwal_pelayanan: "", catatan_pelayanan: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_pelayanan: "", nama_pelayanan: "", kategori_pelayanan: "", deskripsi_pelayanan: "",
      koordinator_pelayanan: "", jumlah_kebutuhan_personel: 0, status_pelayanan: "AKTIF",
      jadwal_pelayanan: "", catatan_pelayanan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Pelayanan) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Pelayanan berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data pelayanan diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Pelayanan baru ditambahkan");
    }
    setIsDialogOpen(false);
  };

  const filteredData = data.filter((item) =>
    item.nama_pelayanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kode_pelayanan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Pelayanan" description="Master data jenis dan unit pelayanan di gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Pelayanan</Button>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari pelayanan atau kode..." 
            className="pl-9" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Info Pelayanan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Koordinator</TableHead>
              <TableHead className="text-center">Kebutuhan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data pelayanan.</TableCell></TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center gap-2"><Briefcase className="h-3 w-3 text-muted-foreground" /> {item.nama_pelayanan}</span>
                      <span className="text-xs text-muted-foreground font-mono">{item.kode_pelayanan}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.kategori_pelayanan}</Badge></TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Pelayanan"
                        description={`Hapus ${item.nama_pelayanan}? Data yang dihapus tidak dapat dikembalikan.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Pelayanan" : "Tambah Pelayanan Baru"}</DialogTitle>
            <DialogDescription>Definisikan jenis pelayanan baru di gereja.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_pelayanan" render={({ field }) => (
                  <FormItem><FormLabel>Kode Pelayanan</FormLabel><FormControl><Input placeholder="Cth: MIN-01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="kategori_pelayanan" render={({ field }) => (
                  <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="nama_pelayanan" render={({ field }) => (
                <FormItem><FormLabel>Nama Pelayanan</FormLabel><FormControl><Input placeholder="Cth: Tim Musik & Pujian" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="koordinator_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel>Koordinator</FormLabel><FormControl><Input placeholder="Nama Koordinator" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="jumlah_kebutuhan_personel" render={({ field }) => (
                   <FormItem><FormLabel>Kebutuhan Personel</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              <FormField control={form.control} name="deskripsi_pelayanan" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="jadwal_pelayanan" render={({ field }) => (
                <FormItem><FormLabel>Jadwal Rutin</FormLabel><FormControl><Input placeholder="Cth: Setiap Minggu" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="TIDAK_AKTIF">Tidak Aktif</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="catatan_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan tambahan..." {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DaftarPelayananPage;