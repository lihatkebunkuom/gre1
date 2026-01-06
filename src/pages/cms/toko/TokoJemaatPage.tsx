import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, ShoppingBag, Star, PackageOpen, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, { message: "Nama produk wajib diisi" }),
  harga: z.coerce.number().min(1, { message: "Harga harus lebih dari 0" }),
  rating: z.coerce.number().min(1).max(5),
  deskripsi: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  images: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;
interface Produk extends FormValues { id: string; }

const MOCK_DATA: Produk[] = [
  { 
    id: "1", title: "Kaos Rohani 'Blessed'", harga: 85000, rating: 5, 
    deskripsi: "Bahan Cotton Combed 30s, sablon plastisol, nyaman dipakai.",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"]
  },
  { 
    id: "2", title: "Buku Renungan Harian", harga: 45000, rating: 4, 
    deskripsi: "Kumpulan renungan inspiratif untuk menemani saat teduh Anda.",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"]
  },
  { 
    id: "3", title: "Mug Keramik Custom", harga: 30000, rating: 5, 
    deskripsi: "Mug cantik dengan ayat emas pilihan.",
    images: [] 
  },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const TokoJemaatPage = () => {
  const [data, setData] = useState<Produk[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State dummy untuk mereset komponen ImageUpload setelah upload
  const [uploadKey, setUploadKey] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", harga: 0, rating: 5, deskripsi: "", images: [] },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", harga: 0, rating: 5, deskripsi: "", images: [] });
    setUploadKey(prev => prev + 1); // Reset uploader
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Produk) => {
    setEditingId(item.id);
    form.reset({ ...item, images: item.images || [] });
    setUploadKey(prev => prev + 1); // Reset uploader
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Produk dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Produk diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Produk ditambahkan");
    }
    setIsDialogOpen(false);
  };

  // Helper untuk menambah gambar ke array
  const handleAddImage = (url: string, currentImages: string[], onChange: (val: string[]) => void) => {
    if (url) {
      onChange([...currentImages, url]);
      setUploadKey(prev => prev + 1); // Force reset component upload agar siap untuk file baru
    }
  };

  // Helper untuk menghapus gambar dari array
  const handleRemoveImage = (index: number, currentImages: string[], onChange: (val: string[]) => void) => {
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Toko Jemaat" description="Katalog produk merchandise dan usaha milik jemaat.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Produk</Button>
      </PageHeader>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Belum ada produk</h3>
            <p className="text-muted-foreground mb-4">Mulai tambahkan produk untuk ditampilkan di toko.</p>
            <Button onClick={handleAddNew}>Tambah Produk Pertama</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
            <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-video bg-muted relative group">
                    {item.images && item.images.length > 0 ? (
                      <>
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {item.images.length > 1 && (
                          <Badge variant="secondary" className="absolute bottom-2 right-2 opacity-90">
                            +{item.images.length - 1} Foto
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                          <ShoppingBag className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                </div>
                <CardContent className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1" title={item.title}>{item.title}</h3>
                        <div className="flex items-center bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs font-bold shrink-0 ml-2">
                            <Star className="h-3 w-3 mr-1 fill-current" /> {item.rating}
                        </div>
                    </div>
                    <p className="text-primary font-bold text-lg mb-3">{formatRupiah(item.harga)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.deskripsi}</p>
                </CardContent>
                <CardFooter className="p-4 bg-muted/20 border-t flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit className="h-3.5 w-3.5 mr-2" /> Edit</Button>
                    <ConfirmDialog trigger={<Button variant="destructive" size="sm"><Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus</Button>} onConfirm={() => handleDelete(item.id)} variant="destructive" title="Hapus Produk" description="Produk ini akan dihapus permanen dari toko." />
                </CardFooter>
            </Card>
            ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Nama Produk</FormLabel><FormControl><Input placeholder="Contoh: Kaos Rohani..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="harga" render={({ field }) => (
                        <FormItem><FormLabel>Harga (Rp)</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="rating" render={({ field }) => (
                        <FormItem><FormLabel>Rating (1-5)</FormLabel><FormControl><div className="flex items-center gap-4 h-10 px-2 border rounded-md"><span className="font-bold w-4 text-center">{field.value}</span><Slider value={[field.value]} min={1} max={5} step={1} onValueChange={(vals) => field.onChange(vals[0])} className="flex-1" /></div></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="deskripsi" render={({ field }) => (
                    <FormItem><FormLabel>Deskripsi Produk</FormLabel><FormControl><Textarea placeholder="Jelaskan detail produk..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-4">
                  <FormField control={form.control} name="images" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galeri Foto</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* List Gambar yang sudah diupload */}
                          {field.value.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {field.value.map((img, idx) => (
                                <div key={idx} className="relative aspect-square border rounded-md overflow-hidden group">
                                  <img src={img} alt={`Produk ${idx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx, field.value, field.onChange)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Komponen Upload */}
                          <div className="border-2 border-dashed rounded-lg p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Tambah Gambar Baru:</p>
                            {/* Key digunakan untuk mereset komponen setelah upload sukses */}
                            <ImageUpload 
                              key={uploadKey} 
                              value="" 
                              onChange={(url) => handleAddImage(url, field.value, field.onChange)} 
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 text-center">
                              Upload satu per satu. Klik upload lagi untuk menambah gambar.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>Anda dapat menambahkan lebih dari satu gambar.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokoJemaatPage;