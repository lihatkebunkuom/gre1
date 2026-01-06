import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
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
  kode_event: z.string().min(1, "Kode wajib diisi"),
  nama_event: z.string().min(3, "Nama event minimal 3 karakter"),
  jenis_event: z.string().min(1, "Pilih jenis event"),
  deskripsi_event: z.string().optional(),
  tanggal_mulai: z.date({ required_error: "Tanggal mulai wajib" }),
  tanggal_selesai: z.date().optional(),
  waktu_mulai: z.string().min(1, "Waktu mulai wajib"),
  waktu_selesai: z.string().optional(),
  lokasi_event: z.string().min(1, "Lokasi wajib diisi"),
  penanggung_jawab_event: z.string().min(1, "Pilih PIC"),
  status_event: z.string().default("TERJADWAL"),
  catatan_event: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface EventGereja extends FormValues { id: string; }

const MOCK_DATA: EventGereja[] = [
  { 
    id: "1", kode_event: "EVT-001", nama_event: "Retreat Pemuda", jenis_event: "Event Khusus", 
    deskripsi_event: "Retreat tahunan komisi pemuda.", tanggal_mulai: new Date("2023-12-10"), 
    tanggal_selesai: new Date("2023-12-12"), waktu_mulai: "08:00", waktu_selesai: "12:00",
    lokasi_event: "Villa Puncak", penanggung_jawab_event: "Sdr. Kevin", status_event: "TERJADWAL", catatan_event: "" 
  },
  { 
    id: "2", kode_event: "EVT-002", nama_event: "Rapat Majelis", jenis_event: "Rapat", 
    deskripsi_event: "Evaluasi triwulan.", tanggal_mulai: new Date("2023-11-20"), 
    waktu_mulai: "19:00", waktu_selesai: "21:00",
    lokasi_event: "Ruang Rapat Lt. 2", penanggung_jawab_event: "Pdt. Budi", status_event: "SELESAI", catatan_event: "" 
  },
];

const KalenderEventPage = () => {
  const [data, setData] = useState<EventGereja[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_event: "", nama_event: "", jenis_event: "", deskripsi_event: "",
      tanggal_mulai: new Date(), waktu_mulai: "", waktu_selesai: "",
      lokasi_event: "", penanggung_jawab_event: "", status_event: "TERJADWAL",
      catatan_event: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_event: `EVT-${Math.floor(Math.random() * 1000)}`,
      nama_event: "", jenis_event: "", deskripsi_event: "",
      tanggal_mulai: new Date(), waktu_mulai: "", waktu_selesai: "",
      lokasi_event: "", penanggung_jawab_event: "", status_event: "TERJADWAL",
      catatan_event: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: EventGereja) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Event dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Event diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Event ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kalender Event" description="Jadwal seluruh kegiatan dan acara gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Event</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>PIC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.nama_event}</span>
                    <span className="text-xs text-muted-foreground">{item.jenis_event} • {item.kode_event}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {format(item.tanggal_mulai, "dd MMM yyyy", { locale: localeId })}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {item.waktu_mulai} {item.waktu_selesai && `- ${item.waktu_selesai}`}</span>
                  </div>
                </TableCell>
                <TableCell>{item.lokasi_event}</TableCell>
                <TableCell>{item.penanggung_jawab_event}</TableCell>
                <TableCell>
                  <Badge variant={item.status_event === "TERJADWAL" ? "outline" : item.status_event === "SELESAI" ? "secondary" : "destructive"}>
                    {item.status_event}
                  </Badge>
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Event" : "Buat Event Baru"}</DialogTitle>
            <DialogDescription>Masukkan detail kegiatan gereja.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_event" render={({ field }) => (
                  <FormItem><FormLabel>Kode Event</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="jenis_event" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Event</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ibadah">Ibadah</SelectItem><SelectItem value="Persekutuan">Persekutuan</SelectItem><SelectItem value="Pelatihan">Pelatihan</SelectItem><SelectItem value="Rapat">Rapat</SelectItem><SelectItem value="Event Khusus">Event Khusus</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="nama_event" render={({ field }) => (
                <FormItem><FormLabel>Nama Event</FormLabel><FormControl><Input placeholder="Contoh: Retreat Pemuda" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggal_mulai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="tanggal_selesai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Selesai (Opsional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="waktu_mulai" render={({ field }) => (
                  <FormItem><FormLabel>Waktu Mulai</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="waktu_selesai" render={({ field }) => (
                  <FormItem><FormLabel>Waktu Selesai</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="lokasi_event" render={({ field }) => (
                  <FormItem><FormLabel>Lokasi</FormLabel><FormControl><Input placeholder="Nama Ruangan / Tempat" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="penanggung_jawab_event" render={({ field }) => (
                  <FormItem><FormLabel>Penanggung Jawab (PIC)</FormLabel><FormControl><Input placeholder="Nama PIC" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="status_event" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TERJADWAL">Terjadwal</SelectItem><SelectItem value="BERLANGSUNG">Berlangsung</SelectItem><SelectItem value="SELESAI">Selesai</SelectItem><SelectItem value="DIBATALKAN">Dibatalkan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
              </div>

              <FormField control={form.control} name="deskripsi_event" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="catatan_event" render={({ field }) => (
                <FormItem><FormLabel>Catatan Tambahan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KalenderEventPage;