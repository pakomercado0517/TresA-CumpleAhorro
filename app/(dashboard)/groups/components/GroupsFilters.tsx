"use client";

import React from "react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "active" | "completed" | "pending";

interface GroupsFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: Array<{ id: FilterType; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "completed", label: "Completados" },
  { id: "pending", label: "Pendientes" },
];

export function GroupsFilters({
  activeFilter,
  onFilterChange,
}: GroupsFiltersProps): React.ReactNode {
  return (
    <div className="mb-3 md:mb-6 flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-3 md:px-6 py-1.5 md:py-2.5 rounded-full text-xs md:text-base font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
