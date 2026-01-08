import { useState } from "react";
import { Search, Calendar, User, Clock, Loader2, Download, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/services/api-client";

interface Kehadiran {
  id: string;
  waktuHadir: string;
  metode: string;
  jemaat: {
    nama: string;
    nomorInduk: string;
    fotoUrl?: string;
  };
  qrSession: {
    namaKegiatan: string;
    jenisKegiatan: string;
  };
}

const KehadiranHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data
  const { data: history, isLoading } = useQuery({
    queryKey: ['kehadiran-history'],
    queryFn: async () => {
      const response = await apiClient.get<Kehadiran[]>('/kehadiran');
      return response as unknown as Kehadiran[];
    }
  });

  const filteredHistory = history?.filter(item => 
    item.jemaat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.qrSession.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Kehadiran" description="Rekapitulasi absensi jemaat dari berbagai kegiatan.">
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
      </PageHeader>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari jemaat atau kegiatan..." 
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
              <TableHead>Jemaat</TableHead>
              <TableHead>Kegiatan</TableHead>
              <TableHead>Waktu Hadir</TableHead>
              <TableHead>Metode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredHistory?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada data kehadiran.</TableCell></TableRow>
            ) : (
              filteredHistory?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.jemaat.fotoUrl} alt={item.jemaat.nama} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.jemaat.nama}</span>
                        <span className="text-xs text-muted-foreground">{item.jemaat.nomorInduk}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.qrSession.namaKegiatan}</span>
                      <span className="text-xs text-muted-foreground">{item.qrSession.jenisKegiatan}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.waktuHadir), "dd MMM yyyy", { locale: localeId })}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.waktuHadir), "HH:mm")} WIB
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.metode}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KehadiranHistoryPage;
