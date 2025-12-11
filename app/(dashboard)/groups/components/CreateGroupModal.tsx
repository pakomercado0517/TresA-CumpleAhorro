"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroup } from "@/lib/api-dashboard";

const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del grupo es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  amountPerBirthday: z
    .number({
      message: "El monto debe ser un número",
    })
    .positive("El monto debe ser mayor a 0")
    .min(1, "El monto debe ser mayor a 0"),
  memberSearch: z.string().optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateGroupModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      amountPerBirthday: 200,
      memberSearch: "",
    },
  });

  const amountValue = watch("amountPerBirthday");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Remover todo excepto números y un solo punto decimal
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");
    
    // Asegurar solo un punto decimal
    const parts = cleanValue.split(".");
    const finalValue = parts.length > 2 
      ? parts[0] + "." + parts.slice(1).join("")
      : cleanValue;
    
    // Convertir a número
    const numValue = parseFloat(finalValue) || 0;
    setValue("amountPerBirthday", numValue, { shouldValidate: true, shouldDirty: true });
  };

  const handleAmountBlur = (): void => {
    // Asegurar que el valor mínimo sea 1
    const currentValue = watch("amountPerBirthday");
    if (!currentValue || currentValue < 1) {
      setValue("amountPerBirthday", 200, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CreateGroupFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const groupData = {
        name: data.name.trim(),
        amountPerBirthday: Number(data.amountPerBirthday),
      };
      
      console.log("📤 Datos enviados al crear grupo:", groupData);
      console.log("📤 JSON que se enviará:", JSON.stringify(groupData));
      
      await createGroup(groupData);
      setIsLoading(false);
      reset({
        name: "",
        amountPerBirthday: 200,
        memberSearch: "",
      });
      setError(null);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el grupo"
      );
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!isLoading) {
      reset({
        name: "",
        amountPerBirthday: 200,
        memberSearch: "",
      });
      setError(null);
      onOpenChange(false);
    }
  };

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        amountPerBirthday: 200,
        memberSearch: "",
      });
      setIsLoading(false);
      setError(null);
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Crear Nuevo Grupo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Nombre del Grupo */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre del Grupo
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ej. Familia Pérez"
              {...register("name", {
                required: "El nombre del grupo es requerido",
                minLength: {
                  value: 1,
                  message: "El nombre del grupo es requerido",
                },
              })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Monto por Persona */}
          <div className="space-y-2">
            <label
              htmlFor="amountPerBirthday"
              className="text-sm font-medium text-gray-700"
            >
              Monto por Persona
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <Input
                id="amountPerBirthday"
                type="text"
                inputMode="decimal"
                value={amountValue || ""}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                placeholder="200.00"
                className={`pl-8 ${errors.amountPerBirthday ? "border-red-500" : ""}`}
              />
            </div>
            {errors.amountPerBirthday && (
              <p className="text-sm text-red-600">
                {errors.amountPerBirthday.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Monto en pesos mexicanos (MXN)
            </p>
          </div>

          {/* Añadir Miembros */}
          <div className="space-y-2">
            <label
              htmlFor="memberSearch"
              className="text-sm font-medium text-gray-700"
            >
              Añadir Miembros
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="memberSearch"
                type="text"
                placeholder="Busca por nombre o email..."
                {...register("memberSearch")}
              />
            </div>
            <p className="text-xs text-gray-500">
              Los miembros se pueden agregar después de crear el grupo
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              {isLoading ? "Guardando..." : "Guardar Grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

