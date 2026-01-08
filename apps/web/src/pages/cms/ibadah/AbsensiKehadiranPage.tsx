import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const AbsensiKehadiranPage = () => {
  const { data: absensi, isLoading } = useQuery({
    queryKey: ["absensi-kehadiran"],
    queryFn: () => apiClient.get("/absensi-kehadiran"),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Absensi Kehadiran</CardTitle>
          <Button asChild>
            <Link to="/ibadah/kehadiran/create">Tambah Absensi</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jadwal Ibadah</TableHead>
                <TableHead>Jemaat</TableHead>
                <TableHead>Waktu Hadir</TableHead>
                <TableHead>Metode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absensi?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.jadwalIbadahId}</TableCell>
                  <TableCell>{item.jemaatId}</TableCell>
                  <TableCell>{new Date(item.waktuHadir).toLocaleString()}</TableCell>
                  <TableCell>{item.metode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AbsensiKehadiranPage;
