"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/dashboard-utils";
import type { BirthdayListItem } from "@/types/dashboard";

interface BirthdayListProps {
  birthdays: Array<BirthdayListItem>;
  isLoading?: boolean;
}

function BirthdayItem({ birthday }: { birthday: BirthdayListItem }): JSX.Element {
  const statusLabels = {
    paid: "Pagado",
    pending: "Pendiente",
    overdue: "Vencido",
  };

  const statusVariants = {
    paid: "paid" as const,
    pending: "pending" as const,
    overdue: "overdue" as const,
  };

  return (
    <Link href={`/events/${birthday.eventId}`}>
      <div className="flex items-center gap-3 p-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {birthday.photoUrl ? (
            <Image
              src={birthday.photoUrl}
              alt={birthday.name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold text-lg">
              {birthday.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {birthday.name}
            </h3>
            <Badge variant={statusVariants[birthday.paymentStatus]}>
              {statusLabels[birthday.paymentStatus]}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">
              {birthday.groupName}
            </p>
            <p className="text-sm text-gray-600 ml-2">
              {formatShortDate(birthday.birthdayDate)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BirthdayList({
  birthdays,
  isLoading = false,
}: BirthdayListProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="px-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 animate-pulse"
            >
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (birthdays.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500">No hay cumpleaños próximos</p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">
        Lista de Cumpleaños
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {birthdays.map((birthday) => (
          <BirthdayItem key={birthday.id} birthday={birthday} />
        ))}
      </div>
    </div>
  );
}

