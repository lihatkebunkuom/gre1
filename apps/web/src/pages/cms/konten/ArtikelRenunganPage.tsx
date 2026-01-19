import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, Eye, BookOpen, CalendarIcon, Search, Filter, Loader2, MoreHorizontal, User, Tag, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";
import { artikelRenunganService } from "@/services/konten-rohani.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Schema ---
const formSchema = z.object({
  jenisKonten: z.string().min(1, "Pilih jenis konten"),
  judulKonten: z.string().min(3, "Judul minimal 3 karakter"),
  subJudul: z.string().optional(),
  penulis: z.string().min(1, "Pilih penulis"),
  tanggalTerbit: z.date({ required_error: "Tanggal terbit wajib" }),
  kategoriKonten: z.string().min(1, "Pilih kategori"),
  ayatAlkitab: z.string().optional(),
  isiKonten: z.string().min(10, "Isi konten minimal 10 karakter"),
  ringkasanKonten: z.string().min(5, "Ringkasan wajib diisi"),
  gambarSampul: z.string().optional(),
  statusPublikasi: z.string().default("DRAFT"),
  tag: z.string().optional(),
  jumlahDibaca: z.coerce.number().default(0),
  catatanEditor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Artikel extends FormValues { id: string; }

const PENULIS_OPTIONS = ["Pdt. Andi Wijaya", "Pdt. Budi", "Sdr. Kevin", "Ibu Sarah"];
const KATEGORI_OPTIONS = ["Iman", "Doa", "Keluarga", "Pemuda", "Pelayanan", "Kesaksian"];

const ArtikelRenunganPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["artikel-renungan"],
    queryFn: () => artikelRenunganService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => artikelRenunganService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artikel-renungan"] });
      toast.success("Konten berhasil diterbitkan");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormValues }) =>
      artikelRenunganService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artikel-renungan"] });
      toast.success("Konten diperbarui");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => artikelRenunganService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artikel-renungan"] });
      toast.success("Konten berhasil dihapus");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisKonten: "Renungan", judulKonten: "", subJudul: "",
      penulis: "", tanggalTerbit: new Date(), kategoriKonten: "", ayatAlkitab: "",
      isiKonten: "", ringkasanKonten: "", gambarSampul: "", statusPublikasi: "DRAFT",
      tag: "", jumlahDibaca: 0, catatanEditor: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenisKonten: "Renungan", judulKonten: "", subJudul: "",
      penulis: "", tanggalTerbit: new Date(), kategoriKonten: "", ayatAlkitab: "",
      isiKonten: "", ringkasanKonten: "", gambarSampul: "", statusPublikasi: "DRAFT",
      tag: "", jumlahDibaca: 0, catatanEditor: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Artikel) => {
    setEditingId(item.id);
    form.reset({
      ...item,
      tanggalTerbit: new Date(item.tanggalTerbit),
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredArticles = (articles as Artikel[]).filter(item => 
    item.judulKonten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategoriKonten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Artikel & Renungan" description="Kelola tulisan rohani, renungan harian, dan artikel gereja.">
        <Button onClick={handleAddNew} className="shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Tulis Konten
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul, penulis, atau kategori..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-primary/20" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-11 px-4 gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <div className="bg-muted/50 p-1 rounded-lg flex gap-1 border">
             <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("h-8 px-2", viewMode === "grid" && "bg-background shadow-sm")}
                onClick={() => setViewMode("grid")}
             >
                Grid
             </Button>
             <Button 
                variant={viewMode === "table" ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("h-8 px-2", viewMode === "table" && "bg-background shadow-sm")}
                onClick={() => setViewMode("table")}
             >
                Table
             </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Menyiapkan data konten...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
               <BookOpen className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">Tidak ada data konten</p>
              <p className="text-sm text-muted-foreground max-w-xs">Mulai dengan menulis konten rohani baru atau periksa kata kunci pencarian Anda.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Lihat Semua Data</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
              <div className={cn(
                "h-1.5 w-full transition-colors",
                item.jenisKonten === "Renungan" ? "bg-blue-500/20 group-hover:bg-blue-500" : "bg-emerald-500/20 group-hover:bg-emerald-500"
              )} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 font-medium bg-primary/10 text-primary border-none">
                    {item.kategoriKonten}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Konten
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Konten</div>}
                          onConfirm={() => deleteMutation.mutate(item.id)}
                          variant="destructive"
                          title="Hapus Konten"
                          description={`Yakin ingin menghapus artikel "${item.judulKonten}"?`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{item.judulKonten}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {item.ringkasanKonten || "Belum ada ringkasan untuk konten ini."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                   <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Penulis</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" /> {item.penulis}
                      </span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Jenis</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-primary" /> {item.jenisKonten}
                      </span>
                   </div>
                </div>
                
                <div className="bg-background/50 p-2.5 rounded-lg border flex items-center gap-2.5 text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-muted-foreground">Terbit: {format(new Date(item.tanggalTerbit), "dd MMM yyyy", { locale: localeId })}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center border-t bg-muted/30 py-3">
                 <div className="flex items-center gap-2">
                    {item.statusPublikasi === "TERBIT" ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-700">Terbit</span>
                      </div>
                    ) : item.statusPublikasi === "DRAFT" ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Draft</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-orange-500">
                        <Info className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Arsip</span>
                      </div>
                    )}
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 text-primary font-semibold hover:bg-primary/5 hover:text-primary" onClick={() => handleEdit(item)}>
                    Lihat Detail
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Judul</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.judulKonten}</span>
                      <span className="text-xs text-muted-foreground truncate w-48">{item.subJudul}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal capitalize">
                      {item.jenisKonten}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.penulis}</TableCell>
                  <TableCell>{format(new Date(item.tanggalTerbit), "dd MMM yyyy", { locale: localeId })}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusPublikasi === "TERBIT" ? "default" : item.statusPublikasi === "DRAFT" ? "secondary" : "outline"}>
                      {item.statusPublikasi}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Preview"><Eye className="h-4 w-4 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate(item.id)} variant="destructive" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Konten" : "Tulis Konten Baru"}</DialogTitle>
            <DialogDescription>Buat artikel atau renungan untuk jemaat.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Metadata */}
                <div className="md:col-span-1 space-y-4">
                  <FormField control={form.control} name="gambarSampul" render={({ field }) => (
                    <FormItem><FormLabel>Gambar Sampul</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="jenisKonten" render={({ field }) => (
                    <FormItem><FormLabel>Jenis</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Artikel">Artikel</SelectItem><SelectItem value="Renungan">Renungan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="kategoriKonten" render={({ field }) => (
                    <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="statusPublikasi" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="TERBIT">Terbit</SelectItem><SelectItem value="ARSIP">Arsip</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="tag" render={({ field }) => (
                    <FormItem><FormLabel>Tag / Kata Kunci</FormLabel><FormControl><Input placeholder="iman, doa (pisahkan koma)" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Column 2 & 3: Main Content */}
                <div className="md:col-span-2 space-y-4">
                  <FormField control={form.control} name="judulKonten" render={({ field }) => (
                    <FormItem><FormLabel>Judul Konten</FormLabel><FormControl><Input className="text-lg font-semibold" placeholder="Judul Utama..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="subJudul" render={({ field }) => (
                      <FormItem><FormLabel>Sub Judul</FormLabel><FormControl><Input placeholder="Opsional" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ayatAlkitab" render={({ field }) => (
                      <FormItem><FormLabel>Ayat Alkitab</FormLabel><FormControl><Input placeholder="Cth: Yohanes 3:16" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="penulis" render={({ field }) => (
                       <FormItem><FormLabel>Penulis</FormLabel><FormControl><Input placeholder="Nama penulis..." {...field} /></FormControl><FormMessage /></FormItem>
                     )} />
                     <FormField control={form.control} name="tanggalTerbit" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Tanggal Terbit</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                  </div>

                  <FormField control={form.control} name="ringkasanKonten" render={({ field }) => (
                    <FormItem><FormLabel>Ringkasan / Excerpt</FormLabel><FormControl><Textarea className="h-20 resize-none" placeholder="Ringkasan singkat untuk tampilan kartu..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <FormField control={form.control} name="isiKonten" render={({ field }) => (
                    <FormItem><FormLabel>Isi Konten (Editor)</FormLabel><FormControl><Textarea className="h-64 font-mono text-sm" placeholder="Tulis konten lengkap di sini..." {...field} /></FormControl><FormDescription>Gunakan format Markdown atau HTML sederhana.</FormDescription><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="catatanEditor" render={({ field }) => (
                    <FormItem><FormLabel>Catatan Editor (Internal)</FormLabel><FormControl><Input placeholder="Catatan untuk revisi..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
              
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Simpan & Publikasi</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtikelRenunganPage;