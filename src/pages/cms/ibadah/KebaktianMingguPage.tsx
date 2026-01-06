import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, Video, Radio, Clock } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  status: z.boolean().default(false),
  title: z.string().min(1, { message: "Judul wajib diisi" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  durasi: z.coerce.number().min(1, { message: "Durasi minimal 1 menit" }),
});

type FormValues = z.infer<typeof formSchema>;
interface Kebaktian extends FormValues { id: string; }

const MOCK_DATA: Kebaktian[] = [
  { id: "1", title: "Ibadah Raya 1", tanggal: new Date(), durasi: 120, status: true },
  { id: "2", title: "Ibadah Raya 2", tanggal: new Date(), durasi: 120, status: false },
  { id: "3", title: "Ibadah Youth", tanggal: new Date(), durasi: 90, status: false },
];

const KebaktianMingguPage = () => {
  const [data, setData] = useState<Kebaktian[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", tanggal: new Date(), durasi: 90, status: false },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", tanggal: new Date(), durasi: 90, status: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Kebaktian) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Data kebaktian dihapus");
  };

  const toggleStatus = (id: string) => {
    setData((prev) => prev.map((item) => {
      if (item.id === id) {
        const newStatus = !item.status;
        toast.info(newStatus ? "Kebaktian sekarang LIVE" : "Kebaktian OFFLINE");
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Jadwal kebaktian diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Jadwal kebaktian ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kebaktian Minggu" description="Kelola jadwal dan status live streaming kebaktian.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Buat Jadwal</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Nama Kebaktian</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={item.status} onCheckedChange={() => toggleStatus(item.id)} />
                    {item.status ? <Badge variant="destructive" className="animate-pulse">LIVE</Badge> : <Badge variant="outline">OFF</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{format(item.tanggal, "dd MMM yyyy, HH:mm", { locale: localeId })}</TableCell>
                <TableCell>{item.durasi} Menit</TableCell>
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
            <DialogTitle>{editingId ? "Edit Jadwal" : "Jadwal Kebaktian Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5"><FormLabel>Status Live Streaming</FormLabel><FormDescription>Aktifkan jika kebaktian sedang berlangsung.</FormDescription></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Nama Ibadah</FormLabel><FormControl><Input placeholder="Contoh: Ibadah Raya 1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="tanggal" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Tanggal</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="durasi" render={({ field }) => (
                   <FormItem><FormLabel>Durasi (Menit)</FormLabel><FormControl><div className="relative"><Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" className="pl-9" {...field} /></div></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KebaktianMingguPage;