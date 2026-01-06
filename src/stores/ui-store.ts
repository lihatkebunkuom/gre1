import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = "dark" | "light" | "system";

interface UIState {
  // Sidebar State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;

  // Theme State
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Global Loading Overlay (Optional)
  isLoading: boolean;
  setLoading: (status: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar Implementation
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),

      // Theme Implementation
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        // Logic perubahan class HTML akan ditangani oleh ThemeProvider
      },

      // Global Loading Implementation
      isLoading: false,
      setLoading: (status) => set({ isLoading: status }),
    }),
    {
      name: 'ui-storage', // Persist di localStorage
      partialize: (state) => ({ 
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme 
      }), // Hanya persist sidebar & theme, jangan loading status
    }
  )
);