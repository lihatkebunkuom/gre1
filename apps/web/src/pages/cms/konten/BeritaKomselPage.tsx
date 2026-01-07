import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, Search, Newspaper } from "lucide-react";
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
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cn } from "@/lib/utils";

// --- Schema & Types ---
const formSchema = z.object({
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  deskripsi: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
});

type FormValues = z.infer<typeof formSchema>;

interface BeritaKomsel extends FormValues {
  id: string;
}

// --- Mock Data ---
const MOCK_DATA: BeritaKomsel[] = [
  {
    id: "1",
    title: "Kunjungan Kasih Wilayah A",
    tanggal: new Date("2023-11-20"),
    deskripsi: "Komsel Wilayah A akan mengadakan kunjungan kasih ke panti asuhan.",
  },
  {
    id: "2",
    title: "Perubahan Jadwal Komsel Youth",
    tanggal: new Date("2023-11-25"),
    deskripsi: "Dikarenakan ada acara gereja, jadwal komsel Youth digeser ke hari Sabtu.",
  },
];

const BeritaKomselPage = () => {
  const [data, setData] = useState<BeritaKomsel[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", deskripsi: "", tanggal: new Date() },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", deskripsi: "", tanggal: new Date() });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: BeritaKomsel) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Berita berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Berita berhasil diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Berita berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Berita Komsel" description="Informasi dan pengumuman seputar kegiatan komunitas sel.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Berita</Button>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari judul berita..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Deskripsi Singkat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-blue-500" /> {item.title}
                  </TableCell>
                  <TableCell>{format(item.tanggal, "dd MMM yyyy", { locale: localeId })}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => handleDelete(item.id)} variant="destructive" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Berita" : "Tambah Berita Komsel"}</DialogTitle>
            <DialogDescription>Bagikan informasi terbaru kepada anggota komsel.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Judul Berita</FormLabel><FormControl><Input placeholder="Contoh: Jadwal Retreat..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tanggal" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="deskripsi" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea placeholder="Tuliskan detail berita di sini..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeritaKomselPage;