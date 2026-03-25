import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Status } from '../types';
import { TaskCard } from './TaskCard';

const columns: { status: Status; label: string }[] = [
  { status: 'To Do', label: 'To Do' },
  { status: 'In Progress', label: 'In Progress' },
  { status: 'In Review', label: 'In Review' },
  { status: 'Done', label: 'Done' },
];

export function KanbanView() {
  const { getFilteredTasks, updateTaskStatus, collaborators } = useStore();
  const tasks = getFilteredTasks();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);
  const [sourceColumn, setSourceColumn] = useState<Status | null>(null);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const dragImageRef = useRef<HTMLDivElement | null>(null);

  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col.status] = tasks.filter((task) => task.status === col.status);
    return acc;
  }, {} as Record<Status, typeof tasks>);

  const handleDragStart = (e: React.DragEvent, taskId: string, status: Status) => {
    setDraggedTaskId(taskId);
    setSourceColumn(status);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);

    if (e.dataTransfer.setDragImage && dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');

    if (taskId && targetStatus !== sourceColumn) {
      updateTaskStatus(taskId, targetStatus);
    }

    setDraggedTaskId(null);
    setDragOverColumn(null);
    setSourceColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    setSourceColumn(null);
  };

  const handleTouchStart = (e: React.TouchEvent, taskId: string, status: Status) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedTaskId(taskId);
    setSourceColumn(status);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedTaskId) return;
    e.preventDefault();

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const column = element?.closest('[data-column]');

    if (column) {
      const columnStatus = column.getAttribute('data-column') as Status;
      setDragOverColumn(columnStatus);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedTaskId) return;

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const column = element?.closest('[data-column]');

    if (column) {
      const targetStatus = column.getAttribute('data-column') as Status;
      if (targetStatus && targetStatus !== sourceColumn) {
        updateTaskStatus(draggedTaskId, targetStatus);
      }
    }

    setDraggedTaskId(null);
    setDragOverColumn(null);
    setSourceColumn(null);
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasksByStatus[column.status];
        const isDropTarget = dragOverColumn === column.status;

        return (
          <div
            key={column.status}
            data-column={column.status}
            className={`flex-1 min-w-[280px] bg-gray-50 rounded-lg p-4 transition-colors ${
              isDropTarget ? 'bg-blue-50 ring-2 ring-blue-300' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">{column.label}</h2>
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-0 overflow-y-auto max-h-[calc(100vh-250px)]">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <div className="mb-2 text-2xl">📋</div>
                  <p>No tasks in {column.label}</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id, column.status)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, task.id, column.status)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {draggedTaskId === task.id ? (
                      <TaskCard
                        task={task}
                        collaborators={collaborators}
                        isPlaceholder
                      />
                    ) : (
                      <TaskCard
                        task={task}
                        collaborators={collaborators}
                        isDragging={false}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      <div ref={dragImageRef} className="fixed -left-[9999px]" />
    </div>
  );
}
