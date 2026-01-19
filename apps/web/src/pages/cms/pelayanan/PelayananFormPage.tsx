import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, ArrowLeft, Loader2, Briefcase, Info, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api-client";

// --- Schema Validasi ---
const formSchema = z.object({
  nama_pelayanan: z.string().min(3, "Nama pelayanan minimal 3 karakter"),
  kategori_pelayanan: z.string().min(1, "Pilih kategori"),
  deskripsi_pelayanan: z.string().optional(),
  koordinator_pelayanan: z.string().min(1, "Pilih koordinator"),
  jumlah_kebutuhan_personel: z.coerce.number().min(0),
  status_pelayanan: z.string().default("AKTIF"),
  jadwal_pelayanan: z.string().optional(),
  catatan_pelayanan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const KATEGORI_OPTIONS = ["Ibadah", "Musik", "Multimedia", "Diakonia", "Pendidikan", "Administrasi", "Keamanan", "Lainnya"];

const PelayananFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // Fetch existing data if in edit mode
  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ['pelayanan', id],
    queryFn: () => apiClient.get(`/pelayanan/${id}`),
    enabled: isEdit,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pelayanan: "",
      kategori_pelayanan: "",
      deskripsi_pelayanan: "",
      koordinator_pelayanan: "",
      jumlah_kebutuhan_personel: 0,
      status_pelayanan: "AKTIF",
      jadwal_pelayanan: "",
      catatan_pelayanan: ""
    },
  });

  useEffect(() => {
    if (existingData) {
      form.reset(existingData as any);
    }
  }, [existingData, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      console.log("Submitting values:", values);
      if (isEdit) return apiClient.patch(`/pelayanan/${id}`, values);
      return apiClient.post('/pelayanan', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pelayanan'] });
      queryClient.invalidateQueries({ queryKey: ['pelayanan-list'] });
      toast.success(isEdit ? "Data pelayanan diperbarui" : "Pelayanan baru berhasil ditambahkan");
      navigate("/pelayan");
    },
    onError: (error: any) => {
      console.error("Mutation Error Response:", error.response?.data);
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        const details = Array.isArray(msg) ? msg.join(", ") : msg;
        toast.error(`Gagal menyimpan: ${details}`);
      } else {
        toast.error("Gagal menyimpan data pelayanan");
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    // Ensure we only send the fields defined in the schema
    const payload = {
      nama_pelayanan: values.nama_pelayanan,
      kategori_pelayanan: values.kategori_pelayanan,
      deskripsi_pelayanan: values.deskripsi_pelayanan,
      koordinator_pelayanan: values.koordinator_pelayanan,
      jumlah_kebutuhan_personel: values.jumlah_kebutuhan_personel,
      status_pelayanan: values.status_pelayanan,
      jadwal_pelayanan: values.jadwal_pelayanan,
      catatan_pelayanan: values.catatan_pelayanan,
    };
    mutation.mutate(payload);
  };

  if (isEdit && isLoadingData) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pelayan")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Unit Pelayanan" : "Tambah Unit Pelayanan"}</h2>
          <p className="text-sm text-muted-foreground">Konfigurasi detail unit atau divisi pelayanan gereja.</p>
        </div>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          className="gap-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Simpan Perubahan" : "Simpan Pelayanan"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* INFORMASI UTAMA */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <CardTitle>Informasi Utama</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="nama_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pelayanan / Unit</FormLabel>
                      <FormControl><Input placeholder="Cth: Tim Musik & Pujian" {...field} className="h-11" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="kategori_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deskripsi_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl><Textarea placeholder="Jelaskan visi dan misi unit ini..." className="min-h-[120px] resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* OPERASIONAL */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle>Operasional & Jadwal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="jadwal_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jadwal Rutin</FormLabel>
                      <FormControl><Input placeholder="Cth: Setiap Minggu, Pukul 07:00" {...field} className="h-11" /></FormControl>
                      <FormDescription>Waktu pelaksanaan pelayanan rutin.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="catatan_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan Tambahan</FormLabel>
                      <FormControl><Textarea placeholder="Catatan khusus operasional..." className="min-h-[100px] resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* SUMBER DAYA */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Sumber Daya</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="koordinator_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Koordinator</FormLabel>
                      <FormControl><Input placeholder="Nama Koordinator" {...field} className="h-11" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="jumlah_kebutuhan_personel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kebutuhan Personel</FormLabel>
                      <FormControl><Input type="number" min={0} {...field} className="h-11" /></FormControl>
                      <FormDescription>Target jumlah anggota tim.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* STATUS */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <CardTitle>Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <FormField control={form.control} name="status_pelayanan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Unit</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "AKTIF"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AKTIF">Aktif</SelectItem>
                          <SelectItem value="NON_AKTIF">Non-Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default PelayananFormPage;
