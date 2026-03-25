export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type ViewType = 'kanban' | 'list' | 'timeline';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  status: Status;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface CollaboratorPresence {
  userId: string;
  taskId: string;
  userName: string;
  color: string;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumn: Status | null;
  currentColumn: Status | null;
}
