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

const wilayahSchema = z.object({
  nama: z.string().min(1, "Nama Wilayah wajib diisi"),
  keterangan: z.string().optional(),
});

type WilayahFormValues = z.infer<typeof wilayahSchema>;

const WilayahFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<WilayahFormValues>({
    resolver: zodResolver(wilayahSchema),
    defaultValues: {
      nama: "",
      keterangan: "",
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['wilayah', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/wilayah/${id}`);
      form.reset({
        nama: data.nama,
        keterangan: data.keterangan || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: WilayahFormValues) => {
      const payload = {
        nama: values.nama,
        keterangan: values.keterangan || "",
      };

      if (isEdit) {
        return apiClient.patch(`/wilayah/${id}`, payload);
      }
      return apiClient.post("/wilayah", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wilayah'] });
      toast.success(isEdit ? "Data wilayah diperbarui" : "Data wilayah berhasil ditambahkan");
      navigate("/wilayah");
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

  const onSubmit = (values: WilayahFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/wilayah")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Wilayah" : "Tambah Wilayah Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi wilayah pelayanan di bawah ini.</p>
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
                    <FormLabel>Nama Wilayah</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Wilayah I / Jakarta Barat" {...field} />
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
                        placeholder="Informasi tambahan mengenai wilayah ini..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/wilayah")}>
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
                      Simpan Wilayah
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

export default WilayahFormPage;
