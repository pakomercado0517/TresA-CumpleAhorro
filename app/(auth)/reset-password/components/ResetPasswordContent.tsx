"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordContent(): React.ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <Card className="w-full max-w-md shadow-lg md:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Restablecer Contraseña
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de
            recordar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-[#22c55e] hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
