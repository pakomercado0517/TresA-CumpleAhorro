"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateMember, getMember } from "@/lib/api-dashboard";
import type { MemberListItem } from "@/types/members";

const editMemberSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(/^[0-9+\-\s()]*$/, "El teléfono solo puede contener números, +, -, espacios y paréntesis")
    .optional()
    .or(z.literal("")),
  birthday: z
    .string()
    .min(1, "La fecha de cumpleaños es requerida")
    .refine(
      (date) => {
        const selectedDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      },
      {
        message: "La fecha de cumpleaños no puede ser futura",
      }
    ),
  photoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

type EditMemberFormData = z.infer<typeof editMemberSchema>;

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberListItem | null;
  onSuccess?: () => void;
}

export function EditMemberModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: EditMemberModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMember, setIsLoadingMember] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      birthday: "",
      photoUrl: "",
    },
  });

  const birthdayValue = watch("birthday");

  // Cargar datos del miembro al abrir el modal
  useEffect(() => {
    if (open && member) {
      const loadMemberData = async (): Promise<void> => {
        try {
          setIsLoadingMember(true);
          // Obtener datos completos del miembro desde la API
          const memberData = await getMember(member.id);
          
          // Establecer valores en el formulario
          setValue("name", memberData.name);
          setValue("phone", memberData.phone || "");
          setValue("birthday", memberData.birthday);
          setValue("photoUrl", memberData.photoUrl || "");
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar los datos del miembro"
          );
        } finally {
          setIsLoadingMember(false);
        }
      };

      loadMemberData();
    } else if (!open) {
      // Resetear formulario al cerrar
      reset();
      setError(null);
    }
  }, [open, member, setValue, reset]);

  // Obtener la fecha máxima (hoy) para el input de fecha
  const getMaxDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const onSubmit = async (data: EditMemberFormData): Promise<void> => {
    if (!member) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateMember(member.id, {
        name: data.name,
        phone: data.phone && data.phone.trim() !== "" ? data.phone : undefined,
        birthday: data.birthday,
        photoUrl:
          data.photoUrl && data.photoUrl.trim() !== ""
            ? data.photoUrl
            : undefined,
      });
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el miembro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!isLoading && !isLoadingMember) {
      reset();
      setError(null);
      onOpenChange(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Editar Miembro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {isLoadingMember && (
            <div className="text-sm text-gray-500">Cargando datos del miembro...</div>
          )}

          {/* Nombre */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ej. María González"
              {...register("name")}
              disabled={isLoadingMember}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ej. 1234567890"
              {...register("phone")}
              disabled={isLoadingMember}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Opcional. Máximo 20 caracteres.
            </p>
          </div>

          {/* Fecha de Cumpleaños */}
          <div className="space-y-2">
            <label
              htmlFor="birthday"
              className="text-sm font-medium text-gray-700"
            >
              Fecha de Cumpleaños <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                id="birthday"
                type="date"
                max={getMaxDate()}
                {...register("birthday")}
                disabled={isLoadingMember}
                className={`pl-10 ${errors.birthday ? "border-red-500" : ""}`}
              />
            </div>
            {errors.birthday && (
              <p className="text-sm text-red-600">{errors.birthday.message}</p>
            )}
            {birthdayValue && !errors.birthday && (
              <p className="text-xs text-gray-500">
                Formato: yyyy-MM-dd (seleccionado automáticamente)
              </p>
            )}
          </div>

          {/* URL de Foto */}
          <div className="space-y-2">
            <label
              htmlFor="photoUrl"
              className="text-sm font-medium text-gray-700"
            >
              URL de Foto
            </label>
            <Input
              id="photoUrl"
              type="url"
              placeholder="https://example.com/foto.jpg"
              {...register("photoUrl")}
              disabled={isLoadingMember}
              className={errors.photoUrl ? "border-red-500" : ""}
            />
            {errors.photoUrl && (
              <p className="text-sm text-red-600">{errors.photoUrl.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Opcional. URL válida de la foto del miembro.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isLoadingMember}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isLoadingMember}
              className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

