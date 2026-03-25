import { useStore } from '../store/useStore';
import { MultiSelect } from './MultiSelect';
import { X } from 'lucide-react';
import { users } from '../data/seedData';
import { Status, Priority } from '../types';

const statusOptions: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorityOptions: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const assigneeOptions = users.map((u) => u.name);

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useStore();

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    filters.dueDateFrom ||
    filters.dueDateTo;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-700">Filters:</span>

        <MultiSelect
          label="Status"
          options={statusOptions}
          selected={filters.status}
          onChange={(status) => setFilters({ status })}
        />

        <MultiSelect
          label="Priority"
          options={priorityOptions}
          selected={filters.priority}
          onChange={(priority) => setFilters({ priority })}
        />

        <MultiSelect
          label="Assignee"
          options={assigneeOptions}
          selected={filters.assignee}
          onChange={(assignee) => setFilters({ assignee })}
        />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dueDateFrom}
            onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={filters.dueDateTo}
            onChange={(e) => setFilters({ dueDateTo: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="To"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
