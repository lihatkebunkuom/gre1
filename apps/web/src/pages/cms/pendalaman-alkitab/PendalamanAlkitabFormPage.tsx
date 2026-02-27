import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import { apiClient } from "@/services/api-client";

const paSchema = z.object({
  judul: z.string().min(1, "Judul harus diisi"),
  waktu: z.string().min(1, "Waktu harus diisi"),
  lokasi: z.string().min(1, "Lokasi harus diisi"),
  keterangan: z.string().optional(),
  pepanthanId: z.string().optional(),
  wilayahId: z.string().optional(),
  kelompokId: z.string().optional(),
  komisiId: z.string().optional(),
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
      judul: "", waktu: "", lokasi: "", keterangan: "",
      pepanthanId: "", wilayahId: "", kelompokId: "", komisiId: "",
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
      let formattedDate = "";
      if (data.waktu) {
        const date = new Date(data.waktu);
        if (!isNaN(date.getTime())) {
          formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        }
      }
      form.reset({
        judul: data.judul || "",
        waktu: formattedDate,
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        pepanthanId: data.pepanthanId || "",
        wilayahId: data.wilayahId || "",
        kelompokId: data.kelompokId || "",
        komisiId: data.komisiId || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: PAFormValues) => {
      // Bersihkan nilai "none" agar menjadi null sebelum dikirim
      const cleanValue = (val?: string) => (val === "none" || val === "" ? null : val);

      const data = {
        ...values,
        waktu: new Date(values.waktu).toISOString(),
        pepanthanId: cleanValue(values.pepanthanId),
        wilayahId: cleanValue(values.wilayahId),
        kelompokId: cleanValue(values.kelompokId),
        komisiId: cleanValue(values.komisiId),
      };
      
      if (isEdit) return apiClient.patch(`/pendalaman-alkitab/${id}`, data);
      return apiClient.post("/pendalaman-alkitab", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendalaman-alkitab'] });
      toast.success(isEdit ? "Data PA diperbarui" : "Data PA berhasil ditambahkan");
      navigate("/pendalaman-alkitab");
    },
    onError: (error: any) => {
      const errorData = error.response?.data?.message;
      let errorMessage = "Terjadi kesalahan";

      if (Array.isArray(errorData)) {
        // Jika error validasi dari NestJS (array of objects)
        errorMessage = errorData.map((err: any) => `${err.property}: ${err.message}`).join(", ");
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      toast.error(errorMessage);
    }
  });

  if (isEdit && isLoadingData) return <div className="h-64 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
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
                <FormItem><FormLabel>Judul PA</FormLabel><FormControl><Input placeholder="Contoh: PA Wilayah X" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="waktu" render={({ field }) => (
                <FormItem><FormLabel>Tanggal & Jam</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lokasi" render={({ field }) => (
                <FormItem><FormLabel>Lokasi PA</FormLabel><FormControl><Input placeholder="Contoh: Rumah Bpk. Y" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
