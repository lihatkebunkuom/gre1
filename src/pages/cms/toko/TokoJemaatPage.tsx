import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, ShoppingBag, Star, PackageOpen } from "lucide-react";
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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  title: z.string().min(1, { message: "Nama produk wajib diisi" }),
  harga: z.coerce.number().min(1, { message: "Harga harus lebih dari 0" }),
  rating: z.coerce.number().min(1).max(5),
  deskripsi: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
});

type FormValues = z.infer<typeof formSchema>;
interface Produk extends FormValues { id: string; }

const MOCK_DATA: Produk[] = [
  { id: "1", title: "Kaos Rohani 'Blessed'", harga: 85000, rating: 5, deskripsi: "Bahan Cotton Combed 30s, sablon plastisol, nyaman dipakai." },
  { id: "2", title: "Buku Renungan Harian", harga: 45000, rating: 4, deskripsi: "Kumpulan renungan inspiratif untuk menemani saat teduh Anda." },
  { id: "3", title: "Mug Keramik Custom", harga: 30000, rating: 5, deskripsi: "Mug cantik dengan ayat emas pilihan." },
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", harga: 0, rating: 5, deskripsi: "" },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", harga: 0, rating: 5, deskripsi: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Produk) => {
    setEditingId(item.id);
    form.reset({ ...item });
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
            <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 opacity-20" />
                </div>
                <CardContent className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                        <div className="flex items-center bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs font-bold">
                            <Star className="h-3 w-3 mr-1 fill-current" /> {item.rating}
                        </div>
                    </div>
                    <p className="text-primary font-bold text-lg mb-3">{formatRupiah(item.harga)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.deskripsi}</p>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormItem><FormLabel>Deskripsi Produk</FormLabel><FormControl><Textarea placeholder="Jelaskan detail produk..." className="resize-none h-24" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokoJemaatPage;