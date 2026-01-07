import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, FileText, Eye, BookOpen } from "lucide-react";
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
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// --- Schema ---
const formSchema = z.object({
  kode_konten: z.string().min(1, "Kode wajib diisi"),
  jenis_konten: z.string().min(1, "Pilih jenis konten"),
  judul_konten: z.string().min(3, "Judul minimal 3 karakter"),
  sub_judul: z.string().optional(),
  penulis: z.string().min(1, "Pilih penulis"),
  tanggal_terbit: z.date({ required_error: "Tanggal terbit wajib" }),
  kategori_konten: z.string().min(1, "Pilih kategori"),
  ayat_alkitab: z.string().optional(),
  isi_konten: z.string().min(10, "Isi konten minimal 10 karakter"),
  ringkasan_konten: z.string().min(5, "Ringkasan wajib diisi"),
  gambar_sampul: z.string().optional(),
  status_publikasi: z.string().default("DRAFT"),
  tag: z.string().optional(),
  jumlah_dibaca: z.coerce.number().default(0),
  catatan_editor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Artikel extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Artikel[] = [
  { 
    id: "1", kode_konten: "ART-001", jenis_konten: "Renungan", judul_konten: "Hidup yang Berbuah", 
    sub_judul: "Renungan Harian", penulis: "Pdt. Andi Wijaya", tanggal_terbit: new Date("2023-11-20"), 
    kategori_konten: "Iman", ayat_alkitab: "Yohanes 15:5", 
    isi_konten: "Isi renungan lengkap...", ringkasan_konten: "Pentingnya tinggal di dalam Kristus.", 
    gambar_sampul: "", status_publikasi: "TERBIT", tag: "buah, iman, kristus", jumlah_dibaca: 125, catatan_editor: "" 
  },
  { 
    id: "2", kode_konten: "ART-002", jenis_konten: "Artikel", judul_konten: "Sejarah Gereja Lokal", 
    sub_judul: "", penulis: "Sdr. Budi", tanggal_terbit: new Date("2023-10-15"), 
    kategori_konten: "Pelayanan", ayat_alkitab: "", 
    isi_konten: "Sejarah panjang...", ringkasan_konten: "Mengenal asal usul gereja.", 
    gambar_sampul: "", status_publikasi: "ARSIP", tag: "sejarah, gereja", jumlah_dibaca: 450, catatan_editor: "Perlu update data tahun" 
  },
];

const PENULIS_OPTIONS = ["Pdt. Andi Wijaya", "Pdt. Budi", "Sdr. Kevin", "Ibu Sarah"];
const KATEGORI_OPTIONS = ["Iman", "Doa", "Keluarga", "Pemuda", "Pelayanan", "Kesaksian"];

const ArtikelRenunganPage = () => {
  const [data, setData] = useState<Artikel[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_konten: "", jenis_konten: "Renungan", judul_konten: "", sub_judul: "",
      penulis: "", tanggal_terbit: new Date(), kategori_konten: "", ayat_alkitab: "",
      isi_konten: "", ringkasan_konten: "", gambar_sampul: "", status_publikasi: "DRAFT",
      tag: "", jumlah_dibaca: 0, catatan_editor: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_konten: `ART-${Math.floor(Math.random() * 1000)}`,
      jenis_konten: "Renungan", judul_konten: "", sub_judul: "",
      penulis: "", tanggal_terbit: new Date(), kategori_konten: "", ayat_alkitab: "",
      isi_konten: "", ringkasan_konten: "", gambar_sampul: "", status_publikasi: "DRAFT",
      tag: "", jumlah_dibaca: 0, catatan_editor: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Artikel) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Konten berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Konten diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Konten diterbitkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Artikel & Renungan" description="Kelola tulisan rohani, renungan harian, dan artikel gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tulis Konten</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.judul_konten}</span>
                    <span className="text-xs text-muted-foreground truncate w-48">{item.sub_judul}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{item.jenis_konten}</span>
                  </div>
                </TableCell>
                <TableCell>{item.penulis}</TableCell>
                <TableCell>{format(item.tanggal_terbit, "dd MMM yyyy", { locale: localeId })}</TableCell>
                <TableCell>
                  <Badge variant={item.status_publikasi === "TERBIT" ? "default" : item.status_publikasi === "DRAFT" ? "secondary" : "outline"}>
                    {item.status_publikasi}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Preview"><Eye className="h-4 w-4 text-muted-foreground" /></Button>
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Konten" : "Tulis Konten Baru"}</DialogTitle>
            <DialogDescription>Buat artikel atau renungan untuk jemaat.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Metadata */}
                <div className="md:col-span-1 space-y-4">
                  <FormField control={form.control} name="gambar_sampul" render={({ field }) => (
                    <FormItem><FormLabel>Gambar Sampul</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="kode_konten" render={({ field }) => (
                    <FormItem><FormLabel>Kode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="jenis_konten" render={({ field }) => (
                    <FormItem><FormLabel>Jenis</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Artikel">Artikel</SelectItem><SelectItem value="Renungan">Renungan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="kategori_konten" render={({ field }) => (
                    <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status_publikasi" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="TERBIT">Terbit</SelectItem><SelectItem value="ARSIP">Arsip</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem><FormLabel>Tag / Kata Kunci</FormLabel><FormControl><Input placeholder="iman, doa (pisahkan koma)" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Column 2 & 3: Main Content */}
                <div className="md:col-span-2 space-y-4">
                  <FormField control={form.control} name="judul_konten" render={({ field }) => (
                    <FormItem><FormLabel>Judul Konten</FormLabel><FormControl><Input className="text-lg font-semibold" placeholder="Judul Utama..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="sub_judul" render={({ field }) => (
                      <FormItem><FormLabel>Sub Judul</FormLabel><FormControl><Input placeholder="Opsional" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ayat_alkitab" render={({ field }) => (
                      <FormItem><FormLabel>Ayat Alkitab</FormLabel><FormControl><Input placeholder="Cth: Yohanes 3:16" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="penulis" render={({ field }) => (
                       <FormItem><FormLabel>Penulis</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Penulis" /></SelectTrigger></FormControl><SelectContent>{PENULIS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                     )} />
                     <FormField control={form.control} name="tanggal_terbit" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Tanggal Terbit</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                  </div>

                  <FormField control={form.control} name="ringkasan_konten" render={({ field }) => (
                    <FormItem><FormLabel>Ringkasan / Excerpt</FormLabel><FormControl><Textarea className="h-20 resize-none" placeholder="Ringkasan singkat untuk tampilan kartu..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <FormField control={form.control} name="isi_konten" render={({ field }) => (
                    <FormItem><FormLabel>Isi Konten (Editor)</FormLabel><FormControl><Textarea className="h-64 font-mono text-sm" placeholder="Tulis konten lengkap di sini..." {...field} /></FormControl><FormDescription>Gunakan format Markdown atau HTML sederhana.</FormDescription><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="catatan_editor" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Editor (Internal)</FormLabel><FormControl><Input placeholder="Catatan untuk revisi..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
              
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan & Publikasi</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtikelRenunganPage;