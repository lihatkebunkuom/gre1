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
  kode_penugasan: z.string().min(1, "Kode wajib diisi"),
  nama_pelayanan: z.string().min(1, "Pilih pelayanan"),
  nama_petugas: z.string().min(1, "Pilih petugas"),
  peran_dalam_pelayanan: z.string().min(1, "Pilih peran"),
  tanggal_mulai_penugasan: z.date({ required_error: "Tanggal mulai wajib" }),
  tanggal_selesai_penugasan: z.date().optional(),
  jadwal_tugas: z.string().optional(),
  status_penugasan: z.string().default("AKTIF"),
  evaluasi_kinerja: z.string().optional(),
  catatan_penugasan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Penugasan extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Penugasan[] = [
  { 
    id: "1", kode_penugasan: "TGS-01", nama_pelayanan: "Tim Musik & Pujian", nama_petugas: "Andi Pratama", 
    peran_dalam_pelayanan: "Pemain Gitar", tanggal_mulai_penugasan: new Date("2023-01-01"), 
    status_penugasan: "AKTIF", jadwal_tugas: "Minggu Ganjil", evaluasi_kinerja: "Sangat baik", catatan_penugasan: "" 
  },
  { 
    id: "2", kode_penugasan: "TGS-02", nama_pelayanan: "Multimedia", nama_petugas: "Siti Nurhaliza", 
    peran_dalam_pelayanan: "Operator LCD", tanggal_mulai_penugasan: new Date("2023-06-01"), 
    status_penugasan: "AKTIF", jadwal_tugas: "Minggu Genap", evaluasi_kinerja: "", catatan_penugasan: "" 
  },
];

const PERAN_OPTIONS = ["Koordinator", "Anggota", "Pendukung", "Mentor", "Volunteer"];
const LAYANAN_OPTIONS = ["Tim Musik & Pujian", "Multimedia", "Sekolah Minggu", "Usher / Penyambut"];
const PETUGAS_OPTIONS = ["Andi Pratama", "Siti Nurhaliza", "Budi Santoso", "Dewi Sartika"]; // Mock from Jemaat

const PenugasanPage = () => {
  const [data, setData] = useState<Penugasan[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_penugasan: "", nama_pelayanan: "", nama_petugas: "", peran_dalam_pelayanan: "",
      tanggal_mulai_penugasan: new Date(), status_penugasan: "AKTIF",
      jadwal_tugas: "", evaluasi_kinerja: "", catatan_penugasan: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_penugasan: `TGS-${Math.floor(Math.random() * 1000)}`, // Auto gen example
      nama_pelayanan: "", nama_petugas: "", peran_dalam_pelayanan: "",
      tanggal_mulai_penugasan: new Date(), status_penugasan: "AKTIF",
      jadwal_tugas: "", evaluasi_kinerja: "", catatan_penugasan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Penugasan) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Penugasan dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data penugasan diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Petugas berhasil ditugaskan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Penugasan Pelayanan" description="Manajemen penempatan SDM pada unit pelayanan gereja.">
        <Button onClick={handleAddNew}><UserPlus className="mr-2 h-4 w-4" /> Buat Penugasan</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pelayanan</TableHead>
              <TableHead>Nama Petugas</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Periode Mulai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nama_pelayanan}</TableCell>
                <TableCell>{item.nama_petugas}</TableCell>
                <TableCell><Badge variant="outline">{item.peran_dalam_pelayanan}</Badge></TableCell>
                <TableCell>{format(item.tanggal_mulai_penugasan, "dd MMM yyyy", { locale: localeId })}</TableCell>
                <TableCell>
                  {item.status_penugasan === "AKTIF" ? (
                    <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded w-fit">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Aktif
                    </div>
                  ) : (
                    <Badge variant="secondary">Selesai</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                    <ConfirmDialog 
                      trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                      onConfirm={() => handleDelete(item.id)} 
                      variant="destructive" 
                      title="Hapus Penugasan"
                      description="Data penugasan ini akan dihapus permanen."
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
            <DialogTitle>{editingId ? "Edit Penugasan" : "Penugasan Baru"}</DialogTitle>
            <DialogDescription>Tempatkan jemaat atau pelayan dalam divisi pelayanan.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_penugasan" render={({ field }) => (
                  <FormItem><FormLabel>Kode Penugasan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_penugasan" render={({ field }) => (
                   <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="SELESAI">Selesai</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="nama_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel>Unit Pelayanan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Pelayanan" /></SelectTrigger></FormControl><SelectContent>{LAYANAN_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nama_petugas" render={({ field }) => (
                   <FormItem><FormLabel>Nama Petugas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Petugas" /></SelectTrigger></FormControl><SelectContent>{PETUGAS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="peran_dalam_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel>Peran / Posisi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Peran" /></SelectTrigger></FormControl><SelectContent>{PERAN_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="jadwal_tugas" render={({ field }) => (
                  <FormItem><FormLabel>Jadwal Tugas</FormLabel><FormControl><Input placeholder="Cth: Minggu Ganjil" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="tanggal_mulai_penugasan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
                <FormField control={form.control} name="tanggal_selesai_penugasan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal Selesai (Opsional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="evaluasi_kinerja" render={({ field }) => (
                <FormItem><FormLabel>Evaluasi Kinerja</FormLabel><FormControl><Textarea placeholder="Catatan evaluasi pelayanan..." className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PenugasanPage;