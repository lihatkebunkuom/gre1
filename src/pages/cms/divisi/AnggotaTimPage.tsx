import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, UserPlus, CheckCircle2 } from "lucide-react";
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
  kode_anggota_tim: z.string().min(1, "Kode wajib diisi"),
  nama_divisi: z.string().min(1, "Pilih divisi"),
  nama_anggota: z.string().min(1, "Pilih anggota"),
  peran_dalam_divisi: z.string().min(1, "Pilih peran"),
  tanggal_mulai_bergabung: z.date({ required_error: "Tanggal mulai wajib" }),
  tanggal_selesai_bergabung: z.date().optional(),
  status_keanggotaan: z.string().default("AKTIF"),
  jadwal_tugas: z.string().optional(),
  tingkat_kompetensi: z.string().optional(),
  catatan_anggota: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface AnggotaTim extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: AnggotaTim[] = [
  { 
    id: "1", kode_anggota_tim: "AGT-001", nama_divisi: "Divisi Musik & Pujian", nama_anggota: "Andi Pratama", 
    peran_dalam_divisi: "Anggota", tanggal_mulai_bergabung: new Date("2023-01-01"), 
    status_keanggotaan: "AKTIF", jadwal_tugas: "Minggu Ganjil", tingkat_kompetensi: "Lanjutan", catatan_anggota: "Gitaris utama" 
  },
  { 
    id: "2", kode_anggota_tim: "AGT-002", nama_divisi: "Divisi Multimedia", nama_anggota: "Siti Nurhaliza", 
    peran_dalam_divisi: "Sekretaris", tanggal_mulai_bergabung: new Date("2023-06-01"), 
    status_keanggotaan: "AKTIF", jadwal_tugas: "Fleksibel", tingkat_kompetensi: "Menengah", catatan_anggota: "" 
  },
];

const DIVISI_OPTIONS = ["Divisi Musik & Pujian", "Divisi Multimedia", "Divisi Diakonia"];
const ANGGOTA_OPTIONS = ["Andi Pratama", "Siti Nurhaliza", "Budi Santoso", "Dewi Sartika"];
const PERAN_OPTIONS = ["Ketua", "Sekretaris", "Bendahara", "Anggota", "Mentor"];
const KOMPETENSI_OPTIONS = ["Pemula", "Menengah", "Lanjutan", "Expert"];

const AnggotaTimPage = () => {
  const [data, setData] = useState<AnggotaTim[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_anggota_tim: "", nama_divisi: "", nama_anggota: "", peran_dalam_divisi: "",
      tanggal_mulai_bergabung: new Date(), status_keanggotaan: "AKTIF",
      jadwal_tugas: "", tingkat_kompetensi: "", catatan_anggota: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_anggota_tim: `AGT-${Math.floor(Math.random() * 1000)}`,
      nama_divisi: "", nama_anggota: "", peran_dalam_divisi: "",
      tanggal_mulai_bergabung: new Date(), status_keanggotaan: "AKTIF",
      jadwal_tugas: "", tingkat_kompetensi: "", catatan_anggota: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: AnggotaTim) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Anggota dihapus dari tim");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data anggota diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Anggota ditambahkan ke tim");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Anggota Tim" description="Manajemen keanggotaan dalam divisi pelayanan.">
        <Button onClick={handleAddNew}><UserPlus className="mr-2 h-4 w-4" /> Tambah Anggota</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Divisi</TableHead>
              <TableHead>Nama Anggota</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nama_divisi}</TableCell>
                <TableCell>{item.nama_anggota}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{item.peran_dalam_divisi}</span>
                    <span className="text-xs text-muted-foreground">{item.tingkat_kompetensi}</span>
                  </div>
                </TableCell>
                <TableCell>{format(item.tanggal_mulai_bergabung, "dd MMM yyyy", { locale: localeId })}</TableCell>
                <TableCell>
                  {item.status_keanggotaan === "AKTIF" ? (
                    <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded w-fit">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Aktif
                    </div>
                  ) : (
                    <Badge variant="secondary">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                    <ConfirmDialog 
                      trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                      onConfirm={() => handleDelete(item.id)} 
                      variant="destructive" 
                      title="Hapus Anggota"
                      description="Hapus anggota dari tim ini?"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Anggota" : "Tambah Anggota Tim"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_anggota_tim" render={({ field }) => (
                  <FormItem><FormLabel>Kode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_keanggotaan" render={({ field }) => (
                   <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="NONAKTIF">Nonaktif</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="nama_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Divisi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Divisi" /></SelectTrigger></FormControl><SelectContent>{DIVISI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nama_anggota" render={({ field }) => (
                   <FormItem><FormLabel>Nama Anggota</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Anggota" /></SelectTrigger></FormControl><SelectContent>{ANGGOTA_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="peran_dalam_divisi" render={({ field }) => (
                   <FormItem><FormLabel>Peran</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Peran" /></SelectTrigger></FormControl><SelectContent>{PERAN_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="tingkat_kompetensi" render={({ field }) => (
                   <FormItem><FormLabel>Kompetensi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Level" /></SelectTrigger></FormControl><SelectContent>{KOMPETENSI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="tanggal_mulai_bergabung" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal Bergabung</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
                <FormField control={form.control} name="tanggal_selesai_bergabung" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal Selesai (Opsional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="jadwal_tugas" render={({ field }) => (
                  <FormItem><FormLabel>Jadwal Tugas</FormLabel><FormControl><Input placeholder="Cth: Setiap Sabtu" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="catatan_anggota" render={({ field }) => (
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

export default AnggotaTimPage;