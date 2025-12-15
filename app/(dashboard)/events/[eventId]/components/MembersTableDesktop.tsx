"use client";

import React from "react";
import Image from "next/image";
import { Upload, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Payment } from "@/types/dashboard";

interface Member {
  id: number;
  name: string;
  photoUrl?: string;
}

interface MembersTableDesktopProps {
  members: Array<Member>;
  payments: Array<Payment>;
  onPaymentToggle: (memberId: number, paid: boolean) => void;
  onViewProof?: (memberId: number) => void;
  onUploadProof?: (memberId: number) => void;
  isLoading?: boolean;
}

export function MembersTableDesktop({
  members,
  payments,
  onPaymentToggle,
  onViewProof,
  onUploadProof,
  isLoading = false,
}: MembersTableDesktopProps): React.ReactNode {
  const getMemberPayment = (memberId: number): Payment | undefined => {
    return payments.find((payment) => payment.memberId === memberId);
  };

  const getMemberPaymentStatus = (memberId: number): boolean => {
    return payments.some((payment) => payment.memberId === memberId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="h-6 w-11 bg-gray-200 rounded-full" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Miembro</span>
        <span className="text-sm font-semibold text-gray-700">
          Estado de Pago
        </span>
        <span className="text-sm font-semibold text-gray-700">
          Comprobante
        </span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {members.map((member) => {
          const isPaid = getMemberPaymentStatus(member.id);
          const payment = getMemberPayment(member.id);
          const hasProof = payment?.proofUrl !== undefined && payment.proofUrl !== "";

          return (
            <div
              key={member.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 items-center"
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
                <span className="text-sm font-medium text-gray-900">
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
                  className={`text-sm font-medium ${
                    isPaid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isPaid ? "Pagado" : "Pendiente"}
                </span>
              </div>

              {/* Proof Action */}
              <div className="flex-shrink-0">
                {isPaid && hasProof ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProof?.(member.id)}
                    className="text-[#22c55e] hover:text-[#16a34a] hover:bg-green-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                ) : isPaid ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUploadProof?.(member.id)}
                    className="text-[#22c55e] hover:text-[#16a34a] hover:bg-green-50"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Subir
                  </Button>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



