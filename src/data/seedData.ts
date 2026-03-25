import { Task, User, Priority, Status } from '../types';

const taskTitles = [
  'Implement user authentication',
  'Design landing page',
  'Fix mobile responsive issues',
  'Optimize database queries',
  'Write API documentation',
  'Refactor legacy code',
  'Add error handling',
  'Create unit tests',
  'Update dependencies',
  'Review pull requests',
  'Configure CI/CD pipeline',
  'Implement search functionality',
  'Add dark mode support',
  'Optimize image loading',
  'Fix security vulnerabilities',
  'Implement pagination',
  'Add export functionality',
  'Create admin dashboard',
  'Implement real-time updates',
  'Add email notifications',
  'Optimize build process',
  'Add analytics tracking',
  'Implement caching',
  'Fix cross-browser issues',
  'Add accessibility features',
  'Create user onboarding flow',
  'Implement data validation',
  'Add file upload feature',
  'Optimize API performance',
  'Create mobile app version',
];

export const users: User[] = [
  { id: 'u1', name: 'Alex Chen', color: '#3b82f6' },
  { id: 'u2', name: 'Sarah Miller', color: '#8b5cf6' },
  { id: 'u3', name: 'Jordan Smith', color: '#ec4899' },
  { id: 'u4', name: 'Morgan Davis', color: '#10b981' },
  { id: 'u5', name: 'Taylor Brown', color: '#f59e0b' },
  { id: 'u6', name: 'Casey Wilson', color: '#06b6d4' },
];

const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export function generateTasks(count: number = 500): Task[] {
  const tasks: Task[] = [];
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 60);
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + 60);

  for (let i = 0; i < count; i++) {
    const dueDate = randomDate(pastDate, futureDate);
    const dueDateObj = new Date(dueDate);
    const hasStartDate = Math.random() > 0.1;

    let startDate: string | null = null;
    if (hasStartDate) {
      const startDateObj = new Date(dueDateObj);
      startDateObj.setDate(startDateObj.getDate() - Math.floor(Math.random() * 14));
      startDate = startDateObj.toISOString().split('T')[0];
    }

    const createdAt = new Date(today);
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));

    tasks.push({
      id: `task-${i + 1}`,
      title: `${randomElement(taskTitles)} #${i + 1}`,
      assignee: randomElement(users).name,
      priority: randomElement(priorities),
      status: randomElement(statuses),
      startDate,
      dueDate,
      createdAt: createdAt.toISOString().split('T')[0],
    });
  }

  return tasks;
}

export const seedTasks = generateTasks(500);
