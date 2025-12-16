"use client";

import React from "react";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
} from "lucide-react";

interface GeneralSettingsSectionProps {
  language: string;
  appearance: "light" | "dark" | "system";
  onLanguageChange: (language: string) => void;
  onAppearanceChange: (appearance: "light" | "dark" | "system") => void;
}

export function GeneralSettingsSection({
  language,
  appearance,
  onLanguageChange,
  onAppearanceChange,
}: GeneralSettingsSectionProps): React.ReactNode {
  const handleLanguageChange = (value: string): void => {
    onLanguageChange(value);
  };

  const handleAppearanceChange = (
    value: "light" | "dark" | "system"
  ): void => {
    onAppearanceChange(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <SettingsIcon className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Ajustes Generales</h2>
      </div>

      <div className="space-y-6">
        {/* Idioma */}
        <div className="space-y-2">
          <label
            htmlFor="language"
            className="text-sm font-medium text-gray-700"
          >
            Idioma
          </label>
          <div className="relative">
            <select
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent pr-10"
            >
              <option value="es-LA">Español (Latinoamérica)</option>
              <option value="es-ES">Español (España)</option>
              <option value="en-US">English (US)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Apariencia */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Apariencia
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => handleAppearanceChange("light")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
                appearance === "light"
                  ? "border-[#22c55e] bg-green-50 text-[#22c55e]"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Claro</span>
            </button>
            <button
              type="button"
              onClick={() => handleAppearanceChange("dark")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
                appearance === "dark"
                  ? "border-[#22c55e] bg-green-50 text-[#22c55e]"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Oscuro</span>
            </button>
            <button
              type="button"
              onClick={() => handleAppearanceChange("system")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
                appearance === "system"
                  ? "border-[#22c55e] bg-green-50 text-[#22c55e]"
                  : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span className="text-sm font-medium">Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

