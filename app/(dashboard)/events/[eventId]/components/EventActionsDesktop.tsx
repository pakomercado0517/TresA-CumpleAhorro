"use client";

import React from "react";
import { FileText, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventActionsDesktopProps {
  onDownloadPDF?: () => void;
  onViewPublic?: () => void;
  onShareWhatsApp?: () => void;
}

export function EventActionsDesktop({
  onDownloadPDF,
  onViewPublic,
  onShareWhatsApp,
}: EventActionsDesktopProps): React.ReactNode {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onDownloadPDF}
        variant="outline"
        className="bg-white hover:bg-gray-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        Descargar PDF
      </Button>
      <Button
        onClick={onViewPublic}
        variant="outline"
        className="bg-white hover:bg-gray-50"
      >
        <Eye className="h-4 w-4 mr-2" />
        Ver Vista Pública
      </Button>
      <Button
        onClick={onShareWhatsApp}
        className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Compartir por WhatsApp
      </Button>
    </div>
  );
}





