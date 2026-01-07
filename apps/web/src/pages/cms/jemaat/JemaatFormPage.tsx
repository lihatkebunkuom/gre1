import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Save, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api-client";

// --- Schema Validasi ---
const formSchema = z.object({
  nomorInduk: z.string().optional(),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  jenisKelamin: z.enum(["L", "P"]),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi" }),
  statusAktif: z.boolean().default(true),
  statusKeanggotaan: z.enum(["TETAP", "TITIPAN", "TAMU"]),
  
  noHp: z.string().optional().or(z.literal("")),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  alamat: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),

  statusPernikahan: z.enum(["BELUM_MENIKAH", "MENIKAH", "CERAI_HIDUP", "CERAI_MATI"]),
  namaPasangan: z.string().optional(),
  jumlahAnak: z.coerce.number().default(0),
  isKepalaKeluarga: z.boolean().default(false),
  noKK: z.string().optional(),

  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  instansi: z.string().optional(),

  pelayananDiikuti: z.string().optional(),
  minatPelayanan: z.string().optional(),

  fotoUrl: z.string().optional(),
  catatanKhusus: z.string().optional(),
  tanggalBergabung: z.date().default(new Date()),
});

type FormValues = z.infer<typeof formSchema>;

const JemaatFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ['jemaat', id],
    queryFn: () => apiClient.get(`/jemaat/${id}`),
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomorInduk: "",
      nama: "",
      jenisKelamin: "L",
      tempatLahir: "",
      statusAktif: true,
      statusKeanggotaan: "TETAP",
      noHp: "",
      email: "",
      alamat: "",
      kota: "",
      provinsi: "",
      statusPernikahan: "BELUM_MENIKAH",
      namaPasangan: "",
      jumlahAnak: 0,
      isKepalaKeluarga: false,
      noKK: "",
      pendidikan: "",
      pekerjaan: "",
      instansi: "",
      pelayananDiikuti: "",
      minatPelayanan: "",
      fotoUrl: "",
      catatanKhusus: "",
      tanggalBergabung: new Date(),
    },
  });

  useEffect(() => {
    if (existingData) {
      const jemaat = existingData as any;
      form.reset({
        ...jemaat,
        tanggalLahir: new Date(jemaat.tanggalLahir),
        tanggalBergabung: new Date(jemaat.tanggalBergabung),
      });
    }
  }, [existingData, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (isEdit) return apiClient.patch(`/jemaat/${id}`, values);
      return apiClient.post('/jemaat', values);
    },
    onSuccess: (data) => {
      console.log("Data berhasil disimpan ke database:", data);
      queryClient.invalidateQueries({ queryKey: ['jemaat'] });
      toast.success(isEdit ? "Data jemaat diperbarui" : "Data jemaat berhasil ditambahkan");
      navigate("/jemaat");
    },
    onError: (error: any) => {
      console.error("Gagal menyimpan ke server:", error);
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log("Mencoba mengirim data ke server...", values);
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/jemaat")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Data Jemaat" : "Tambah Jemaat Baru"}</h2>
          <p className="text-sm text-muted-foreground">Isi data lengkap jemaat dalam satu halaman.</p>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
            {/* INFORMASI PRIBADI */}
            <Card className="shadow-md">
              <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Informasi Pribadi</CardTitle></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <FormField control={form.control} name="fotoUrl" render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Foto Jemaat</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                
                <FormField control={form.control} name="nama" render={({ field }) => (
                  <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                      <FormItem><FormLabel>Jenis Kelamin</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="statusKeanggotaan" render={({ field }) => (
                      <FormItem><FormLabel>Status Keanggotaan</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="TETAP">Tetap</SelectItem><SelectItem value="TITIPAN">Titipan</SelectItem><SelectItem value="TAMU">Tamu</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="tempatLahir" render={({ field }) => (
                    <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField
                    control={form.control}
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-11",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="text-[10px]">Tanggal lahir jemaat.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField control={form.control} name="statusAktif" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/30">
                    <div className="space-y-0.5"><FormLabel>Status Aktif</FormLabel><FormDescription>Jemaat masih aktif beribadah</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* KONTAK & ALAMAT */}
            <Card className="shadow-md">
              <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Kontak & Alamat</CardTitle></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="noHp" render={({ field }) => (
                    <FormItem><FormLabel>No. Handphone</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
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
                    <FormItem><FormLabel>Kota</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="provinsi" render={({ field }) => (
                    <FormItem><FormLabel>Provinsi</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* DATA KELUARGA */}
            <Card className="shadow-md">
              <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Data Keluarga</CardTitle></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="statusPernikahan" render={({ field }) => (
                    <FormItem><FormLabel>Status Pernikahan</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MENIKAH">Menikah</SelectItem><SelectItem value="BELUM_MENIKAH">Belum Menikah</SelectItem><SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem><SelectItem value="CERAI_MATI">Cerai Mati</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="isKepalaKeluarga" render={({ field }) => (
                    <FormItem className="flex flex-col justify-center md:pt-6"><div className="flex items-center space-x-3 p-3 rounded-md border bg-muted/30"><Switch checked={field.value} onCheckedChange={field.onChange} /><FormLabel className="cursor-pointer">Kepala Keluarga?</FormLabel></div></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="noKK" render={({ field }) => (
                  <FormItem><FormLabel>No. Kartu Keluarga (KK)</FormLabel><FormControl><Input {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="namaPasangan" render={({ field }) => (
                  <FormItem><FormLabel>Nama Pasangan</FormLabel><FormControl><Input disabled={form.watch("statusPernikahan") === "BELUM_MENIKAH"} {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="jumlahAnak" render={({ field }) => (
                  <FormItem><FormLabel>Jumlah Anak</FormLabel><FormControl><Input type="number" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            {/* PENDIDIKAN & PEKERJAAN */}
            <Card className="shadow-md">
              <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Pendidikan & Pekerjaan</CardTitle></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <FormField control={form.control} name="pendidikan" render={({ field }) => (
                  <FormItem><FormLabel>Pendidikan Terakhir</FormLabel><FormControl><Input placeholder="Contoh: S1 Ekonomi" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pekerjaan" render={({ field }) => (
                  <FormItem><FormLabel>Pekerjaan</FormLabel><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="instansi" render={({ field }) => (
                  <FormItem><FormLabel>Nama Instansi / Perusahaan</FormLabel><FormControl><Input placeholder="Nama tempat bekerja" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            {/* PELAYANAN & LAINNYA */}
            <Card className="shadow-md">
              <CardHeader className="p-8 pb-4"><CardTitle className="text-xl">Pelayanan & Lainnya</CardTitle></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="pelayananDiikuti" render={({ field }) => (
                      <FormItem><FormLabel>Pelayanan</FormLabel><FormControl><Input placeholder="Usher, Singer..." {...field} className="h-11" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="minatPelayanan" render={({ field }) => (
                      <FormItem><FormLabel>Minat Pelayanan</FormLabel><FormControl><Input placeholder="Musik, Multimedia..." {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                      control={form.control}
                      name="tanggalBergabung"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tgl Bergabung</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-11",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pilih tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField control={form.control} name="catatanKhusus" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Khusus</FormLabel><FormControl><Textarea placeholder="Catatan tambahan..." className="resize-none min-h-[100px]" {...field} /></FormControl></FormItem>
                  )} />
              </CardContent>
            </Card>

        </form>
      </Form>
    </div>
  );
};

export default JemaatFormPage;