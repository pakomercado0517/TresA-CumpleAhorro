"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import React from "react";

export function LoginContent(): React.ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8 md:px-8">
      <Card className="w-full max-w-md shadow-lg md:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Acceso de Administrador
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Ingresa tus credenciales para gestionar las tandas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-[#22c55e] hover:underline"
            >
              Crea una cuenta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
