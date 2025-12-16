"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MembersMobileControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const months = [
  { value: "", label: "Todos los meses" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "pending", label: "Pendientes" },
  { value: "inactive", label: "Inactivos" },
];

export function MembersMobileControls({
  searchQuery,
  onSearchChange,
  selectedMonth,
  onMonthChange,
  selectedStatus,
  onStatusChange,
}: MembersMobileControlsProps): React.ReactNode {
  return (
    <div className="mb-3 md:hidden space-y-2 w-full overflow-x-hidden">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre o grupo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-3 py-1.5 text-xs"
        />
      </div>

      {/* Month and Status Filters */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-2.5 py-1.5 pr-7 text-xs text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex-1 relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-2.5 py-1.5 pr-7 text-xs text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

