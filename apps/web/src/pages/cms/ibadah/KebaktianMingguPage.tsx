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

const KebaktianMingguPage = () => {
  const { data: kebaktian, isLoading } = useQuery({
    queryKey: ["kebaktian-minggu"],
    queryFn: () => apiClient.get("/kebaktian-minggu"),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Kebaktian Minggu</CardTitle>
          <Button asChild>
            <Link to="/ibadah/kebaktian/create">Tambah Kebaktian</Link>
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Pengkhotbah</TableHead>
                <TableHead>Liturgos</TableHead>
                <TableHead>Pembaca Warta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kebaktian?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.tanggal).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.waktu).toLocaleTimeString()}</TableCell>
                  <TableCell>{item.tema}</TableCell>
                  <TableCell>{item.pengkhotbah}</TableCell>
                  <TableCell>{item.liturgos}</TableCell>
                  <TableCell>{item.pembacaWarta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default KebaktianMingguPage;
