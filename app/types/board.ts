export type Priority = 'High' | 'Medium' | 'Low' | string; // Allow string for flexibility from CSV
export type Status = 'To Do' | 'In Progress' | 'Done' | string; // Allow string for flexibility from CSV

export interface Task {
  id: string;
  name: string; // Corresponds to 'Name' in CSV
  assignees: string[]; // Multiple person assignment
  status: Status;
  priority?: Priority;
  // We can add other fields like 'subitems' or 'mondayDocV2' later if needed
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
} 