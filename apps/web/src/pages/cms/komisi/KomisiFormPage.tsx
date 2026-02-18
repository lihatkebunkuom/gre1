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

const komisiSchema = z.object({
  namaKomisi: z.string().min(1, "Nama Komisi wajib diisi"),
  keterangan: z.string().optional(),
});

type KomisiFormValues = z.infer<typeof komisiSchema>;

const KomisiFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<KomisiFormValues>({
    resolver: zodResolver(komisiSchema),
    defaultValues: {
      namaKomisi: "",
      keterangan: "",
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['komisi', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/komisi/${id}`);
      form.reset({
        namaKomisi: data.namaKomisi,
        keterangan: data.keterangan || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: KomisiFormValues) => {
      if (isEdit) {
        return apiClient.patch(`/komisi/${id}`, values);
      }
      return apiClient.post("/komisi", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['komisi'] });
      toast.success(isEdit ? "Data komisi diperbarui" : "Data komisi berhasil ditambahkan");
      navigate("/komisi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: KomisiFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/komisi")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Komisi" : "Tambah Komisi Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi komisi di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="namaKomisi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Komisi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Komisi Pemuda" {...field} />
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
                        placeholder="Deskripsi singkat mengenai komisi ini..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/komisi")}>
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
                      Simpan Komisi
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

export default KomisiFormPage;
