export const validateTaskField = (field: string, value: any): string | null => {
  if (field === "title") {
    if (!value || value.trim().length === 0) {
      return "Title is required";
    }
    if (value.trim().length > 200) {
      return "Title must be less than 200 characters";
    }
  }

  if (field === "developer") {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return "Developer is required";
    }
  }

  if (field === "estimatedSp" || field === "actualSp") {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      return "Story points must be a positive number";
    }
    if (numValue > 100) {
      return "Story points must be less than 100";
    }
  }

  return null;
};
