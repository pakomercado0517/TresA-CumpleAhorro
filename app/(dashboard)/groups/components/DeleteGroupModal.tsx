"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { deleteGroup } from "@/lib/api-dashboard";
import type { GroupListItem } from "@/types/groups";

interface DeleteGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupListItem | null;
  onSuccess?: () => void;
}

export function DeleteGroupModal({
  open,
  onOpenChange,
  group,
  onSuccess,
}: DeleteGroupModalProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    if (!group) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteGroup(group.id);
      setIsLoading(false);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el grupo"
      );
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    if (!isLoading) {
      setError(null);
      onOpenChange(false);
    }
  };

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (open) {
      setIsLoading(false);
      setError(null);
    }
  }, [open]);

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Eliminar Grupo
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            ¿Estás seguro de que deseas eliminar el grupo{" "}
            <span className="font-semibold text-gray-900">{group.name}</span>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            <strong>Advertencia:</strong> Al eliminar este grupo, también se eliminarán:
          </p>
          <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
            <li>Todos los miembros del grupo ({group.memberCount})</li>
            <li>Todos los eventos asociados ({group.totalEvents})</li>
            <li>Todos los pagos registrados</li>
          </ul>
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
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Eliminando..." : "Eliminar Grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

