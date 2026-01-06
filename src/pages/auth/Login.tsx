import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Church, Loader2 } from "lucide-react";
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

const formSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect path: kembali ke halaman tujuan atau dashboard
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // MOCK AUTHENTICATION LOGIC
    // Dalam real app, ini adalah API Call
    setTimeout(() => {
      let role: UserRole = "JEMAAT";
      let name = "Jemaat User";

      // Simulasi role berdasarkan email
      if (values.email.includes("admin")) {
        role = "ADMIN";
        name = "Administrator";
      } else if (values.email.includes("sekretaris")) {
        role = "SEKRETARIS";
        name = "Sekretaris Gereja";
      }

      const mockUser = {
        id: "usr_123",
        email: values.email,
        name: name,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      };
      
      const mockToken = "ey_mock_jwt_token_123456";

      login(mockUser, mockToken);
      
      toast.success(`Selamat datang kembali, ${name}!`);
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Church className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Gereja Digital CMS</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk masuk ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@gereja.org" {...field} />
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
                  "Masuk"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div className="bg-muted p-3 rounded text-xs w-full text-left">
            <p className="font-semibold mb-1">Akun Demo:</p>
            <p>Admin: admin@test.com (pass: bebas)</p>
            <p>Jemaat: user@test.com (pass: bebas)</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;