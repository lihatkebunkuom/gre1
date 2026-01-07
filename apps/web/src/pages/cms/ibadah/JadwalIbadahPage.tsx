import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, MapPin, Clock } from "lucide-react";
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
  kode_jadwal_ibadah: z.string().min(1, "Kode wajib diisi"),
  nama_ibadah: z.string().min(3, "Nama ibadah wajib diisi"),
  jenis_ibadah: z.string().min(1, "Pilih jenis ibadah"),
  hari_ibadah: z.string().min(1, "Pilih hari"),
  tanggal_ibadah: z.date({ required_error: "Tanggal wajib diisi" }),
  waktu_mulai: z.string().min(1, "Waktu mulai wajib"),
  waktu_selesai: z.string().optional(),
  lokasi_ibadah: z.string().min(1, "Lokasi wajib diisi"),
  pendeta_pelayan: z.string().min(1, "Pilih pelayan"),
  tema_khotbah: z.string().optional(),
  status_ibadah: z.string().default("TERJADWAL"),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface JadwalIbadah extends FormValues { id: string; }

const MOCK_DATA: JadwalIbadah[] = [
  { 
    id: "1", kode_jadwal_ibadah: "IBD-01", nama_ibadah: "Ibadah Raya 1", jenis_ibadah: "Ibadah Minggu", 
    hari_ibadah: "Minggu", tanggal_ibadah: new Date("2023-11-26"), waktu_mulai: "07:00", waktu_selesai: "09:00",
    lokasi_ibadah: "Gedung Utama", pendeta_pelayan: "Pdt. Andi Wijaya", tema_khotbah: "Hidup yang Berbuah", 
    status_ibadah: "TERJADWAL", keterangan: "" 
  },
  { 
    id: "2", kode_jadwal_ibadah: "IBD-02", nama_ibadah: "Ibadah Doa Malam", jenis_ibadah: "Ibadah Khusus", 
    hari_ibadah: "Kamis", tanggal_ibadah: new Date("2023-11-23"), waktu_mulai: "19:00", waktu_selesai: "20:30",
    lokasi_ibadah: "Ruang Doa", pendeta_pelayan: "Pdt. Budi", tema_khotbah: "Kuasa Doa", 
    status_ibadah: "SELESAI", keterangan: "" 
  },
];

const JadwalIbadahPage = () => {
  const [data, setData] = useState<JadwalIbadah[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_jadwal_ibadah: "", nama_ibadah: "", jenis_ibadah: "", hari_ibadah: "",
      tanggal_ibadah: new Date(), waktu_mulai: "", waktu_selesai: "",
      lokasi_ibadah: "", pendeta_pelayan: "", tema_khotbah: "", 
      status_ibadah: "TERJADWAL", keterangan: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_jadwal_ibadah: `IBD-${Math.floor(Math.random() * 1000)}`,
      nama_ibadah: "", jenis_ibadah: "", hari_ibadah: "",
      tanggal_ibadah: new Date(), waktu_mulai: "", waktu_selesai: "",
      lokasi_ibadah: "", pendeta_pelayan: "", tema_khotbah: "", 
      status_ibadah: "TERJADWAL", keterangan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: JadwalIbadah) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Jadwal dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Jadwal diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Jadwal ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Jadwal Ibadah" description="Pengaturan jadwal ibadah rutin dan khusus.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Jadwal</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ibadah</TableHead>
              <TableHead>Waktu & Lokasi</TableHead>
              <TableHead>Pelayan Firman</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.nama_ibadah}</span>
                    <span className="text-xs text-muted-foreground">{item.jenis_ibadah}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {format(item.tanggal_ibadah, "dd MMM yyyy", { locale: localeId })}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {item.waktu_mulai}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {item.lokasi_ibadah}</span>
                  </div>
                </TableCell>
                <TableCell>{item.pendeta_pelayan}</TableCell>
                <TableCell className="italic text-muted-foreground">"{item.tema_khotbah}"</TableCell>
                <TableCell>
                  <Badge variant={item.status_ibadah === "TERJADWAL" ? "outline" : "secondary"}>
                    {item.status_ibadah}
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
            <DialogTitle>{editingId ? "Edit Jadwal" : "Buat Jadwal Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_jadwal_ibadah" render={({ field }) => (
                  <FormItem><FormLabel>Kode Jadwal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="jenis_ibadah" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Ibadah</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ibadah Minggu">Ibadah Minggu</SelectItem><SelectItem value="Ibadah Pemuda">Ibadah Pemuda</SelectItem><SelectItem value="Ibadah Keluarga">Ibadah Keluarga</SelectItem><SelectItem value="Ibadah Khusus">Ibadah Khusus</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="nama_ibadah" render={({ field }) => (
                <FormItem><FormLabel>Nama Ibadah</FormLabel><FormControl><Input placeholder="Contoh: Ibadah Raya 1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="hari_ibadah" render={({ field }) => (
                    <FormItem><FormLabel>Hari</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Hari" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Senin">Senin</SelectItem><SelectItem value="Selasa">Selasa</SelectItem><SelectItem value="Rabu">Rabu</SelectItem><SelectItem value="Kamis">Kamis</SelectItem><SelectItem value="Jumat">Jumat</SelectItem><SelectItem value="Sabtu">Sabtu</SelectItem><SelectItem value="Minggu">Minggu</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="tanggal_ibadah" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
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

              <FormField control={form.control} name="lokasi_ibadah" render={({ field }) => (
                  <FormItem><FormLabel>Lokasi</FormLabel><FormControl><Input placeholder="Nama Ruangan" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="pendeta_pelayan" render={({ field }) => (
                    <FormItem><FormLabel>Pendeta / Pelayan</FormLabel><FormControl><Input placeholder="Nama Pelayan Firman" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_ibadah" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TERJADWAL">Terjadwal</SelectItem><SelectItem value="SELESAI">Selesai</SelectItem><SelectItem value="DIBATALKAN">Dibatalkan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
              </div>

              <FormField control={form.control} name="tema_khotbah" render={({ field }) => (
                <FormItem><FormLabel>Tema Khotbah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="keterangan" render={({ field }) => (
                <FormItem><FormLabel>Keterangan</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JadwalIbadahPage;