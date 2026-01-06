import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, UserCheck, QrCode } from "lucide-react";
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

const formSchema = z.object({
  kode_absensi: z.string().min(1, "Kode wajib diisi"),
  nama_kegiatan: z.string().min(1, "Pilih kegiatan"),
  tanggal_kegiatan: z.date({ required_error: "Tanggal wajib diisi" }),
  jemaat: z.string().min(1, "Pilih jemaat"),
  status_kehadiran: z.string().default("HADIR"),
  waktu_check_in: z.string().min(1, "Waktu check-in wajib"),
  metode_absensi: z.string().default("MANUAL"),
  catatan_absensi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Absensi extends FormValues { id: string; }

const MOCK_DATA: Absensi[] = [
  { 
    id: "1", kode_absensi: "ABS-001", nama_kegiatan: "Ibadah Raya 1", tanggal_kegiatan: new Date(), 
    jemaat: "Andi Pratama", status_kehadiran: "HADIR", waktu_check_in: "06:45", 
    metode_absensi: "QR_CODE", catatan_absensi: "" 
  },
  { 
    id: "2", kode_absensi: "ABS-002", nama_kegiatan: "Ibadah Raya 1", tanggal_kegiatan: new Date(), 
    jemaat: "Siti Nurhaliza", status_kehadiran: "IZIN", waktu_check_in: "-", 
    metode_absensi: "MANUAL", catatan_absensi: "Sakit" 
  },
];

const JEMAAT_OPTIONS = ["Andi Pratama", "Siti Nurhaliza", "Budi Santoso", "Dewi Sartika"];
const KEGIATAN_OPTIONS = ["Ibadah Raya 1", "Ibadah Raya 2", "Ibadah Youth", "Retreat Pemuda"];

const AbsensiKehadiranPage = () => {
  const [data, setData] = useState<Absensi[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_absensi: "", nama_kegiatan: "", tanggal_kegiatan: new Date(),
      jemaat: "", status_kehadiran: "HADIR", waktu_check_in: "00:00",
      metode_absensi: "MANUAL", catatan_absensi: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_absensi: `ABS-${Math.floor(Math.random() * 10000)}`,
      nama_kegiatan: "", tanggal_kegiatan: new Date(),
      jemaat: "", status_kehadiran: "HADIR", waktu_check_in: format(new Date(), "HH:mm"),
      metode_absensi: "MANUAL", catatan_absensi: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Absensi) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Absensi dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Absensi diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Absensi dicatat");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Absensi Kehadiran" description="Pencatatan kehadiran jemaat dalam ibadah dan event.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Catat Kehadiran</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Nama Jemaat</TableHead>
              <TableHead>Kegiatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{format(item.tanggal_kegiatan, "dd MMM", { locale: localeId })}</span>
                    <span className="text-muted-foreground text-xs">{item.waktu_check_in}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.jemaat}</TableCell>
                <TableCell>{item.nama_kegiatan}</TableCell>
                <TableCell>
                  <Badge variant={item.status_kehadiran === "HADIR" ? "default" : "secondary"}>
                    {item.status_kehadiran}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.metode_absensi === "QR_CODE" ? (
                    <div className="flex items-center gap-1 text-xs text-blue-600"><QrCode className="h-3 w-3" /> QR</div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><UserCheck className="h-3 w-3" /> Manual</div>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Absensi" : "Input Kehadiran Manual"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_absensi" render={({ field }) => (
                  <FormItem><FormLabel>Kode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tanggal_kegiatan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="nama_kegiatan" render={({ field }) => (
                <FormItem><FormLabel>Kegiatan / Ibadah</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kegiatan" /></SelectTrigger></FormControl><SelectContent>{KEGIATAN_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="jemaat" render={({ field }) => (
                <FormItem><FormLabel>Nama Jemaat</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Cari Jemaat" /></SelectTrigger></FormControl><SelectContent>{JEMAAT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status_kehadiran" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="HADIR">Hadir</SelectItem><SelectItem value="IZIN">Izin</SelectItem><SelectItem value="TIDAK_HADIR">Tidak Hadir</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="waktu_check_in" render={({ field }) => (
                  <FormItem><FormLabel>Jam Masuk</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="metode_absensi" render={({ field }) => (
                   <FormItem><FormLabel>Metode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MANUAL">Manual Input</SelectItem><SelectItem value="QR_CODE">Scan QR</SelectItem><SelectItem value="FACE_RECOG">Face Recog</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="catatan_absensi" render={({ field }) => (
                   <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Keterangan..." {...field} /></FormControl><FormMessage /></FormItem>
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

export default AbsensiKehadiranPage;