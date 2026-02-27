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

const ibadahKelompokSchema = z.object({
  judul: z.string().min(1, "Judul harus diisi"),
  waktu: z.string().min(1, "Waktu harus diisi"),
  lokasi: z.string().min(1, "Lokasi harus diisi"),
  keterangan: z.string().optional(),
  kelompokId: z.string().min(1, "Kelompok harus dipilih"),
});

type IbadahKelompokFormValues = z.infer<typeof ibadahKelompokSchema>;

const IbadahKelompokFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<IbadahKelompokFormValues>({
    resolver: zodResolver(ibadahKelompokSchema),
    defaultValues: {
      judul: "",
      waktu: "",
      lokasi: "",
      keterangan: "",
      kelompokId: "",
    },
  });

  // Fetch Kelompok List
  const { data: kelompokList } = useQuery({
    queryKey: ['kelompok'],
    queryFn: async () => {
      const response = await apiClient.get<any[]>('/kelompok');
      return response;
    }
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-kelompok', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-kelompok/${id}`);
      
      let formattedDate = "";
      if (data.waktu) {
        const date = new Date(data.waktu);
        if (!isNaN(date.getTime())) {
          formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
        }
      }

      form.reset({
        judul: data.judul || "",
        waktu: formattedDate,
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        kelompokId: data.kelompokId || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const kelompokOptions = Array.isArray(kelompokList) ? kelompokList : [];

  const mutation = useMutation({
    mutationFn: async (values: IbadahKelompokFormValues) => {
      // Convert to ISO string for backend
      const data = {
        ...values,
        waktu: new Date(values.waktu).toISOString(),
      };
      
      if (isEdit) {
        return apiClient.patch(`/ibadah-kelompok/${id}`, data);
      }
      return apiClient.post("/ibadah-kelompok", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-kelompok'] });
      toast.success(isEdit ? "Data ibadah diperbarui" : "Data ibadah berhasil ditambahkan");
      navigate("/ibadah-kelompok");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: IbadahKelompokFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/ibadah-kelompok")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Ibadah Kelompok" : "Tambah Ibadah Kelompok Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi ibadah kelompok di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="kelompokId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelompok</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelompok" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kelompokOptions.map((k) => (
                          <SelectItem key={k.id} value={k.id}>
                            {k.nama}
                          </SelectItem>
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
                      <Input placeholder="Contoh: Ibadah Rumah Tangga" {...field} />
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
                    <FormLabel>Tanggal & Jam</FormLabel>
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
                    <FormLabel>Lokasi Ibadah</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Rumah Bpk. Slamet" {...field} />
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
                        placeholder="Informasi tambahan (optional)..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/ibadah-kelompok")}>
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
                      Simpan Data
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

export default IbadahKelompokFormPage;
