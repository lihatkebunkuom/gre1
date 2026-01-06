import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Church, Loader2, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";

// --- Schemas ---

// Schema dasar untuk validasi field yang sama
const baseSchema = {
  no_handphone: z.string()
    .min(1, { message: "Nomor handphone wajib diisi" })
    .regex(/^08[0-9]+$/, { message: "Format nomor tidak valid (harus angka diawali 08)" })
    .min(10, { message: "Nomor terlalu pendek (min 10 digit)" })
    .max(14, { message: "Nomor terlalu panjang (max 14 digit)" }),
};

// Schema Login
const loginSchema = z.object({
  ...baseSchema,
  password: z.string().min(1, { message: "Password wajib diisi" }),
  nama: z.string().optional(), // Optional di login
});

// Schema Register
const registerSchema = z.object({
  ...baseSchema,
  password: z.string().min(5, { message: "Password minimal 5 karakter" }),
  nama: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // Toggle Login/Register

  // Redirect path
  const from = location.state?.from?.pathname || "/";

  // Init form dengan schema dinamis
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      password: "",
    },
  });

  // Reset form saat toggle mode
  const toggleMode = () => {
    setIsRegister(!isRegister);
    form.reset({
      nama: "",
      no_handphone: "",
      password: "",
    });
  };

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);

    // MOCK LOGIC
    setTimeout(() => {
      if (isRegister) {
        // --- Logic Registrasi ---
        toast.success("Pendaftaran berhasil! Silakan masuk.");
        setIsRegister(false); // Pindah ke mode login
        form.setValue("no_handphone", values.no_handphone); // Pre-fill no hp
        setIsLoading(false);
      } else {
        // --- Logic Login ---
        let role: UserRole = "JEMAAT";
        let name = "Jemaat User";

        // Simulasi role (Admin Bypass)
        if (values.no_handphone === "08123456789") {
          role = "ADMIN";
          name = "Administrator";
        } else if (values.no_handphone === "08111111111") {
          role = "SEKRETARIS";
          name = "Sekretaris Gereja";
        } else {
          // Kalau user biasa login, anggap namanya dari database (atau dari form register barusan di real app)
          name = "Jemaat Baru"; 
        }

        const mockUser = {
          id: `usr_${Math.floor(Math.random() * 1000)}`,
          email: `${values.no_handphone}@placeholder.com`,
          name: name,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };
        
        login(mockUser, "ey_mock_jwt_token_123456");
        
        toast.success(`Selamat datang, ${name}!`);
        setIsLoading(false);
        navigate(from, { replace: true });
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Church className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isRegister ? "Daftar Akun Baru" : "Gereja Digital CMS"}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? "Lengkapi data diri untuk bergabung" 
              : "Masuk untuk mengakses sistem gereja"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Field Nama (Hanya di Register) */}
              {isRegister && (
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem className="animate-in slide-in-from-top-2">
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Nama Lengkap Anda" 
                            className="pl-9"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="no_handphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Handphone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="text" 
                          placeholder="08xxxxxxxxxx" 
                          className="pl-9"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  isRegister ? "Daftar Sekarang" : "Masuk"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
          <div className="text-center">
            {isRegister ? (
              <p>
                Sudah punya akun?{" "}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="text-primary font-semibold hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            ) : (
              <p>
                Belum terdaftar?{" "}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="text-primary font-semibold hover:underline"
                >
                  Buat akun baru
                </button>
              </p>
            )}
          </div>

          {!isRegister && (
            <div className="bg-muted p-3 rounded text-xs w-full text-left">
              <p className="font-semibold mb-1">Akun Demo:</p>
              <p>Admin: 08123456789 (Pass: bebas)</p>
              <p>Jemaat: 08999999999 (Pass: bebas)</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;