import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, Heart, Search, Filter } from "lucide-react";
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
  jenis_persembahan: z.string().min(1, "Jenis wajib dipilih"),
  tanggal_persembahan: z.date({ required_error: "Tanggal wajib diisi" }),
  ibadah_kegiatan: z.string().min(1, "Ibadah wajib dipilih"),
  nominal: z.coerce.number().min(1, "Nominal harus lebih dari 0"),
  metode_pemberian: z.string().min(1, "Metode wajib dipilih"),
  nama_pemberi: z.string().default("Anonim"),
  kategori_jemaat: z.string().optional(),
  tujuan_persembahan: z.string().min(1, "Tujuan wajib diisi"),
  status_pencatatan: z.string().default("TERCATAT"),
  petugas_pencatat: z.string().min(1, "Petugas wajib diisi"),
  catatan_persembahan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Persembahan extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Persembahan[] = [
  { 
    id: "1", jenis_persembahan: "Persembahan Mingguan", tanggal_persembahan: new Date("2023-11-26"), 
    ibadah_kegiatan: "Ibadah Raya 1", nominal: 1500000, metode_pemberian: "Tunai", 
    nama_pemberi: "Kolekte Kantong", kategori_jemaat: "", tujuan_persembahan: "Kas Umum", 
    status_pencatatan: "DIVERIFIKASI", petugas_pencatat: "Tim Perhitungan", catatan_persembahan: "Total kantong 1" 
  },
  { 
    id: "2", jenis_persembahan: "Persepuluhan", tanggal_persembahan: new Date("2023-11-25"), 
    ibadah_kegiatan: "Transfer Bank", nominal: 2500000, metode_pemberian: "Transfer", 
    nama_pemberi: "Bpk. Andi", kategori_jemaat: "Jemaat Tetap", tujuan_persembahan: "Operasional", 
    status_pencatatan: "DIVERIFIKASI", petugas_pencatat: "Bendahara", catatan_persembahan: "" 
  },
];

const JENIS_OPTIONS = ["Persembahan Mingguan", "Persepuluhan", "Ucapan Syukur", "Diakonia", "Misi", "Pembangunan", "Khusus"];
const IBADAH_OPTIONS = ["Ibadah Raya 1", "Ibadah Raya 2", "Ibadah Youth", "Transfer Bank", "QRIS"];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const PersembahanPage = () => {
  const [data, setData] = useState<Persembahan[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_persembahan: "", tanggal_persembahan: new Date(), ibadah_kegiatan: "",
      nominal: 0, metode_pemberian: "Tunai", nama_pemberi: "Anonim", kategori_jemaat: "",
      tujuan_persembahan: "Kas Umum", status_pencatatan: "TERCATAT", petugas_pencatat: "", catatan_persembahan: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenis_persembahan: "", tanggal_persembahan: new Date(), ibadah_kegiatan: "",
      nominal: 0, metode_pemberian: "Tunai", nama_pemberi: "Anonim", kategori_jemaat: "",
      tujuan_persembahan: "Kas Umum", status_pencatatan: "TERCATAT", petugas_pencatat: "", catatan_persembahan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Persembahan) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Data dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Persembahan diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Persembahan dicatat");
    }
    setIsDialogOpen(false);
  };

  const filteredData = data.filter(item => 
    item.jenis_persembahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_pemberi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Pencatatan Persembahan" description="Manajemen persembahan, persepuluhan, dan kolekte.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Input Persembahan</Button>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau jenis..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis & Kegiatan</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Pemberi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">
                   {format(item.tanggal_persembahan, "dd MMM yyyy", { locale: localeId })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.jenis_persembahan}</span>
                    <span className="text-xs text-muted-foreground">{item.ibadah_kegiatan}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatRupiah(item.nominal)}
                </TableCell>
                <TableCell className="text-sm">{item.metode_pemberian}</TableCell>
                <TableCell className="text-sm">{item.nama_pemberi}</TableCell>
                <TableCell>
                  <Badge variant={item.status_pencatatan === "DIVERIFIKASI" ? "default" : "secondary"}>
                    {item.status_pencatatan}
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Persembahan" : "Input Persembahan Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="jenis_persembahan" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Persembahan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent>{JENIS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tanggal_persembahan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="ibadah_kegiatan" render={({ field }) => (
                   <FormItem><FormLabel>Sumber Ibadah / Kegiatan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Sumber" /></SelectTrigger></FormControl><SelectContent>{IBADAH_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nominal" render={({ field }) => (
                   <FormItem><FormLabel>Nominal (Rp)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="metode_pemberian" render={({ field }) => (
                   <FormItem><FormLabel>Metode Pemberian</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Metode" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Tunai">Tunai</SelectItem><SelectItem value="Transfer">Transfer</SelectItem><SelectItem value="QRIS">QRIS</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nama_pemberi" render={({ field }) => (
                   <FormItem><FormLabel>Nama Pemberi</FormLabel><FormControl><Input placeholder="Isi 'Anonim' jika tidak ada nama" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tujuan_persembahan" render={({ field }) => (
                   <FormItem><FormLabel>Alokasi / Tujuan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Tujuan" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Kas Umum">Kas Umum</SelectItem><SelectItem value="Operasional">Operasional</SelectItem><SelectItem value="Pembangunan">Pembangunan</SelectItem><SelectItem value="Diakonia">Diakonia</SelectItem><SelectItem value="Misi">Misi</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="petugas_pencatat" render={({ field }) => (
                   <FormItem><FormLabel>Petugas Pencatat</FormLabel><FormControl><Input placeholder="Nama Petugas" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              
              <FormField control={form.control} name="status_pencatatan" render={({ field }) => (
                <FormItem><FormLabel>Status Verifikasi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="TERCATAT">Tercatat</SelectItem><SelectItem value="DIVERIFIKASI">Diverifikasi (Bendahara)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="catatan_persembahan" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Keterangan tambahan..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersembahanPage;