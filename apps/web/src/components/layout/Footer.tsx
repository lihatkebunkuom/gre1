import { APP_CONFIG } from "@/constants/config";

export const Footer = () => {
  return (
    <footer className="py-6 px-8 border-t bg-background/50 backdrop-blur-sm mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} <strong>{APP_CONFIG.NAME}</strong>. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Bantuan</a>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
};