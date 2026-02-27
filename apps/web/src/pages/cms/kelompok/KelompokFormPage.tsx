import { useEffect } from "react";
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

const kelompokSchema = z.object({
  nama: z.string().min(1, "Nama Kelompok wajib diisi"),
  keteranganKelompok: z.string().optional(),
  wilayahId: z.string().optional(),
});

type KelompokFormValues = z.infer<typeof kelompokSchema>;

const KelompokFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<KelompokFormValues>({
    resolver: zodResolver(kelompokSchema),
    defaultValues: {
      nama: "",
      keteranganKelompok: "",
      wilayahId: "",
    },
  });

  // Fetch Wilayah Options
  const { data: wilayahList, isLoading: isLoadingWilayah } = useQuery({
    queryKey: ['wilayah'],
    queryFn: async () => {
      return await apiClient.get<any[]>('/wilayah');
    }
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['kelompok', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/kelompok/${id}`);
      form.reset({
        nama: data.nama,
        keteranganKelompok: data.keteranganKelompok || "",
        wilayahId: data.wilayahId || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: KelompokFormValues) => {
      const payload = {
        nama: values.nama,
        keteranganKelompok: values.keteranganKelompok || "",
        wilayahId: (values.wilayahId === "" || values.wilayahId === "none") ? null : values.wilayahId
      };
      
      if (isEdit) {
        return apiClient.patch(`/kelompok/${id}`, payload);
      }
      return apiClient.post("/kelompok", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelompok'] });
      toast.success(isEdit ? "Data kelompok diperbarui" : "Data kelompok berhasil ditambahkan");
      navigate("/kelompok");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      let errorMessage = "Terjadi kesalahan";

      if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.map((m: any) => m.message || m).join(", ");
      } else if (typeof serverMessage === "string") {
        errorMessage = serverMessage;
      }

      toast.error(errorMessage);
    }
  });

  const onSubmit = (values: KelompokFormValues) => {
    mutation.mutate(values);
  };

  if (isEdit && isLoadingData) {
    return (
      <div className="h-64 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/kelompok")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Kelompok" : "Tambah Kelompok Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi kelompok sel di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kelompok</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Kelompok Sel Karanganyar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wilayahId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Wilayah (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingWilayah ? "Memuat wilayah..." : "Pilih wilayah pelayanan"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Tanpa Wilayah</SelectItem>
                        {wilayahList?.map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keteranganKelompok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan Kelompok</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informasi tambahan mengenai kelompok ini..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/kelompok")}>
                  Batal
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Kelompok
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KelompokFormPage;
