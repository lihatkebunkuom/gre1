import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, Book, Mic } from "lucide-react";
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { TextToSpeechPlayer } from "@/components/common/TextToSpeechPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Schema ---
const formSchema = z.object({
  versi_alkitab: z.string().min(1, "Versi wajib dipilih"),
  kitab: z.string().min(1, "Kitab wajib dipilih"),
  pasal: z.coerce.number().min(1),
  ayat: z.coerce.number().min(1),
  teks_ayat: z.string().min(5, "Teks ayat wajib diisi"),
  bahasa: z.string().default("id-ID"),
  kategori_ayat: z.string().optional(),
  kata_kunci: z.string().optional(),
  
  // TTS Fields
  tts_status: z.boolean().default(true),
  tts_bahasa: z.string().default("id-ID"),
  tts_kecepatan_baca: z.string().default("1"),
  
  // Meta
  status_tampil: z.string().default("AKTIF"),
  catatan_ayat: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface AyatAlkitab extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: AyatAlkitab[] = [
  { 
    id: "1", versi_alkitab: "TB", kitab: "Yohanes", pasal: 3, ayat: 16, 
    teks_ayat: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.", 
    bahasa: "id-ID", kategori_ayat: "Penguatan", kata_kunci: "kasih, keselamatan",
    tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1", status_tampil: "AKTIF", catatan_ayat: "" 
  },
  { 
    id: "2", versi_alkitab: "TB", kitab: "Mazmur", pasal: 23, ayat: 1, 
    teks_ayat: "TUHAN adalah gembalaku, takkan kekurangan aku.", 
    bahasa: "id-ID", kategori_ayat: "Doa", kata_kunci: "gembala, pemeliharaan",
    tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "0.8", status_tampil: "AKTIF", catatan_ayat: "" 
  },
];

// DATA LENGKAP KITAB
const KITAB_PL = [
  "Kejadian", "Keluaran", "Imamat", "Bilangan", "Ulangan", "Yosua", "Hakim-hakim", "Rut", 
  "1 Samuel", "2 Samuel", "1 Raja-raja", "2 Raja-raja", "1 Tawarikh", "2 Tawarikh", "Ezra", "Nehemia", "Ester",
  "Ayub", "Mazmur", "Amsal", "Pengkhotbah", "Kidung Agung",
  "Yesaya", "Yeremia", "Ratapan", "Yehezkiel", "Daniel",
  "Hosea", "Yoel", "Amos", "Obaja", "Yunus", "Mikha", "Nahum", "Habakuk", "Zefanya", "Hagai", "Zakharia", "Maleakhi"
];

const KITAB_PB = [
  "Matius", "Markus", "Lukas", "Yohanes", "Kisah Para Rasul",
  "Roma", "1 Korintus", "2 Korintus", "Galatia", "Efesus", "Filipi", "Kolose", 
  "1 Tesalonika", "2 Tesalonika", "1 Timotius", "2 Timotius", "Titus", "Filemon", "Ibrani", "Yakobus",
  "1 Petrus", "2 Petrus", "1 Yohanes", "2 Yohanes", "3 Yohanes", "Yudas",
  "Wahyu"
];

const VERSI_OPTIONS = ["TB (Terjemahan Baru)", "BIS (Bahasa Indonesia Sehari-hari)", "NIV (English)"];

const AlkitabPage = () => {
  const [data, setData] = useState<AyatAlkitab[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      versi_alkitab: "TB", kitab: "", pasal: 1, ayat: 1, teks_ayat: "", bahasa: "id-ID",
      kategori_ayat: "", kata_kunci: "", tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1",
      status_tampil: "AKTIF", catatan_ayat: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      versi_alkitab: "TB", kitab: "", pasal: 1, ayat: 1, teks_ayat: "", bahasa: "id-ID",
      kategori_ayat: "", kata_kunci: "", tts_status: true, tts_bahasa: "id-ID", tts_kecepatan_baca: "1",
      status_tampil: "AKTIF", catatan_ayat: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: AyatAlkitab) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Ayat berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Ayat diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Ayat ditambahkan");
    }
    setIsDialogOpen(false);
  };

  // Helper untuk preview text TTS
  const watchTeks = form.watch("teks_ayat");
  const watchRate = form.watch("tts_kecepatan_baca");
  const watchLang = form.watch("tts_bahasa");

  return (
    <div className="space-y-6">
      <PageHeader title="Alkitab Digital" description="Kelola konten ayat harian dan referensi Alkitab dengan fitur audio.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Ayat</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Referensi</TableHead>
              <TableHead>Isi Ayat</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>TTS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.kitab} {item.pasal}:{item.ayat}</div>
                  <div className="text-xs text-muted-foreground">{item.versi_alkitab}</div>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 text-sm italic">"{item.teks_ayat}"</p>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategori_ayat}</Badge></TableCell>
                <TableCell>
                  {item.tts_status ? (
                    <TextToSpeechPlayer 
                      text={`${item.kitab} pasal ${item.pasal} ayat ${item.ayat}. ${item.teks_ayat}`} 
                      rate={parseFloat(item.tts_kecepatan_baca)}
                      lang={item.tts_bahasa}
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.status_tampil === "AKTIF" ? "default" : "secondary"}>
                    {item.status_tampil}
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
            <DialogTitle>{editingId ? "Edit Ayat" : "Tambah Ayat Baru"}</DialogTitle>
            <DialogDescription>Masukkan teks ayat dan atur pembacaan audio.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="konten" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="konten">Konten Ayat</TabsTrigger>
                  <TabsTrigger value="audio">Audio & TTS</TabsTrigger>
                </TabsList>
                
                <TabsContent value="konten" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="versi_alkitab" render={({ field }) => (
                      <FormItem><FormLabel>Versi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Versi" /></SelectTrigger></FormControl><SelectContent>{VERSI_OPTIONS.map(opt => <SelectItem key={opt} value={opt.split(" ")[0]}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="kitab" render={({ field }) => (
                      <FormItem><FormLabel>Kitab</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kitab" /></SelectTrigger></FormControl>
                          <SelectContent className="max-h-[300px]">
                            <SelectGroup>
                              <SelectLabel>Perjanjian Lama</SelectLabel>
                              {KITAB_PL.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Perjanjian Baru</SelectLabel>
                              {KITAB_PB.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="pasal" render={({ field }) => (
                      <FormItem><FormLabel>Pasal</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ayat" render={({ field }) => (
                      <FormItem><FormLabel>Ayat</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="teks_ayat" render={({ field }) => (
                    <FormItem><FormLabel>Isi Teks Ayat</FormLabel><FormControl><Textarea className="h-24" placeholder="Tuliskan isi ayat..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="kategori_ayat" render={({ field }) => (
                      <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Penguatan">Penguatan</SelectItem><SelectItem value="Doa">Doa</SelectItem><SelectItem value="Janji Tuhan">Janji Tuhan</SelectItem><SelectItem value="Teguran">Teguran</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="kata_kunci" render={({ field }) => (
                      <FormItem><FormLabel>Kata Kunci</FormLabel><FormControl><Input placeholder="kasih, damai (pisahkan koma)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between border rounded-lg p-4 bg-muted/20">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktifkan Text to Speech</FormLabel>
                      <FormDescription>Izinkan ayat ini dibacakan oleh sistem.</FormDescription>
                    </div>
                    <FormField control={form.control} name="tts_status" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>

                  {form.watch("tts_status") && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="tts_bahasa" render={({ field }) => (
                          <FormItem><FormLabel>Bahasa Suara</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="id-ID">Indonesia</SelectItem><SelectItem value="en-US">English (US)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="tts_kecepatan_baca" render={({ field }) => (
                          <FormItem><FormLabel>Kecepatan Baca</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="0.5">Lambat (0.5x)</SelectItem><SelectItem value="0.8">Sedang (0.8x)</SelectItem><SelectItem value="1">Normal (1.0x)</SelectItem><SelectItem value="1.2">Cepat (1.2x)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                      </div>
                      
                      <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-md">
                        <span className="text-sm font-medium flex items-center gap-2"><Mic className="h-4 w-4" /> Preview Suara</span>
                        <TextToSpeechPlayer 
                          text={watchTeks || "Contoh suara pembacaan ayat."} 
                          rate={parseFloat(watchRate)} 
                          lang={watchLang}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="status_tampil" render={({ field }) => (
                      <FormItem><FormLabel>Status Tampil</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="NONAKTIF">Nonaktif</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="catatan_ayat" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Internal</FormLabel><FormControl><Input placeholder="Catatan editor..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </TabsContent>
              </Tabs>

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlkitabPage;