import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Plus, Trash2, Image, Video, Mic, ExternalLink, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

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

// --- Schema ---
const formSchema = z.object({
  kode_media: z.string().min(1, "Kode wajib diisi"),
  jenis_media: z.string().min(1, "Pilih jenis media"),
  judul_media: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi_media: z.string().optional(),
  kategori_media: z.string().min(1, "Pilih kategori"),
  file_media: z.string().min(1, "Link/File wajib diisi"),
  thumbnail_media: z.string().optional(),
  tanggal_upload: z.date({ required_error: "Tanggal upload wajib" }),
  durasi_media: z.string().optional(),
  pengunggah: z.string().min(1, "Pilih pengunggah"),
  status_tampil: z.string().default("DITAMPILKAN"),
  tag_media: z.string().optional(),
  catatan_media: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface MediaItem extends FormValues { id: string; }

// --- Mock Data ---
const MOCK_DATA: MediaItem[] = [
  { 
    id: "1", kode_media: "MED-001", jenis_media: "Video", judul_media: "Highlight Natal 2023", 
    deskripsi_media: "Dokumentasi perayaan Natal.", kategori_media: "Event", 
    file_media: "https://youtube.com/watch?v=xyz", thumbnail_media: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80", 
    tanggal_upload: new Date("2023-12-26"), durasi_media: "05:30", pengunggah: "Tim Multimedia", 
    status_tampil: "DITAMPILKAN", tag_media: "natal, dokumentasi", catatan_media: "" 
  },
  { 
    id: "2", kode_media: "MED-002", jenis_media: "Gambar", judul_media: "Flyer Ibadah Padang", 
    deskripsi_media: "Flyer promosi.", kategori_media: "Ibadah", 
    file_media: "https://example.com/flyer.jpg", thumbnail_media: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80", 
    tanggal_upload: new Date("2023-11-10"), durasi_media: "", pengunggah: "Sekretariat", 
    status_tampil: "DISEMBUNYIKAN", tag_media: "flyer, promo", catatan_media: "Sudah lewat" 
  },
];

const KATEGORI_MEDIA = ["Ibadah", "Event", "Pelayanan", "Komsel", "Promosi", "Dokumentasi"];
const PENGUNGGAH_OPTIONS = ["Tim Multimedia", "Sekretariat", "Admin", "Tim Musik"];

const MediaGaleriPage = () => {
  const [data, setData] = useState<MediaItem[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_media: "", jenis_media: "Gambar", judul_media: "", deskripsi_media: "",
      kategori_media: "", file_media: "", thumbnail_media: "", tanggal_upload: new Date(),
      durasi_media: "", pengunggah: "", status_tampil: "DITAMPILKAN", tag_media: "", catatan_media: ""
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      kode_media: `MED-${Math.floor(Math.random() * 1000)}`,
      jenis_media: "Gambar", judul_media: "", deskripsi_media: "",
      kategori_media: "", file_media: "", thumbnail_media: "", tanggal_upload: new Date(),
      durasi_media: "", pengunggah: "", status_tampil: "DITAMPILKAN", tag_media: "", catatan_media: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MediaItem) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Media berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data media diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Media ditambahkan");
    }
    setIsDialogOpen(false);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "Video": return <Video className="h-4 w-4 text-red-500" />;
      case "Audio": return <Mic className="h-4 w-4 text-blue-500" />;
      default: return <Image className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Media & Galeri" description="Kelola konten visual, video, dan multimedia gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Upload Media</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
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
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-10 w-16 bg-muted rounded overflow-hidden">
                    {item.thumbnail_media ? (
                      <img src={item.thumbnail_media} alt="thumb" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Image className="h-4 w-4" /></div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.judul_media}</span>
                    <a href={item.file_media} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                      Link File <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(item.jenis_media)} <span>{item.jenis_media}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{item.kategori_media}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{format(item.tanggal_upload, "dd MMM yyyy", { locale: localeId })}</span>
                    <span className="text-xs text-muted-foreground">{item.pengunggah}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status_tampil === "DITAMPILKAN" ? "default" : "secondary"}>
                    {item.status_tampil === "DITAMPILKAN" ? "Tampil" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                    <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => handleDelete(item.id)} variant="destructive" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Media" : "Upload Media Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kode_media" render={({ field }) => (
                  <FormItem><FormLabel>Kode Media</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="jenis_media" render={({ field }) => (
                  <FormItem><FormLabel>Jenis Media</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Gambar">Gambar</SelectItem><SelectItem value="Video">Video</SelectItem><SelectItem value="Audio">Audio</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <FormField control={form.control} name="thumbnail_media" render={({ field }) => (
                    <FormItem><FormLabel>Thumbnail</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="col-span-2 space-y-4">
                  <FormField control={form.control} name="judul_media" render={({ field }) => (
                    <FormItem><FormLabel>Judul Media</FormLabel><FormControl><Input placeholder="Judul Foto / Video" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="file_media" render={({ field }) => (
                    <FormItem><FormLabel>Link File / URL Video</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="deskripsi_media" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea className="h-20 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="kategori_media" render={({ field }) => (
                   <FormItem><FormLabel>Kategori</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl><SelectContent>{KATEGORI_MEDIA.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="pengunggah" render={({ field }) => (
                   <FormItem><FormLabel>Pengunggah</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Pengunggah" /></SelectTrigger></FormControl><SelectContent>{PENGUNGGAH_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="tanggal_upload" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Upload</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="durasi_media" render={({ field }) => (
                   <FormItem><FormLabel>Durasi (Opsional)</FormLabel><FormControl><Input placeholder="00:00" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status_tampil" render={({ field }) => (
                   <FormItem><FormLabel>Status Tampil</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="DITAMPILKAN">Ditampilkan</SelectItem><SelectItem value="DISEMBUNYIKAN">Disembunyikan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="tag_media" render={({ field }) => (
                   <FormItem><FormLabel>Tag / Kata Kunci</FormLabel><FormControl><Input placeholder="Pisahkan dengan koma" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              
              <FormField control={form.control} name="catatan_media" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan internal..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaGaleriPage;