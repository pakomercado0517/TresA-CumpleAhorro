"use client";

import React from "react";
import { GroupCard } from "./GroupCard";
import type { GroupListItem } from "@/types/groups";

interface GroupsListProps {
  groups: Array<GroupListItem>;
  isLoading: boolean;
  activeGroupsCount: number;
  onEditGroup?: (group: GroupListItem) => void;
  onDeleteGroup?: (group: GroupListItem) => void;
}

export function GroupsList({
  groups,
  isLoading,
  activeGroupsCount,
  onEditGroup,
  onDeleteGroup,
}: GroupsListProps): React.ReactNode {
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="mt-6 md:mt-8 text-center py-12 md:py-16">
        <p className="text-base md:text-lg text-gray-500">
          No se encontraron grupos
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-8">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
        <h2 className="text-base md:text-xl font-semibold text-gray-900">
          Grupos Activos
        </h2>
        <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#22c55e] flex items-center justify-center">
          <span className="text-xs md:text-sm font-bold text-white">
            {activeGroupsCount}
          </span>
        </div>
      </div>
      <div className="space-y-2 md:space-y-4">
        {groups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group}
            onEdit={onEditGroup}
            onDelete={onDeleteGroup}
          />
        ))}
      </div>
    </div>
  );
}
