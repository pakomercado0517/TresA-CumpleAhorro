"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GroupsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function GroupsSearch({
  searchQuery,
  onSearchChange,
}: GroupsSearchProps): React.ReactNode {
  return (
    <div className="mb-3 md:mb-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar grupos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 md:pl-10 pr-4 py-2 md:py-3 w-full text-sm md:text-base"
        />
      </div>
    </div>
  );
}
