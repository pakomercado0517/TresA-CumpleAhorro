"use client";

import React from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
interface Member {
  id: number;
  name: string;
  photoUrl?: string;
}

interface EventPayment {
  id: number;
  memberId: number;
  amount: number;
  datePaid: string;
  proofUrl: string | null;
}

interface MembersTableProps {
  members: Array<Member>;
  payments: Array<EventPayment>;
  onPaymentToggle: (memberId: number, paid: boolean) => void;
  isLoading?: boolean;
}

export function MembersTable({
  members,
  payments,
  onPaymentToggle,
  isLoading = false,
}: MembersTableProps): React.ReactNode {
  const getMemberPaymentStatus = (memberId: number): boolean => {
    const hasPaid = payments.some((payment) => {
      // Asegurar comparación con tipos correctos
      const paymentMemberId = Number(payment.memberId);
      const currentMemberId = Number(memberId);
      return paymentMemberId === currentMemberId;
    });

    return hasPaid;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="h-6 w-11 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden overflow-x-auto">
      <div className="min-w-full">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Miembro</span>
          <span className="text-sm font-semibold text-gray-700">
            Estado de Pago
          </span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {members.map((member) => {
            const isPaid = getMemberPaymentStatus(member.id);
            return (
              <div
                key={member.id}
                className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center"
              >
                {/* Member Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={isPaid}
                    onCheckedChange={(checked) =>
                      onPaymentToggle(member.id, checked)
                    }
                  />
                  <span
                    className={`text-xs font-medium ${
                      isPaid ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isPaid ? "Pagado" : "Pendiente"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
