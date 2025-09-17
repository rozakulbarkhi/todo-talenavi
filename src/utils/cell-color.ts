export const getStatusColor = (status: string) => {
  switch (status) {
    case "Waiting for review":
      return "bg-blue-500";
    case "Ready to start":
      return "bg-red-500";
    case "In Progress":
      return "bg-orange-500";
    case "Done":
      return "bg-green-500";
    case "Stuck":
      return "bg-gray-500";
    case "Pending Deploy":
      return "bg-purple-500";
    default:
      return "bg-gray-400";
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "Feature Enhancements":
      return "bg-pink-500";
    case "Bug":
      return "bg-red-500";
    case "Other":
      return "bg-purple-500";
    default:
      return "bg-gray-400";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-600";
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-blue-500";
    case "Low":
      return "bg-green-500";
    case "Best Effort":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};
