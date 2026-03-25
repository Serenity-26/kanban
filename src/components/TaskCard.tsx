import { Task, CollaboratorPresence } from '../types';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';
import { formatDueDate, isOverdue } from '../utils/dateUtils';
import { users } from '../data/seedData';

interface TaskCardProps {
  task: Task;
  collaborators: CollaboratorPresence[];
  isDragging?: boolean;
  isPlaceholder?: boolean;
}

export function TaskCard({ task, collaborators, isDragging, isPlaceholder }: TaskCardProps) {
  const taskCollaborators = collaborators.filter((c) => c.taskId === task.id);
  const assigneeUser = users.find((u) => u.name === task.assignee);
  const overdue = isOverdue(task.dueDate);

  if (isPlaceholder) {
    return (
      <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 mb-3">
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${isDragging ? 'opacity-50 shadow-lg' : ''
        }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {assigneeUser && <Avatar name={task.assignee} color={assigneeUser.color} size="sm" />}
          {taskCollaborators.length > 0 && (
            <div className="flex -space-x-2">
              {taskCollaborators.slice(0, 2).map((collab) => (
                <div
                  key={collab.userId}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white transition-all duration-300 ease-in-out hover:scale-110"
                  style={{ backgroundColor: collab.color }}
                  title={`${collab.userName} is viewing`}
                >
                  👁
                </div>
              ))}
              {taskCollaborators.length > 2 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-medium text-white">
                  +{taskCollaborators.length - 2}
                </div>
              )}
            </div>
          )}
        </div>

        <span
          className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}
        >
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}
