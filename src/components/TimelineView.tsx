import { useStore } from '../store/useStore';
import { getMonthDateRange, getDaysInMonth } from '../utils/dateUtils';
import { Priority } from '../types';

const DAY_WIDTH = 40;

export function TimelineView() {
  const { getFilteredTasks } = useStore();
  const tasks = getFilteredTasks();

  const { start: monthStart, end: monthEnd } = getMonthDateRange();
  const daysInMonth = getDaysInMonth(monthStart);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const priorityColors: Record<Priority, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  };

  const getTaskPosition = (task: typeof tasks[0]) => {
    const startDate = task.startDate
      ? new Date(task.startDate)
      : new Date(task.dueDate);
    const endDate = new Date(task.dueDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const daysSinceMonthStart =
      Math.floor((startDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = task.startDate
      ? Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

    return {
      left: daysSinceMonthStart * DAY_WIDTH,
      width: duration * DAY_WIDTH,
      isVisible:
        startDate <= monthEnd && endDate >= monthStart,
    };
  };

  const todayPosition =
    Math.floor((today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) *
    DAY_WIDTH;

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-lg font-medium text-gray-600">No tasks to display</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <div style={{ minWidth: daysInMonth * DAY_WIDTH + 200 }}>
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 flex">
            <div className="w-48 px-4 py-3 font-medium text-sm text-gray-700 border-r border-gray-200">
              Task
            </div>
            <div className="flex">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(monthStart);
                date.setDate(date.getDate() + i);
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <div
                    key={i}
                    className={`px-2 py-3 text-center text-xs border-r border-gray-200 ${
                      isToday ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-600'
                    }`}
                    style={{ width: DAY_WIDTH }}
                  >
                    <div>{date.getDate()}</div>
                    <div className="text-gray-400">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            {tasks.map((task, index) => {
              const position = getTaskPosition(task);

              if (!position.isVisible) return null;

              return (
                <div
                  key={task.id}
                  className="flex border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="w-48 px-4 py-3 text-sm text-gray-900 border-r border-gray-200 truncate">
                    {task.title}
                  </div>
                  <div className="relative flex-1" style={{ height: 48 }}>
                    <div
                      className="absolute top-2 rounded px-2 py-1 text-xs text-white font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer truncate"
                      style={{
                        left: position.left,
                        width: Math.max(position.width, DAY_WIDTH),
                        backgroundColor: priorityColors[task.priority],
                      }}
                      title={`${task.title} - ${task.priority}`}
                    >
                      {task.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {todayPosition >= 0 && todayPosition <= daysInMonth * DAY_WIDTH && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 pointer-events-none z-20"
                style={{ left: todayPosition + 200 }}
              >
                <div className="absolute -top-6 -left-8 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                  Today
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
