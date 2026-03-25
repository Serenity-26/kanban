import { create } from 'zustand';
import { Task, ViewType, Filters, CollaboratorPresence, Status, Priority } from '../types';
import { seedTasks } from '../data/seedData';

interface AppState {
  tasks: Task[];
  currentView: ViewType;
  filters: Filters;
  collaborators: CollaboratorPresence[];
  sortBy: 'title' | 'priority' | 'dueDate' | null;
  sortDirection: 'asc' | 'desc';

  setView: (view: ViewType) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setSortBy: (sortBy: 'title' | 'priority' | 'dueDate') => void;
  setCollaborators: (collaborators: CollaboratorPresence[]) => void;
  getFilteredTasks: () => Task[];
}

const defaultFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
  dueDateFrom: '',
  dueDateTo: '',
};

export const useStore = create<AppState>((set, get) => ({
  tasks: seedTasks,
  currentView: 'kanban',
  filters: defaultFilters,
  collaborators: [],
  sortBy: null,
  sortDirection: 'asc',

  setView: (view) => set({ currentView: view }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),

  setSortBy: (newSortBy) =>
    set((state) => {
      const newDirection =
        state.sortBy === newSortBy && state.sortDirection === 'asc'
          ? 'desc'
          : 'asc';
      return {
        sortBy: newSortBy,
        sortDirection: newDirection,
      };
    }),

  setCollaborators: (collaborators) => set({ collaborators }),

  getFilteredTasks: () => {
    const { tasks, filters, sortBy, sortDirection } = get();

    let filtered = tasks.filter((task) => {
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) {
        return false;
      }
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) {
        return false;
      }
      if (filters.dueDateTo && task.dueDate > filters.dueDateTo) {
        return false;
      }
      return true;
    });

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === 'priority') {
          const priorityOrder: Record<Priority, number> = {
            'Critical': 0,
            'High': 1,
            'Medium': 2,
            'Low': 3,
          };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortBy === 'dueDate') {
          comparison = a.dueDate.localeCompare(b.dueDate);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  },
}));
