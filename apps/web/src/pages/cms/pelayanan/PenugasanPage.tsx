import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Trash2, CalendarIcon, UserPlus, Search, Filter, MoreVertical, Calendar as CalendarLucide, UserCircle, Briefcase, Info } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PenugasanService } from "@/services/penugasan.service";
import { apiClient } from "@/services/api-client";

// --- Schema ---
const formSchema = z.object({
  petugas_id: z.string().min(1, "Pilih petugas"),
  peran_dalam_pelayanan: z.string().min(1, "Pilih peran"),
  tanggal_mulai_penugasan: z.date({ required_error: "Tanggal mulai wajib" }),
  tanggal_selesai_penugasan: z.date().optional().nullable(),
  jadwal_tugas: z.string().optional().nullable(),
  status_penugasan: z.string().default("AKTIF"),
  evaluasi_kinerja: z.string().optional().nullable(),
  catatan_penugasan: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;
interface Penugasan extends FormValues { 
  id: string; 
  nama_pelayanan?: string; 
  nama_petugas?: string; 
  pelayanan_id: string;
}

const PERAN_OPTIONS = ["Koordinator", "Anggota", "Pendukung", "Mentor", "Volunteer"];

const PenugasanPage = () => {
  const [data, setData] = useState<Penugasan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [pelayananOptions, setPelayananOptions] = useState<{id: string, nama_pelayanan: string}[]>([]);
  const [petugasOptions, setPetugasOptions] = useState<{id: string, nama: string}[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petugas_id: "", peran_dalam_pelayanan: "",
      tanggal_mulai_penugasan: new Date(), status_penugasan: "AKTIF",
      jadwal_tugas: "", evaluasi_kinerja: "", catatan_penugasan: ""
    },
  });

  const fetchData = async () => {
    try {
      const response = await PenugasanService.getAll();
      setData(response as any);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data penugasan");
    }
  };

  const fetchOptions = async () => {
    try {
      const [pelayananRes, petugasRes] = await Promise.all([
        apiClient.get('/pelayanan'),
        apiClient.get('/jemaat')
      ]);
      setPelayananOptions(pelayananRes as any);
      setPetugasOptions(petugasRes as any);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      petugas_id: "", peran_dalam_pelayanan: "",
      tanggal_mulai_penugasan: new Date(), status_penugasan: "AKTIF",
      jadwal_tugas: "", evaluasi_kinerja: "", catatan_penugasan: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Penugasan) => {
    setEditingId(item.id);
    form.reset({
      ...item,
      petugas_id: item.petugas_id,
      tanggal_mulai_penugasan: new Date(item.tanggal_mulai_penugasan),
      tanggal_selesai_penugasan: item.tanggal_selesai_penugasan ? new Date(item.tanggal_selesai_penugasan) : null,
      jadwal_tugas: item.jadwal_tugas || "",
      evaluasi_kinerja: item.evaluasi_kinerja || "",
      catatan_penugasan: item.catatan_penugasan || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await PenugasanService.delete(id);
      toast.success("Penugasan dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus penugasan");
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        pelayanan_id: (values as any).pelayanan_id || pelayananOptions[0]?.id || "manual-input-placeholder",
        tanggal_mulai_penugasan: format(values.tanggal_mulai_penugasan, 'yyyy-MM-dd'),
        tanggal_selesai_penugasan: values.tanggal_selesai_penugasan ? format(values.tanggal_selesai_penugasan, 'yyyy-MM-dd') : undefined,
        jadwal_tugas: values.jadwal_tugas || undefined,
        evaluasi_kinerja: values.evaluasi_kinerja || undefined,
        catatan_penugasan: values.catatan_penugasan || undefined
      };

      if (editingId) {
        await PenugasanService.update(editingId, payload);
        toast.success("Data penugasan diperbarui");
      } else {
        await PenugasanService.create(payload as any);
        toast.success("Petugas berhasil ditugaskan");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data");
    }
  };

  const filteredData = data.filter(item => 
    item.nama_petugas?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_pelayanan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.peran_dalam_pelayanan?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Penugasan Pelayanan" description="Manajemen penempatan SDM pada unit pelayanan gereja.">
        <Button onClick={handleAddNew} className="shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"><UserPlus className="mr-2 h-4 w-4" /> Buat Penugasan</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari petugas, unit, atau peran..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-primary/20" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-11 px-4 gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/10 rounded-2xl border-2 border-dashed flex flex-col items-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <UserCircle className="h-10 w-10 text-muted-foreground opacity-30" />
            </div>
            <p className="text-muted-foreground font-medium">Data penugasan tidak ditemukan</p>
            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-1">Bersihkan pencarian</Button>
          </div>
        ) : (
          filteredData.map((item) => (
            <Card key={item.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/10 overflow-hidden">
              <div className={cn(
                "h-1.5 w-full transition-colors",
                item.status_penugasan === "AKTIF" ? "bg-primary/20 group-hover:bg-primary" : "bg-muted group-hover:bg-muted-foreground"
              )} />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                   <Badge variant={item.status_penugasan === "AKTIF" ? "default" : "secondary"} className={cn(
                     "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border-none",
                     item.status_penugasan === "AKTIF" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                   )}>
                     {item.status_penugasan === "AKTIF" ? "• Aktif" : "Selesai"}
                   </Badge>
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Penugasan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Data</div>}
                          onConfirm={() => handleDelete(item.id)}
                          variant="destructive"
                          title="Hapus Penugasan"
                          description="Data penugasan ini akan dihapus secara permanen."
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{item.nama_petugas}</h3>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> {item.nama_pelayanan || 'Unit Umum'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex items-center justify-between p-3 bg-background/50 backdrop-blur-sm border rounded-xl">
                   <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Peran</p>
                      <p className="text-sm font-bold text-foreground">{item.peran_dalam_pelayanan}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Jadwal</p>
                      <p className="text-xs font-medium">{item.jadwal_tugas || "Fleksibel"}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 border-t pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarLucide className="h-3.5 w-3.5 text-primary" />
                    <span>Mulai: <span className="text-foreground font-medium">{format(new Date(item.tanggal_mulai_penugasan), "dd MMM yyyy", { locale: localeId })}</span></span>
                  </div>
                  {item.tanggal_selesai_penugasan && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Info className="h-3.5 w-3.5 text-orange-500" />
                      <span>Selesai: <span className="text-foreground font-medium">{format(new Date(item.tanggal_selesai_penugasan), "dd MMM yyyy", { locale: localeId })}</span></span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                 <Button variant="ghost" size="sm" className="w-full h-9 group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-transparent font-bold text-xs" onClick={() => handleEdit(item)}>
                   Detail & Evaluasi
                 </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingId ? "Edit Penugasan" : "Penugasan Baru"}</DialogTitle>
            <DialogDescription className="text-base">Tempatkan jemaat atau pelayan dalam divisi pelayanan gereja.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <FormField control={form.control} name="petugas_id" render={({ field }) => (
                   <FormItem><FormLabel className="font-bold">Nama Petugas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11 bg-muted/20 border-muted-foreground/20 focus:ring-primary/20"><SelectValue placeholder="Pilih Petugas" /></SelectTrigger></FormControl><SelectContent>{petugasOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.nama}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="status_penugasan" render={({ field }) => (
                   <FormItem><FormLabel className="font-bold">Status Penugasan</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11 bg-muted/20 border-muted-foreground/20 focus:ring-primary/20"><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AKTIF">Aktif</SelectItem><SelectItem value="SELESAI">Selesai</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <FormField control={form.control} name="peran_dalam_pelayanan" render={({ field }) => (
                   <FormItem><FormLabel className="font-bold">Peran / Posisi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11 bg-muted/20 border-muted-foreground/20 focus:ring-primary/20"><SelectValue placeholder="Pilih Peran" /></SelectTrigger></FormControl><SelectContent>{PERAN_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="jadwal_tugas" render={({ field }) => (
                  <FormItem><FormLabel className="font-bold">Jadwal Tugas</FormLabel><FormControl><Input placeholder="Cth: Minggu Ganjil" className="h-11 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary/20" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField control={form.control} name="tanggal_mulai_penugasan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel className="font-bold">Tanggal Mulai</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-11 bg-muted/20 border-muted-foreground/20 hover:bg-muted/30 transition-all", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
                <FormField control={form.control} name="tanggal_selesai_penugasan" render={({ field }) => (
                   <FormItem className="flex flex-col"><FormLabel className="font-bold">Tanggal Selesai (Opsional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-11 bg-muted/20 border-muted-foreground/20 hover:bg-muted/30 transition-all", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                 )} />
              </div>

              <FormField control={form.control} name="evaluasi_kinerja" render={({ field }) => (
                <FormItem><FormLabel className="font-bold">Evaluasi Kinerja / Catatan</FormLabel><FormControl><Textarea placeholder="Catatan evaluasi pelayanan jemaat ini..." className="resize-none h-24 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary/20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <DialogFooter className="gap-2 sm:gap-0 pt-2"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11 px-8 rounded-xl font-bold">Batal</Button><Button type="submit" className="h-11 px-10 rounded-xl font-bold shadow-lg shadow-primary/20">Simpan Data</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PenugasanPage;