import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, Image as ImageIcon, Video, Mic, ExternalLink, Calendar as CalendarIcon, Search, Filter, Loader2, MoreHorizontal, User, Tag, Clock, Info } from "lucide-react";
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
import { mediaGaleriService } from "@/services/konten-rohani.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Schema ---
const formSchema = z.object({
  jenisMedia: z.string().min(1, "Pilih jenis media"),
  judulMedia: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsiMedia: z.string().optional(),
  kategoriMedia: z.string().min(1, "Pilih kategori"),
  fileMedia: z.string().optional(),
  thumbnailMedia: z.string().optional(),
  tanggalUpload: z.date({ required_error: "Tanggal upload wajib" }),
  durasiMedia: z.string().optional(),
  pengunggah: z.string().min(1, "Pilih pengunggah"),
  statusTampil: z.string().default("DITAMPILKAN"),
  tagMedia: z.string().optional(),
  catatanMedia: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface MediaItem extends FormValues { id: string; }

const KATEGORI_MEDIA = ["Ibadah", "Event", "Pelayanan", "Komsel", "Promosi", "Dokumentasi"];
const PENGUNGGAH_OPTIONS = ["Tim Multimedia", "Sekretariat", "Admin", "Tim Musik"];

const MediaGaleriPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ["media-galeri"],
    queryFn: () => mediaGaleriService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => mediaGaleriService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-galeri"] });
      toast.success("Media ditambahkan");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormValues }) =>
      mediaGaleriService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-galeri"] });
      toast.success("Data media diperbarui");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaGaleriService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-galeri"] });
      toast.success("Media berhasil dihapus");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisMedia: "Gambar", judulMedia: "", deskripsiMedia: "",
      kategoriMedia: "", fileMedia: "", thumbnailMedia: "", tanggalUpload: new Date(),
      durasiMedia: "", pengunggah: "", statusTampil: "DITAMPILKAN", tagMedia: "", catatanMedia: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      jenisMedia: "Gambar", judulMedia: "", deskripsiMedia: "",
      kategoriMedia: "", fileMedia: "", thumbnailMedia: "", tanggalUpload: new Date(),
      durasiMedia: "", pengunggah: "", statusTampil: "DITAMPILKAN", tagMedia: "", catatanMedia: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MediaItem) => {
    setEditingId(item.id);
    form.reset({
      ...item,
      tanggalUpload: new Date(item.tanggalUpload),
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

  const getIcon = (type: string) => {
    switch(type) {
      case "Video": return <Video className="h-4 w-4 text-red-500" />;
      case "Audio": return <Mic className="h-4 w-4 text-blue-500" />;
      default: return <ImageIcon className="h-4 w-4 text-green-500" />;
    }
  };

  const filteredData = (mediaItems as MediaItem[]).filter(item => 
    item.judulMedia.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategoriMedia.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pengunggah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Media & Galeri" description="Kelola konten visual, video, dan multimedia gereja.">
        <Button onClick={handleAddNew} className="shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Upload Media
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul, kategori, atau pengunggah..." 
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
          <p className="text-muted-foreground animate-pulse">Menyiapkan galeri media...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
               <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">Tidak ada data media</p>
              <p className="text-sm text-muted-foreground max-w-xs">Mulai dengan mengunggah foto atau video baru atau periksa kata kunci pencarian Anda.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Lihat Semua Media</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {item.thumbnailMedia ? (
                  <img src={item.thumbnailMedia} alt={item.judulMedia} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                     {getIcon(item.jenisMedia)}
                  </div>
                )}
                <Badge className="absolute top-2 left-2 bg-black/50 backdrop-blur-md border-none text-white font-medium">
                  {item.jenisMedia}
                </Badge>
                {item.durasiMedia && (
                  <Badge className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md border-none text-white text-[10px]">
                    {item.durasiMedia}
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 font-medium bg-primary/10 text-primary border-none">
                    {item.kategoriMedia}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Media
                      </DropdownMenuItem>
                      {item.fileMedia && (
                        <DropdownMenuItem onClick={() => window.open(item.fileMedia, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" /> Buka Tautan
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Media</div>}
                          onConfirm={() => deleteMutation.mutate(item.id)}
                          variant="destructive"
                          title="Hapus Media"
                          description={`Yakin ingin menghapus media "${item.judulMedia}"?`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">{item.judulMedia}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[32px] text-xs">
                  {item.deskripsiMedia || "Tidak ada deskripsi untuk media ini."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                   <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground uppercase tracking-wider font-semibold">Pengunggah</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <User className="h-3 w-3 text-primary" /> {item.pengunggah}
                      </span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground uppercase tracking-wider font-semibold">Tanggal</span>
                      <span className="font-medium flex items-center gap-1.5">
                        <CalendarIcon className="h-3 w-3 text-primary" /> {format(new Date(item.tanggalUpload), "dd MMM yy")}
                      </span>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center border-t bg-muted/30 py-2">
                 <div className="flex items-center gap-2">
                    {item.statusTampil === "DITAMPILKAN" ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-semibold text-green-700">Tampil</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-semibold">Hidden</span>
                      </div>
                    )}
                 </div>
                 <Button variant="ghost" size="sm" className="h-7 text-[10px] text-primary font-semibold hover:bg-primary/5" onClick={() => handleEdit(item)}>
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
                <TableHead className="w-[80px]">Thumb</TableHead>
                <TableHead>Media Info</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="h-10 w-16 bg-muted rounded overflow-hidden">
                      {item.thumbnailMedia ? (
                        <img src={item.thumbnailMedia} alt="thumb" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          {getIcon(item.jenisMedia)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.judulMedia}</span>
                      {item.fileMedia && (
                        <a href={item.fileMedia} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                          Link File <ExternalLink className="h-2 w-2" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      {getIcon(item.jenisMedia)} <span>{item.jenisMedia}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{item.kategoriMedia}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-col text-[10px]">
                      <span>{format(new Date(item.tanggalUpload), "dd MMM yyyy", { locale: localeId })}</span>
                      <span className="text-muted-foreground">{item.pengunggah}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.statusTampil === "DITAMPILKAN" ? "default" : "secondary"} className="text-[10px]">
                      {item.statusTampil === "DITAMPILKAN" ? "Tampil" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8"><Edit className="h-3.5 w-3.5 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate(item.id)} variant="destructive" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Media" : "Upload Media Baru"}</DialogTitle>
            <DialogDescription>Tambahkan konten multimedia ke dalam galeri gereja.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField control={form.control} name="jenisMedia" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Media</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Gambar">Gambar</SelectItem><SelectItem value="Video">Video</SelectItem><SelectItem value="Audio">Audio</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <FormField control={form.control} name="thumbnailMedia" render={({ field }) => (
                    <FormItem><FormLabel>Thumbnail</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="col-span-2 space-y-4">
                  <FormField control={form.control} name="judulMedia" render={({ field }) => (
                    <FormItem><FormLabel>Judul Media</FormLabel><FormControl><Input placeholder="Judul Foto / Video" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fileMedia" render={({ field }) => (
                    <FormItem><FormLabel>Link File / URL Video (Opsional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="deskripsiMedia" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea className="h-20 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="kategoriMedia" render={({ field }) => (
                   <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_MEDIA.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="pengunggah" render={({ field }) => (
                   <FormItem><FormLabel>Pengunggah</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Pengunggah" /></SelectTrigger></FormControl><SelectContent>{PENGUNGGAH_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggalUpload" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Upload</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="durasiMedia" render={({ field }) => (
                   <FormItem><FormLabel>Durasi (Opsional)</FormLabel><FormControl><Input placeholder="00:00" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="statusTampil" render={({ field }) => (
                   <FormItem><FormLabel>Status Tampil</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="DITAMPILKAN">Ditampilkan</SelectItem><SelectItem value="DISEMBUNYIKAN">Disembunyikan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="tagMedia" render={({ field }) => (
                   <FormItem><FormLabel>Tag / Kata Kunci</FormLabel><FormControl><Input placeholder="Pisahkan dengan koma" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              
              <FormField control={form.control} name="catatanMedia" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan internal..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaGaleriPage;