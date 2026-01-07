import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ImagePlus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

// --- Schema & Types ---

const formSchema = z.object({
  image: z.string().min(1, { message: "Gambar wajib diupload" }),
});

type FormValues = z.infer<typeof formSchema>;

interface BannerMiddle {
  id: string;
  image: string;
}

// --- Mock Data ---

const MOCK_DATA: BannerMiddle[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
  },
];

const BannerMiddlePage = () => {
  const [data, setData] = useState<BannerMiddle[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
    },
  });

  // --- Handlers ---

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ image: "" });
    setIsDialogOpen(true);
  };

  const handleReplace = (item: BannerMiddle) => {
    setEditingId(item.id);
    form.reset({ image: item.image });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Banner berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, image: values.image } : item
        )
      );
      toast.success("Gambar banner berhasil diganti");
    } else {
      // Create new
      const newItem: BannerMiddle = {
        id: Math.random().toString(36).substr(2, 9),
        image: values.image,
      };
      setData((prev) => [...prev, newItem]);
      toast.success("Banner baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Middle"
        description="Kelola banner sisipan (tengah) halaman. Tampilan akan menyesuaikan lebar layar."
      >
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Banner
        </Button>
      </PageHeader>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tombol Add Besar (Optional UX) */}
        <div 
          onClick={handleAddNew}
          className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 h-64 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors group"
        >
          <div className="bg-muted group-hover:bg-background p-4 rounded-full mb-3 transition-colors">
            <ImagePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="font-medium text-muted-foreground group-hover:text-foreground">Upload Banner Baru</p>
        </div>

        {/* Banner Cards */}
        {data.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col h-64 group shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 flex-1 relative bg-muted">
              <img 
                src={item.image} 
                alt="Banner Middle" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Button variant="secondary" size="sm" onClick={() => handleReplace(item)}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Preview
                 </Button>
              </div>
            </CardContent>
            <CardFooter className="p-3 bg-card border-t flex justify-between items-center">
              <span className="text-xs text-muted-foreground">ID: {item.id}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleReplace(item)}
                  title="Ganti Gambar"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Ganti
                </Button>
                
                <ConfirmDialog
                  trigger={
                    <Button variant="destructive" size="icon" className="h-9 w-9">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                  title="Hapus Banner"
                  description="Apakah Anda yakin ingin menghapus banner ini?"
                  onConfirm={() => handleDelete(item.id)}
                  variant="destructive"
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Ganti Gambar Banner" : "Upload Banner Baru"}</DialogTitle>
            <DialogDescription>
              {editingId 
                ? "Upload gambar baru untuk menggantikan banner yang dipilih." 
                : "Pilih gambar untuk ditambahkan ke daftar banner middle."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingId ? "Simpan Perubahan" : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerMiddlePage;