import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  jenisPersembahan: z.string().min(1, "Jenis wajib dipilih"),
  tanggalPersembahan: z.date({ required_error: "Tanggal wajib diisi" }),
  ibadahKegiatan: z.string().min(1, "Ibadah wajib dipilih"),
  nominal: z.coerce.number().min(1, "Nominal harus lebih dari 0"),
  metodePemberian: z.string().min(1, "Metode wajib dipilih"),
  namaPemberi: z.string().default("Anonim"),
  kategoriJemaat: z.string().optional(),
  tujuanPersembahan: z.string().min(1, "Tujuan wajib diisi"),
  statusPencatatan: z.string().default("TERCATAT"),
  petugasPencatat: z.string().min(1, "Petugas wajib diisi"),
  catatanPersembahan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Persembahan extends FormValues { id: string; }

const JENIS_OPTIONS = ["Persembahan Mingguan", "Persepuluhan", "Ucapan Syukur", "Diakonia", "Misi", "Pembangunan", "Khusus"];
const IBADAH_OPTIONS = ["Ibadah Raya 1", "Ibadah Raya 2", "Ibadah Youth", "Transfer Bank", "QRIS"];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const PersembahanPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data
  const { data: offerings, isLoading } = useQuery({
    queryKey: ['persembahan'],
    queryFn: async () => {
      const response = await apiClient.get<Persembahan[]>('/keuangan/persembahan');
      return response as unknown as Persembahan[];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisPersembahan: "", tanggalPersembahan: new Date(), ibadahKegiatan: "",
      nominal: 0, metodePemberian: "Tunai", namaPemberi: "Anonim", kategoriJemaat: "",
      tujuanPersembahan: "Kas Umum", statusPencatatan: "TERCATAT", petugasPencatat: "", catatanPersembahan: ""
    },
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        tanggalPersembahan: values.tanggalPersembahan.toISOString(),
      };
      if (editingId) {
        return apiClient.patch(`/keuangan/persembahan/${editingId}`, payload);
      }
      return apiClient.post('/keuangan/persembahan', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persembahan'] });
      toast.success(editingId ? "Persembahan diperbarui" : "Persembahan dicatat");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/keuangan/persembahan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persembahan'] });
      toast.success("Data berhasil dihapus");
    }
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenisPersembahan: "", tanggalPersembahan: new Date(), ibadahKegiatan: "",
      nominal: 0, metodePemberian: "Tunai", namaPemberi: "Anonim", kategoriJemaat: "",
      tujuanPersembahan: "Kas Umum", statusPencatatan: "TERCATAT", petugasPencatat: "", catatanPersembahan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Persembahan) => {
    setEditingId(item.id);
    form.reset({ ...item, tanggalPersembahan: new Date(item.tanggalPersembahan) });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const filteredData = offerings?.filter(item => 
    item.jenisPersembahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.namaPemberi.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            {isLoading ? (
               <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></TableCell></TableRow>
            ) : filteredData.length === 0 ? (
               <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                     {format(new Date(item.tanggalPersembahan), "dd MMM yyyy", { locale: localeId })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.jenisPersembahan}</span>
                      <span className="text-xs text-muted-foreground">{item.ibadahKegiatan}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatRupiah(item.nominal)}
                  </TableCell>
                  <TableCell className="text-sm">{item.metodePemberian}</TableCell>
                  <TableCell className="text-sm">{item.namaPemberi}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusPencatatan === "DIVERIFIKASI" ? "default" : "secondary"}>
                      {item.statusPencatatan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => handleDelete(item.id)} variant="destructive" />
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
            <DialogTitle>{editingId ? "Edit Persembahan" : "Input Persembahan Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="jenisPersembahan" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Persembahan</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent>{JENIS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tanggalPersembahan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="ibadahKegiatan" render={({ field }) => (
                   <FormItem><FormLabel>Sumber Ibadah / Kegiatan</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Sumber" /></SelectTrigger></FormControl><SelectContent>{IBADAH_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="nominal" render={({ field }) => (
                   <FormItem><FormLabel>Nominal (Rp)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="metodePemberian" render={({ field }) => (
                   <FormItem><FormLabel>Metode Pemberian</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Metode" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Tunai">Tunai</SelectItem><SelectItem value="Transfer">Transfer</SelectItem><SelectItem value="QRIS">QRIS</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="namaPemberi" render={({ field }) => (
                   <FormItem><FormLabel>Nama Pemberi</FormLabel><FormControl><Input placeholder="Isi 'Anonim' jika tidak ada nama" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tujuanPersembahan" render={({ field }) => (
                   <FormItem><FormLabel>Alokasi / Tujuan</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Tujuan" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Kas Umum">Kas Umum</SelectItem><SelectItem value="Operasional">Operasional</SelectItem><SelectItem value="Pembangunan">Pembangunan</SelectItem><SelectItem value="Diakonia">Diakonia</SelectItem><SelectItem value="Misi">Misi</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="petugasPencatat" render={({ field }) => (
                   <FormItem><FormLabel>Petugas Pencatat</FormLabel><FormControl><Input placeholder="Nama Petugas" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              
              <FormField control={form.control} name="statusPencatatan" render={({ field }) => (
                <FormItem><FormLabel>Status Verifikasi</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="TERCATAT">Tercatat</SelectItem><SelectItem value="DIVERIFIKASI">Diverifikasi (Bendahara)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="catatanPersembahan" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Keterangan tambahan..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersembahanPage;