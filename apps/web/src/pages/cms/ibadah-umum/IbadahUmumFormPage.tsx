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
import { apiClient } from "@/services/api-client";

const ibadahUmumSchema = z.object({
  judul: z.string().optional(),
  waktuMulai: z.string().optional(),
  lokasi: z.string().optional(),
  keterangan: z.string().optional(),
});

type IbadahUmumFormValues = z.infer<typeof ibadahUmumSchema>;

const IbadahUmumFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<IbadahUmumFormValues>({
    resolver: zodResolver(ibadahUmumSchema),
    defaultValues: {
      judul: "",
      waktuMulai: "",
      lokasi: "",
      keterangan: "",
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-umum', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-umum/${id}`);
      form.reset({
        judul: data.judul || "",
        waktuMulai: data.waktuMulai || "",
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: IbadahUmumFormValues) => {
      if (isEdit) {
        return apiClient.patch(`/ibadah-umum/${id}`, values);
      }
      return apiClient.post("/ibadah-umum", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-umum'] });
      toast.success(isEdit ? "Data ibadah diperbarui" : "Data ibadah berhasil ditambahkan");
      navigate("/ibadah-umum");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: IbadahUmumFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/ibadah-umum")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Ibadah Umum" : "Tambah Ibadah Umum Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi ibadah di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Ibadah</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ibadah Minggu Pagi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waktuMulai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Mulai</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lokasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Gedung Utama Lt. 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informasi tambahan mengenai ibadah..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/ibadah-umum")}>
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
                      Simpan Ibadah
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

export default IbadahUmumFormPage;