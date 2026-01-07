import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, Video, Clock, Link as LinkIcon, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  kode_kebaktian: z.string().min(1, "Kode wajib diisi"),
  status_kebaktian: z.string().default("TIDAK_LIVE"),
  judul_kebaktian: z.string().min(1, "Judul wajib diisi"),
  tanggal_kebaktian: z.date({ required_error: "Tanggal wajib diisi" }),
  waktu_mulai: z.string().min(1, "Waktu mulai wajib"),
  durasi_kebaktian: z.coerce.number().min(1, "Durasi minimal 1 menit"),
  pendeta_khotbah: z.string().min(1, "Pilih pendeta"),
  liturgos: z.string().min(1, "Pilih liturgos"),
  lokasi_kebaktian: z.string().min(1, "Lokasi wajib diisi"),
  link_live_streaming: z.string().optional(),
  catatan_kebaktian: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Kebaktian extends FormValues { id: string; }

const MOCK_DATA: Kebaktian[] = [
  { 
    id: "1", kode_kebaktian: "SUN-01", status_kebaktian: "LIVE", judul_kebaktian: "Ibadah Raya 1", 
    tanggal_kebaktian: new Date(), waktu_mulai: "07:00", durasi_kebaktian: 120,
    pendeta_khotbah: "Pdt. Andi Wijaya", liturgos: "Sdr. David", lokasi_kebaktian: "Gedung Utama",
    link_live_streaming: "https://youtube.com/live/xyz", catatan_kebaktian: "" 
  },
  { 
    id: "2", kode_kebaktian: "SUN-02", status_kebaktian: "TIDAK_LIVE", judul_kebaktian: "Ibadah Raya 2", 
    tanggal_kebaktian: new Date(), waktu_mulai: "10:00", durasi_kebaktian: 120,
    pendeta_khotbah: "Pdt. Andi Wijaya", liturgos: "Sdr. Budi", lokasi_kebaktian: "Gedung Utama",
    link_live_streaming: "", catatan_kebaktian: "" 
  },
];

const KebaktianMingguPage = () => {
  const [data, setData] = useState<Kebaktian[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      kode_kebaktian: "", status_kebaktian: "TIDAK_LIVE", judul_kebaktian: "", 
      tanggal_kebaktian: new Date(), waktu_mulai: "09:00", durasi_kebaktian: 90, 
      pendeta_khotbah: "", liturgos: "", lokasi_kebaktian: "Gedung Utama",
      link_live_streaming: "", catatan_kebaktian: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_kebaktian: `SUN-${Math.floor(Math.random() * 1000)}`,
      status_kebaktian: "TIDAK_LIVE", judul_kebaktian: "", 
      tanggal_kebaktian: new Date(), waktu_mulai: "09:00", durasi_kebaktian: 90, 
      pendeta_khotbah: "", liturgos: "", lokasi_kebaktian: "Gedung Utama",
      link_live_streaming: "", catatan_kebaktian: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Kebaktian) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Kebaktian dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Kebaktian diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Kebaktian ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kebaktian Minggu" description="Kelola detail kebaktian dan live streaming mingguan.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Buat Kebaktian</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Kebaktian</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Pelayan</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.status_kebaktian === "LIVE" ? (
                    <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                  ) : (
                    <Badge variant="secondary">OFFLINE</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.judul_kebaktian}</span>
                    <span className="text-xs text-muted-foreground">{item.kode_kebaktian}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{format(item.tanggal_kebaktian, "dd MMM yyyy", { locale: localeId })}</span>
                    <span className="text-muted-foreground">{item.waktu_mulai} ({item.durasi_kebaktian} mnt)</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {item.pendeta_khotbah}</span>
                    <span className="text-xs text-muted-foreground">Liturgos: {item.liturgos}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.link_live_streaming ? (
                    <a href={item.link_live_streaming} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-sm">
                      <Video className="h-3 w-3" /> Link
                    </a>
                  ) : <span className="text-muted-foreground text-sm">-</span>}
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
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Kebaktian" : "Kebaktian Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_kebaktian" render={({ field }) => (
                  <FormItem><FormLabel>Kode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_kebaktian" render={({ field }) => (
                  <FormItem><FormLabel>Status Live</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="LIVE">Live Streaming</SelectItem><SelectItem value="TIDAK_LIVE">Tidak Live</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="judul_kebaktian" render={({ field }) => (
                <FormItem><FormLabel>Judul Kebaktian</FormLabel><FormControl><Input placeholder="Contoh: Ibadah Raya 1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="tanggal_kebaktian" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-2">
                   <FormField control={form.control} name="waktu_mulai" render={({ field }) => (
                      <FormItem><FormLabel>Jam Mulai</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                   <FormField control={form.control} name="durasi_kebaktian" render={({ field }) => (
                      <FormItem><FormLabel>Durasi (Mnt)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="pendeta_khotbah" render={({ field }) => (
                  <FormItem><FormLabel>Pengkhotbah</FormLabel><FormControl><Input placeholder="Nama Pendeta" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="liturgos" render={({ field }) => (
                  <FormItem><FormLabel>Liturgos / WL</FormLabel><FormControl><Input placeholder="Nama Liturgos" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="lokasi_kebaktian" render={({ field }) => (
                   <FormItem><FormLabel>Lokasi</FormLabel><FormControl><Input placeholder="Gedung / Online" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="link_live_streaming" render={({ field }) => (
                   <FormItem><FormLabel>Link Streaming (Youtube/Zoom)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="catatan_kebaktian" render={({ field }) => (
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

export default KebaktianMingguPage;