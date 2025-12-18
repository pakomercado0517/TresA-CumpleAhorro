"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .max(255, "El email no puede exceder 255 caracteres"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm(): React.ReactNode {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Deriva el mensaje de éxito del parámetro de URL sin usar useEffect
  const resetSuccessMessage = useMemo<string | null>(() => {
    const resetParam = searchParams.get("reset");
    if (resetParam === "success") {
      return "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tu nueva contraseña.";
    }
    return null;
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await login({
        email: data.email,
        password: data.password,
      });
      // No necesitamos resetear isLoading aquí porque la redirección
      // desmontará el componente. Si hay un error, se captura abajo.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  // Combina el mensaje de éxito del estado con el mensaje derivado de la URL
  const displaySuccess = success || resetSuccessMessage;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {displaySuccess && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          {displaySuccess}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            {...register("email")}
            className={errors.email ? "border-red-500 pr-10" : "pr-10"}
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            {...register("password")}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-[#22c55e] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full font-medium">
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
