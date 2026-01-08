import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, HeartHandshake, Mic, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { TextToSpeechPlayer } from "@/components/common/TextToSpeechPlayer";
import { cn } from "@/lib/utils";
import { apiClient } from "@/services/api-client";

// --- Schema ---
const formSchema = z.object({
  judulPokokDoa: z.string().min(3, "Judul wajib diisi"),
  kategoriDoa: z.string().min(1, "Pilih kategori"),
  deskripsiDoa: z.string().min(10, "Deskripsi minimal 10 karakter"),
  pengajuDoa: z.string().min(1, "Pilih pengaju"),
  tanggalPengajuan: z.date(),
  tingkatPrioritas: z.string().default("Sedang"),
  statusDoa: z.string().default("AKTIF"),
  tanggalTerjawab: z.date().optional(),
  kesaksianJawabanDoa: z.string().optional(),
  
  // TTS
  ttsStatus: z.boolean().default(true),
  ttsBahasa: z.string().default("id-ID"),
  ttsKecepatanBaca: z.string().default("1"),
  
  // Meta
  statusTampil: z.string().default("PUBLIK"),
  catatanDoa: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface PokokDoa extends FormValues { id: string; }

const KATEGORI_DOA = ["Pribadi", "Keluarga", "Gereja", "Bangsa", "Misi", "Sakit Penyakit"];

const PokokDoaPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch Data
  const { data: listDoa, isLoading } = useQuery({
    queryKey: ['pokok-doa'],
    queryFn: async () => {
      const response = await apiClient.get<PokokDoa[]>('/doa');
      return response as unknown as PokokDoa[];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judulPokokDoa: "", kategoriDoa: "", deskripsiDoa: "", pengajuDoa: "Jemaat",
      tanggalPengajuan: new Date(), tingkatPrioritas: "Sedang", statusDoa: "AKTIF",
      ttsStatus: true, ttsBahasa: "id-ID", ttsKecepatanBaca: "1",
      statusTampil: "PUBLIK", catatanDoa: ""
    },
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        tanggalPengajuan: values.tanggalPengajuan.toISOString(),
        tanggalTerjawab: values.tanggalTerjawab?.toISOString(),
      };
      if (editingId) {
        return apiClient.patch(`/doa/${editingId}`, payload);
      }
      return apiClient.post('/doa', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokok-doa'] });
      toast.success(editingId ? "Pokok doa diperbarui" : "Pokok doa ditambahkan");
      setIsDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/doa/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokok-doa'] });
      toast.success("Pokok doa dihapus");
    }
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      judulPokokDoa: "", kategoriDoa: "", deskripsiDoa: "", pengajuDoa: "Jemaat",
      tanggalPengajuan: new Date(), tingkatPrioritas: "Sedang", statusDoa: "AKTIF",
      ttsStatus: true, ttsBahasa: "id-ID", ttsKecepatanBaca: "1",
      statusTampil: "PUBLIK", catatanDoa: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: PokokDoa) => {
    setEditingId(item.id);
    form.reset({ 
      ...item,
      tanggalPengajuan: new Date(item.tanggalPengajuan),
      tanggalTerjawab: item.tanggalTerjawab ? new Date(item.tanggalTerjawab) : undefined
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pokok Doa" description="Daftar permohonan doa jemaat dan gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Buat Pokok Doa</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pokok Doa</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Pengaju</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>TTS</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></TableCell></TableRow>
            ) : listDoa?.length === 0 ? (
               <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
            ) : listDoa?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.judulPokokDoa}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarIcon className="h-3 w-3" /> {format(new Date(item.tanggalPengajuan), "dd MMM yyyy", { locale: localeId })}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategoriDoa}</Badge></TableCell>
                <TableCell>{item.pengajuDoa}</TableCell>
                <TableCell>
                  <Badge variant={item.statusDoa === "AKTIF" ? "default" : item.statusDoa === "TERJAWAB" ? "secondary" : "destructive"}>
                    {item.statusDoa}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.ttsStatus ? (
                    <TextToSpeechPlayer 
                      text={`Pokok doa: ${item.judulPokokDoa}. ${item.deskripsiDoa}`} 
                      rate={parseFloat(item.ttsKecepatanBaca)}
                      lang={item.ttsBahasa}
                    />
                  ) : <span className="text-muted-foreground text-xs">-</span>}
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
            <DialogTitle>{editingId ? "Edit Pokok Doa" : "Buat Pokok Doa Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="judulPokokDoa" render={({ field }) => (
                <FormItem><FormLabel>Judul Pokok Doa</FormLabel><FormControl><Input placeholder="Topik doa..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kategoriDoa" render={({ field }) => (
                  <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_DOA.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tingkatPrioritas" render={({ field }) => (
                  <FormItem><FormLabel>Prioritas</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Rendah">Rendah</SelectItem><SelectItem value="Sedang">Sedang</SelectItem><SelectItem value="Tinggi">Tinggi</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="deskripsiDoa" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi Doa</FormLabel><FormControl><Textarea className="h-24" placeholder="Detail permohonan doa..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="pengajuDoa" render={({ field }) => (
                   <FormItem><FormLabel>Pengaju</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Jemaat">Jemaat</SelectItem><SelectItem value="Pendeta">Pendeta</SelectItem><SelectItem value="Anonim">Anonim</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="tanggalPengajuan" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2"><Mic className="h-4 w-4" /> <span className="font-medium text-sm">Pengaturan Audio (TTS)</span></div>
                   <FormField control={form.control} name="ttsStatus" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                </div>
                {form.watch("ttsStatus") && (
                   <div className="flex items-center gap-4">
                      <FormField control={form.control} name="ttsKecepatanBaca" render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel className="text-xs">Kecepatan</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="0.8">Lambat</SelectItem><SelectItem value="1">Normal</SelectItem><SelectItem value="1.2">Cepat</SelectItem></SelectContent></Select></FormItem>
                      )} />
                      <div className="flex-1 pt-4">
                         <TextToSpeechPlayer text={form.watch("deskripsiDoa") || "Tes audio"} rate={parseFloat(form.watch("ttsKecepatanBaca"))} />
                      </div>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="statusDoa" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="TERJAWAB">Terjawab</SelectItem><SelectItem value="DITUTUP">Ditutup</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="statusTampil" render={({ field }) => (
                  <FormItem><FormLabel>Visibilitas</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="PUBLIK">Publik</SelectItem><SelectItem value="INTERNAL">Internal</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              {form.watch("statusDoa") === "TERJAWAB" && (
                 <FormField control={form.control} name="kesaksianJawabanDoa" render={({ field }) => (
                    <FormItem><FormLabel>Kesaksian Jawaban Doa</FormLabel><FormControl><Textarea className="h-20" placeholder="Ceritakan bagaimana Tuhan menjawab..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
              )}

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PokokDoaPage;
