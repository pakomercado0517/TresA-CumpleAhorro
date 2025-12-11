"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import React from "react";

export function ForgotPasswordContent(): React.ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <Card className="w-full max-w-md shadow-lg md:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu
            contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
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
