import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, FileText, ArrowUpDown } from "lucide-react";
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
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  deskripsi: z.string().min(1, { message: "Deskripsi wajib diisi" }),
});

type FormValues = z.infer<typeof formSchema>;
interface Buletin extends FormValues { id: string; }

const MOCK_DATA: Buletin[] = [
  { id: "1", title: "Warta Jemaat - Edisi November", tanggal: new Date("2023-11-05"), deskripsi: "Ringkasan kegiatan gereja bulan November minggu pertama." },
  { id: "2", title: "Warta Jemaat - Edisi Oktober Akhir", tanggal: new Date("2023-10-29"), deskripsi: "Laporan keuangan dan jadwal pelayanan." },
];

const BuletinPage = () => {
  const [data, setData] = useState<Buletin[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", deskripsi: "", tanggal: new Date() },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", deskripsi: "", tanggal: new Date() });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Buletin) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Buletin berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Buletin diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Buletin ditambahkan");
    }
    setIsDialogOpen(false);
  };

  const sortedData = [...data].sort((a, b) => {
    return sortAsc 
      ? a.tanggal.getTime() - b.tanggal.getTime() 
      : b.tanggal.getTime() - a.tanggal.getTime();
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Buletin GKJ" description="Arsip warta jemaat dan buletin mingguan gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Upload Buletin</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => setSortAsc(!sortAsc)}>
                <div className="flex items-center gap-2">Tanggal Terbit <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead>Judul Buletin</TableHead>
              <TableHead>Isi Ringkas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[180px]">{format(item.tanggal, "dd MMMM yyyy", { locale: localeId })}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                   <FileText className="h-4 w-4 text-orange-500" /> {item.title}
                </TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">{item.deskripsi}</TableCell>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Buletin" : "Buletin Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Judul Buletin</FormLabel><FormControl><Input placeholder="Contoh: Warta Jemaat Edisi..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tanggal" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal Terbit</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="deskripsi" render={({ field }) => (
                <FormItem><FormLabel>Ringkasan Isi</FormLabel><FormControl><Textarea placeholder="Ringkasan singkat isi buletin..." className="resize-none h-24" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuletinPage;