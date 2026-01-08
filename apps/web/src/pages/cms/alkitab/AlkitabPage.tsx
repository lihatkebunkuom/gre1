import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, Book, Mic, Keyboard, Loader2 } from "lucide-react";
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { TextToSpeechPlayer } from "@/components/common/TextToSpeechPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/services/api-client";

// --- Schema ---
const formSchema = z.object({
  versiAlkitab: z.string().min(1, "Versi wajib diisi"),
  kitab: z.string().min(1, "Kitab wajib diisi"),
  pasal: z.coerce.number().min(1),
  ayat: z.coerce.number().min(1),
  teksAyat: z.string().min(5, "Teks ayat wajib diisi"),
  bahasa: z.string().default("id-ID"),
  kategoriAyat: z.string().optional(),
  kataKunci: z.string().optional(),
  
  // TTS Fields
  ttsStatus: z.boolean().default(true),
  ttsBahasa: z.string().default("id-ID"),
  ttsKecepatanBaca: z.string().default("1"),
  
  // Meta
  statusTampil: z.string().default("AKTIF"),
  catatanAyat: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface AyatAlkitab extends FormValues { id: string; }

// DATA LENGKAP KITAB
const KITAB_PL = [
  "Kejadian", "Keluaran", "Imamat", "Bilangan", "Ulangan", "Yosua", "Hakim-hamim", "Rut", 
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
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State untuk toggle input manual
  const [manualVersi, setManualVersi] = useState(false);
  const [manualKitab, setManualKitab] = useState(false);

  // Fetch Data
  const { data: listAyat, isLoading } = useQuery({
    queryKey: ['alkitab'],
    queryFn: async () => {
      const response = await apiClient.get<AyatAlkitab[]>('/alkitab');
      return response as unknown as AyatAlkitab[];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      versiAlkitab: "TB", kitab: "", pasal: 1, ayat: 1, teksAyat: "", bahasa: "id-ID",
      kategoriAyat: "", kataKunci: "", ttsStatus: true, ttsBahasa: "id-ID", ttsKecepatanBaca: "1",
      statusTampil: "AKTIF", catatanAyat: ""
    },
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (editingId) {
        return apiClient.patch(`/alkitab/${editingId}`, values);
      }
      return apiClient.post('/alkitab', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alkitab'] });
      toast.success(editingId ? "Ayat diperbarui" : "Ayat ditambahkan");
      setIsDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/alkitab/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alkitab'] });
      toast.success("Ayat berhasil dihapus");
    }
  });

  const handleAddNew = () => {
    setEditingId(null);
    setManualVersi(false);
    setManualKitab(false);
    form.reset({
      versiAlkitab: "TB", kitab: "", pasal: 1, ayat: 1, teksAyat: "", bahasa: "id-ID",
      kategoriAyat: "", kataKunci: "", ttsStatus: true, ttsBahasa: "id-ID", ttsKecepatanBaca: "1",
      statusTampil: "AKTIF", catatanAyat: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: AyatAlkitab) => {
    setEditingId(item.id);
    
    // Cek apakah kitab ada di list standar
    const allKitab = [...KITAB_PL, ...KITAB_PB];
    const isStandardKitab = allKitab.includes(item.kitab);
    setManualKitab(!isStandardKitab);

    // Cek apakah versi ada di list standar
    const standardVersiCodes = VERSI_OPTIONS.map(v => v.split(" ")[0]);
    const isStandardVersi = standardVersiCodes.includes(item.versiAlkitab);
    setManualVersi(!isStandardVersi);

    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  // Helper untuk preview text TTS
  const watchTeks = form.watch("teksAyat");
  const watchRate = form.watch("ttsKecepatanBaca");
  const watchLang = form.watch("ttsBahasa");

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
            {isLoading ? (
               <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></TableCell></TableRow>
            ) : listAyat?.length === 0 ? (
               <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
            ) : listAyat?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.kitab} {item.pasal}:{item.ayat}</div>
                  <div className="text-xs text-muted-foreground">{item.versiAlkitab}</div>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 text-sm italic">"{item.teksAyat}"</p>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategoriAyat}</Badge></TableCell>
                <TableCell>
                  {item.ttsStatus ? (
                    <TextToSpeechPlayer 
                      text={`${item.kitab} pasal ${item.pasal} ayat ${item.ayat}. ${item.teksAyat}`} 
                      rate={parseFloat(item.ttsKecepatanBaca)}
                      lang={item.ttsBahasa}
                    />
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.statusTampil === "AKTIF" ? "default" : "secondary"}>
                    {item.statusTampil}
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
                    {/* VERSI ALKITAB */}
                    <FormField control={form.control} name="versiAlkitab" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Versi</FormLabel>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setManualVersi(!manualVersi);
                              field.onChange(""); // Reset nilai saat switch
                            }}
                          >
                            {manualVersi ? "Pilih dari List" : "Input Manual"}
                          </Button>
                        </div>
                        {manualVersi ? (
                          <FormControl>
                            <Input placeholder="Ketik nama versi (mis: KJV)..." {...field} />
                          </FormControl>
                        ) : (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Versi" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {VERSI_OPTIONS.map(opt => <SelectItem key={opt} value={opt.split(" ")[0]}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* NAMA KITAB */}
                    <FormField control={form.control} name="kitab" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Kitab</FormLabel>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setManualKitab(!manualKitab);
                              field.onChange(""); // Reset nilai saat switch
                            }}
                          >
                            {manualKitab ? "Pilih dari List" : "Input Manual"}
                          </Button>
                        </div>
                        {manualKitab ? (
                          <FormControl>
                            <Input placeholder="Ketik nama kitab..." {...field} />
                          </FormControl>
                        ) : (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        )}
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
                  <FormField control={form.control} name="teksAyat" render={({ field }) => (
                    <FormItem><FormLabel>Isi Teks Ayat</FormLabel><FormControl><Textarea className="h-24" placeholder="Tuliskan isi ayat..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="kategoriAyat" render={({ field }) => (
                      <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Penguatan">Penguatan</SelectItem><SelectItem value="Doa">Doa</SelectItem><SelectItem value="Janji Tuhan">Janji Tuhan</SelectItem><SelectItem value="Teguran">Teguran</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="kataKunci" render={({ field }) => (
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
                    <FormField control={form.control} name="ttsStatus" render={({ field }) => (
                      <FormItem><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                  </div>

                  {form.watch("ttsStatus") && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="ttsBahasa" render={({ field }) => (
                          <FormItem><FormLabel>Bahasa Suara</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="id-ID">Indonesia</SelectItem><SelectItem value="en-US">English (US)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="ttsKecepatanBaca" render={({ field }) => (
                          <FormItem><FormLabel>Kecepatan Baca</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="0.5">Lambat (0.5x)</SelectItem><SelectItem value="0.8">Sedang (0.8x)</SelectItem><SelectItem value="1">Normal (1.0x)</SelectItem><SelectItem value="1.2">Cepat (1.2x)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
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
                    <FormField control={form.control} name="statusTampil" render={({ field }) => (
                      <FormItem><FormLabel>Status Tampil</FormLabel><Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="NONAKTIF">Nonaktif</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="catatanAyat" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Internal</FormLabel><FormControl><Input placeholder="Catatan editor..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </TabsContent>
              </Tabs>

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlkitabPage;
