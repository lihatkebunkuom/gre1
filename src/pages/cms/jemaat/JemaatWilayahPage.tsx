import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, Map, Users } from "lucide-react";
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const formSchema = z.object({
  nama_wilayah: z.string().min(1, "Nama wilayah wajib diisi"),
  nama_kelompok: z.string().min(1, "Nama kelompok wajib diisi"),
  ketua_kelompok: z.string().min(3, "Nama ketua minimal 3 karakter"),
  jadwal_pertemuan: z.string().optional(),
  catatan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Wilayah extends FormValues { 
  id: string; 
  jumlah_anggota: number; 
}

const MOCK_DATA: Wilayah[] = [
  { id: "1", nama_wilayah: "Jakarta Barat", nama_kelompok: "Komsel Efrata", ketua_kelompok: "Bpk. Yohanes", jumlah_anggota: 12, jadwal_pertemuan: "Jumat, 19:00", catatan: "Fokus pemuridan" },
  { id: "2", nama_wilayah: "Jakarta Selatan", nama_kelompok: "Komsel Sion", ketua_kelompok: "Ibu Maria", jumlah_anggota: 8, jadwal_pertemuan: "Kamis, 18:30", catatan: "" },
];

const JemaatWilayahPage = () => {
  const [data, setData] = useState<Wilayah[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nama_wilayah: "", nama_kelompok: "", ketua_kelompok: "", jadwal_pertemuan: "", catatan: "" },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ nama_wilayah: "", nama_kelompok: "", ketua_kelompok: "", jadwal_pertemuan: "", catatan: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Wilayah) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Data wilayah dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...item, ...values } : item));
      toast.success("Data wilayah diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9), jumlah_anggota: 0 }, ...prev]);
      toast.success("Wilayah baru ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kelompok & Wilayah" description="Manajemen data wilayah pelayanan dan kelompok sel (Komsel).">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Wilayah</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wilayah</TableHead>
              <TableHead>Nama Kelompok</TableHead>
              <TableHead>Ketua / Gembala</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead className="text-center">Anggota</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium flex items-center gap-2"><Map className="h-4 w-4 text-muted-foreground" /> {item.nama_wilayah}</TableCell>
                <TableCell>{item.nama_kelompok}</TableCell>
                <TableCell>{item.ketua_kelompok}</TableCell>
                <TableCell>{item.jadwal_pertemuan || "-"}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-xs font-medium">
                    <Users className="h-3 w-3" /> {item.jumlah_anggota}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                    <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => handleDelete(item.id)} variant="destructive" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Data" : "Tambah Wilayah/Kelompok"}</DialogTitle>
            <DialogDescription>Kelola data pembagian wilayah pelayanan jemaat.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nama_wilayah" render={({ field }) => (
                  <FormItem><FormLabel>Nama Wilayah</FormLabel><FormControl><Input placeholder="Cth: Jakarta Pusat" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nama_kelompok" render={({ field }) => (
                  <FormItem><FormLabel>Nama Kelompok</FormLabel><FormControl><Input placeholder="Cth: Komsel A1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="ketua_kelompok" render={({ field }) => (
                <FormItem><FormLabel>Ketua Kelompok</FormLabel><FormControl><Input placeholder="Nama Ketua" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="jadwal_pertemuan" render={({ field }) => (
                <FormItem><FormLabel>Jadwal Pertemuan</FormLabel><FormControl><Input placeholder="Cth: Setiap Jumat, 19:00 WIB" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="catatan" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JemaatWilayahPage;