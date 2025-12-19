"use client";

import React from "react";
import { FileText, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventActionsProps {
  onDownloadPDF?: () => void;
  onViewPublic?: () => void;
  onShareWhatsApp?: () => void;
}

export function EventActions({
  onDownloadPDF,
  onViewPublic,
  onShareWhatsApp,
}: EventActionsProps): React.ReactNode {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        Lista de Miembros
      </h3>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onDownloadPDF}
          variant="outline"
          className="w-full justify-start bg-white hover:bg-gray-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Descargar PDF
        </Button>
        <Button
          onClick={onViewPublic}
          variant="outline"
          className="w-full justify-start bg-white hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Vista Pública
        </Button>
        <Button
          onClick={onShareWhatsApp}
          className="w-full justify-start bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Compartir por WhatsApp
        </Button>
      </div>
    </div>
  );
}










