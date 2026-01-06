import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cn } from "@/lib/utils";

// --- Types & Schema ---

const formSchema = z.object({
  image: z.string().min(1, { message: "Gambar wajib diupload" }),
  kategori: z.string().min(1, { message: "Kategori wajib dipilih" }),
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Banner extends FormValues {
  id: string;
}

// --- Mock Data ---

const MOCK_DATA: Banner[] = [
  {
    id: "1",
    title: "Ibadah Raya Spesial Natal",
    kategori: "Event",
    tanggal: new Date(),
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
  },
  {
    id: "2",
    title: "Renungan: Hidup yang Berbuah",
    kategori: "Artikel",
    tanggal: new Date(Date.now() - 86400000), // Kemarin
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
  },
];

const KATEGORI_OPTIONS = ["Event", "Artikel", "Pengumuman", "Renungan"];

// --- Main Component ---

const BannerTopPage = () => {
  // State
  const [data, setData] = useState<Banner[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      kategori: "",
      image: "",
      tanggal: new Date(),
    },
  });

  // Handlers
  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      title: "",
      kategori: "",
      image: "",
      tanggal: new Date(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Banner) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      kategori: item.kategori,
      image: item.image,
      tanggal: item.tanggal,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Banner berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      // Update
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...values, id: editingId } : item
        )
      );
      toast.success("Banner berhasil diperbarui");
    } else {
      // Create
      const newBanner: Banner = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
      };
      setData((prev) => [newBanner, ...prev]);
      toast.success("Banner baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  // Filter Data
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Top / Artikel"
        description="Kelola banner utama yang muncul di halaman depan aplikasi."
      >
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Banner
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan judul..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table List */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Image</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada data banner ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-32 h-16 rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.kategori}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(item.tanggal, "dd MMMM yyyy", { locale: localeId })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title="Hapus Banner"
                        description={`Apakah Anda yakin ingin menghapus banner "${item.title}"?`}
                        onConfirm={() => handleDelete(item.id)}
                        variant="destructive"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Create / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Banner" : "Tambah Banner Baru"}</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk {editingId ? "memperbarui" : "membuat"} banner.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Image Upload Field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar Banner</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul banner..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="kategori"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {KATEGORI_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Picker Field */}
                <FormField
                  control={form.control}
                  name="tanggal"
                  render={({ field }) => (
                    <FormItem>
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingId ? "Simpan Perubahan" : "Buat Banner"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerTopPage;