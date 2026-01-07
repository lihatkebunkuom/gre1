import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, Layers, Users } from "lucide-react";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Schema ---
const formSchema = z.object({
  kode_divisi: z.string().min(1, "Kode wajib diisi"),
  nama_divisi: z.string().min(3, "Nama divisi minimal 3 karakter"),
  kategori_divisi: z.string().min(1, "Pilih kategori"),
  deskripsi_divisi: z.string().optional(),
  koordinator_divisi: z.string().min(1, "Pilih koordinator"),
  wakil_koordinator: z.string().optional(),
  jumlah_anggota: z.coerce.number().min(0).default(0),
  status_divisi: z.string().default("AKTIF"),
  tanggal_pembentukan: z.date({ required_error: "Tanggal wajib diisi" }),
  visi_divisi: z.string().optional(),
  misi_divisi: z.string().optional(),
  catatan_divisi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Divisi extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Divisi[] = [
  { 
    id: "1", kode_divisi: "DIV-MUSIK", nama_divisi: "Divisi Musik & Pujian", kategori_divisi: "Musik", 
    deskripsi_divisi: "Mengelola seluruh pelayanan musik gereja.", koordinator_divisi: "Sdr. David", 
    wakil_koordinator: "Sdri. Anna", jumlah_anggota: 25, status_divisi: "AKTIF", 
    tanggal_pembentukan: new Date("2020-01-01"), visi_divisi: "Menjadi pemuji yang menyembah", misi_divisi: "Melatih skill dan karakter", catatan_divisi: "" 
  },
  { 
    id: "2", kode_divisi: "DIV-MM", nama_divisi: "Divisi Multimedia", kategori_divisi: "Multimedia", 
    deskripsi_divisi: "Tim teknis audio visual.", koordinator_divisi: "Sdr. Kevin", 
    wakil_koordinator: "", jumlah_anggota: 12, status_divisi: "AKTIF", 
    tanggal_pembentukan: new Date("2021-05-15"), visi_divisi: "", misi_divisi: "", catatan_divisi: "Butuh alat baru" 
  },
];

const KATEGORI_OPTIONS = ["Ibadah", "Musik", "Multimedia", "Diakonia", "Pendidikan", "Administrasi"];
const KOORDINATOR_OPTIONS = ["Sdr. David", "Sdr. Kevin", "Pdt. Andi", "Ibu Sarah"];

const DaftarDivisiPage = () => {
  const [data, setData] = useState<Divisi[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_divisi: "", nama_divisi: "", kategori_divisi: "", deskripsi_divisi: "",
      koordinator_divisi: "", wakil_koordinator: "", jumlah_anggota: 0, status_divisi: "AKTIF",
      tanggal_pembentukan: new Date(), visi_divisi: "", misi_divisi: "", catatan_divisi: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_divisi: `DIV-${Math.floor(Math.random() * 1000)}`,
      nama_divisi: "", kategori_divisi: "", deskripsi_divisi: "",
      koordinator_divisi: "", wakil_koordinator: "", jumlah_anggota: 0, status_divisi: "AKTIF",
      tanggal_pembentukan: new Date(), visi_divisi: "", misi_divisi: "", catatan_divisi: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Divisi) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Divisi dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data divisi diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Divisi baru ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Divisi" description="Master data divisi pelayanan gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Divisi</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Info Divisi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Koordinator</TableHead>
              <TableHead className="text-center">Anggota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium flex items-center gap-2"><Layers className="h-3 w-3 text-muted-foreground" /> {item.nama_divisi}</span>
                    <span className="text-xs text-muted-foreground font-mono">{item.kode_divisi}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategori_divisi}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{item.koordinator_divisi}</span>
                    {item.wakil_koordinator && <span className="text-xs text-muted-foreground">Wk: {item.wakil_koordinator}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    <Users className="h-3 w-3" /> {item.jumlah_anggota}
                  </div>
                </TableCell>
                <TableCell>
                  {item.status_divisi === "AKTIF" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Non-Aktif</Badge>
                  )}
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Divisi" : "Tambah Divisi Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_divisi" render={({ field }) => (
                  <FormItem><FormLabel>Kode Divisi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="kategori_divisi" render={({ field }) => (
                  <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="nama_divisi" render={({ field }) => (
                <FormItem><FormLabel>Nama Divisi</FormLabel><FormControl><Input placeholder="Contoh: Divisi Musik & Pujian" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="koordinator_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Koordinator</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Koordinator" /></SelectTrigger></FormControl><SelectContent>{KOORDINATOR_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="wakil_koordinator" render={({ field }) => (
                   <FormItem><FormLabel>Wakil Koordinator</FormLabel><FormControl><Input placeholder="Nama Wakil" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggal_pembentukan" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Pembentukan</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="jumlah_anggota" render={({ field }) => (
                   <FormItem><FormLabel>Jumlah Anggota (Manual)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="visi_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Visi</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="misi_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Misi</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="deskripsi_divisi" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="TIDAK_AKTIF">Tidak Aktif</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="catatan_divisi" render={({ field }) => (
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

export default DaftarDivisiPage;