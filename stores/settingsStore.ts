import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationPreferences {
  paymentAlerts: boolean;
  eventReminders: boolean;
  weeklySummary: boolean;
}

interface SettingsState {
  // Preferencias persistentes (se guardan en localStorage)
  language: string;
  appearance: "light" | "dark" | "system";
  notifications: NotificationPreferences;

  // Acciones
  setLanguage: (language: string) => void;
  setAppearance: (appearance: "light" | "dark" | "system") => void;
  setNotifications: (notifications: Partial<NotificationPreferences>) => void;
  resetSettings: () => void;
}

const defaultNotifications: NotificationPreferences = {
  paymentAlerts: true,
  eventReminders: true,
  weeklySummary: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Valores por defecto
      language: "es-LA",
      appearance: "light",
      notifications: defaultNotifications,

      // Acciones
      setLanguage: (language: string) => {
        set({ language });
      },

      setAppearance: (appearance: "light" | "dark" | "system") => {
        set({ appearance });
      },

      setNotifications: (notifications: Partial<NotificationPreferences>) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...notifications,
          },
        }));
      },

      resetSettings: () => {
        set({
          language: "es-LA",
          appearance: "light",
          notifications: defaultNotifications,
        });
      },
    }),
    {
      name: "settings-storage",
    }
  )
);

