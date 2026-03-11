import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Loader2, Info, BookOpen, Target, Users, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { tentangGerejaService, TentangGerejaData } from "@/services/tentang-gereja.service";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  sejarah: z.string().min(10, "Sejarah minimal 10 karakter"),
  visiMisi: z.string().min(10, "Visi & Misi minimal 10 karakter"),
  susunanMajelis: z.string().min(10, "Susunan Majelis minimal 10 karakter"),
  susunanPengurusKomisi: z.string().min(10, "Susunan Komisi minimal 10 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

const TentangGerejaPage = () => {
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["tentang-gereja"],
    queryFn: () => tentangGerejaService.get(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sejarah: "",
      visiMisi: "",
      susunanMajelis: "",
      susunanPengurusKomisi: "",
    },
  });

  useEffect(() => {
    if (existingData) {
      form.reset({
        sejarah: existingData.sejarah || "",
        visiMisi: existingData.visiMisi || "",
        susunanMajelis: existingData.susunanMajelis || "",
        susunanPengurusKomisi: existingData.susunanPengurusKomisi || "",
      });
    }
  }, [existingData, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => tentangGerejaService.upsert(values as TentangGerejaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tentang-gereja"] });
      toast.success("Informasi gereja berhasil diperbarui");
    },
    onError: () => {
      toast.error("Gagal menyimpan data");
    }
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat informasi gereja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="Tentang Gereja" 
        description="Kelola informasi profil, visi misi, dan struktur organisasi gereja."
      >
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={mutation.isPending}
          className="shadow-md"
        >
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </PageHeader>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mb-6 dark:bg-blue-950/20 dark:border-blue-900/30">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-semibold mb-1">Panduan Pengisian</p>
          <p>Gunakan format teks yang rapi. Informasi ini akan ditampilkan pada profil publik gereja di aplikasi jemaat.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section 1: Sejarah */}
            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg dark:bg-amber-900/30 dark:text-amber-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sejarah Gereja</CardTitle>
                    <CardDescription>Ceritakan asal-usul dan perjalanan gereja.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="sejarah"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Tuliskan sejarah lengkap gereja di sini..." 
                          className="min-h-[300px] font-serif text-base leading-relaxed bg-background/50 focus-visible:ring-primary/20 border-muted"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 2: Visi & Misi */}
            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Visi dan Misi</CardTitle>
                    <CardDescription>Tujuan dan nilai-nilai utama pelayanan.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="visiMisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Tuliskan visi dan poin-poin misi gereja..." 
                          className="min-h-[300px] font-serif text-base leading-relaxed bg-background/50 focus-visible:ring-primary/20 border-muted"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3: Susunan Majelis */}
            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Susunan dan Bidang Majelis</CardTitle>
                    <CardDescription>Struktur kepemimpinan majelis gereja.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="susunanMajelis"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Jabatan - Nama Majelis - Bidang..." 
                          className="min-h-[300px] font-mono text-sm bg-background/50 focus-visible:ring-primary/20 border-muted"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 4: Pengurus Komisi */}
            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Susunan Pengurus Komisi</CardTitle>
                    <CardDescription>Daftar pengurus komisi-komisi gereja.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="susunanPengurusKomisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Contoh: Komisi Anak: Ketua - Nama..." 
                          className="min-h-[300px] font-mono text-sm bg-background/50 focus-visible:ring-primary/20 border-muted"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button 
              type="submit" 
              size="lg"
              disabled={mutation.isPending}
              className="px-10 h-12 text-base shadow-lg"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Simpan Informasi Gereja
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TentangGerejaPage;
