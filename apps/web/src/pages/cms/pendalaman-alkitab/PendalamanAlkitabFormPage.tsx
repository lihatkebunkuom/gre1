import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { apiClient } from "@/services/api-client";
import { cn } from "@/lib/utils";

const paSchema = z.object({
  judul: z.string().min(1, "Judul ibadah wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  keterangan: z.string().optional(),
  pepanthanId: z.string().optional(),
  wilayahId: z.string().optional(),
  kelompokId: z.string().optional(),
  komisiId: z.string().optional(),
  bahasapa: z.string().optional(),
  tanggalpa: z.date().optional().nullable(),
  petugaspa: z.string().optional(),
});

type PAFormValues = z.infer<typeof paSchema>;

const PendalamanAlkitabFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<PAFormValues>({
    resolver: zodResolver(paSchema),
    defaultValues: {
      judul: "", 
      waktuMulai: "", 
      lokasi: "", 
      keterangan: "",
      pepanthanId: "", 
      wilayahId: "", 
      kelompokId: "", 
      komisiId: "",
      bahasapa: "",
      tanggalpa: null,
      petugaspa: "",
    },
  });

  // Fetch Options
  const { data: pepanthanList } = useQuery({ queryKey: ['pepanthan'], queryFn: () => apiClient.get<any[]>('/pepanthan') });
  const { data: wilayahList } = useQuery({ queryKey: ['wilayah'], queryFn: () => apiClient.get<any[]>('/wilayah') });
  const { data: kelompokList } = useQuery({ queryKey: ['kelompok'], queryFn: () => apiClient.get<any[]>('/kelompok') });
  const { data: komisiList } = useQuery({ queryKey: ['komisi'], queryFn: () => apiClient.get<any[]>('/komisi') });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['pendalaman-alkitab', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/pendalaman-alkitab/${id}`);
      form.reset({
        judul: data.judul || "",
        waktuMulai: data.waktuMulai || "",
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        pepanthanId: data.pepanthanId || "",
        wilayahId: data.wilayahId || "",
        kelompokId: data.kelompokId || "",
        komisiId: data.komisiId || "",
        bahasapa: data.bahasapa || "",
        tanggalpa: data.tanggalpa ? new Date(data.tanggalpa) : null,
        petugaspa: data.petugaspa || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: PAFormValues) => {
      // Bersihkan nilai "none" agar menjadi null sebelum dikirim
      const cleanValue = (val?: string) => (val === "none" || val === "" ? null : val);

      const payload = {
        ...values,
        tanggalpa: values.tanggalpa ? format(values.tanggalpa, "yyyy-MM-dd") : null,
        pepanthanId: cleanValue(values.pepanthanId),
        wilayahId: cleanValue(values.wilayahId),
        kelompokId: cleanValue(values.kelompokId),
        komisiId: cleanValue(values.komisiId),
      };
      
      if (isEdit) return apiClient.patch(`/pendalaman-alkitab/${id}`, payload);
      return apiClient.post("/pendalaman-alkitab", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendalaman-alkitab'] });
      toast.success(isEdit ? "Data PA diperbarui" : "Data PA berhasil ditambahkan");
      navigate("/pendalaman-alkitab");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  if (isEdit && isLoadingData) return <div className="h-64 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pendalaman-alkitab")}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit PA" : "Tambah PA Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi pendalaman alkitab di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="pepanthanId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pepanthan (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih Pepanthan" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- Tidak Ada --</SelectItem>
                        {Array.isArray(pepanthanList) && pepanthanList.map(p => <SelectItem key={p.id} value={p.id}>{p.namaPepanthan}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="wilayahId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wilayah (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih Wilayah" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- Tidak Ada --</SelectItem>
                        {Array.isArray(wilayahList) && wilayahList.map(w => <SelectItem key={w.id} value={w.id}>{w.nama}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="kelompokId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelompok (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelompok" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- Tidak Ada --</SelectItem>
                        {Array.isArray(kelompokList) && kelompokList.map(k => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="komisiId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Komisi (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih Komisi" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- Tidak Ada --</SelectItem>
                        {Array.isArray(komisiList) && komisiList.map(c => <SelectItem key={c.id} value={c.id}>{c.namaKomisi}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="judul" render={({ field }) => (
                <FormItem><FormLabel>Judul PA <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="Contoh: PA Wilayah X" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tanggalpa"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: localeId })
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
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waktuMulai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Mulai <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField control={form.control} name="lokasi" render={({ field }) => (
                <FormItem><FormLabel>Lokasi PA <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="Contoh: Rumah Bpk. Y" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bahasapa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bahasa</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Indonesia / Jawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="petugaspa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petugas</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Pdt. Budi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField control={form.control} name="keterangan" render={({ field }) => (
                <FormItem><FormLabel>Keterangan</FormLabel><FormControl><Textarea placeholder="Informasi tambahan..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/pendalaman-alkitab")}>Batal</Button>
                <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Simpan Data</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendalamanAlkitabFormPage;
