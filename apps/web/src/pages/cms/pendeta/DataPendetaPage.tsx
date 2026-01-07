import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
  CalendarIcon, Edit, Plus, Trash2, UserCheck, 
  MapPin, Phone, Mail, GraduationCap, FileBadge,
  Camera, Instagram, Facebook, Youtube, MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Calendar } from "@/components/ui/calendar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// --- 1. Schema Validasi (Zod) ---

const formSchema = z.object({
  // A. Informasi Utama
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
  gelar: z.string().optional(),
  jenis_kelamin: z.enum(["L", "P"], { required_error: "Pilih jenis kelamin" }),
  tempat_lahir: z.string().optional(),
  tanggal_lahir: z.date({ required_error: "Tanggal lahir wajib diisi" }),
  status_aktif: z.boolean().default(true),

  // B. Kontak
  no_handphone: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Format email salah").optional().or(z.literal("")),
  alamat: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),

  // C. Data Kepelayanan
  jabatan_pelayanan: z.string().min(1, "Jabatan wajib dipilih"),
  tanggal_penahbisan: z.date().optional(),
  wilayah_pelayanan: z.string().optional(),
  bidang_pelayanan: z.string().optional(), // Disimpan sebagai string comma-separated
  jadwal_pelayanan: z.string().optional(),

  // D. Pendidikan
  pendidikan_terakhir: z.string().optional(),
  institusi_teologi: z.string().optional(),
  tahun_lulus: z.coerce.number().optional(),
  riwayat_pendidikan: z.string().optional(),

  // E. Administratif
  nomor_induk_pendeta: z.string().optional(),
  status_pernikahan: z.enum(["MENIKAH", "BELUM_MENIKAH", "CERAI_HIDUP", "CERAI_MATI"]).optional(),
  nama_pasangan: z.string().optional(),
  jumlah_anak: z.coerce.number().default(0),

  // F. Media
  foto_pendeta: z.string().optional(),
  biografi_singkat: z.string().optional(),
  ig_link: z.string().optional(),
  fb_link: z.string().optional(),
  yt_link: z.string().optional(),

  // G. Internal
  catatan_internal: z.string().optional(),
  riwayat_pelayanan_text: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
interface Pendeta extends FormValues { id: string; }

// --- 2. Mock Data ---

const MOCK_DATA: Pendeta[] = [
  {
    id: "1",
    nama_lengkap: "Budi Santoso",
    gelar: "S.Th",
    jenis_kelamin: "L",
    tempat_lahir: "Jakarta",
    tanggal_lahir: new Date("1980-05-20"),
    status_aktif: true,
    no_handphone: "081234567890",
    email: "budi@gereja.org",
    jabatan_pelayanan: "GEMBALA_SIDANG",
    bidang_pelayanan: "Khotbah, Konseling",
    foto_pendeta: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    kota: "Jakarta Selatan",
    alamat: "Jl. Mawar No 10",
    provinsi: "DKI Jakarta",
    wilayah_pelayanan: "Pusat",
    jadwal_pelayanan: "",
    pendidikan_terakhir: "S1 Teologi",
    institusi_teologi: "STT Jakarta",
    tahun_lulus: 2002,
    riwayat_pendidikan: "",
    nomor_induk_pendeta: "PDT-001",
    status_pernikahan: "MENIKAH",
    nama_pasangan: "Siti Aminah",
    jumlah_anak: 2,
    biografi_singkat: "Melayani sejak tahun 2005.",
    ig_link: "", fb_link: "", yt_link: "",
    catatan_internal: "", riwayat_pelayanan_text: ""
  },
  {
    id: "2",
    nama_lengkap: "Sarah Wijaya",
    gelar: "M.Div",
    jenis_kelamin: "P",
    tempat_lahir: "Surabaya",
    tanggal_lahir: new Date("1985-11-12"),
    status_aktif: true,
    no_handphone: "081987654321",
    email: "sarah@gereja.org",
    jabatan_pelayanan: "PENDETA_MUDA",
    bidang_pelayanan: "Anak & Remaja",
    foto_pendeta: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    kota: "Jakarta Barat",
    alamat: "", provinsi: "", wilayah_pelayanan: "", jadwal_pelayanan: "",
    pendidikan_terakhir: "", institusi_teologi: "", tahun_lulus: 0, riwayat_pendidikan: "",
    nomor_induk_pendeta: "PDM-023", status_pernikahan: "BELUM_MENIKAH", nama_pasangan: "", jumlah_anak: 0,
    biografi_singkat: "", ig_link: "", fb_link: "", yt_link: "", catatan_internal: "", riwayat_pelayanan_text: ""
  }
];

// --- 3. Component ---

const DataPendetaPage = () => {
  const [data, setData] = useState<Pendeta[]>(MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pribadi");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_lengkap: "", gelar: "", jenis_kelamin: "L",
      status_aktif: true, no_handphone: "", email: "",
      jabatan_pelayanan: "", jumlah_anak: 0,
    },
  });

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      nama_lengkap: "", gelar: "", jenis_kelamin: "L", status_aktif: true,
      no_handphone: "", email: "", alamat: "", kota: "", provinsi: "",
      jabatan_pelayanan: "", wilayah_pelayanan: "", bidang_pelayanan: "", jadwal_pelayanan: "",
      pendidikan_terakhir: "", institusi_teologi: "", tahun_lulus: 0, riwayat_pendidikan: "",
      nomor_induk_pendeta: "", status_pernikahan: "BELUM_MENIKAH", nama_pasangan: "", jumlah_anak: 0,
      biografi_singkat: "", ig_link: "", fb_link: "", yt_link: "",
      catatan_internal: "", riwayat_pelayanan_text: "",
      foto_pendeta: "",
      tanggal_lahir: new Date(),
    });
    setActiveTab("pribadi");
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Pendeta) => {
    setEditingId(item.id);
    form.reset({ ...item });
    setActiveTab("pribadi");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("Data pendeta berhasil dihapus");
  };

  const onSubmit = (values: FormValues) => {
    if (editingId) {
      setData((prev) => prev.map((item) => item.id === editingId ? { ...values, id: editingId } : item));
      toast.success("Data pendeta diperbarui");
    } else {
      setData((prev) => [{ ...values, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      toast.success("Pendeta baru ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Data Pendeta & Hamba Tuhan" description="Kelola data hamba tuhan, pendeta, dan staf rohani gereja.">
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Tambah Pendeta</Button>
      </PageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nama & Gelar</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada data pendeta.</TableCell></TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.foto_pendeta} />
                      <AvatarFallback>{item.nama_lengkap.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.nama_lengkap} {item.gelar && `, ${item.gelar}`}</span>
                      <span className="text-xs text-muted-foreground">{item.nomor_induk_pendeta || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {item.jabatan_pelayanan.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground gap-1">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.no_handphone}</span>
                      {item.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.status_aktif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Non-Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(item)}><Edit className="mr-2 h-4 w-4" /> Edit Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                           <ConfirmDialog 
                              trigger={<div className="flex items-center w-full"><Trash2 className="mr-2 h-4 w-4" /> Hapus</div>}
                              onConfirm={() => handleDelete(item.id)}
                              variant="destructive"
                              title="Hapus Data"
                              description="Data ini akan dihapus permanen."
                           />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{editingId ? "Edit Data Pendeta" : "Tambah Pendeta Baru"}</DialogTitle>
            <DialogDescription>Lengkapi informasi hamba tuhan di bawah ini.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pribadi">Pribadi</TabsTrigger>
                    <TabsTrigger value="pelayanan">Pelayanan</TabsTrigger>
                    <TabsTrigger value="pendidikan">Pendidikan</TabsTrigger>
                    <TabsTrigger value="lainnya">Lainnya</TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 p-6 max-h-[60vh]">
                  
                  {/* TAB 1: DATA PRIBADI & KONTAK */}
                  <TabsContent value="pribadi" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-4">
                        <FormField control={form.control} name="foto_pendeta" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foto Profil</FormLabel>
                            <FormControl><ImageUpload value={field.value} onChange={field.onChange} className="w-full" /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="status_aktif" render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5"><FormLabel className="text-base">Status Aktif</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                            <FormItem className="col-span-2"><FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="Contoh: Budi Santoso" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="gelar" render={({ field }) => (
                            <FormItem><FormLabel>Gelar Akademik</FormLabel><FormControl><Input placeholder="S.Th, M.Div" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="jenis_kelamin" render={({ field }) => (
                            <FormItem><FormLabel>Jenis Kelamin</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl><SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="tempat_lahir" render={({ field }) => (
                            <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="tanggal_lahir" render={({ field }) => (
                            <FormItem><FormLabel>Tanggal Lahir <span className="text-red-500">*</span></FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="space-y-4 pt-4 border-t">
                          <h4 className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Informasi Kontak</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="no_handphone" render={({ field }) => (
                              <FormItem><FormLabel>No. Handphone <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="alamat" render={({ field }) => (
                              <FormItem className="col-span-2"><FormLabel>Alamat Lengkap</FormLabel><FormControl><Textarea className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="kota" render={({ field }) => (
                              <FormItem><FormLabel>Kota/Kabupaten</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="provinsi" render={({ field }) => (
                              <FormItem><FormLabel>Provinsi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: DATA PELAYANAN & ADMINISTRASI */}
                  <TabsContent value="pelayanan" className="space-y-6 mt-0">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <h4 className="font-medium flex items-center gap-2"><UserCheck className="h-4 w-4" /> Data Kepelayanan</h4>
                         <FormField control={form.control} name="jabatan_pelayanan" render={({ field }) => (
                            <FormItem><FormLabel>Jabatan Pelayanan <span className="text-red-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Jabatan" /></SelectTrigger></FormControl><SelectContent><SelectItem value="GEMBALA_SIDANG">Gembala Sidang</SelectItem><SelectItem value="WAKIL_GEMBALA">Wakil Gembala</SelectItem><SelectItem value="PENDETA_MUDA">Pendeta Muda</SelectItem><SelectItem value="PENATUA">Penatua</SelectItem><SelectItem value="EVANGELIS">Evangelis</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="tanggal_penahbisan" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Tanggal Penahbisan</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="wilayah_pelayanan" render={({ field }) => (
                            <FormItem><FormLabel>Wilayah Pelayanan</FormLabel><FormControl><Input placeholder="Contoh: Rayon Pusat" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="bidang_pelayanan" render={({ field }) => (
                            <FormItem><FormLabel>Bidang Pelayanan</FormLabel><FormControl><Input placeholder="Contoh: Misi, Musik, Pemuda (Pisahkan koma)" {...field} /></FormControl><FormDescription>Pisahkan dengan koma jika lebih dari satu.</FormDescription><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="jadwal_pelayanan" render={({ field }) => (
                            <FormItem><FormLabel>Jadwal Rutin</FormLabel><FormControl><Textarea placeholder="Contoh: Minggu Raya 1, Kamis Doa Malam" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-medium flex items-center gap-2"><FileBadge className="h-4 w-4" /> Data Administratif</h4>
                         <FormField control={form.control} name="nomor_induk_pendeta" render={({ field }) => (
                            <FormItem><FormLabel>Nomor Induk (NIP)</FormLabel><FormControl><Input placeholder="PDT-XXX-YYY" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="status_pernikahan" render={({ field }) => (
                            <FormItem><FormLabel>Status Pernikahan</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MENIKAH">Menikah</SelectItem><SelectItem value="BELUM_MENIKAH">Belum Menikah</SelectItem><SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem><SelectItem value="CERAI_MATI">Cerai Mati</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="nama_pasangan" render={({ field }) => (
                            <FormItem><FormLabel>Nama Pasangan</FormLabel><FormControl><Input disabled={form.watch("status_pernikahan") === "BELUM_MENIKAH"} {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                         <FormField control={form.control} name="jumlah_anak" render={({ field }) => (
                            <FormItem><FormLabel>Jumlah Anak</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: PENDIDIKAN & PROFIL */}
                  <TabsContent value="pendidikan" className="space-y-6 mt-0">
                    <div className="space-y-4">
                       <h4 className="font-medium flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Latar Belakang Pendidikan</h4>
                       <div className="grid grid-cols-3 gap-4">
                          <FormField control={form.control} name="pendidikan_terakhir" render={({ field }) => (
                              <FormItem><FormLabel>Pendidikan Terakhir</FormLabel><FormControl><Input placeholder="S1/S2/S3" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="institusi_teologi" render={({ field }) => (
                              <FormItem className="col-span-2"><FormLabel>Institusi / Sekolah Teologi</FormLabel><FormControl><Input placeholder="Nama STT / Universitas" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="tahun_lulus" render={({ field }) => (
                              <FormItem><FormLabel>Tahun Lulus</FormLabel><FormControl><Input type="number" placeholder="YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                       </div>
                       <FormField control={form.control} name="riwayat_pendidikan" render={({ field }) => (
                          <FormItem><FormLabel>Riwayat Pendidikan Lainnya</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                       <h4 className="font-medium flex items-center gap-2"><Camera className="h-4 w-4" /> Media & Profil Publik</h4>
                       <FormField control={form.control} name="biografi_singkat" render={({ field }) => (
                          <FormItem><FormLabel>Biografi Singkat</FormLabel><FormControl><Textarea placeholder="Ceritakan singkat tentang perjalanan pelayanan..." className="resize-none h-24" {...field} /></FormControl><FormDescription>Akan ditampilkan di halaman profil publik gereja.</FormDescription><FormMessage /></FormItem>
                        )} />
                       <div className="grid grid-cols-3 gap-4">
                          <FormField control={form.control} name="ig_link" render={({ field }) => (
                              <FormItem><FormLabel className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</FormLabel><FormControl><Input placeholder="@username" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="fb_link" render={({ field }) => (
                              <FormItem><FormLabel className="flex items-center gap-1"><Facebook className="h-3 w-3" /> Facebook</FormLabel><FormControl><Input placeholder="Username / Link" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="yt_link" render={({ field }) => (
                              <FormItem><FormLabel className="flex items-center gap-1"><Youtube className="h-3 w-3" /> YouTube</FormLabel><FormControl><Input placeholder="Channel Link" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                       </div>
                    </div>
                  </TabsContent>

                  {/* TAB 4: LAINNYA (INTERNAL) */}
                  <TabsContent value="lainnya" className="space-y-4 mt-0">
                    <FormField control={form.control} name="catatan_internal" render={({ field }) => (
                        <FormItem><FormLabel>Catatan Internal (Admin Only)</FormLabel><FormControl><Textarea placeholder="Catatan khusus yang tidak dipublikasikan..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="riwayat_pelayanan_text" render={({ field }) => (
                        <FormItem><FormLabel>Riwayat Pelayanan Gereja Sebelumnya</FormLabel><FormControl><Textarea placeholder="Daftar gereja tempat melayani sebelumnya..." className="resize-none h-32" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TabsContent>

                </ScrollArea>
                
                <DialogFooter className="p-6 pt-2 border-t mt-auto bg-background">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                  <Button type="submit">Simpan Data</Button>
                </DialogFooter>
              </Tabs>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataPendetaPage;