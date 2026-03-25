import { useStore } from './store/useStore';
import { KanbanView } from './components/KanbanView';
import { ListView } from './components/ListView';
import { TimelineView } from './components/TimelineView';
import { FilterBar } from './components/FilterBar';
import { CollaborationBar } from './components/CollaborationBar';
import { useUrlSync } from './hooks/useUrlSync';
import { useCollaboration } from './hooks/useCollaboration';
import { LayoutGrid, List, Calendar } from 'lucide-react';
import { ViewType } from './types';

function App() {
  const { currentView, setView } = useStore();

  useUrlSync();
  useCollaboration();

  const views: { type: ViewType; label: string; icon: typeof LayoutGrid }[] = [
    { type: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { type: 'list', label: 'List', icon: List },
    { type: 'timeline', label: 'Timeline', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Project Tracker</h1>
        </div>
      </header>

      <CollaborationBar />

      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex gap-2">
          {views.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                currentView === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <FilterBar />

      <main className="p-6">
        {currentView === 'kanban' && <KanbanView />}
        {currentView === 'list' && <ListView />}
        {currentView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}

export default App;
