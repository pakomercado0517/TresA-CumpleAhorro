"use client";

import React from "react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "in-progress" | "completed";

interface EventsFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export function EventsFilters({
  activeFilter,
  onFilterChange,
  selectedYear,
  onYearChange,
}: EventsFiltersProps): React.ReactNode {
  const filters: Array<{ value: FilterType; label: string }> = [
    { value: "all", label: "Todos" },
    { value: "in-progress", label: "En curso" },
    { value: "completed", label: "Completados" },
  ];

  const currentYear = new Date().getFullYear();
  const isCurrentYearSelected = selectedYear === currentYear;

  const handleYearToggle = (): void => {
    if (isCurrentYearSelected) {
      onYearChange(null);
    } else {
      onYearChange(currentYear);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 md:hidden overflow-x-auto">
      {/* Filtro de Año - Primera opción */}
      <button
        type="button"
        onClick={handleYearToggle}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
          isCurrentYearSelected
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        Este Año ({currentYear})
      </button>
      {/* Resto de filtros */}
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            activeFilter === filter.value
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}





