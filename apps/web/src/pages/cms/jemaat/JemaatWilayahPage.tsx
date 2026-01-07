import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Trash2, Map, Users, Loader2 } from "lucide-react";
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { apiClient } from "@/services/api-client";

// --- Schema ---
// Kita akan menggunakan 2 mode form: Wilayah atau Kelompok
const wilayahSchema = z.object({
  nama: z.string().min(1, "Nama wilayah wajib diisi"),
  keterangan: z.string().optional(),
});

const kelompokSchema = z.object({
  nama: z.string().min(1, "Nama kelompok wajib diisi"),
  ketua: z.string().optional(),
  jadwal: z.string().optional(),
  catatan: z.string().optional(),
  wilayahId: z.string().optional(),
});

type WilayahFormValues = z.infer<typeof wilayahSchema>;
type KelompokFormValues = z.infer<typeof kelompokSchema>;

const JemaatWilayahPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'wilayah' | 'kelompok'>('wilayah');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // --- Fetch Data ---
  const { data: wilayahs, isLoading: loadingWilayah } = useQuery({
    queryKey: ['wilayah'],
    queryFn: () => apiClient.get<any[]>('/wilayah'),
  });

  const { data: kelompoks, isLoading: loadingKelompok } = useQuery({
    queryKey: ['kelompok'],
    queryFn: () => apiClient.get<any[]>('/kelompok'),
  });

  // --- Forms ---
  const formWilayah = useForm<WilayahFormValues>({ resolver: zodResolver(wilayahSchema) });
  const formKelompok = useForm<KelompokFormValues>({ resolver: zodResolver(kelompokSchema) });

  // --- Mutations ---
  const wilayahMutation = useMutation({
    mutationFn: (vals: WilayahFormValues) => 
      editingItem 
        ? apiClient.patch(`/wilayah/${editingItem.id}`, vals) 
        : apiClient.post('/wilayah', vals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wilayah'] });
      toast.success(editingItem ? "Wilayah diperbarui" : "Wilayah ditambahkan");
      handleCloseDialog();
    }
  });

  const kelompokMutation = useMutation({
    mutationFn: (vals: KelompokFormValues) => 
      editingItem 
        ? apiClient.patch(`/kelompok/${editingItem.id}`, vals) 
        : apiClient.post('/kelompok', vals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelompok'] });
      toast.success(editingItem ? "Kelompok diperbarui" : "Kelompok ditambahkan");
      handleCloseDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string, type: 'wilayah' | 'kelompok' }) => 
      apiClient.delete(`/${type}/${id}`),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [vars.type] });
      toast.success("Data berhasil dihapus");
    }
  });

  // --- Handlers ---
  const handleAddNew = (type: 'wilayah' | 'kelompok') => {
    setActiveTab(type);
    setEditingItem(null);
    if(type === 'wilayah') formWilayah.reset({ nama: "", keterangan: "" });
    else formKelompok.reset({ nama: "", ketua: "", jadwal: "", catatan: "", wilayahId: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any, type: 'wilayah' | 'kelompok') => {
    setActiveTab(type);
    setEditingItem(item);
    if(type === 'wilayah') {
      formWilayah.reset({ nama: item.nama, keterangan: item.keterangan });
    } else {
      formKelompok.reset({ 
        nama: item.nama, 
        ketua: item.ketua, 
        jadwal: item.jadwal, 
        catatan: item.catatan, 
        wilayahId: item.wilayahId || (item.wilayah?.id)
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const onSubmitWilayah = (values: WilayahFormValues) => wilayahMutation.mutate(values);
  const onSubmitKelompok = (values: KelompokFormValues) => kelompokMutation.mutate(values);

  return (
    <div className="space-y-6">
      <PageHeader title="Kelompok & Wilayah" description="Manajemen data wilayah pelayanan dan kelompok sel (Komsel).">
        <div className="flex gap-2">
          <Button onClick={() => handleAddNew('wilayah')} variant="outline"><Plus className="mr-2 h-4 w-4" /> Tambah Wilayah</Button>
          <Button onClick={() => handleAddNew('kelompok')}><Plus className="mr-2 h-4 w-4" /> Tambah Komsel</Button>
        </div>
      </PageHeader>

      {/* Tabel Wilayah */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Map className="h-5 w-5" /> Data Wilayah</h3>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Nama Wilayah</TableHead><TableHead>Keterangan</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {loadingWilayah ? <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow> : 
               wilayahs?.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center">Belum ada data wilayah</TableCell></TableRow> :
               wilayahs?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.keterangan || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item, 'wilayah')}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate({ id: item.id, type: 'wilayah' })} variant="destructive" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tabel Kelompok */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5" /> Data Komsel</h3>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Nama Komsel</TableHead><TableHead>Wilayah</TableHead><TableHead>Ketua</TableHead><TableHead>Jadwal</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {loadingKelompok ? <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow> : 
               kelompoks?.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center">Belum ada data komsel</TableCell></TableRow> :
               kelompoks?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.wilayah?.nama || "-"}</TableCell>
                  <TableCell>{item.ketua || "-"}</TableCell>
                  <TableCell>{item.jadwal || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item, 'kelompok')}><Edit className="h-4 w-4 text-blue-500" /></Button>
                      <ConfirmDialog trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} onConfirm={() => deleteMutation.mutate({ id: item.id, type: 'kelompok' })} variant="destructive" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Tambah"} {activeTab === 'wilayah' ? 'Wilayah' : 'Kelompok Sel'}</DialogTitle>
            <DialogDescription>{activeTab === 'wilayah' ? 'Kelola area pelayanan.' : 'Kelola kelompok sel / komsel.'}</DialogDescription>
          </DialogHeader>

          {activeTab === 'wilayah' ? (
            <Form {...formWilayah}>
              <form onSubmit={formWilayah.handleSubmit(onSubmitWilayah)} className="space-y-4">
                <FormField control={formWilayah.control} name="nama" render={({ field }) => (
                  <FormItem><FormLabel>Nama Wilayah</FormLabel><FormControl><Input placeholder="Cth: Jakarta Pusat" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formWilayah.control} name="keterangan" render={({ field }) => (
                  <FormItem><FormLabel>Keterangan</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter><Button type="button" variant="outline" onClick={handleCloseDialog}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
              </form>
            </Form>
          ) : (
            <Form {...formKelompok}>
              <form onSubmit={formKelompok.handleSubmit(onSubmitKelompok)} className="space-y-4">
                 <FormField control={formKelompok.control} name="nama" render={({ field }) => (
                  <FormItem><FormLabel>Nama Komsel</FormLabel><FormControl><Input placeholder="Cth: Komsel Efrata" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={formKelompok.control} name="wilayahId" render={({ field }) => (
                   <FormItem><FormLabel>Induk Wilayah</FormLabel><Select onValueChange={field.onChange} value={field.value || ""}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Wilayah" /></SelectTrigger></FormControl><SelectContent>{wilayahs?.map((w: any) => <SelectItem key={w.id} value={w.id}>{w.nama}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={formKelompok.control} name="ketua" render={({ field }) => (
                    <FormItem><FormLabel>Ketua / Gembala</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={formKelompok.control} name="jadwal" render={({ field }) => (
                    <FormItem><FormLabel>Jadwal</FormLabel><FormControl><Input placeholder="Cth: Jumat 19:00" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={formKelompok.control} name="catatan" render={({ field }) => (
                  <FormItem><FormLabel>Catatan</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter><Button type="button" variant="outline" onClick={handleCloseDialog}>Batal</Button><Button type="submit">Simpan</Button></DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JemaatWilayahPage;