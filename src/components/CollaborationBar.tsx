import { useStore } from '../store/useStore';
import { Avatar } from './Avatar';

export function CollaborationBar() {
  const { collaborators } = useStore();

  const uniqueUsers = Array.from(
    new Map(collaborators.map((c) => [c.userId, c])).values()
  );

  if (uniqueUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex -space-x-2">
        {uniqueUsers.slice(0, 3).map((user) => (
          <div
            key={user.userId}
            className="relative transition-transform hover:scale-110"
            title={user.userName}
          >
            <Avatar name={user.userName} color={user.color} size="sm" />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"
              title="Active"
            />
          </div>
        ))}
        {uniqueUsers.length > 3 && (
          <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-medium text-white border-2 border-white">
            +{uniqueUsers.length - 3}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600">
        {uniqueUsers.length} {uniqueUsers.length === 1 ? 'person is' : 'people are'} viewing this
        board
      </span>
    </div>
  );
}
