import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Wallet, 
  Settings, 
  FileText, 
  LucideIcon 
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[]; // Kosongkan jika untuk semua role
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { 
    title: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard, 
    roles: [] 
  },
  { 
    title: "Data Jemaat", 
    href: "/jemaat", 
    icon: Users, 
    roles: ['ADMIN', 'SEKRETARIS', 'GEMBALA'] 
  },
  { 
    title: "Jadwal Ibadah", 
    href: "/jadwal", 
    icon: Calendar, 
    roles: ['ADMIN', 'SEKRETARIS', 'GEMBALA', 'JEMAAT'] 
  },
  { 
    title: "Keuangan", 
    href: "/keuangan", 
    icon: Wallet, 
    roles: ['ADMIN', 'BENDAHARA'] 
  },
  { 
    title: "Laporan", 
    href: "/laporan", 
    icon: FileText, 
    roles: ['ADMIN', 'GEMBALA', 'BENDAHARA'] 
  },
  { 
    title: "Pengaturan", 
    href: "/pengaturan", 
    icon: Settings, 
    roles: ['ADMIN'] 
  },
];