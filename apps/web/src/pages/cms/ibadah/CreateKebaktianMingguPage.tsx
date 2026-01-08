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

const CreateKebaktianMingguPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();
  const mutation = useMutation({
    mutationFn: (newKebaktian) =>
      apiClient.post("/kebaktian-minggu", newKebaktian),
    onSuccess: () => {
      navigate("/ibadah/kebaktian");
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
      waktu: combine(data.tanggal, data.waktu),
    };
    mutation.mutate(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Kebaktian Minggu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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
              <Label htmlFor="waktu">Waktu</Label>
              <Input id="waktu" type="time" {...register("waktu", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tema">Tema</Label>
              <Input id="tema" {...register("tema", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pengkhotbah">Pengkhotbah</Label>
              <Input id="pengkhotbah" {...register("pengkhotbah", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="liturgos">Liturgos</Label>
              <Input id="liturgos" {...register("liturgos", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pembacaWarta">Pembaca Warta</Label>
              <Input id="pembacaWarta" {...register("pembacaWarta")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Input id="catatan" {...register("catatan")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/ibadah/kebaktian")}>
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

export default CreateKebaktianMingguPage;