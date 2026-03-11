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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { apiClient } from "@/services/api-client";
import { cn } from "@/lib/utils";

const ibadahKelompokSchema = z.object({
  judul: z.string().min(1, "Judul ibadah wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  keterangan: z.string().optional(),
  kelompokId: z.string().min(1, "Kelompok wajib dipilih"),
  bahasakelompok: z.string().optional(),
  tanggalkelompok: z.date().optional().nullable(),
  petugaskelompok: z.string().optional(),
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
      waktuMulai: "",
      lokasi: "",
      keterangan: "",
      kelompokId: "",
      bahasakelompok: "",
      tanggalkelompok: null,
      petugaskelompok: "",
    },
  });

  // Fetch Kelompok List
  const { data: kelompokList } = useQuery({
    queryKey: ['kelompok'],
    queryFn: async () => {
      return await apiClient.get<any[]>('/kelompok');
    }
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-kelompok', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-kelompok/${id}`);
      form.reset({
        judul: data.judul || "",
        waktuMulai: data.waktuMulai || "",
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        kelompokId: data.kelompokId || "",
        bahasakelompok: data.bahasakelompok || "",
        tanggalkelompok: data.tanggalkelompok ? new Date(data.tanggalkelompok) : null,
        petugaskelompok: data.petugaskelompok || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: IbadahKelompokFormValues) => {
      const payload = {
        ...values,
        tanggalkelompok: values.tanggalkelompok ? format(values.tanggalkelompok, "yyyy-MM-dd") : null,
      };
      
      if (isEdit) {
        return apiClient.patch(`/ibadah-kelompok/${id}`, payload);
      }
      return apiClient.post("/ibadah-kelompok", payload);
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
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
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
                    <FormLabel>Pilih Kelompok <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelompok" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(kelompokList) && kelompokList.map((k) => (
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
                    <FormLabel>Judul Ibadah <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ibadah Rumah Tangga" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tanggalkelompok"
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
                    <FormLabel>Lokasi Ibadah <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Rumah Bpk. Slamet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bahasakelompok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bahasa</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Indonesia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="petugaskelompok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petugas</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Pdt. Budi Santoso" {...field} />
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
