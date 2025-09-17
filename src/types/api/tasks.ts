export type Priority = "Critical" | "High" | "Medium" | "Low" | "Best Effort";
export type Status =
  | "In Progress"
  | "Ready to start"
  | "Waiting for review"
  | "Done"
  | "Stuck"
  | "Pending Deploy";
export type TaskType = "Feature Enhancements" | "Bug" | "Other";

export interface TaskRequest {
  title: string;
  developer: string;
  priority: Priority;
  status: Status;
  type: TaskType;
  estimatedSp: number;
  actualSp: number;
  date?: string;
}

export interface TaskResponse {
  id?: string | number;
  title: string;
  developer: string;
  priority: Priority;
  status: Status;
  type: TaskType;
  date?: string;
  "Estimated SP": number;
  "Actual SP": number;
}

export type Task = {
  id: string;
  title: string;
  developers: string[];
  priority: Priority;
  status: Status;
  type: TaskType;
  date?: string;
  estimatedSp: number;
  actualSp: number;
};
