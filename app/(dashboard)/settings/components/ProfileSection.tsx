"use client";

import React from "react";
import { User, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { User as UserType } from "@/types/auth";

interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
}

interface ProfileSectionProps {
  user: UserType | null;
  profileData: ProfileData;
  onProfileChange: (data: ProfileData) => void;
}

export function ProfileSection({
  user,
  profileData,
  onProfileChange,
}: ProfileSectionProps): React.ReactNode {
  const handleNameChange = (value: string): void => {
    onProfileChange({
      ...profileData,
      name: value,
    });
  };

  const handleEmailChange = (value: string): void => {
    onProfileChange({
      ...profileData,
      email: value,
    });
  };

  const handlePhotoChange = (): void => {
    // TODO: Implementar cambio de foto
    // Por ahora solo actualizamos el estado
    // Cuando se implemente la subida de archivos, aquí se actualizará avatarUrl
    onProfileChange({
      ...profileData,
      avatarUrl: "", // Se actualizará cuando se implemente la subida de archivos
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <User className="h-5 w-5 text-gray-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Perfil del Administrador
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Foto de Perfil */}
        <div className="flex-shrink-0">
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-semibold text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <button
              type="button"
              onClick={handlePhotoChange}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#22c55e] flex items-center justify-center text-white hover:bg-[#16a34a] transition-colors border-2 border-white"
              aria-label="Cambiar foto"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Permitido: JPG, PNG Max: 3MB
          </p>
        </div>

        {/* Campos de Formulario */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Nombre Completo
            </label>
            <Input
              id="fullName"
              type="text"
              value={profileData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej. Admin Usuario"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="admin@tanda.com"
                className="w-full pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

