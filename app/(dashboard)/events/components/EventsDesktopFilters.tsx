"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "in-progress" | "completed";
type SortType = "date-asc" | "date-desc" | "name-asc" | "name-desc";

interface EventsDesktopFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

export function EventsDesktopFilters({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}: EventsDesktopFiltersProps): React.ReactNode {
  const filters: Array<{ value: FilterType; label: string }> = [
    { value: "all", label: "Todos" },
    { value: "in-progress", label: "En curso" },
    { value: "completed", label: "Completados" },
  ];

  const sortOptions: Array<{ value: SortType; label: string }> = [
    { value: "date-asc", label: "Fecha (Más próximos)" },
    { value: "date-desc", label: "Fecha (Más lejanos)" },
    { value: "name-asc", label: "Nombre (A-Z)" },
    { value: "name-desc", label: "Nombre (Z-A)" },
  ];

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeFilter === filter.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordenar por:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}



