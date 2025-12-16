"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { NotificationsSection } from "./NotificationsSection";
import { GeneralSettingsSection } from "./GeneralSettingsSection";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  updateUserProfile,
  changeUserPassword,
  updateUserAvatar,
  updateUserPreferences,
} from "@/lib/api-dashboard";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsPageContent(): React.ReactNode {
  const { user, updateUser } = useAuthStore();
  const {
    language,
    appearance,
    notifications,
    setLanguage,
    setAppearance,
    setNotifications,
  } = useSettingsStore();

  // Estados locales para rastrear cambios
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Valores originales para comparar
  const originalProfileRef = useRef<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const originalNotificationsRef = useRef(notifications);
  const originalLanguageRef = useRef(language);
  const originalAppearanceRef = useRef(appearance);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar valores originales cuando cambie el usuario o las preferencias
  useEffect(() => {
    if (user) {
      originalProfileRef.current = {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      };
      setProfileData({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  // Actualizar referencias de preferencias cuando cambien
  useEffect(() => {
    originalNotificationsRef.current = notifications;
    originalLanguageRef.current = language;
    originalAppearanceRef.current = appearance;
  }, [notifications, language, appearance]);

  // Detectar si hay cambios
  const hasChanges = (): boolean => {
    // Cambios en perfil
    const profileChanged =
      profileData.name !== originalProfileRef.current.name ||
      profileData.email !== originalProfileRef.current.email ||
      profileData.avatarUrl !== originalProfileRef.current.avatarUrl;

    // Cambios en contraseña (si hay nueva contraseña)
    const passwordChanged =
      passwordData.newPassword.trim() !== "" &&
      passwordData.confirmPassword.trim() !== "";

    // Cambios en notificaciones
    const notificationsChanged =
      JSON.stringify(notifications) !==
      JSON.stringify(originalNotificationsRef.current);

    // Cambios en idioma
    const languageChanged = language !== originalLanguageRef.current;

    // Cambios en apariencia
    const appearanceChanged = appearance !== originalAppearanceRef.current;

    return (
      profileChanged ||
      passwordChanged ||
      notificationsChanged ||
      languageChanged ||
      appearanceChanged
    );
  };

  const handleSave = async (): Promise<void> => {
    if (!hasChanges()) {
      console.log("🔍 [Settings] No hay cambios detectados");
      return;
    }

    console.log("💾 [Settings] Iniciando guardado de cambios...");
    setIsSaving(true);
    setError(null);

    try {
      const changes: {
        profile?: { name?: string; email?: string };
        avatar?: { avatarUrl: string };
        password?: { oldPassword: string; newPassword: string };
        preferences?: {
          notifications?: Partial<typeof notifications>;
          language?: string;
          appearance?: "light" | "dark" | "system";
        };
      } = {};

      // Detectar cambios en perfil (nombre y email)
      const profileChanges: { name?: string; email?: string } = {};
      if (profileData.name !== originalProfileRef.current.name) {
        profileChanges.name = profileData.name;
        console.log("📝 [Settings] Cambio detectado en nombre:", {
          anterior: originalProfileRef.current.name,
          nuevo: profileData.name,
        });
      }
      if (profileData.email !== originalProfileRef.current.email) {
        profileChanges.email = profileData.email;
        console.log("📧 [Settings] Cambio detectado en email:", {
          anterior: originalProfileRef.current.email,
          nuevo: profileData.email,
        });
      }
      if (Object.keys(profileChanges).length > 0) {
        changes.profile = profileChanges;
        console.log("✅ [Settings] Cambios de perfil a enviar:", profileChanges);
      }

      // Detectar cambios en avatar (se maneja por separado)
      const avatarChanged =
        profileData.avatarUrl !== originalProfileRef.current.avatarUrl;
      if (avatarChanged && profileData.avatarUrl.trim() !== "") {
        changes.avatar = { avatarUrl: profileData.avatarUrl };
        console.log("🖼️ [Settings] Cambio detectado en avatar:", {
          anterior: originalProfileRef.current.avatarUrl,
          nuevo: profileData.avatarUrl,
        });
        console.log("✅ [Settings] Cambio de avatar a enviar:", changes.avatar);
      }

      // Detectar cambios en contraseña
      if (
        passwordData.newPassword.trim() !== "" &&
        passwordData.confirmPassword.trim() !== ""
      ) {
        console.log("🔒 [Settings] Cambio de contraseña detectado");
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        if (passwordData.oldPassword.trim() === "") {
          throw new Error("Debes ingresar tu contraseña actual");
        }
        changes.password = {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        };
        console.log("✅ [Settings] Cambio de contraseña a enviar (sin mostrar contraseñas)");
      }

      // Detectar cambios en preferencias
      const preferencesChanges: {
        notifications?: Partial<typeof notifications>;
        language?: string;
        appearance?: "light" | "dark" | "system";
      } = {};

      if (
        JSON.stringify(notifications) !==
        JSON.stringify(originalNotificationsRef.current)
      ) {
        preferencesChanges.notifications = notifications;
        console.log("🔔 [Settings] Cambio detectado en notificaciones:", {
          anterior: originalNotificationsRef.current,
          nuevo: notifications,
        });
      }
      if (language !== originalLanguageRef.current) {
        preferencesChanges.language = language;
        console.log("🌐 [Settings] Cambio detectado en idioma:", {
          anterior: originalLanguageRef.current,
          nuevo: language,
        });
      }
      if (appearance !== originalAppearanceRef.current) {
        preferencesChanges.appearance = appearance;
        console.log("🎨 [Settings] Cambio detectado en apariencia:", {
          anterior: originalAppearanceRef.current,
          nuevo: appearance,
        });
      }

      if (Object.keys(preferencesChanges).length > 0) {
        changes.preferences = preferencesChanges;
        console.log("✅ [Settings] Cambios de preferencias a enviar:", preferencesChanges);
      }

      // Resumen de todos los cambios detectados
      console.log("📦 [Settings] Resumen de cambios a enviar:", {
        tienePerfil: !!changes.profile,
        tieneAvatar: !!changes.avatar,
        tienePassword: !!changes.password,
        tienePreferencias: !!changes.preferences,
        cambios: changes,
      });

      // Guardar cambios según lo que haya cambiado
      if (changes.profile) {
        console.log("🚀 [Settings] Enviando actualización de perfil:", changes.profile);
        const updatedUser = await updateUserProfile(changes.profile);
        console.log("✅ [Settings] Perfil actualizado exitosamente:", updatedUser);
        updateUser(updatedUser);
        originalProfileRef.current = {
          ...originalProfileRef.current,
          ...changes.profile,
        };
        toast.success("Perfil actualizado correctamente");
      }

      if (changes.avatar) {
        console.log("🚀 [Settings] Enviando actualización de avatar:", changes.avatar);
        const updatedUser = await updateUserAvatar(changes.avatar);
        console.log("✅ [Settings] Avatar actualizado exitosamente:", updatedUser);
        updateUser(updatedUser);
        originalProfileRef.current = {
          ...originalProfileRef.current,
          avatarUrl: updatedUser.avatarUrl || "",
        };
        toast.success("Avatar actualizado correctamente");
      }

      if (changes.password) {
        console.log("🚀 [Settings] Enviando cambio de contraseña (sin mostrar contraseñas)");
        const response = await changeUserPassword(changes.password);
        console.log("✅ [Settings] Contraseña actualizada exitosamente:", response);
        // Limpiar campos de contraseña después de guardar
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Contraseña actualizada correctamente");
      }

      if (changes.preferences) {
        console.log("🚀 [Settings] Guardando preferencias (solo frontend):", changes.preferences);
        const response = await updateUserPreferences(changes.preferences);
        console.log("✅ [Settings] Preferencias guardadas:", response);
        // Actualizar referencias originales
        originalNotificationsRef.current = notifications;
        originalLanguageRef.current = language;
        originalAppearanceRef.current = appearance;
        toast.success("Preferencias actualizadas correctamente");
      }

      // Si no hubo cambios, mostrar mensaje
      if (
        !changes.profile &&
        !changes.avatar &&
        !changes.password &&
        !changes.preferences
      ) {
        console.log("⚠️ [Settings] No se detectaron cambios para enviar");
        toast.info("No hay cambios para guardar");
      } else {
        console.log("🎉 [Settings] Todos los cambios guardados exitosamente");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al guardar los cambios";
      console.error("❌ [Settings] Error al guardar cambios:", error);
      console.error("❌ [Settings] Mensaje de error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
      console.log("🏁 [Settings] Proceso de guardado finalizado");
    }
  };

  const handleCancel = (): void => {
    // Resetear a valores originales
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      });
    }
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    // Resetear preferencias a valores originales guardados
    setLanguage(originalLanguageRef.current);
    setAppearance(originalAppearanceRef.current);
    setNotifications(originalNotificationsRef.current);
    setError(null);
  };

  return (
    <>
      <div className="pb-4 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8">

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <ProfileSection
              user={user}
              profileData={profileData}
              onProfileChange={setProfileData}
            />
            <SecuritySection
              passwordData={passwordData}
              onPasswordChange={setPasswordData}
            />
            <NotificationsSection
              notifications={notifications}
              onNotificationsChange={setNotifications}
            />
            <GeneralSettingsSection
              language={language}
              appearance={appearance}
              onLanguageChange={setLanguage}
              onAppearanceChange={setAppearance}
            />
          </div>

          {/* Botones de acción - Mobile (Sticky, se acomodan al final) */}
          <div className="sticky bottom-16 mt-6 mb-4 sm:hidden z-40">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving || !hasChanges()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges()}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

