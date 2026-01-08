import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Plus, Trash2, CalendarIcon, FileSpreadsheet, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
import { apiClient } from "@/services/api-client";

const formSchema = z.object({
  jenisLaporan: z.string().min(1, "Jenis wajib dipilih"),
  tanggalMulai: z.date(),
  tanggalSelesai: z.date(),
  totalPemasukan: z.coerce.number(),
  totalPengeluaran: z.coerce.number(),
  saldoAwal: z.coerce.number(),
  saldoAkhir: z.coerce.number(),
  ringkasanLaporan: z.string().optional(),
  disusunOleh: z.string().min(1, "Penyusun wajib diisi"),
  statusLaporan: z.string().default("DRAFT"),
});

type FormValues = z.infer<typeof formSchema>;
interface Laporan extends FormValues { id: string; }

const JENIS_LAPORAN = ["Harian", "Mingguan", "Bulanan", "Tahunan", "Event Khusus"];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const LaporanKeuanganPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Fetch Data
  const { data: reports, isLoading } = useQuery({
    queryKey: ['laporan-keuangan'],
    queryFn: async () => {
      const response = await apiClient.get<Laporan[]>('/keuangan/laporan');
      return response as unknown as Laporan[];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisLaporan: "Bulanan", tanggalMulai: new Date(), tanggalSelesai: new Date(),
      totalPemasukan: 0, totalPengeluaran: 0, saldoAwal: 0, saldoAkhir: 0,
      ringkasanLaporan: "", disusunOleh: "", statusLaporan: "DRAFT"
    },
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        tanggalMulai: values.tanggalMulai.toISOString(),
        tanggalSelesai: values.tanggalSelesai.toISOString(),
      };
      if (editingId) {
        return apiClient.patch(`/keuangan/laporan/${editingId}`, payload);
      }
      return apiClient.post('/keuangan/laporan', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laporan-keuangan'] });
      toast.success(editingId ? "Laporan diperbarui" : "Laporan dibuat");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/keuangan/laporan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laporan-keuangan'] });
      toast.success("Laporan dihapus");
    }
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenisLaporan: "Bulanan", tanggalMulai: new Date(), tanggalSelesai: new Date(),
      totalPemasukan: 0, totalPengeluaran: 0, saldoAwal: 0, saldoAkhir: 0,
      ringkasanLaporan: "", disusunOleh: "", statusLaporan: "DRAFT"
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Laporan) => {
    setEditingId(item.id);
    form.reset({ 
      ...item, 
      tanggalMulai: new Date(item.tanggalMulai), 
      tanggalSelesai: new Date(item.tanggalSelesai) 
    });
    setIsDialogOpen(true);
  };

  const calculateSaldoAkhir = () => {
    const awal = Number(form.getValues("saldoAwal"));
    const masuk = Number(form.getValues("totalPemasukan"));
    const keluar = Number(form.getValues("totalPengeluaran"));
    form.setValue("saldoAkhir", awal + masuk - keluar);
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
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
            {isLoading ? (
               <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></TableCell></TableRow>
            ) : reports?.length === 0 ? (
               <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
            ) : (
              reports?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{format(new Date(item.tanggalMulai), "dd MMM yyyy", { locale: localeId })}</span>
                      <span className="text-muted-foreground text-xs">s/d {format(new Date(item.tanggalSelesai), "dd MMM yyyy", { locale: localeId })}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.jenisLaporan}</Badge></TableCell>
                  <TableCell className="text-green-600">{formatRupiah(item.totalPemasukan)}</TableCell>
                  <TableCell className="text-red-600">{formatRupiah(item.totalPengeluaran)}</TableCell>
                  <TableCell className="font-bold">{formatRupiah(item.saldoAkhir)}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusLaporan === "FINAL" ? "default" : "secondary"}>
                      {item.statusLaporan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon" title="Hapus"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate(item.id)} variant="destructive" />
                      <Button variant="ghost" size="icon" title="Export Excel"><FileSpreadsheet className="h-4 w-4 text-green-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Laporan" : "Buat Laporan Keuangan"}</DialogTitle>
            <DialogDescription>Masukkan ringkasan keuangan untuk periode tertentu.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="jenisLaporan" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Laporan</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{JENIS_LAPORAN.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="statusLaporan" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="FINAL">Final</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggalMulai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="tanggalSelesai" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Selesai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
              </div>
              
              <div className="bg-muted p-4 rounded-md space-y-4">
                 <h4 className="font-medium text-sm">Ringkasan Angka (Manual Input / Auto)</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="saldoAwal" render={({ field }) => (
                       <FormItem><FormLabel>Saldo Awal</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="totalPemasukan" render={({ field }) => (
                       <FormItem><FormLabel className="text-green-600">Total Pemasukan</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="totalPengeluaran" render={({ field }) => (
                       <FormItem><FormLabel className="text-red-600">Total Pengeluaran</FormLabel><FormControl><Input type="number" {...field} onChange={e => { field.onChange(e); calculateSaldoAkhir(); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="saldoAkhir" render={({ field }) => (
                       <FormItem><FormLabel className="font-bold">Saldo Akhir (Estimasi)</FormLabel><FormControl><Input type="number" readOnly className="bg-muted font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
              </div>

              <FormField control={form.control} name="ringkasanLaporan" render={({ field }) => (
                <FormItem><FormLabel>Ringkasan Eksekutif</FormLabel><FormControl><Textarea className="h-24 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="disusunOleh" render={({ field }) => (
                <FormItem><FormLabel>Disusun Oleh</FormLabel><FormControl><Input placeholder="Nama Penyusun" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan Laporan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaporanKeuanganPage;