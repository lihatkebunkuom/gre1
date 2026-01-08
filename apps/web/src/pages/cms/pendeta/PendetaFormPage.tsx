import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
  CalendarIcon, Save, ArrowLeft, Loader2,
  Camera, Instagram, Facebook, Youtube, 
  MapPin, UserCheck, FileBadge, GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
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
import { ImageUpload } from "@/components/common/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api-client";

// --- 1. Schema Validasi (Zod) ---

const formSchema = z.object({
  // A. Informasi Utama
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  gelar: z.string().optional(),
  jenisKelamin: z.enum(["L", "P"], { required_error: "Pilih jenis kelamin" }),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi" }),
  statusAktif: z.boolean().default(true),

  // B. Kontak
  noHandphone: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Format email salah").optional().or(z.literal("")),
  alamat: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),

  // C. Data Kepelayanan
  jabatanPelayanan: z.string().min(1, "Jabatan wajib dipilih"),
  tanggalPenahbisan: z.date().optional(),
  wilayahPelayanan: z.string().optional(),
  bidangPelayanan: z.string().optional(),
  jadwalPelayanan: z.string().optional(),

  // D. Pendidikan
  pendidikanTerakhir: z.string().optional(),
  institusiTeologi: z.string().optional(),
  tahunLulus: z.coerce.number().optional(),
  riwayatPendidikan: z.string().optional(),

  // E. Administratif
  nomorIndukPendeta: z.string().optional(),
  statusPernikahan: z.enum(["MENIKAH", "BELUM_MENIKAH", "CERAI_HIDUP", "CERAI_MATI"]).optional(),
  namaPasangan: z.string().optional(),
  jumlahAnak: z.coerce.number().default(0),

  // F. Media
  fotoPendeta: z.string().optional(),
  biografiSingkat: z.string().optional(),
  igLink: z.string().optional(),
  fbLink: z.string().optional(),
  ytLink: z.string().optional(),

  // G. Internal
  catatanInternal: z.string().optional(),
  riwayatPelayananText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PendetaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // Fetch existing data if in edit mode
  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ['pendeta', id],
    queryFn: () => apiClient.get(`/pendeta/${id}`),
    enabled: isEdit,
  });

  // Default values setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "", 
      gelar: "", 
      jenisKelamin: "L",
      statusAktif: true, 
      noHandphone: "", 
      email: "", 
      alamat: "", 
      kota: "", 
      provinsi: "",
      tempatLahir: "",
      jabatanPelayanan: "", 
      wilayahPelayanan: "", 
      bidangPelayanan: "", 
      jadwalPelayanan: "",
      tanggalPenahbisan: undefined,
      pendidikanTerakhir: "", 
      institusiTeologi: "", 
      tahunLulus: 0, 
      riwayatPendidikan: "",
      nomorIndukPendeta: "", 
      statusPernikahan: "BELUM_MENIKAH", 
      namaPasangan: "", 
      jumlahAnak: 0,
      biografiSingkat: "", 
      igLink: "", 
      fbLink: "", 
      ytLink: "",
      catatanInternal: "", 
      riwayatPelayananText: "",
      fotoPendeta: "",
      tanggalLahir: new Date(),
    },
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (existingData) {
      const data = existingData as any;
      form.reset({
        ...data,
        tanggalLahir: new Date(data.tanggalLahir),
        tanggalPenahbisan: data.tanggalPenahbisan ? new Date(data.tanggalPenahbisan) : undefined,
      });
    }
  }, [existingData, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (isEdit) {
        return apiClient.patch(`/pendeta/${id}`, values);
      }
      return apiClient.post('/pendeta', values);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Data pendeta diperbarui" : "Data pendeta berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ['pendeta'] });
      navigate("/pendeta");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Gagal menyimpan data pendeta");
    }
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const onInvalid = (errors: any) => {
    console.log("Form Errors:", errors);
    toast.error("Mohon lengkapi data yang wajib diisi");
  };

  if (isEdit && isLoadingData) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pendeta")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Data Pendeta" : "Tambah Pendeta Baru"}</h2>
          <p className="text-sm text-muted-foreground">Isi data lengkap hamba tuhan dalam satu halaman.</p>
        </div>
        <Button 
          onClick={form.handleSubmit(onSubmit, onInvalid)} 
          className="gap-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Simpan Perubahan" : "Simpan Data"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* CARD 1: INFORMASI PRIBADI */}
          <Card className="shadow-md">
            <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Informasi Pribadi</CardTitle></CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <FormField control={form.control} name="fotoPendeta" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foto Profil</FormLabel>
                        <FormControl><ImageUpload value={field.value} onChange={field.onChange} className="w-full aspect-square" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
                <div className="w-full md:w-3/4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="namaLengkap" render={({ field }) => (
                          <FormItem><FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="Contoh: Budi Santoso" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="gelar" render={({ field }) => (
                          <FormItem><FormLabel>Gelar Akademik</FormLabel><FormControl><Input placeholder="S.Th, M.Div" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                          <FormItem><FormLabel>Jenis Kelamin</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="statusAktif" render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30 h-11">
                            <div className="space-y-0.5"><FormLabel className="text-base">Status Aktif</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="tempatLahir" render={({ field }) => (
                          <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="tanggalLahir" render={({ field }) => (
                          <FormItem className="flex flex-col"><FormLabel>Tanggal Lahir <span className="text-red-500">*</span></FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-11", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: KONTAK & ALAMAT */}
          <Card className="shadow-md">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-xl">Kontak & Alamat</CardTitle></div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="noHandphone" render={({ field }) => (
                        <FormItem><FormLabel>No. Handphone <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="alamat" render={({ field }) => (
                    <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea className="resize-none min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="kota" render={({ field }) => (
                        <FormItem><FormLabel>Kota/Kabupaten</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="provinsi" render={({ field }) => (
                        <FormItem><FormLabel>Provinsi</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>

          {/* CARD 3: DATA KEPELAYANAN */}
          <Card className="shadow-md">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-xl">Data Kepelayanan</CardTitle></div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="jabatanPelayanan" render={({ field }) => (
                        <FormItem><FormLabel>Jabatan Pelayanan <span className="text-red-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih Jabatan" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GEMBALA_SIDANG">Gembala Sidang</SelectItem><SelectItem value="WAKIL_GEMBALA">Wakil Gembala</SelectItem><SelectItem value="PENDETA_MUDA">Pendeta Muda</SelectItem><SelectItem value="PENATUA">Penatua</SelectItem><SelectItem value="EVANGELIS">Evangelis</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                      )} />
                     <FormField control={form.control} name="tanggalPenahbisan" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Tanggal Penahbisan</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-11", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="wilayahPelayanan" render={({ field }) => (
                        <FormItem><FormLabel>Wilayah Pelayanan</FormLabel><FormControl><Input placeholder="Contoh: Rayon Pusat" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                    <FormField control={form.control} name="bidangPelayanan" render={({ field }) => (
                        <FormItem><FormLabel>Bidang Pelayanan</FormLabel><FormControl><Input placeholder="Contoh: Misi, Musik, Pemuda (Pisahkan koma)" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                </div>
                <FormField control={form.control} name="jadwalPelayanan" render={({ field }) => (
                    <FormItem><FormLabel>Jadwal Rutin</FormLabel><FormControl><Textarea placeholder="Contoh: Minggu Raya 1, Kamis Doa Malam" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="nomorIndukPendeta" render={({ field }) => (
                        <FormItem><FormLabel>Nomor Induk (NIP)</FormLabel><FormControl><Input placeholder="PDT-XXX-YYY" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                </div>
            </CardContent>
          </Card>

          {/* CARD 4: DATA KELUARGA */}
          <Card className="shadow-md">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2"><FileBadge className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-xl">Data Keluarga</CardTitle></div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="statusPernikahan" render={({ field }) => (
                        <FormItem><FormLabel>Status Pernikahan</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MENIKAH">Menikah</SelectItem><SelectItem value="BELUM_MENIKAH">Belum Menikah</SelectItem><SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem><SelectItem value="CERAI_MATI">Cerai Mati</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="namaPasangan" render={({ field }) => (
                        <FormItem><FormLabel>Nama Pasangan</FormLabel><FormControl><Input disabled={form.watch("statusPernikahan") === "BELUM_MENIKAH"} {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="jumlahAnak" render={({ field }) => (
                        <FormItem><FormLabel>Jumlah Anak</FormLabel><FormControl><Input type="number" min={0} {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>

          {/* CARD 5: PENDIDIKAN */}
          <Card className="shadow-md">
             <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-xl">Latar Belakang Pendidikan</CardTitle></div>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="pendidikanTerakhir" render={({ field }) => (
                        <FormItem><FormLabel>Pendidikan Terakhir</FormLabel><FormControl><Input placeholder="S1/S2/S3" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="institusiTeologi" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Institusi / Sekolah Teologi</FormLabel><FormControl><Input placeholder="Nama STT / Universitas" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="tahunLulus" render={({ field }) => (
                    <FormItem><FormLabel>Tahun Lulus</FormLabel><FormControl><Input type="number" placeholder="YYYY" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="riwayatPendidikan" render={({ field }) => (
                    <FormItem><FormLabel>Riwayat Pendidikan Lainnya</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
             </CardContent>
          </Card>

          {/* CARD 6: MEDIA & PROFIL */}
          <Card className="shadow-md">
             <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2"><Camera className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-xl">Media & Profil Publik</CardTitle></div>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-6">
                <FormField control={form.control} name="biografiSingkat" render={({ field }) => (
                    <FormItem><FormLabel>Biografi Singkat</FormLabel><FormControl><Textarea placeholder="Ceritakan singkat tentang perjalanan pelayanan..." className="resize-none h-24" {...field} /></FormControl><FormDescription>Akan ditampilkan di halaman profil publik gereja.</FormDescription><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="igLink" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</FormLabel><FormControl><Input placeholder="@username" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="fbLink" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><Facebook className="h-3 w-3" /> Facebook</FormLabel><FormControl><Input placeholder="Username / Link" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ytLink" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><Youtube className="h-3 w-3" /> YouTube</FormLabel><FormControl><Input placeholder="Channel Link" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
             </CardContent>
          </Card>

          {/* CARD 7: INTERNAL */}
          <Card className="shadow-md">
             <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Informasi Internal</CardTitle></CardHeader>
             <CardContent className="p-8 pt-0 space-y-6">
                <FormField control={form.control} name="catatanInternal" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Internal (Admin Only)</FormLabel><FormControl><Textarea placeholder="Catatan khusus yang tidak dipublikasikan..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="riwayatPelayananText" render={({ field }) => (
                    <FormItem><FormLabel>Riwayat Pelayanan Gereja Sebelumnya</FormLabel><FormControl><Textarea placeholder="Daftar gereja tempat melayani sebelumnya..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
             </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
};

export default PendetaFormPage;
