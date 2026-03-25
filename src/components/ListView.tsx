
import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

const ROW_HEIGHT = 60;
const BUFFER_ROWS = 5;

export function ListView() {
  const { getFilteredTasks, updateTaskStatus, sortBy, setSortBy, sortDirection } = useStore();
  const tasks = getFilteredTasks();

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const totalHeight = tasks.length * ROW_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
  const endIndex = Math.min(
    tasks.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_ROWS
  );

  const visibleTasks = tasks.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-lg font-medium text-gray-600">No tasks found</p>
        <p className="text-sm mt-2">Try adjusting your filters</p>
        <button
          onClick={() => useStore.getState().clearFilters()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Single table with fixed header */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-auto"
        style={{ height: 'calc(100vh - 300px)' }}
      >
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th
                className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('title')}
              >
                <div className="flex items-center gap-2">
                  Task
                  <SortIcon column="title" sortBy={sortBy} sortDirection={sortDirection} />
                </div>
              </th>
              <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th
                className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('priority')}
              >
                <div className="flex items-center gap-2">
                  Priority
                  <SortIcon column="priority" sortBy={sortBy} sortDirection={sortDirection} />
                </div>
              </th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('dueDate')}
              >
                <div className="flex items-center gap-2">
                  Due Date
                  <SortIcon column="dueDate" sortBy={sortBy} sortDirection={sortDirection} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Spacer row for virtualization */}
            <tr style={{ height: offsetY }}>
              <td colSpan={5} />
            </tr>
            {visibleTasks.map((task) => {
              const assigneeUser = users.find((u) => u.name === task.assignee);
              const overdue = isOverdue(task.dueDate);

              return (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                  style={{ height: ROW_HEIGHT }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {assigneeUser && (
                        <Avatar name={task.assignee} color={assigneeUser.color} size="sm" />
                      )}
                      <span className="text-sm text-gray-700 truncate">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        overdue ? 'text-red-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {formatDueDate(task.dueDate)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Bottom spacer */}
            <tr style={{ height: totalHeight - offsetY - visibleTasks.length * ROW_HEIGHT }}>
              <td colSpan={5} />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm text-gray-600">
        Showing {tasks.length} tasks
      </div>
    </div>
  );
}