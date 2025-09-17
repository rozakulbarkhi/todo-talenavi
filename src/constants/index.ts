const STATUS_COLORS: Record<string, string> = {
  "Waiting for review": "#3b82f6",
  "Ready to start": "#ef4444",
  "In Progress": "#f97316",
  Done: "#22c55e",
  Stuck: "#6b7280",
  "Pending Deploy": "#a855f7",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#ef4444",
  Medium: "#3b82f6",
  Low: "#22c55e",
  "Best Effort": "#6b7280",
};

const TYPE_COLORS: Record<string, string> = {
  "Feature Enhancements": "#ec4899",
  Bug: "#ef4444",
  Other: "#a855f7",
};

export { STATUS_COLORS, PRIORITY_COLORS, TYPE_COLORS };
