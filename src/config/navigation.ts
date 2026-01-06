import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Wallet, 
  Settings, 
  FileText, 
  BookOpen,
  Heart,
  Music,
  MonitorPlay,
  Database,
  LucideIcon,
  Church,
  Image
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href?: string; // Optional jika punya subitems
  icon: LucideIcon;
  roles: UserRole[];
  items?: NavItemChild[]; // Submenu
}

export interface NavItemChild {
  title: string;
  href: string;
  roles: UserRole[];
}

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    groupLabel: "", // Grup Utama (Top)
    items: [
      { 
        title: "Dashboard", 
        href: "/", 
        icon: LayoutDashboard, 
        roles: [] // Semua role
      }
    ]
  },
  {
    groupLabel: "Manajemen Data",
    items: [
      { 
        title: "Data Jemaat", 
        icon: Users, 
        roles: ['ADMIN', 'SEKRETARIS', 'GEMBALA'],
        items: [
          { title: "Daftar Jemaat", href: "/jemaat", roles: [] },
          { title: "Tambah Jemaat", href: "/jemaat/create", roles: [] },
          { title: "Kelompok / Wilayah", href: "/jemaat/wilayah", roles: [] },
        ]
      },
      {
        title: "Pelayan & SDM",
        icon: Database, 
        roles: ['ADMIN', 'SEKRETARIS'],
        items: [
          { title: "Daftar Pelayan", href: "/pelayan", roles: [] },
          { title: "Penugasan", href: "/pelayan/penugasan", roles: [] },
        ]
      }
    ]
  },
  {
    groupLabel: "Pelayanan & Ibadah",
    items: [
      { 
        title: "Jadwal Ibadah", 
        icon: Calendar, 
        roles: [], // Semua bisa lihat jadwal
        items: [
          { title: "Kalender Event", href: "/event/kalender", roles: [] },
          { title: "Jadwal Ibadah", href: "/ibadah", roles: [] },
          { title: "Absensi Kehadiran", href: "/ibadah/kehadiran", roles: ['ADMIN', 'SEKRETARIS'] },
        ]
      },
      {
        title: "Divisi Pelayanan",
        icon: Church,
        roles: ['ADMIN', 'SEKRETARIS', 'GEMBALA'],
        items: [
          { title: "Daftar Divisi", href: "/pelayanan", roles: [] },
          { title: "Anggota Tim", href: "/pelayanan/anggota", roles: [] },
        ]
      }
    ]
  },
  {
    groupLabel: "Konten & Media",
    items: [
      {
        title: "Manajemen Banner",
        icon: Image,
        roles: ['ADMIN', 'SEKRETARIS'],
        items: [
          { title: "Banner Top / Artikel", href: "/banner/top", roles: [] },
          { title: "Banner Middle", href: "/banner/middle", roles: [] },
          { title: "Banner Bottom", href: "/banner/bottom", roles: [] },
        ]
      },
      {
        title: "Konten Rohani",
        icon: BookOpen,
        roles: ['ADMIN', 'SEKRETARIS', 'GEMBALA'],
        items: [
          { title: "Artikel & Renungan", href: "/konten/artikel", roles: [] },
          { title: "Media & Galeri", href: "/konten/media", roles: [] },
        ]
      },
      {
        title: "Alkitab & Doa",
        icon: Heart,
        roles: [], 
        items: [
          { title: "Alkitab Digital", href: "/alkitab", roles: [] },
          { title: "Pokok Doa", href: "/doa", roles: [] },
        ]
      }
    ]
  },
  {
    groupLabel: "Administrasi",
    items: [
      { 
        title: "Keuangan", 
        icon: Wallet, 
        roles: ['ADMIN', 'BENDAHARA'],
        items: [
          { title: "Transaksi", href: "/keuangan/transaksi", roles: [] },
          { title: "Persembahan", href: "/keuangan/persembahan", roles: [] },
          { title: "Laporan Keuangan", href: "/keuangan/laporan", roles: [] },
        ]
      },
      { 
        title: "Laporan & Analitik", 
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
    ]
  }
];

export const getAllNavItems = () => {
  const all: { title: string, href: string }[] = [];
  SIDEBAR_GROUPS.forEach(group => {
    group.items.forEach(item => {
      if (item.href) all.push({ title: item.title, href: item.href });
      if (item.items) {
        item.items.forEach(sub => all.push({ title: sub.title, href: sub.href }));
      }
    });
  });
  return all;
};