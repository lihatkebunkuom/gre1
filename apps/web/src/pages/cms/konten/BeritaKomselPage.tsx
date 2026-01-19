import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, Search, Newspaper, Filter, Loader2, MoreHorizontal, Info } from "lucide-react";
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cn } from "@/lib/utils";
import { beritaKomselService } from "@/services/konten-rohani.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/common/ImageUpload";

// --- Schema & Types ---
const formSchema = z.object({
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  deskripsi: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BeritaKomsel extends FormValues {
  id: string;
}

const BeritaKomselPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["berita-komsel"],
    queryFn: () => beritaKomselService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => beritaKomselService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["berita-komsel"] });
      toast.success("Berita berhasil ditambahkan");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormValues }) =>
      beritaKomselService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["berita-komsel"] });
      toast.success("Berita berhasil diperbarui");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => beritaKomselService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["berita-komsel"] });
      toast.success("Berita berhasil dihapus");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", deskripsi: "", tanggal: new Date(), imageUrl: "" },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", deskripsi: "", tanggal: new Date(), imageUrl: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: BeritaKomsel) => {
    setEditingId(item.id);
    form.reset({
      ...item,
      tanggal: new Date(item.tanggal),
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

  const filteredData = (news as BeritaKomsel[]).filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Berita Komsel" description="Informasi dan pengumuman seputar kegiatan komunitas sel.">
        <Button onClick={handleAddNew} className="shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari berita komsel..." 
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
          <p className="text-muted-foreground animate-pulse">Menyiapkan berita komsel...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
               <Newspaper className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">Tidak ada berita komsel</p>
              <p className="text-sm text-muted-foreground max-w-xs">Mulai dengan menambahkan berita baru atau periksa kata kunci pencarian Anda.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Lihat Semua Berita</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
              <div className="h-1.5 w-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
              {item.imageUrl && (
                <div className="aspect-video relative overflow-hidden bg-muted border-b">
                  <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 font-medium bg-primary/10 text-primary border-none">
                    Komsel
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Berita
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Berita</div>}
                          onConfirm={() => deleteMutation.mutate(item.id)}
                          variant="destructive"
                          title="Hapus Berita"
                          description={`Yakin ingin menghapus berita "${item.title}"?`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {item.deskripsi}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 space-y-4">
                <div className="bg-background/50 p-2.5 rounded-lg border flex items-center gap-2.5 text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-muted-foreground">Tanggal: {format(new Date(item.tanggal), "dd MMM yyyy", { locale: localeId })}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end items-center border-t bg-muted/30 py-3">
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
                <TableHead>Judul Berita</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi Singkat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-blue-500" /> {item.title}
                  </TableCell>
                  <TableCell>{format(new Date(item.tanggal), "dd MMM yyyy", { locale: localeId })}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Berita" : "Tambah Berita Komsel"}</DialogTitle>
            <DialogDescription>Bagikan informasi terbaru kepada anggota komsel.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Berita</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Judul Berita</FormLabel><FormControl><Input placeholder="Contoh: Jadwal Retreat..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tanggal" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="deskripsi" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea placeholder="Tuliskan detail berita di sini..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeritaKomselPage;