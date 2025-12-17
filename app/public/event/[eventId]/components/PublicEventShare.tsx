"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PublicEventShareProps {
  eventId: number;
}

export function PublicEventShare({
  eventId,
}: PublicEventShareProps): React.ReactNode {
  const [publicEventUrl, setPublicEventUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicEventUrl(`${window.location.origin}/public/event/${eventId}`);
    }
  }, [eventId]);

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(publicEventUrl);
      toast.success("Enlace copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("Error al copiar el enlace");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* QR Code */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          {publicEventUrl && (
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <QRCodeSVG value={publicEventUrl} size={150} level="H" />
            </div>
          )}
        </div>

        {/* Información y botón */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Comparte el evento
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Escanea para abrir en tu celular o compartir este enlace con
              otros invitados.
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 transition-colors"
          >
            <Share2 className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Copiar Enlace
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

