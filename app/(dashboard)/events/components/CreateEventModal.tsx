"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateGroupEvents, getGroups, getGroupMembers } from "@/lib/api-dashboard";
import type { Group } from "@/types/dashboard";

const createEventSchema = z.object({
  groupId: z
    .number({
      message: "Debes seleccionar un grupo",
    })
    .positive("Debes seleccionar un grupo"),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateEventModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateEventModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      groupId: undefined,
    },
  });

  const selectedGroupId = watch("groupId");

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

  // Cargar miembros cuando se selecciona un grupo
  useEffect(() => {
    if (selectedGroupId && open) {
      const loadMembers = async (): Promise<void> => {
        try {
          setIsLoadingMembers(true);
          const members = await getGroupMembers(selectedGroupId);
          setMemberCount(members.length);
          
          // Encontrar el grupo seleccionado para mostrar su información
          const group = groups.find((g) => g.id === selectedGroupId);
          setSelectedGroup(group || null);
        } catch (err) {
          console.error("Error loading members:", err);
          setMemberCount(0);
        } finally {
          setIsLoadingMembers(false);
        }
      };

      loadMembers();
    } else {
      setMemberCount(0);
      setSelectedGroup(null);
    }
  }, [selectedGroupId, open, groups]);

  const onSubmit = async (data: CreateEventFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Log para ver qué se envía al crear eventos
      console.log("📤 Objeto enviado al crear eventos:", {
        groupId: data.groupId,
        method: "POST",
        url: `/groups/${data.groupId}/events/generate`,
        body: null, // No se envía body, solo el groupId en la URL
      });
      
      const result = await generateGroupEvents(data.groupId);
      
      console.log("✅ Respuesta del servidor:", result);
      
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al generar los eventos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!isLoading) {
      reset();
      setError(null);
      setSelectedGroup(null);
      setMemberCount(0);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Generar Eventos de Cumpleaños
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Información */}
          <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">¿Qué hace esta acción?</p>
            <p className="text-xs">
              Genera eventos de cumpleaños para el año actual de todos los
              miembros del grupo seleccionado. Los eventos se crearán
              automáticamente basándose en las fechas de cumpleaños de cada
              miembro.
            </p>
          </div>

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
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  id="groupId"
                  {...register("groupId", {
                    valueAsNumber: true,
                  })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent ${
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
              </div>
            )}
            {errors.groupId && (
              <p className="text-sm text-red-600">{errors.groupId.message}</p>
            )}
          </div>

          {/* Información del Grupo Seleccionado */}
          {selectedGroup && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Información del Grupo
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Nombre:</span> {selectedGroup.name}
                </p>
                <p>
                  <span className="font-medium">Monto por persona:</span>{" "}
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(selectedGroup.amountPerBirthday)}
                </p>
                {isLoadingMembers ? (
                  <p className="text-xs text-gray-500">Cargando miembros...</p>
                ) : (
                  <p>
                    <span className="font-medium">Miembros:</span> {memberCount}{" "}
                    {memberCount === 1 ? "miembro" : "miembros"}
                  </p>
                )}
              </div>
              {memberCount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Se generarán {memberCount} evento(s) de cumpleaños para el
                    año {new Date().getFullYear()}.
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedGroup && memberCount === 0 && !isLoadingMembers && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              <p>
                Este grupo no tiene miembros. Agrega miembros al grupo antes de
                generar eventos.
              </p>
            </div>
          )}

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
              disabled={
                isLoading ||
                isLoadingGroups ||
                isLoadingMembers ||
                groups.length === 0 ||
                !selectedGroupId ||
                memberCount === 0
              }
              className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              {isLoading ? "Generando..." : "Generar Eventos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

