import type { TaskResponse, Task } from "@/types/api/tasks";

export const normalizeTask = (raw: TaskResponse, idx: number): Task => ({
  id: String(raw.id ?? `${raw.title}-${idx}`),
  title: raw.title,
  developers: raw.developer
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  priority: raw.priority,
  status: raw.status,
  type: raw.type,
  date: raw.date,
  estimatedSp: Number(raw["Estimated SP"] ?? 0),
  actualSp: Number(raw["Actual SP"] ?? 0),
});
