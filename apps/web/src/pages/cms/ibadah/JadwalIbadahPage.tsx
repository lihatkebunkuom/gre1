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

const JadwalIbadahPage = () => {
  const { data: jadwal, isLoading } = useQuery({
    queryKey: ["jadwal-ibadah"],
    queryFn: () => apiClient.get("/jadwal-ibadah"),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Jadwal Ibadah</CardTitle>
          <Button asChild>
            <Link to="/ibadah/create">Tambah Jadwal</Link>
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
                <TableHead>Nama Ibadah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Pembicara</TableHead>
                <TableHead>Tema</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwal?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.namaIbadah}</TableCell>
                  <TableCell>{new Date(item.tanggal).toLocaleDateString()}</TableCell>
                  <TableCell>{`${new Date(item.waktuMulai).toLocaleTimeString()} - ${new Date(
                    item.waktuSelesai
                  ).toLocaleTimeString()}`}</TableCell>
                  <TableCell>{item.lokasi}</TableCell>
                  <TableCell>{item.pembicara}</TableCell>
                  <TableCell>{item.tema}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default JadwalIbadahPage;
