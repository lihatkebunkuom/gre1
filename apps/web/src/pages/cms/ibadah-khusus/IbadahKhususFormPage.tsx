import { useEffect } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { apiClient } from "@/services/api-client";
import { cn } from "@/lib/utils";

const ibadahKhususSchema = z.object({
  judul: z.string().min(1, "Judul ibadah wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  keterangan: z.string().optional(),
  bahasakhusus: z.string().optional(),
  tanggalkhusus: z.date().optional().nullable(),
  petugaskhusus: z.string().optional(),
});

type IbadahKhususFormValues = z.infer<typeof ibadahKhususSchema>;

const IbadahKhususFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<IbadahKhususFormValues>({
    resolver: zodResolver(ibadahKhususSchema),
    defaultValues: {
      judul: "",
      waktuMulai: "",
      lokasi: "",
      keterangan: "",
      bahasakhusus: "",
      tanggalkhusus: null,
      petugaskhusus: "",
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-khusus', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-khusus/${id}`);
      form.reset({
        judul: data.judul || "",
        waktuMulai: data.waktuMulai || "",
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        bahasakhusus: data.bahasakhusus || "",
        tanggalkhusus: data.tanggalkhusus ? new Date(data.tanggalkhusus) : null,
        petugaskhusus: data.petugaskhusus || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: IbadahKhususFormValues) => {
      const payload = {
        ...values,
        tanggalkhusus: values.tanggalkhusus ? format(values.tanggalkhusus, "yyyy-MM-dd") : null,
      };
      
      if (isEdit) {
        return apiClient.patch(`/ibadah-khusus/${id}`, payload);
      }
      return apiClient.post("/ibadah-khusus", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-khusus'] });
      toast.success(isEdit ? "Data ibadah diperbarui" : "Data ibadah berhasil ditambahkan");
      navigate("/ibadah-khusus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: IbadahKhususFormValues) => {
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
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ibadah-khusus")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Ibadah Khusus" : "Tambah Ibadah Khusus Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi ibadah khusus di bawah ini.</p>
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
                    <FormLabel>Judul Ibadah Khusus <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ibadah Syukuran Rumah Baru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tanggalkhusus"
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

              <FormField
                control={form.control}
                name="lokasi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Ibadah Khusus <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Rumah Kel. Bapak X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bahasakhusus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bahasa</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Indonesia / Mandarin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="petugaskhusus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petugas</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Pdt. Samuel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                <Button type="button" variant="outline" onClick={() => navigate("/ibadah-khusus")}>
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

export default IbadahKhususFormPage;
