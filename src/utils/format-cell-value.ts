export const formatCellValue = (value: any, columnKey?: string): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if ((columnKey === "estimatedSp" || columnKey === "actualSp") && value < 0) {
    return "-";
  }

  if ((columnKey === "estimatedSp" || columnKey === "actualSp") && value >= 0) {
    return `${value} SP`;
  }

  if (columnKey === "date") {
    if (!value) return "-";
    return value;
  }

  return String(value);
};
