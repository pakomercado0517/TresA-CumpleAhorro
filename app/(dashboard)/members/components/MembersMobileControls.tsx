"use client";

import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MembersMobileControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onFilterClick: () => void;
}

const months = [
  { value: "", label: "Todos los meses" },
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export function MembersMobileControls({
  searchQuery,
  onSearchChange,
  selectedMonth,
  onMonthChange,
  onFilterClick,
}: MembersMobileControlsProps): React.ReactNode {
  return (
    <div className="mb-3 md:hidden space-y-2 w-full overflow-x-hidden">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre, teléfono..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-3 py-1.5 text-xs"
        />
      </div>

      {/* Month Filter and Filter Button */}
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
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="p-1.5 h-auto"
          aria-label="Filtros"
        >
          <Filter className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

