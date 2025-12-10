"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";

type Status = "loading" | "success" | "error";

export function VerifyEmailContent(): JSX.Element {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmailToken = async (): Promise<void> => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de verificación no proporcionado");
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Error al verificar el email. El token puede haber expirado o ser inválido."
        );
      }
    };

    verifyEmailToken();
  }, [searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <Card className="w-full max-w-md shadow-lg md:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Verificación de Email
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            {status === "loading" && "Verificando tu email..."}
            {status === "success" && "Email verificado exitosamente"}
            {status === "error" && "Error al verificar el email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#22c55e]"></div>
              <p className="mt-4 text-sm text-gray-600">Por favor espera...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                <p className="font-medium mb-2">✅ {message}</p>
                <p>
                  Tu email ha sido verificado exitosamente. Ahora puedes iniciar
                  sesión en tu cuenta.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full font-medium">
                  Ir al inicio de sesión
                </Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                <p className="font-medium mb-2">❌ {message}</p>
                <p>
                  El token de verificación puede haber expirado o ser inválido.
                  Por favor, solicita un nuevo email de verificación.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Ir al inicio de sesión
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Nota: El endpoint para reenviar email de verificación aún no
                  está disponible
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

