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

const pepanthanSchema = z.object({
  namaPepanthan: z.string().min(1, "Nama Pepanthan wajib diisi"),
  alamat: z.string().optional(),
  keterangan: z.string().optional(),
});

type PepanthanFormValues = z.infer<typeof pepanthanSchema>;

const PepanthanFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<PepanthanFormValues>({
    resolver: zodResolver(pepanthanSchema),
    defaultValues: {
      namaPepanthan: "",
      alamat: "",
      keterangan: "",
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['pepanthan', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/pepanthan/${id}`);
      form.reset({
        namaPepanthan: data.namaPepanthan,
        alamat: data.alamat || "",
        keterangan: data.keterangan || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: PepanthanFormValues) => {
      if (isEdit) {
        return apiClient.patch(`/pepanthan/${id}`, values);
      }
      return apiClient.post("/pepanthan", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pepanthan'] });
      toast.success(isEdit ? "Data pepanthan diperbarui" : "Data pepanthan berhasil ditambahkan");
      navigate("/pepanthan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: PepanthanFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/pepanthan")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Pepanthan" : "Tambah Pepanthan Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi pepanthan di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="namaPepanthan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pepanthan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Pepanthan Karanganyar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Alamat lengkap pepanthan..." 
                        {...field} 
                      />
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
                        placeholder="Informasi tambahan..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/pepanthan")}>
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
                      Simpan Pepanthan
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

export default PepanthanFormPage;
