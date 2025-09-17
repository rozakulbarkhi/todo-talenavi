import type { Task } from "../api/tasks";

export type ViewType = "main-table" | "kanban";

export interface NavigationItemType {
  value: ViewType;
  label: string;
  icon?: any;
}

export interface DeveloperType {
  developers: string[];
}

export interface RowSelectionConfig {
  onChange: (
    selectedRowKeys: (string | number)[],
    selectedRows: Task[]
  ) => void;
  onSelect: (record: Task, selected: boolean, selectedRows: Task[]) => void;
  onSelectAll: (
    selected: boolean,
    selectedRows: Task[],
    changeRows: Task[]
  ) => void;
}

export interface SegmentItem {
  value: string;
  count: number;
  percent: number;
  color: string;
}
