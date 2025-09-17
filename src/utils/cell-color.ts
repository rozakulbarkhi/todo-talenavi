import { STATUS_COLORS, PRIORITY_COLORS, TYPE_COLORS } from "@/constants";

const hexToTailwindClass = (hex: string): string => {
  const colorMap: Record<string, string> = {
    "#3b82f6": "bg-blue-500",
    "#ef4444": "bg-red-500",
    "#f97316": "bg-orange-500",
    "#22c55e": "bg-green-500",
    "#6b7280": "bg-gray-500",
    "#a855f7": "bg-purple-500",
    "#dc2626": "bg-red-600",
    "#ec4899": "bg-pink-500",
  };
  return colorMap[hex] || "bg-gray-400";
};

export const getStatusColor = (status: string): string => {
  const hex = STATUS_COLORS[status];
  return hex ? hexToTailwindClass(hex) : "bg-gray-400";
};

export const getTypeColor = (type: string): string => {
  const hex = TYPE_COLORS[type];
  return hex ? hexToTailwindClass(hex) : "bg-gray-400";
};

export const getPriorityColor = (priority: string): string => {
  const hex = PRIORITY_COLORS[priority];
  return hex ? hexToTailwindClass(hex) : "bg-gray-400";
};
