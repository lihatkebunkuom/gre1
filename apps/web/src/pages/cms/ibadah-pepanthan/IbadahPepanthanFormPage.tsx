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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { apiClient } from "@/services/api-client";
import { cn } from "@/lib/utils";

const ibadahPepanthanSchema = z.object({
  judul: z.string().min(1, { message: "Judul ibadah wajib diisi" }),
  waktuMulai: z.string().min(1, { message: "Waktu mulai wajib diisi" }),
  lokasi: z.string().min(1, { message: "Detail lokasi wajib diisi" }),
  keterangan: z.string().optional(),
  pepanthanId: z.string().min(1, { message: "Pepanthan wajib dipilih" }),
  bahasapepanthan: z.string().optional(),
  tanggalpepanthan: z.date().optional().nullable(),
  petugaspepanthan: z.string().optional(),
});

type IbadahPepanthanFormValues = z.infer<typeof ibadahPepanthanSchema>;

const IbadahPepanthanFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const form = useForm<IbadahPepanthanFormValues>({
    resolver: zodResolver(ibadahPepanthanSchema),
    defaultValues: {
      judul: "",
      waktuMulai: "",
      lokasi: "",
      keterangan: "",
      pepanthanId: "",
      bahasapepanthan: "",
      tanggalpepanthan: null,
      petugaspepanthan: "",
    },
  });

  // Fetch Pepanthan Options
  const { data: pepanthanList, isLoading: isLoadingPepanthan } = useQuery({
    queryKey: ['pepanthan'],
    queryFn: async () => {
      return await apiClient.get<any[]>('/pepanthan');
    },
  });

  // Fetch Data for Edit
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['ibadah-pepanthan', id],
    queryFn: async () => {
      const data = await apiClient.get<any>(`/ibadah-pepanthan/${id}`);
      form.reset({
        judul: data.judul || "",
        waktuMulai: data.waktuMulai || "",
        lokasi: data.lokasi || "",
        keterangan: data.keterangan || "",
        pepanthanId: data.pepanthanId || "",
        bahasapepanthan: data.bahasapepanthan || "",
        tanggalpepanthan: data.tanggalpepanthan ? new Date(data.tanggalpepanthan) : null,
        petugaspepanthan: data.petugaspepanthan || "",
      });
      return data;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (values: IbadahPepanthanFormValues) => {
      const payload = {
        ...values,
        tanggalpepanthan: values.tanggalpepanthan ? format(values.tanggalpepanthan, "yyyy-MM-dd") : null,
      };
      if (isEdit) {
        return apiClient.patch(`/ibadah-pepanthan/${id}`, payload);
      }
      return apiClient.post("/ibadah-pepanthan", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibadah-pepanthan'] });
      toast.success(isEdit ? "Data ibadah diperbarui" : "Data ibadah berhasil ditambahkan");
      navigate("/ibadah-pepanthan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  });

  const onSubmit = (values: IbadahPepanthanFormValues) => {
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/ibadah-pepanthan")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Ibadah Pepanthan" : "Tambah Ibadah Pepanthan Baru"}</h2>
          <p className="text-muted-foreground">Lengkapi informasi ibadah di bawah ini.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pepanthanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Pepanthan <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingPepanthan ? "Memuat data pepanthan..." : "Pilih lokasi pepanthan"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pepanthanList?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.namaPepanthan}
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
                      <Input placeholder="Contoh: Ibadah Minggu Sore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tanggalpepanthan"
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
                    <FormLabel>Detail Lokasi <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ruang Utama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bahasapepanthan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bahasa</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jawa / Indonesia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="petugaspepanthan"
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
                <Button type="button" variant="outline" onClick={() => navigate("/ibadah-pepanthan")}>
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

export default IbadahPepanthanFormPage;
