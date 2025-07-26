import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Bookmark, 
  Users, 
  Calendar,
  TrendingUp,
  Activity,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';
import { getFromLocalStorage } from '../utils/localStorage';

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

interface HomePageProps {
  setActiveToolId?: (toolId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveToolId }) => {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalTodos: 0,
    totalBookmarks: 0,
    totalContacts: 0,
    completedTodos: 0,
    totalShoppingItems: 0,
  });

  useEffect(() => {
    const notes = getFromLocalStorage<unknown[]>('notes', []);
    const todos = getFromLocalStorage<unknown[]>('todos', []);
    const bookmarks = getFromLocalStorage<unknown[]>('bookmarks', []);
    const contacts = getFromLocalStorage<unknown[]>('contacts', []);
    const shoppingList = getFromLocalStorage<unknown[]>('shoppingList', []);
    
    setStats({
      totalNotes: notes.length,
      totalTodos: todos.length,
      totalBookmarks: bookmarks.length,
      totalContacts: contacts.length,
      completedTodos: todos.filter((todo: unknown) => (todo as { completed?: boolean }).completed).length,
      totalShoppingItems: shoppingList.length,
    });

    const activities: RecentActivity[] = [];

    notes.slice(0, 3).forEach((note: unknown) => {
      const n = note as { id: string; title?: string; updatedAt: string };
      activities.push({
        id: `note-${n.id}`,
        type: 'note',
        title: n.title || 'Untitled Note',
        description: `Updated ${new Date(n.updatedAt).toLocaleDateString()}`,
        timestamp: n.updatedAt,
        icon: <FileText size={16} />, 
        color: 'bg-blue-100 text-blue-600'
      });
    });

    todos.slice(0, 3).forEach((todo: unknown) => {
      const t = todo as { id: string; text: string; completed: boolean; createdAt: string };
      activities.push({
        id: `todo-${t.id}`,
        type: 'todo',
        title: t.text,
        description: t.completed ? 'Completed' : 'Pending',
        timestamp: t.createdAt,
        icon: <CheckSquare size={16} />, 
        color: t.completed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
      });
    });

    bookmarks.slice(0, 2).forEach((bookmark: unknown) => {
      const b = bookmark as { id: string; title: string; createdAt: string };
      activities.push({
        id: `bookmark-${b.id}`,
        type: 'bookmark',
        title: b.title,
        description: `Added ${new Date(b.createdAt).toLocaleDateString()}`,
        timestamp: b.createdAt,
        icon: <Bookmark size={16} />, 
        color: 'bg-purple-100 text-purple-600'
      });
    });

    contacts.slice(0, 2).forEach((contact: unknown) => {
      const c = contact as { id: string; name: string; createdAt: string };
      activities.push({
        id: `contact-${c.id}`,
        type: 'contact',
        title: c.name,
        description: `Added ${new Date(c.createdAt).toLocaleDateString()}`,
        timestamp: c.createdAt,
        icon: <Users size={16} />, 
        color: 'bg-indigo-100 text-indigo-600'
      });
    });

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivities(activities.slice(0, 8));
  }, []);

  const quickActions = [
    {
      name: 'Create Note',
      description: 'Start writing',
      icon: <FileText size={20} />,
      color: 'from-blue-500 to-blue-600',
      action: () => setActiveToolId && setActiveToolId('notes')
    },
    {
      name: 'Add Todo',
      description: 'Track tasks',
      icon: <CheckSquare size={20} />,
      color: 'from-green-500 to-green-600',
      action: () => setActiveToolId && setActiveToolId('todo')
    },
    {
      name: 'Save Bookmark',
      description: 'Save links',
      icon: <Bookmark size={20} />,
      color: 'from-purple-500 to-purple-600',
      action: () => setActiveToolId && setActiveToolId('bookmarks')
    },
    {
      name: 'Plan Day',
      description: 'Schedule time',
      icon: <Calendar size={20} />,
      color: 'from-orange-500 to-orange-600',
      action: () => setActiveToolId && setActiveToolId('daily-planner')
    }
  ];

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center py-8 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            {currentTime}
          </div>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">{currentDate}</p>
          <p className="text-sm sm:text-base text-gray-500">Welcome back to your productivity suite</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full inline-flex">
          <Zap size={16} />
          <span className="text-sm font-medium">All systems operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.totalNotes}</div>
          <div className="text-xs sm:text-sm opacity-90">Notes</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.totalTodos}</div>
          <div className="text-xs sm:text-sm opacity-90">Tasks</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.totalBookmarks}</div>
          <div className="text-xs sm:text-sm opacity-90">Bookmarks</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.totalContacts}</div>
          <div className="text-xs sm:text-sm opacity-90">Contacts</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.completedTodos}</div>
          <div className="text-xs sm:text-sm opacity-90">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats.totalShoppingItems}</div>
          <div className="text-xs sm:text-sm opacity-90">Shopping</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <Zap size={24} className="mr-3 text-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 sm:p-6 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 p-3 bg-white bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-200">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">{action.name}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Activity size={24} className="mr-3 text-blue-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.color} mr-4 flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No recent activity</p>
              <p className="text-sm mt-2">Start using the tools to see your activity here</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <Star size={24} className="mr-3 text-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Productivity Tips</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🍅 Use the Pomodoro Technique</h3>
              <p className="text-sm text-blue-700">Work in 25-minute focused sessions with 5-minute breaks to maintain high productivity.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">📝 Capture Everything</h3>
              <p className="text-sm text-green-700">Use the Notes tool to quickly capture ideas, thoughts, and important information.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">📅 Plan Your Day</h3>
              <p className="text-sm text-purple-700">Use the Daily Planner to schedule your tasks and maintain a structured routine.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">🔖 Organize Resources</h3>
              <p className="text-sm text-orange-700">Keep your important links organized with the Bookmarks Manager for quick access.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Built with ❤️ for productivity enthusiasts</p>
        <p className="text-xs mt-2">All data is stored locally in your browser</p>
      </div>
    </div>
  );
};

export default HomePage;