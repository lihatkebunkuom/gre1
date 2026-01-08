import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, Search, QrCode, Calendar, Clock, Loader2, Printer, Download } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiClient } from "@/services/api-client";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface QrSession {
  id: string;
  kodeQr: string;
  namaKegiatan: string;
  jenisKegiatan: string;
  tanggalKegiatan: string;
  waktuMulai: string;
  waktuSelesai: string;
  statusAktif: boolean;
  _count?: {
    kehadirans: number;
  };
}

const QrSessionListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<QrSession | null>(null);

  // Fetch Data
  const { data: sessionList, isLoading } = useQuery({
    queryKey: ['qr-sessions', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<QrSession[]>('/kehadiran/qr-session');
      return response as unknown as QrSession[];
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/kehadiran/qr-session/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-sessions'] });
      toast.success("Sesi QR berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus sesi");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Re-render React
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sesi QR Kehadiran" description="Manajemen kode QR untuk absensi ibadah dan kegiatan.">
        <Link to="/kehadiran/sesi/create">
           <Button><Plus className="mr-2 h-4 w-4" /> Buat Sesi QR</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama kegiatan..." 
            className="pl-9" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kegiatan</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Hadir</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : sessionList?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada sesi QR.</TableCell></TableRow>
            ) : (
              sessionList?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.namaKegiatan}</span>
                      <span className="text-xs text-muted-foreground">{item.jenisKegiatan}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.tanggalKegiatan), "dd MMMM yyyy", { locale: localeId })}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.waktuMulai), "HH:mm")} - {format(new Date(item.waktuSelesai), "HH:mm")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item._count?.kehadirans || 0} Jemaat</Badge>
                  </TableCell>
                  <TableCell>
                    {item.statusAktif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aktif</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Berakhir</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedSession(item)}>
                        <QrCode className="h-4 w-4 text-purple-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/kehadiran/sesi/edit/${item.id}`)}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <ConfirmDialog 
                        trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} 
                        onConfirm={() => handleDelete(item.id)} 
                        variant="destructive" 
                        title="Hapus Sesi QR"
                        description={`Hapus sesi ${item.namaKegiatan}? Semua data kehadiran terkait akan tetap tersimpan.`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* QR Code Modal */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Kehadiran</DialogTitle>
            <DialogDescription>
              Scan kode ini untuk mencatat kehadiran jemaat.
            </DialogDescription>
          </DialogHeader>
          
          <div id="qr-print-area" className="flex flex-col items-center justify-center p-6 space-y-4 bg-white rounded-lg border">
            <div className="text-center space-y-1 mb-4 hidden print:block">
              <h1 className="text-2xl font-bold uppercase">QR Kehadiran Jemaat</h1>
              <p className="text-lg font-semibold">{selectedSession?.namaKegiatan}</p>
              <p className="text-sm">
                {selectedSession && format(new Date(selectedSession.tanggalKegiatan), "EEEE, dd MMMM yyyy", { locale: localeId })}
              </p>
            </div>

            <QRCodeSVG 
              value={selectedSession?.kodeQr || ""} 
              size={250}
              level="H"
              includeMargin={true}
            />
            
            <div className="text-center mt-4">
              <p className="font-mono text-sm font-bold tracking-widest uppercase">
                {selectedSession?.kodeQr}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Gereja Digital - Sistem Kehadiran Otomatis
              </p>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button onClick={() => setSelectedSession(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QrSessionListPage;
