import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash2, FileText, ArrowUpDown, Search, Filter, Loader2, MoreHorizontal, Download, ExternalLink } from "lucide-react";
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
import { buletinService } from "@/services/konten-rohani.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi" }),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  deskripsi: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  fileUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Buletin extends FormValues { id: string; }

const BuletinPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortAsc, setSortAsc] = useState(false);

  const { data: buletins = [], isLoading } = useQuery({
    queryKey: ["buletin"],
    queryFn: () => buletinService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => buletinService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buletin"] });
      toast.success("Buletin ditambahkan");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: FormValues }) =>
      buletinService.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buletin"] });
      toast.success("Buletin diperbarui");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => buletinService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buletin"] });
      toast.success("Buletin berhasil dihapus");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", deskripsi: "", tanggal: new Date(), fileUrl: "" },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({ title: "", deskripsi: "", tanggal: new Date(), fileUrl: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Buletin) => {
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

  const filteredData = (buletins as Buletin[]).filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.tanggal).getTime();
    const dateB = new Date(b.tanggal).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Buletin GKJ" description="Arsip warta jemaat dan buletin mingguan gereja.">
        <Button onClick={handleAddNew} className="shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Upload Buletin
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari buletin..." 
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
          <p className="text-muted-foreground animate-pulse">Menyiapkan arsip buletin...</p>
        </div>
      ) : sortedData.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
               <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg">Tidak ada data buletin</p>
              <p className="text-sm text-muted-foreground max-w-xs">Mulai dengan mengupload buletin baru atau periksa kata kunci pencarian Anda.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Lihat Semua Buletin</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20">
              <div className="h-1.5 w-full bg-orange-500/20 group-hover:bg-orange-500 transition-colors" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2 font-medium bg-orange-100 text-orange-700 border-none">
                    Edisi Mingguan
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Buletin
                      </DropdownMenuItem>
                      {item.fileUrl && (
                        <DropdownMenuItem onClick={() => window.open(item.fileUrl, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" /> Buka PDF
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                        <ConfirmDialog 
                          trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus Buletin</div>}
                          onConfirm={() => deleteMutation.mutate(item.id)}
                          variant="destructive"
                          title="Hapus Buletin"
                          description={`Yakin ingin menghapus "${item.title}"?`}
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
                  <span className="font-medium text-muted-foreground">Terbit: {format(new Date(item.tanggal), "dd MMMM yyyy", { locale: localeId })}</span>
                </div>
                {item.fileUrl && (
                  <Button variant="outline" size="sm" className="w-full text-xs gap-2" onClick={() => window.open(item.fileUrl, '_blank')}>
                    <Download className="h-3 w-3" /> Download PDF
                  </Button>
                )}
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
                <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => setSortAsc(!sortAsc)}>
                  <div className="flex items-center gap-2">Tanggal Terbit <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>Judul Buletin</TableHead>
                <TableHead>Isi Ringkas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="w-[200px]">{format(new Date(item.tanggal), "dd MMMM yyyy", { locale: localeId })}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" /> {item.title}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">{item.deskripsi}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {item.fileUrl && <Button variant="ghost" size="icon" title="Buka PDF" onClick={() => window.open(item.fileUrl, '_blank')}><ExternalLink className="h-4 w-4 text-blue-500" /></Button>}
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
            <DialogTitle>{editingId ? "Edit Buletin" : "Buletin Baru"}</DialogTitle>
            <DialogDescription>Upload warta jemaat terbaru untuk diakses jemaat.</DialogDescription>
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
              <FormField control={form.control} name="fileUrl" render={({ field }) => (
                <FormItem><FormLabel>File URL (PDF)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Simpan</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuletinPage;