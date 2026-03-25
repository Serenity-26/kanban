import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { users } from '../data/seedData';
import { CollaboratorPresence } from '../types';

export function useCollaboration() {
  const { tasks, setCollaborators } = useStore();

  useEffect(() => {
    const simulatedUsers = users.slice(0, 4);
    const collaborators: CollaboratorPresence[] = [];

    simulatedUsers.forEach((user, index) => {
      if (tasks.length > 0) {
        const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 50))];
        collaborators.push({
          userId: user.id,
          taskId: randomTask.id,
          userName: user.name,
          color: user.color,
        });
      }
    });

    setCollaborators(collaborators);

    const interval = setInterval(() => {
      const newCollaborators: CollaboratorPresence[] = [];

      simulatedUsers.forEach((user) => {
        if (Math.random() > 0.3 && tasks.length > 0) {
          const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 100))];
          newCollaborators.push({
            userId: user.id,
            taskId: randomTask.id,
            userName: user.name,
            color: user.color,
          });
        }
      });

      setCollaborators(newCollaborators);
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, setCollaborators]);
}
