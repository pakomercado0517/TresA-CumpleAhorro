"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, UserPlus, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateGroup,
  getGroupMembers,
  createMember,
} from "@/lib/api-dashboard";
import type { GroupListItem } from "@/types/groups";

const editGroupSchema = z.object({
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
});

const addMemberSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(
      /^[0-9+\-\s()]*$/,
      "El teléfono solo puede contener números, +, -, espacios y paréntesis"
    )
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

type EditGroupFormData = z.infer<typeof editGroupSchema>;
type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface EditGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupListItem | null;
  onSuccess?: () => void;
}

interface GroupMember {
  id: number;
  name: string;
  phone?: string;
  birthday: string;
  photoUrl?: string;
}

export function EditGroupModal({
  open,
  onOpenChange,
  group,
  onSuccess,
}: EditGroupModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "members">("edit");
  const [members, setMembers] = useState<Array<GroupMember>>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: "",
      amountPerBirthday: 200,
    },
  });

  const amountValue = watch("amountPerBirthday");

  // Formulario para agregar miembros
  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    formState: { errors: memberErrors },
    reset: resetMember,
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      birthday: "",
      photoUrl: "",
    },
  });

  const getMaxDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Remover todo excepto números y un solo punto decimal
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");

    // Asegurar solo un punto decimal
    const parts = cleanValue.split(".");
    const finalValue =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleanValue;

    // Convertir a número
    const numValue = parseFloat(finalValue) || 0;
    setValue("amountPerBirthday", numValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAmountBlur = (): void => {
    // Asegurar que el valor mínimo sea 1
    const currentValue = watch("amountPerBirthday");
    if (!currentValue || currentValue < 1) {
      setValue("amountPerBirthday", group?.amountPerPeriod || 200, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: EditGroupFormData): Promise<void> => {
    if (!group) return;

    setIsLoading(true);
    setError(null);

    try {
      const groupData = {
        name: data.name.trim(),
        amountPerBirthday: Number(data.amountPerBirthday),
      };

      await updateGroup(group.id, groupData);
      setIsLoading(false);
      reset();
      setError(null);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el grupo"
      );
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

  const loadMembers = async (): Promise<void> => {
    if (!group) return;

    try {
      setIsLoadingMembers(true);
      const groupMembers = await getGroupMembers(group.id);
      setMembers(groupMembers);
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Cargar datos del grupo y miembros cuando se abre el modal
  useEffect(() => {
    if (open && group) {
      reset({
        name: group.name,
        amountPerBirthday: group.amountPerPeriod,
      });
      setIsLoading(false);
      setError(null);
      setActiveTab("edit");
      setShowAddMemberForm(false);
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group, reset]);

  const handleAddMember = async (data: AddMemberFormData): Promise<void> => {
    if (!group) return;

    setIsAddingMember(true);
    setError(null);

    try {
      await createMember(group.id, {
        name: data.name.trim(),
        phone: data.phone && data.phone.trim() !== "" ? data.phone : undefined,
        birthday: data.birthday,
        photoUrl:
          data.photoUrl && data.photoUrl.trim() !== ""
            ? data.photoUrl
            : undefined,
      });

      resetMember();
      setShowAddMemberForm(false);
      await loadMembers(); // Recargar lista de miembros
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al agregar el miembro"
      );
    } finally {
      setIsAddingMember(false);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Editar Grupo
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "text-[#22c55e] border-b-2 border-[#22c55e]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Información del Grupo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "members"
                ? "text-[#22c55e] border-b-2 border-[#22c55e]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Miembros ({members.length})
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800 mb-4">
            {error}
          </div>
        )}

        {/* Tab: Editar Grupo */}
        {activeTab === "edit" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  className={`pl-8 ${
                    errors.amountPerBirthday ? "border-red-500" : ""
                  }`}
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
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Tab: Miembros */}
        {activeTab === "members" && (
          <div className="space-y-4">
            {/* Botón para agregar miembro */}
            {!showAddMemberForm && (
              <Button
                type="button"
                onClick={() => setShowAddMemberForm(true)}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Miembro
              </Button>
            )}

            {/* Formulario para agregar miembro */}
            {showAddMemberForm && (
              <form
                onSubmit={handleSubmitMember(handleAddMember)}
                className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Nuevo Miembro
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMemberForm(false);
                      resetMember();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  <label
                    htmlFor="memberName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="memberName"
                    type="text"
                    placeholder="Ej. María González"
                    {...registerMember("name")}
                    className={memberErrors.name ? "border-red-500" : ""}
                  />
                  {memberErrors.name && (
                    <p className="text-sm text-red-600">
                      {memberErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label
                    htmlFor="memberPhone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Teléfono
                  </label>
                  <Input
                    id="memberPhone"
                    type="tel"
                    placeholder="Ej. 1234567890"
                    {...registerMember("phone")}
                    className={memberErrors.phone ? "border-red-500" : ""}
                  />
                  {memberErrors.phone && (
                    <p className="text-sm text-red-600">
                      {memberErrors.phone.message}
                    </p>
                  )}
                </div>

                {/* Fecha de Cumpleaños */}
                <div className="space-y-2">
                  <label
                    htmlFor="memberBirthday"
                    className="text-sm font-medium text-gray-700"
                  >
                    Fecha de Cumpleaños <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="memberBirthday"
                      type="date"
                      max={getMaxDate()}
                      {...registerMember("birthday")}
                      className={`pl-10 ${
                        memberErrors.birthday ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {memberErrors.birthday && (
                    <p className="text-sm text-red-600">
                      {memberErrors.birthday.message}
                    </p>
                  )}
                </div>

                {/* URL de Foto */}
                <div className="space-y-2">
                  <label
                    htmlFor="memberPhotoUrl"
                    className="text-sm font-medium text-gray-700"
                  >
                    URL de Foto
                  </label>
                  <Input
                    id="memberPhotoUrl"
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    {...registerMember("photoUrl")}
                    className={memberErrors.photoUrl ? "border-red-500" : ""}
                  />
                  {memberErrors.photoUrl && (
                    <p className="text-sm text-red-600">
                      {memberErrors.photoUrl.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddMemberForm(false);
                      resetMember();
                    }}
                    disabled={isAddingMember}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isAddingMember}
                    className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white"
                  >
                    {isAddingMember ? "Agregando..." : "Agregar"}
                  </Button>
                </div>
              </form>
            )}

            {/* Lista de miembros */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Miembros del Grupo ({members.length})
              </h3>

              {isLoadingMembers ? (
                <div className="text-sm text-gray-500 py-4 text-center">
                  Cargando miembros...
                </div>
              ) : members.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-lg">
                  No hay miembros en este grupo
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.name}
                          </p>
                          {member.phone && (
                            <p className="text-xs text-gray-500">
                              {member.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
