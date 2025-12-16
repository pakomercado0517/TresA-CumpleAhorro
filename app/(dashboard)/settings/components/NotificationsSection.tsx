"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationPreferences {
  paymentAlerts: boolean;
  eventReminders: boolean;
  weeklySummary: boolean;
}

interface NotificationsSectionProps {
  notifications: NotificationPreferences;
  onNotificationsChange: (
    notifications: Partial<NotificationPreferences>
  ) => void;
}

export function NotificationsSection({
  notifications,
  onNotificationsChange,
}: NotificationsSectionProps): React.ReactNode {
  const handlePaymentAlertsChange = (checked: boolean): void => {
    onNotificationsChange({ paymentAlerts: checked });
  };

  const handleEventRemindersChange = (checked: boolean): void => {
    onNotificationsChange({ eventReminders: checked });
  };

  const handleWeeklySummaryChange = (checked: boolean): void => {
    onNotificationsChange({ weeklySummary: checked });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Bell className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
      </div>

      <div className="space-y-4">
        {/* Alertas de Pago */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Alertas de Pago
            </h3>
            <p className="text-xs text-gray-600">
              Recibir correo cuando un miembro suba un comprobante.
            </p>
          </div>
          <Switch
            checked={notifications.paymentAlerts}
            onCheckedChange={handlePaymentAlertsChange}
          />
        </div>

        {/* Recordatorios de Eventos */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Recordatorios de Eventos
            </h3>
            <p className="text-xs text-gray-600">
              Avisos 24h antes de un cumpleaños.
            </p>
          </div>
          <Switch
            checked={notifications.eventReminders}
            onCheckedChange={handleEventRemindersChange}
          />
        </div>

        {/* Resumen Semanal */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Resumen Semanal
            </h3>
            <p className="text-xs text-gray-600">
              Informe de estado de todas las tandas.
            </p>
          </div>
          <Switch
            checked={notifications.weeklySummary}
            onCheckedChange={handleWeeklySummaryChange}
          />
        </div>
      </div>
    </div>
  );
}

