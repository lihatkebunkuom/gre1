import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Camera, CheckCircle2, XCircle, User, RefreshCw, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Jemaat {
  id: string;
  nama: string;
  nomorInduk: string;
  fotoUrl?: string;
}

const KehadiranScanPage = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [selectedJemaat, setSelectedJemaat] = useState<Jemaat | null>(null);
  const [jemaatSearch, setJemaatSearch] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Fetch Jemaat for selection (Simulation of logged-in jemaat or admin scanning for others)
  const { data: jemaats, isLoading: isLoadingJemaat } = useQuery({
    queryKey: ['jemaat-search', jemaatSearch],
    queryFn: async () => {
      const response = await apiClient.get<Jemaat[]>(`/jemaat${jemaatSearch ? `?search=${jemaatSearch}` : ''}`);
      return response as unknown as Jemaat[];
    },
    enabled: jemaatSearch.length > 2
  });

  const scanMutation = useMutation({
    mutationFn: async (kodeQr: string) => {
      if (!selectedJemaat) throw new Error("Pilih jemaat terlebih dahulu");
      return apiClient.post('/kehadiran/scan', {
        kodeQr,
        jemaatId: selectedJemaat.id
      });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Kehadiran berhasil dicatat");
      setScannedResult("SUCCESS");
      // Stop scanner on success if needed, or keep it running for next scan
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "QR Code tidak valid atau sudah kedaluwarsa";
      toast.error(msg);
      setScannedResult("ERROR");
    }
  });

  useEffect(() => {
    if (selectedJemaat && !scannedResult) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          if (!scanMutation.isPending) {
            scanMutation.mutate(decodedText);
            if (scannerRef.current) {
               // Optional: pause or stop after one scan
               // scannerRef.current.pause(); 
            }
          }
        },
        (error) => {
          // console.warn(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [selectedJemaat, scannedResult]);

  const resetScan = () => {
    setScannedResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader 
        title="Scan Kehadiran" 
        description="Arahkan kamera ke QR Code kegiatan untuk mencatat kehadiran." 
      />

      {!selectedJemaat ? (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Jemaat</CardTitle>
            <CardDescription>Cari jemaat yang akan melakukan absensi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau nomor induk..." 
                className="pl-9"
                value={jemaatSearch}
                onChange={(e) => setJemaatSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {isLoadingJemaat ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : jemaats?.map(j => (
                <div 
                  key={j.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => setSelectedJemaat(j)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={j.fotoUrl} />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{j.nama}</p>
                      <p className="text-xs text-muted-foreground">{j.nomorInduk}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Pilih</Button>
                </div>
              ))}
              {jemaatSearch.length > 2 && jemaats?.length === 0 && (
                <p className="text-center text-sm text-muted-foreground p-4">Jemaat tidak ditemukan</p>
              )}
              {jemaatSearch.length <= 2 && (
                <p className="text-center text-sm text-muted-foreground p-4 italic">Masukkan minimal 3 karakter untuk mencari</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={selectedJemaat.fotoUrl} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{selectedJemaat.nama}</p>
                  <p className="text-xs text-muted-foreground uppercase">{selectedJemaat.nomorInduk}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedJemaat(null);
                setScannedResult(null);
              }}>Ganti Jemaat</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2">
            <CardContent className="p-0">
              {scannedResult === "SUCCESS" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-green-50 dark:bg-green-900/10">
                  <CheckCircle2 className="h-20 w-20 text-green-500 animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Berhasil!</h3>
                    <p className="text-muted-foreground">Kehadiran Anda telah tercatat dalam sistem.</p>
                  </div>
                  <Button className="mt-4" onClick={resetScan}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Scan Lagi
                  </Button>
                </div>
              ) : scannedResult === "ERROR" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-red-50 dark:bg-red-900/10">
                  <XCircle className="h-20 w-20 text-red-500" />
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">Gagal</h3>
                    <p className="text-muted-foreground">QR Code tidak valid atau sudah digunakan.</p>
                  </div>
                  <Button variant="destructive" className="mt-4" onClick={resetScan}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Coba Lagi
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <div id="reader" className="w-full"></div>
                  {scanMutation.isPending && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
                      <Loader2 className="h-10 w-10 animate-spin mb-2" />
                      <p className="font-medium">Memproses...</p>
                    </div>
                  )}
                  {!scannedResult && (
                     <div className="p-4 bg-muted/30 text-center border-t">
                        <p className="text-xs flex items-center justify-center gap-2 text-muted-foreground">
                          <Camera className="h-3 w-3" /> Pastikan QR Code berada di dalam kotak
                        </p>
                     </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Alert>
            <AlertTitle className="text-sm font-bold flex items-center gap-2">
              Petunjuk Penggunaan
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground space-y-1">
              <p>1. Pilih nama jemaat yang akan melakukan absensi.</p>
              <p>2. Izinkan akses kamera jika diminta oleh browser.</p>
              <p>3. Arahkan kamera ke QR Code kegiatan yang disediakan admin.</p>
              <p>4. Tunggu hingga notifikasi berhasil muncul.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default KehadiranScanPage;
