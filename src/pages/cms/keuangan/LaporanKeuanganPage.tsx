import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FileDown, Plus, Trash2, CalendarIcon, FileSpreadsheet, Eye } from "lucide-react";
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
  jenis_laporan: z.string().min(1, "Jenis wajib dipilih"),
  tanggal_mulai: z.date(),
  tanggal_selesai: z.date(),
  total_pemasukan: z.coerce.number(),
  total_pengeluaran: z.coerce.number(),
  saldo_awal: z.coerce.number(),
  saldo_akhir: z.coerce.number(),
  ringkasan_laporan: z.string().optional(),
  disusun_oleh: z.string().min(1, "Penyusun wajib diisi"),
  status_laporan: z.string().default("DRAFT"),
});

type FormValues = z.infer<typeof formSchema>;
interface Laporan extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: Laporan[] = [
  { 
    id: "1", jenis_laporan: "Bulanan", tanggal_mulai: new Date("2023-10-01"), tanggal_selesai: new Date("2023-10-31"),
    total_pemasukan: 50000000, total_pengeluaran: 35000000, saldo_awal: 10000000, saldo_akhir: 25000000,
    ringkasan_laporan: "Surplus kas bulan Oktober.", disusun_oleh: "Bendahara", status_laporan: "FINAL"
  },
];

const JENIS_LAPORAN = ["Harian", "Mingguan", "Bulanan", "Tahunan", "Event Khusus"];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const LaporanKeuanganPage = () => {
  const [data, setData] = useState<Laporan[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_laporan: "Bulanan", tanggal_mulai: new Date(), tanggal_selesai: new Date(),
      total_pemasukan: 0, total_pengeluaran: 0, saldo_awal: 0, saldo_akhir: 0,
      ringkasan_laporan: "", disusun_oleh: "", status_laporan: "DRAFT"
    },
  });

  const handleAddNew = () => {
    form.reset({
      jenis_laporan: "Bulanan", tanggal_mulai: new Date(), tanggal_selesai: new Date(),
      total_pemasukan: 0, total_pengeluaran: 0, saldo_awal: 0, saldo_akhir: 0,
      ringkasan_laporan: "", disusun_oleh: "", status_laporan: "DRAFT"
    });
    setIsDialogOpen(true);
  };

  const calculateSaldoAkhir = () => {
    const awal = Number(form.getValues("saldo_awal"));
    const masuk = Number(form.getValues("total_pemasukan"));
    const keluar = Number(form.getValues("total_pengeluaran"));
    form.setValue("saldo_akhir", awal + masuk - keluar);
  };

  const onSubmit = (values: FormValues) => {
    setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
    toast.success("Laporan keuangan dibuat");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Keuangan" description="Rekapitulasi dan pelaporan kondisi keuangan gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Buat Laporan Baru</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Pemasukan</TableHead>
              <TableHead>Pengeluaran</TableHead>
              <TableHead>Saldo Akhir</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{format(item.tanggal_mulai, "dd MMM yyyy", { locale: localeId })}</span>
                    <span className="text-muted-foreground text-xs">s/d {format(item.tanggal_selesai, "dd MMM yyyy", { locale: localeId })}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.jenis_laporan}</Badge></TableCell>
                <TableCell className="text-green-600">{formatRupiah(item.total_pemasukan)}</TableCell>
                <TableCell className="text-red-600">{formatRupiah(item.total_pengeluaran)}</TableCell>
                <TableCell className="font-bold">{formatRupiah(item.saldo_akhir)}</TableCell>
                <TableCell>
                  <Badge variant={item.status_laporan === "FINAL" ? "default" : "secondary"}>
                    {item.status_laporan}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Lihat Detail"><Eye className="h-4 w-4 text-blue-500" /></Button>
                    <Button variant="ghost" size="icon" title="Export Excel"><FileSpreadsheet className="h-4 w-4 text-green-600" /></Button>
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
            <DialogTitle>Buat Laporan Keuangan</DialogTitle>
            <DialogDescription>Masukkan ringkasan keuangan untuk periode tertentu.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="jenis_laporan" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Laporan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{JENIS_LAPORAN.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_laporan" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="FINAL">Final</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggal_mulai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="tanggal_selesai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Selesai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
              </div>
              
              <div className="bg-muted p-4 rounded-md space-y-4">
                 <h4 className="font-medium text-sm">Ringkasan Angka (Manual Input / Auto)</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="saldo_awal" render={({ field }) => (
                       <FormItem><FormLabel>Saldo Awal</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="total_pemasukan" render={({ field }) => (
                       <FormItem><FormLabel className="text-green-600">Total Pemasukan</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="total_pengeluaran" render={({ field }) => (
                       <FormItem><FormLabel className="text-red-600">Total Pengeluaran</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="saldo_akhir" render={({ field }) => (
                       <FormItem><FormLabel className="font-bold">Saldo Akhir (Estimasi)</FormLabel><FormControl><Input type="number" readOnly className="bg-muted font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
              </div>

              <FormField control={form.control} name="ringkasan_laporan" render={({ field }) => (
                <FormItem><FormLabel>Ringkasan Eksekutif</FormLabel><FormControl><Textarea className="h-24 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="disusun_oleh" render={({ field }) => (
                <FormItem><FormLabel>Disusun Oleh</FormLabel><FormControl><Input placeholder="Nama Penyusun" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan Laporan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaporanKeuanganPage;