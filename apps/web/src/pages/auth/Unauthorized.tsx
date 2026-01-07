import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Akses Ditolak</h1>
          <p className="text-muted-foreground">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
            Hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button onClick={() => navigate("/")}>
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;