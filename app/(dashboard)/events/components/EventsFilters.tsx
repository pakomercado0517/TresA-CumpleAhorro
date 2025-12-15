"use client";

import React from "react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "in-progress" | "completed";

interface EventsFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function EventsFilters({
  activeFilter,
  onFilterChange,
}: EventsFiltersProps): React.ReactNode {
  const filters: Array<{ value: FilterType; label: string }> = [
    { value: "all", label: "Todos" },
    { value: "in-progress", label: "En curso" },
    { value: "completed", label: "Completados" },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-3 md:hidden overflow-x-auto">
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



