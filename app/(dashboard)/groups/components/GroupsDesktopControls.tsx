"use client";

import React from "react";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GroupsDesktopControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onExportClick: () => void;
}

export function GroupsDesktopControls({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onExportClick,
}: GroupsDesktopControlsProps): React.ReactNode {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre, estado o fecha..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        variant="outline"
        onClick={onFilterClick}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filtros
      </Button>
      <Button
        variant="outline"
        onClick={onExportClick}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
}




