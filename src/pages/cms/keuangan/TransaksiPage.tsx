import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, ArrowUpCircle, ArrowDownCircle, FileText, Search, Filter } from "lucide-react";
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
import { ImageUpload } from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";

// --- Schema ---
const formSchema = z.object({
  jenis_transaksi: z.string().min(1, "Jenis wajib dipilih"),
  tanggal_transaksi: z.date({ required_error: "Tanggal wajib diisi" }),
  kategori_transaksi: z.string().min(1, "Kategori wajib dipilih"),
  deskripsi_transaksi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  nominal: z.coerce.number().min(1, "Nominal harus lebih dari 0"),
  metode_pembayaran: z.string().min(1, "Metode wajib dipilih"),
  sumber_tujuan: z.string().min(1, "Sumber/Tujuan wajib diisi"),
  penanggung_jawab: z.string().min(1, "PIC wajib diisi"),
  bukti_transaksi: z.string().optional(),
  status_transaksi: z.string().default("DRAFT"),
  catatan_transaksi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Transaksi extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Transaksi[] = [
  { 
    id: "1", jenis_transaksi: "PENGELUARAN", tanggal_transaksi: new Date("2023-11-20"), 
    kategori_transaksi: "Operasional", deskripsi_transaksi: "Pembayaran Listrik & Air Bulan November", 
    nominal: 2500000, metode_pembayaran: "Transfer", sumber_tujuan: "PLN & PDAM", 
    penanggung_jawab: "Bendahara 1", status_transaksi: "VALID", bukti_transaksi: "", catatan_transaksi: "" 
  },
  { 
    id: "2", jenis_transaksi: "PEMASUKAN", tanggal_transaksi: new Date("2023-11-21"), 
    kategori_transaksi: "Donasi", deskripsi_transaksi: "Sumbangan renovasi atap", 
    nominal: 5000000, metode_pembayaran: "Transfer", sumber_tujuan: "Bpk. Donatur", 
    penanggung_jawab: "Sekretariat", status_transaksi: "VALID", bukti_transaksi: "", catatan_transaksi: "" 
  },
];

const KATEGORI_OPTIONS = ["Operasional", "Pelayanan", "Sosial", "Aset", "Gaji/Honor", "Donasi", "Lainnya"];
const METODE_OPTIONS = ["Tunai", "Transfer BCA", "Transfer Mandiri", "QRIS", "Cek/Giro"];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const TransaksiPage = () => {
  const [data, setData] = useState<Transaksi[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_transaksi: "PENGELUARAN", tanggal_transaksi: new Date(), kategori_transaksi: "",
      deskripsi_transaksi: "", nominal: 0, metode_pembayaran: "", sumber_tujuan: "",
      penanggung_jawab: "", bukti_transaksi: "", status_transaksi: "DRAFT", catatan_transaksi: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenis_transaksi: "PENGELUARAN", tanggal_transaksi: new Date(), kategori_transaksi: "",
      deskripsi_transaksi: "", nominal: 0, metode_pembayaran: "", sumber_tujuan: "",
      penanggung_jawab: "", bukti_transaksi: "", status_transaksi: "DRAFT", catatan_transaksi: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Transaksi) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Transaksi dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Transaksi diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Transaksi dicatat");
    }
    setIsDialogOpen(false);
  };

  const filteredData = data.filter(item => 
    item.deskripsi_transaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori_transaksi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Transaksi Keuangan" description="Pencatatan arus kas masuk dan keluar operasional gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Catat Transaksi</Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari deskripsi atau kategori..." 
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
              <TableHead>Deskripsi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">
                   {format(item.tanggal_transaksi, "dd MMM yyyy", { locale: localeId })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.deskripsi_transaksi}</span>
                    <span className="text-xs text-muted-foreground">{item.sumber_tujuan}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategori_transaksi}</Badge></TableCell>
                <TableCell>
                  <div className={cn("font-medium flex items-center gap-1", item.jenis_transaksi === "PEMASUKAN" ? "text-green-600" : "text-red-600")}>
                    {item.jenis_transaksi === "PEMASUKAN" ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}
                    {formatRupiah(item.nominal)}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{item.metode_pembayaran}</TableCell>
                <TableCell>
                  <Badge variant={item.status_transaksi === "VALID" ? "default" : item.status_transaksi === "DIBATALKAN" ? "destructive" : "secondary"}>
                    {item.status_transaksi}
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
            <DialogTitle>{editingId ? "Edit Transaksi" : "Catat Transaksi Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="jenis_transaksi" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Transaksi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="PEMASUKAN">Pemasukan (+)</SelectItem><SelectItem value="PENGELUARAN">Pengeluaran (-)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tanggal_transaksi" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="kategori_transaksi" render={({ field }) => (
                   <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nominal" render={({ field }) => (
                   <FormItem><FormLabel>Nominal (Rp)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="deskripsi_transaksi" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi Transaksi</FormLabel><FormControl><Textarea className="resize-none h-20" placeholder="Keterangan lengkap..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="metode_pembayaran" render={({ field }) => (
                   <FormItem><FormLabel>Metode Pembayaran</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Metode" /></SelectTrigger></FormControl><SelectContent>{METODE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="sumber_tujuan" render={({ field }) => (
                   <FormItem><FormLabel>{form.watch('jenis_transaksi') === 'PEMASUKAN' ? 'Sumber Dana' : 'Dibayarkan Kepada'}</FormLabel><FormControl><Input placeholder="Nama Pihak / Institusi" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="penanggung_jawab" render={({ field }) => (
                   <FormItem><FormLabel>Penanggung Jawab (PIC)</FormLabel><FormControl><Input placeholder="Nama Petugas" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                <FormField control={form.control} name="status_transaksi" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="VALID">Valid / Selesai</SelectItem><SelectItem value="DIBATALKAN">Dibatalkan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="bukti_transaksi" render={({ field }) => (
                <FormItem><FormLabel>Bukti Transaksi (Struk/Nota)</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="catatan_transaksi" render={({ field }) => (
                <FormItem><FormLabel>Catatan Tambahan</FormLabel><FormControl><Input placeholder="Catatan internal..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransaksiPage;