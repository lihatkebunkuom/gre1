import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/services/api-client";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateJadwalIbadahPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();
  const mutation = useMutation({
    mutationFn: (newJadwal) =>
      apiClient.post("/jadwal-ibadah", newJadwal),
    onSuccess: () => {
      navigate("/ibadah");
    },
  });

  const onSubmit = (data: any) => {
    const combine = (date: Date, timeStr: string) => {
      const newDate = new Date(date);
      const [hours, minutes] = timeStr.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return newDate;
    };

    const payload = {
      ...data,
      tanggal: data.tanggal,
      waktuMulai: combine(data.tanggal, data.waktuMulai),
      waktuSelesai: combine(data.tanggal, data.waktuSelesai),
    };
    mutation.mutate(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Jadwal Ibadah</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="namaIbadah">Nama Ibadah</Label>
              <Input id="namaIbadah" {...register("namaIbadah", { required: true })} />
            </div>
            
            <div className="grid gap-2">
              <Label>Tanggal</Label>
              <Controller
                control={control}
                name="tanggal"
                defaultValue={new Date()}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="waktuMulai">Waktu Mulai</Label>
              <Input id="waktuMulai" type="time" {...register("waktuMulai", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="waktuSelesai">Waktu Selesai</Label>
              <Input id="waktuSelesai" type="time" {...register("waktuSelesai", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" {...register("lokasi", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pembicara">Pembicara</Label>
              <Input id="pembicara" {...register("pembicara", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tema">Tema</Label>
              <Input id="tema" {...register("tema")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input id="keterangan" {...register("keterangan")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/ibadah")}>
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

export default CreateJadwalIbadahPage;