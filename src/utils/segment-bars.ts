import { PRIORITY_COLORS, STATUS_COLORS, TYPE_COLORS } from "@/constants";

import type { Task } from "@/types/api/tasks";

import type { SegmentItem } from "@/types/components";

const getColorMap = (
  field: keyof Pick<Task, "priority" | "status" | "type">
): Record<string, string> => {
  switch (field) {
    case "status":
      return STATUS_COLORS;
    case "priority":
      return PRIORITY_COLORS;
    case "type":
      return TYPE_COLORS;
    default:
      return {};
  }
};

export const calculateSegments = (
  tasks: Task[],
  field: keyof Pick<Task, "priority" | "status" | "type">,
  colors?: Record<string, string>
): SegmentItem[] => {
  if (!tasks.length) return [];

  const counts: Record<string, number> = {};
  const totalTasks = tasks.length;
  const colorMap = colors || getColorMap(field);

  tasks.forEach((task) => {
    const value = task[field];
    counts[value] = (counts[value] || 0) + 1;
  });

  const segments = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
    percent: (count / totalTasks) * 100,
    color: colorMap[value] || "#6b7280",
  }));

  return segments;
};

export const getSegmentBarStyles = () => ({
  display: "flex",
  width: "100%",
  height: "16px",
  overflow: "hidden",
  borderRadius: "6px",
  backgroundColor: "white",
});

export const getSegmentStyles = (
  segment: SegmentItem,
  index: number,
  total: number
) => ({
  width: `${segment.percent}%`,
  backgroundColor: segment.color,
  borderTopLeftRadius: index === 0 ? "6px" : "0",
  borderBottomLeftRadius: index === 0 ? "6px" : "0",
  borderTopRightRadius: index === total - 1 ? "6px" : "0",
  borderBottomRightRadius: index === total - 1 ? "6px" : "0",
});
