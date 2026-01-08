import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/services/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateAbsensiKehadiranPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const mutation = useMutation({
    mutationFn: (newAbsensi) =>
      apiClient.post("/absensi-kehadiran", newAbsensi),
    onSuccess: () => {
      navigate("/ibadah/kehadiran");
    },
  });

  const { data: jadwalIbadah } = useQuery({
    queryKey: ["jadwal-ibadah"],
    queryFn: () => apiClient.get("/jadwal-ibadah"),
  });

  const { data: jemaat } = useQuery({
    queryKey: ["jemaat"],
    queryFn: () => apiClient.get("/jemaat"),
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      waktuHadir: new Date(data.waktuHadir),
    };
    mutation.mutate(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Absensi Kehadiran</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="jadwalIbadahId">JadwalIbadah</Label>
              <Select onValueChange={(value) => setValue("jadwalIbadahId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jadwal Ibadah" />
                </SelectTrigger>
                <SelectContent>
                  {jadwalIbadah?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.namaIbadah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jemaatId">Jemaat</Label>
              <Select onValueChange={(value) => setValue("jemaatId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jemaat" />
                </SelectTrigger>
                <SelectContent>
                  {jemaat?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="waktuHadir">Waktu Hadir</Label>
              <Input id="waktuHadir" type="datetime-local" {...register("waktuHadir")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metode">Metode</Label>
              <Select onValueChange={(value) => setValue("metode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QR_CODE">QR Code</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/ibadah/kehadiran")}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAbsensiKehadiranPage;
