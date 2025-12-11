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
import { createMember, getGroups } from "@/lib/api-dashboard";
import type { Group } from "@/types/dashboard";

const createMemberSchema = z.object({
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
  groupId: z
    .number({
      message: "Debes seleccionar un grupo",
    })
    .positive("Debes seleccionar un grupo"),
});

type CreateMemberFormData = z.infer<typeof createMemberSchema>;

interface CreateMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateMemberModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateMemberModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateMemberFormData>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      birthday: "",
      photoUrl: "",
      groupId: undefined,
    },
  });

  const selectedGroupId = watch("groupId");
  const birthdayValue = watch("birthday");

  // Cargar grupos al abrir el modal
  useEffect(() => {
    if (open) {
      const loadGroups = async (): Promise<void> => {
        try {
          setIsLoadingGroups(true);
          const groupsData = await getGroups();
          setGroups(groupsData);
          // Si hay grupos y no hay uno seleccionado, seleccionar el primero
          if (groupsData.length > 0 && !selectedGroupId) {
            setValue("groupId", groupsData[0].id, { shouldValidate: true });
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar los grupos"
          );
        } finally {
          setIsLoadingGroups(false);
        }
      };

      loadGroups();
    }
  }, [open, selectedGroupId, setValue]);

  // Obtener la fecha máxima (hoy) para el input de fecha
  const getMaxDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const onSubmit = async (data: CreateMemberFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await createMember(data.groupId, {
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
        err instanceof Error ? err.message : "Error al crear el miembro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!isLoading) {
      reset();
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Crear Nuevo Miembro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Grupo */}
          <div className="space-y-2">
            <label
              htmlFor="groupId"
              className="text-sm font-medium text-gray-700"
            >
              Grupo <span className="text-red-500">*</span>
            </label>
            {isLoadingGroups ? (
              <div className="text-sm text-gray-500">Cargando grupos...</div>
            ) : groups.length === 0 ? (
              <div className="text-sm text-red-600">
                No hay grupos disponibles. Crea un grupo primero.
              </div>
            ) : (
              <select
                id="groupId"
                {...register("groupId", {
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent ${
                  errors.groupId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona un grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
            {errors.groupId && (
              <p className="text-sm text-red-600">{errors.groupId.message}</p>
            )}
          </div>

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
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isLoadingGroups || groups.length === 0}
              className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              {isLoading ? "Guardando..." : "Guardar Miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

