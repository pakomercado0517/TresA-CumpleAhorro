"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySectionProps {
  passwordData: PasswordData;
  onPasswordChange: (data: PasswordData) => void;
}

export function SecuritySection({
  passwordData,
  onPasswordChange,
}: SecuritySectionProps): React.ReactNode {
  const handleCurrentPasswordChange = (value: string): void => {
    onPasswordChange({
      ...passwordData,
      oldPassword: value,
    });
  };

  const handleNewPasswordChange = (value: string): void => {
    onPasswordChange({
      ...passwordData,
      newPassword: value,
    });
  };

  const handleConfirmPasswordChange = (value: string): void => {
    onPasswordChange({
      ...passwordData,
      confirmPassword: value,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Opcional
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="oldPassword"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña Actual
          </label>
          <Input
            id="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => handleCurrentPasswordChange(e.target.value)}
            placeholder="Ingrese su contraseña actual para confirmar cambios"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
            Nueva Contraseña
          </label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            placeholder="Ingrese su nueva contraseña"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirmar Contraseña
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            placeholder="Confirme su nueva contraseña"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

