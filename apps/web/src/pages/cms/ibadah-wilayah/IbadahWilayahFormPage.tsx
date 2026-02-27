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

const ibadahWilayahSchema = z.object({
  judul: z.string().min(1, "Judul Ibadah wajib diisi"),
  waktu: z.string().min(1, "Waktu pelaksanaan wajib diisi"),
  lokasi: z.string().optional(),
  keterangan: z.string().optional(),
  wilayahId: z.string().min(1, "Wilayah wajib dipilih"),
});

type IbadahWilayahFormValues = z.infer<typeof ibadahWilayahSchema>;

const IbadahWilayahFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<IbadahWilayahFormValues>({
    resolver: zodResolver(ibadahWilayahSchema),
    defaultValues: {
      judul: "",
      waktu: "",
      lokasi: "",
      keterangan: "",
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

  // Helper to format ISO to datetime-local input format
  const formatToInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISODate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISODate;
  };

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-wilayah', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-wilayah/${id}`);
      form.reset({
        judul: data.judul,
        waktu: formatToInput(data.waktu),
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        wilayahId: data.wilayahId,
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: IbadahWilayahFormValues) => {
      // Convert input date to ISO String
      const payload = {
        judul: values.judul,
        waktu: new Date(values.waktu).toISOString(),
        lokasi: values.lokasi || "",
        keterangan: values.keterangan || "",
        wilayahId: values.wilayahId,
      };

      if (isEdit) {
        return apiClient.patch(`/ibadah-wilayah/${id}`, payload);
      }
      return apiClient.post("/ibadah-wilayah", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-wilayah'] });
      toast.success(isEdit ? "Jadwal ibadah wilayah diperbarui" : "Jadwal ibadah wilayah berhasil ditambahkan");
      navigate("/ibadah-wilayah");
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

  const onSubmit = (values: IbadahWilayahFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/ibadah-wilayah")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Ibadah Wilayah" : "Tambah Ibadah Wilayah Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi rincian jadwal ibadah wilayah di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="wilayahId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Wilayah</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingWilayah ? "Memuat wilayah..." : "Pilih lokasi wilayah pelayanan"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Ibadah</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ibadah Keluarga Wilayah I" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waktu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Pelaksanaan (Tanggal & Jam)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                      <Input placeholder="Contoh: Rumah Kel. Bp. Sutrisno" {...field} />
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
                        placeholder="Informasi tambahan (tema, pengkhotbah, dll)..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/ibadah-wilayah")}>
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
                      Simpan Jadwal
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

export default IbadahWilayahFormPage;
