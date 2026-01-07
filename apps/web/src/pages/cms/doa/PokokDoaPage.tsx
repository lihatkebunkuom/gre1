import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, CalendarIcon, HeartHandshake, Mic } from "lucide-react";
import { toast } from "sonner";

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

// --- Schema ---
const formSchema = z.object({
  judul_pokok_doa: z.string().min(3, "Judul wajib diisi"),
  kategori_doa: z.string().min(1, "Pilih kategori"),
  deskripsi_doa: z.string().min(10, "Deskripsi minimal 10 karakter"),
  pengaju_doa: z.string().min(1, "Pilih pengaju"),
  tanggal_pengajuan: z.date(),
  tingkat_prioritas: z.string().default("Sedang"),
  status_doa: z.string().default("AKTIF"),
  tanggal_terjawab: z.date().optional(),
  kesaksian_jawaban_doa: z.string().optional(),
  
  // TTS
  tts_status: z.boolean().default(true),
  tts_bahasa: z.string().default("id-ID"),
  tts_kecepatan_baca: z.string().default("1"),
  
  // Meta
  status_tampil: z.string().default("PUBLIK"),
  catatan_doa: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface PokokDoa extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: PokokDoa[] = [
  { 
    id: "1", judul_pokok_doa: "Kesembuhan Ibu Ani", kategori_doa: "Keluarga", 
    deskripsi_doa: "Mohon dukungan doa untuk Ibu Ani yang sedang dirawat di RS karena demam berdarah.", 
    pengaju_doa: "Jemaat", tanggal_pengajuan: new Date("2023-11-25"), tingkat_prioritas: "Tinggi", 
    status_doa: "AKTIF", tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1", 
    status_tampil: "PUBLIK", catatan_doa: "" 
  },
  { 
    id: "2", judul_pokok_doa: "Persiapan Natal", kategori_doa: "Gereja", 
    deskripsi_doa: "Berdoa untuk panitia natal agar diberi hikmat dalam persiapan acara bulan depan.", 
    pengaju_doa: "Pendeta", tanggal_pengajuan: new Date("2023-11-20"), tingkat_prioritas: "Sedang", 
    status_doa: "AKTIF", tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1", 
    status_tampil: "PUBLIK", catatan_doa: "" 
  },
];

const KATEGORI_DOA = ["Pribadi", "Keluarga", "Gereja", "Bangsa", "Misi", "Sakit Penyakit"];

const PokokDoaPage = () => {
  const [data, setData] = useState<PokokDoa[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul_pokok_doa: "", kategori_doa: "", deskripsi_doa: "", pengaju_doa: "Jemaat",
      tanggal_pengajuan: new Date(), tingkat_prioritas: "Sedang", status_doa: "AKTIF",
      tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1",
      status_tampil: "PUBLIK", catatan_doa: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      judul_pokok_doa: "", kategori_doa: "", deskripsi_doa: "", pengaju_doa: "Jemaat",
      tanggal_pengajuan: new Date(), tingkat_prioritas: "Sedang", status_doa: "AKTIF",
      tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1",
      status_tampil: "PUBLIK", catatan_doa: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: PokokDoa) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Pokok doa dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Pokok doa diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Pokok doa ditambahkan");
    }
    setIsDialogOpen(false);
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
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.judul_pokok_doa}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarIcon className="h-3 w-3" /> {format(item.tanggal_pengajuan, "dd MMM yyyy", { locale: localeId })}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategori_doa}</Badge></TableCell>
                <TableCell>{item.pengaju_doa}</TableCell>
                <TableCell>
                  <Badge variant={item.status_doa === "AKTIF" ? "default" : item.status_doa === "TERJAWAB" ? "secondary" : "destructive"}>
                    {item.status_doa}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.tts_status ? (
                    <TextToSpeechPlayer 
                      text={`Pokok doa: ${item.judul_pokok_doa}. ${item.deskripsi_doa}`} 
                      rate={parseFloat(item.tts_kecepatan_baca)}
                      lang={item.tts_bahasa}
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
              <FormField control={form.control} name="judul_pokok_doa" render={({ field }) => (
                <FormItem><FormLabel>Judul Pokok Doa</FormLabel><FormControl><Input placeholder="Topik doa..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kategori_doa" render={({ field }) => (
                  <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_DOA.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tingkat_prioritas" render={({ field }) => (
                  <FormItem><FormLabel>Prioritas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Rendah">Rendah</SelectItem><SelectItem value="Sedang">Sedang</SelectItem><SelectItem value="Tinggi">Tinggi</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="deskripsi_doa" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi Doa</FormLabel><FormControl><Textarea className="h-24" placeholder="Detail permohonan doa..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="pengaju_doa" render={({ field }) => (
                   <FormItem><FormLabel>Pengaju</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Jemaat">Jemaat</SelectItem><SelectItem value="Pendeta">Pendeta</SelectItem><SelectItem value="Anonim">Anonim</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="tanggal_pengajuan" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2"><Mic className="h-4 w-4" /> <span className="font-medium text-sm">Pengaturan Audio (TTS)</span></div>
                   <FormField control={form.control} name="tts_status" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                </div>
                {form.watch("tts_status") && (
                   <div className="flex items-center gap-4">
                      <FormField control={form.control} name="tts_kecepatan_baca" render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel className="text-xs">Kecepatan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="0.8">Lambat</SelectItem><SelectItem value="1">Normal</SelectItem><SelectItem value="1.2">Cepat</SelectItem></SelectContent></Select></FormItem>
                      )} />
                      <div className="flex-1 pt-4">
                         <TextToSpeechPlayer text={form.watch("deskripsi_doa") || "Tes audio"} rate={parseFloat(form.watch("tts_kecepatan_baca"))} />
                      </div>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status_doa" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="TERJAWAB">Terjawab</SelectItem><SelectItem value="DITUTUP">Ditutup</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status_tampil" render={({ field }) => (
                  <FormItem><FormLabel>Visibilitas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="PUBLIK">Publik</SelectItem><SelectItem value="INTERNAL">Internal</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              {form.watch("status_doa") === "TERJAWAB" && (
                 <FormField control={form.control} name="kesaksian_jawaban_doa" render={({ field }) => (
                    <FormItem><FormLabel>Kesaksian Jawaban Doa</FormLabel><FormControl><Textarea className="h-20" placeholder="Ceritakan bagaimana Tuhan menjawab..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
              )}

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PokokDoaPage;