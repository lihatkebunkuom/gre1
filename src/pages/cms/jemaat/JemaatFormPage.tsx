import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Schema Validasi ---

const formSchema = z.object({
  // A. Data Utama
  nomor_induk_jemaat: z.string().min(1, "No. Induk wajib diisi"),
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
  jenis_kelamin: z.enum(["L", "P"], { required_error: "Pilih jenis kelamin" }),
  tempat_lahir: z.string().optional(),
  tanggal_lahir: z.date({ required_error: "Tanggal lahir wajib diisi" }),
  status_aktif: z.boolean().default(true),
  status_keanggotaan: z.string().min(1, "Pilih status keanggotaan"),

  // B. Kontak
  no_handphone: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  alamat_lengkap: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),

  // C. Keluarga
  status_pernikahan: z.string().min(1, "Pilih status pernikahan"),
  nama_pasangan: z.string().optional(),
  jumlah_anak: z.coerce.number().default(0),
  kepala_keluarga: z.boolean().default(false),
  nomor_kartu_keluarga: z.string().optional(),

  // D. Rohani
  status_baptis: z.string(),
  tanggal_baptis: z.date().optional(),
  gereja_baptis: z.string().optional(),
  status_sidi: z.string(),
  tanggal_sidi: z.date().optional(),
  pendeta_sidi: z.string().optional(),

  // E. Wilayah
  kelompok: z.string().optional(),
  wilayah: z.string().optional(),
  komsel: z.string().optional(),
  peran_dalam_kelompok: z.string().default("Anggota"),

  // F. Pelayanan
  kehadiran_ibadah_rata_rata: z.coerce.number().min(0).max(100).default(0),
  pelayanan_diikuti: z.string().optional(), // Comma separated for simplicity
  minat_pelayanan: z.string().optional(),

  // G. Pekerjaan
  pendidikan_terakhir: z.string().optional(),
  pekerjaan: z.string().optional(),
  instansi_perusahaan: z.string().optional(),

  // H. Media
  foto_jemaat: z.string().optional(),
  catatan_khusus: z.string().optional(),
  tanggal_bergabung: z.date().default(new Date()),
});

type FormValues = z.infer<typeof formSchema>;

const JemaatFormPage = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomor_induk_jemaat: "",
      nama_lengkap: "",
      jenis_kelamin: "L",
      status_aktif: true,
      status_keanggotaan: "TETAP",
      no_handphone: "",
      status_pernikahan: "BELUM_MENIKAH",
      jumlah_anak: 0,
      kepala_keluarga: false,
      status_baptis: "BELUM",
      status_sidi: "BELUM",
      peran_dalam_kelompok: "Anggota",
      kehadiran_ibadah_rata_rata: 0,
      tanggal_bergabung: new Date(),
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast.success("Data jemaat berhasil disimpan");
    navigate("/jemaat"); // Redirect kembali ke list
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/jemaat")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Form Data Jemaat</h2>
          <p className="text-sm text-muted-foreground">Isi data lengkap jemaat baru atau perbarui data lama.</p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
          <Save className="h-4 w-4" /> Simpan Data
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="datadiri" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="datadiri">Data Diri & Keluarga</TabsTrigger>
              <TabsTrigger value="rohani">Rohani & Wilayah</TabsTrigger>
              <TabsTrigger value="sosial">Pekerjaan & Pelayanan</TabsTrigger>
              <TabsTrigger value="media">Media & Lainnya</TabsTrigger>
            </TabsList>

            {/* TAB 1: DATA DIRI, KONTAK, KELUARGA */}
            <TabsContent value="datadiri" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SECTION A: DATA UTAMA */}
                <Card>
                  <CardHeader><CardTitle>Informasi Utama</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="foto_jemaat" render={({ field }) => (
                       <FormItem><FormLabel>Foto Jemaat</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="nomor_induk_jemaat" render={({ field }) => (
                        <FormItem><FormLabel>No. Induk Jemaat</FormLabel><FormControl><Input placeholder="Auto / Manual" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="status_keanggotaan" render={({ field }) => (
                         <FormItem><FormLabel>Status Keanggotaan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TETAP">Jemaat Tetap</SelectItem><SelectItem value="TITIPAN">Jemaat Titipan</SelectItem><SelectItem value="TAMU">Jemaat Tamu</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                      <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="jenis_kelamin" render={({ field }) => (
                         <FormItem><FormLabel>Jenis Kelamin</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="status_aktif" render={({ field }) => (
                        <FormItem className="flex flex-col justify-end pb-2"><div className="flex items-center space-x-2"><Switch checked={field.value} onCheckedChange={field.onChange} /><FormLabel>Status Aktif</FormLabel></div></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="tempat_lahir" render={({ field }) => (
                        <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="tanggal_lahir" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Tanggal Lahir</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  {/* SECTION B: KONTAK */}
                  <Card>
                    <CardHeader><CardTitle>Kontak & Alamat</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="no_handphone" render={({ field }) => (
                          <FormItem><FormLabel>No. Handphone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="alamat_lengkap" render={({ field }) => (
                        <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="kota" render={({ field }) => (
                          <FormItem><FormLabel>Kota</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="provinsi" render={({ field }) => (
                          <FormItem><FormLabel>Provinsi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* SECTION C: KELUARGA */}
                  <Card>
                    <CardHeader><CardTitle>Data Keluarga</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="status_pernikahan" render={({ field }) => (
                           <FormItem><FormLabel>Status Pernikahan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MENIKAH">Menikah</SelectItem><SelectItem value="BELUM_MENIKAH">Belum Menikah</SelectItem><SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem><SelectItem value="CERAI_MATI">Cerai Mati</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                         )} />
                         <FormField control={form.control} name="kepala_keluarga" render={({ field }) => (
                            <FormItem className="flex flex-col justify-center pt-6"><div className="flex items-center space-x-2"><Switch checked={field.value} onCheckedChange={field.onChange} /><FormLabel>Kepala Keluarga?</FormLabel></div></FormItem>
                          )} />
                       </div>
                       <FormField control={form.control} name="nomor_kartu_keluarga" render={({ field }) => (
                          <FormItem><FormLabel>No. Kartu Keluarga (KK)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="nama_pasangan" render={({ field }) => (
                          <FormItem><FormLabel>Nama Pasangan</FormLabel><FormControl><Input disabled={form.watch("status_pernikahan") === "BELUM_MENIKAH"} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="jumlah_anak" render={({ field }) => (
                          <FormItem><FormLabel>Jumlah Anak</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ROHANI & WILAYAH */}
            <TabsContent value="rohani" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* SECTION D: ROHANI */}
                 <Card>
                    <CardHeader><CardTitle>Data Rohani</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <FormField control={form.control} name="status_baptis" render={({ field }) => (
                         <FormItem><FormLabel>Status Baptis</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SUDAH">Sudah Baptis</SelectItem><SelectItem value="BELUM">Belum Baptis</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                       )} />
                       {form.watch("status_baptis") === "SUDAH" && (
                         <div className="pl-4 border-l-2 border-muted space-y-4">
                           <FormField control={form.control} name="tanggal_baptis" render={({ field }) => (
                              <FormItem className="flex flex-col"><FormLabel>Tanggal Baptis</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>
                            )} />
                           <FormField control={form.control} name="gereja_baptis" render={({ field }) => (
                              <FormItem><FormLabel>Gereja Tempat Baptis</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                         </div>
                       )}

                       <div className="h-px bg-border my-2" />

                       <FormField control={form.control} name="status_sidi" render={({ field }) => (
                         <FormItem><FormLabel>Status Sidi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SUDAH">Sudah Sidi</SelectItem><SelectItem value="BELUM">Belum Sidi</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                       )} />
                        {form.watch("status_sidi") === "SUDAH" && (
                         <div className="pl-4 border-l-2 border-muted space-y-4">
                           <FormField control={form.control} name="tanggal_sidi" render={({ field }) => (
                              <FormItem className="flex flex-col"><FormLabel>Tanggal Sidi</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>
                            )} />
                           <FormField control={form.control} name="pendeta_sidi" render={({ field }) => (
                              <FormItem><FormLabel>Pendeta Peneguhan</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                         </div>
                       )}
                    </CardContent>
                 </Card>

                 {/* SECTION E: WILAYAH */}
                 <Card>
                    <CardHeader><CardTitle>Kelompok & Wilayah</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <FormField control={form.control} name="wilayah" render={({ field }) => (
                          <FormItem><FormLabel>Wilayah Pelayanan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Wilayah" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PUSAT">Jakarta Pusat</SelectItem><SelectItem value="BARAT">Jakarta Barat</SelectItem><SelectItem value="SELATAN">Jakarta Selatan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                       )} />
                       <FormField control={form.control} name="kelompok" render={({ field }) => (
                          <FormItem><FormLabel>Kelompok Sel (Komsel)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Komsel" /></SelectTrigger></FormControl><SelectContent><SelectItem value="EFRATA">Komsel Efrata</SelectItem><SelectItem value="SION">Komsel Sion</SelectItem><SelectItem value="BETHEL">Komsel Bethel</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                       )} />
                       <FormField control={form.control} name="peran_dalam_kelompok" render={({ field }) => (
                          <FormItem><FormLabel>Peran dalam Kelompok</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Peran" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Anggota">Anggota</SelectItem><SelectItem value="Ketua">Ketua Komsel</SelectItem><SelectItem value="Sekretaris">Sekretaris</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                       )} />
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>

            {/* TAB 3: SOSIAL (PEKERJAAN & PELAYANAN) */}
            <TabsContent value="sosial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* SECTION F: PELAYANAN */}
                 <Card>
                    <CardHeader><CardTitle>Kehadiran & Pelayanan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <FormField control={form.control} name="kehadiran_ibadah_rata_rata" render={({ field }) => (
                          <FormItem><FormLabel>Rata-rata Kehadiran (%)</FormLabel><FormControl><Input type="number" min={0} max={100} {...field} /></FormControl><FormDescription>Estimasi persentase kehadiran dalam 3 bulan terakhir.</FormDescription></FormItem>
                       )} />
                       <FormField control={form.control} name="pelayanan_diikuti" render={({ field }) => (
                          <FormItem><FormLabel>Pelayanan yang Diikuti</FormLabel><FormControl><Input placeholder="Contoh: Usher, Singer (Pisahkan koma)" {...field} /></FormControl></FormItem>
                       )} />
                       <FormField control={form.control} name="minat_pelayanan" render={({ field }) => (
                          <FormItem><FormLabel>Minat Pelayanan</FormLabel><FormControl><Textarea placeholder="Bidang yang diminati jemaat..." {...field} /></FormControl></FormItem>
                       )} />
                    </CardContent>
                 </Card>

                 {/* SECTION G: PEKERJAAN */}
                 <Card>
                    <CardHeader><CardTitle>Pendidikan & Pekerjaan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <FormField control={form.control} name="pendidikan_terakhir" render={({ field }) => (
                          <FormItem><FormLabel>Pendidikan Terakhir</FormLabel><FormControl><Input placeholder="Contoh: S1 Ekonomi" {...field} /></FormControl></FormItem>
                       )} />
                       <FormField control={form.control} name="pekerjaan" render={({ field }) => (
                          <FormItem><FormLabel>Pekerjaan</FormLabel><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} /></FormControl></FormItem>
                       )} />
                       <FormField control={form.control} name="instansi_perusahaan" render={({ field }) => (
                          <FormItem><FormLabel>Nama Instansi / Perusahaan</FormLabel><FormControl><Input placeholder="Nama tempat bekerja" {...field} /></FormControl></FormItem>
                       )} />
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>

            {/* TAB 4: MEDIA & CATATAN */}
            <TabsContent value="media" className="space-y-6">
               <Card>
                  <CardHeader><CardTitle>Lainnya</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <FormField control={form.control} name="tanggal_bergabung" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Tanggal Bergabung</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                     <FormField control={form.control} name="catatan_khusus" render={({ field }) => (
                        <FormItem><FormLabel>Catatan Khusus (Admin Only)</FormLabel><FormControl><Textarea placeholder="Catatan pastoral atau administrasi..." className="resize-none h-32" {...field} /></FormControl></FormItem>
                     )} />
                  </CardContent>
               </Card>
            </TabsContent>

          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default JemaatFormPage;