import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Save } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/services/api-client";

const formSchema = z.object({
  namaKegiatan: z.string().min(3, "Nama kegiatan minimal 3 karakter"),
  jenisKegiatan: z.string().min(2, "Jenis kegiatan minimal 2 karakter"),
  tanggalKegiatan: z.string().min(1, "Tanggal kegiatan wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),
  statusAktif: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const QrSessionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaKegiatan: "",
      jenisKegiatan: "Ibadah Minggu",
      tanggalKegiatan: new Date().toISOString().split('T')[0],
      waktuMulai: "",
      waktuSelesai: "",
      statusAktif: true,
    },
  });

  // Fetch data if edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['qr-session', id],
    queryFn: async () => {
      const response = await apiClient.get<any>(`/kehadiran/qr-session/${id}`);
      const data = response as any;
      
      form.reset({
        namaKegiatan: data.namaKegiatan,
        jenisKegiatan: data.jenisKegiatan,
        tanggalKegiatan: new Date(data.tanggalKegiatan).toISOString().split('T')[0],
        waktuMulai: new Date(data.waktuMulai).toISOString().slice(0, 16),
        waktuSelesai: new Date(data.waktuSelesai).toISOString().slice(0, 16),
        statusAktif: data.statusAktif,
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Format dates to ISO strings for backend
      const payload = {
        ...values,
        waktuMulai: new Date(values.waktuMulai).toISOString(),
        waktuSelesai: new Date(values.waktuSelesai).toISOString(),
      };

      if (isEdit) {
        return apiClient.patch(`/kehadiran/qr-session/${id}`, payload);
      }
      return apiClient.post('/kehadiran/qr-session', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-sessions'] });
      toast.success(isEdit ? "Sesi QR diperbarui" : "Sesi QR dibuat");
      navigate("/kehadiran/sesi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (isEdit && isLoadingData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/kehadiran/sesi")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title={isEdit ? "Edit Sesi QR" : "Buat Sesi QR"} 
          description="Atur informasi kegiatan dan masa aktif kode QR." 
        />
      </div>

      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="namaKegiatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kegiatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Ibadah Raya 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenisKegiatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kegiatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Ibadah Minggu, Pemuda, dll" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalKegiatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kegiatan</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="waktuMulai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Mulai QR Aktif</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>QR mulai bisa di-scan</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waktuSelesai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu QR Berakhir</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>QR tidak bisa di-scan lagi</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="statusAktif"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Aktif</FormLabel>
                    <FormDescription>
                      Nonaktifkan jika QR tidak boleh digunakan sementara.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/kehadiran/sesi")}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Sesi
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default QrSessionFormPage;
