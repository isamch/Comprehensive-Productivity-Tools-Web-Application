import React, { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Clock, 
  Link, 
  Edit3, 
  Bookmark, 
  Calculator as CalcIcon, 
  ArrowLeftRight, 
  FileSearch, 
  Users, 
  ShoppingCart, 
  Timer, 
  Calendar, 
  Lightbulb, 
  Type,
  Menu,
  X,
  Home
} from 'lucide-react';

import HomePage from './components/HomePage';
import Notes from './components/Notes';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import URLShortener from './components/URLShortener';
import TextEditor from './components/TextEditor';
import BookmarksManager from './components/BookmarksManager';
import Calculator from './components/Calculator';
import UnitConverter from './components/UnitConverter';
import WordCounter from './components/WordCounter';
import ContactsList from './components/ContactsList';
import ShoppingList from './components/ShoppingList';
import Stopwatch from './components/Stopwatch';
import DailyPlanner from './components/DailyPlanner';
import ContentIdeasGenerator from './components/ContentIdeasGenerator';
import CaseConverter from './components/CaseConverter';

const tools = [
  { id: 'home', name: 'Home', icon: Home, component: HomePage },
  { id: 'notes', name: 'Notes', icon: FileText, component: Notes },
  { id: 'todo', name: 'To-Do List', icon: CheckSquare, component: TodoList },
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: Clock, component: PomodoroTimer },
  { id: 'url-shortener', name: 'URL Shortener', icon: Link, component: URLShortener },
  { id: 'text-editor', name: 'Text Editor', icon: Edit3, component: TextEditor },
  { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark, component: BookmarksManager },
  { id: 'calculator', name: 'Calculator', icon: CalcIcon, component: Calculator },
  { id: 'unit-converter', name: 'Unit Converter', icon: ArrowLeftRight, component: UnitConverter },
  { id: 'word-counter', name: 'Word Counter', icon: FileSearch, component: WordCounter },
  { id: 'contacts', name: 'Contacts', icon: Users, component: ContactsList },
  { id: 'shopping', name: 'Shopping List', icon: ShoppingCart, component: ShoppingList },
  { id: 'stopwatch', name: 'Stopwatch', icon: Timer, component: Stopwatch },
  { id: 'daily-planner', name: 'Daily Planner', icon: Calendar, component: DailyPlanner },
  { id: 'content-ideas', name: 'Content Ideas', icon: Lightbulb, component: ContentIdeasGenerator },
  { id: 'case-converter', name: 'Case Converter', icon: Type, component: CaseConverter },
];

function App() {
  const [activeToolId, setActiveToolId] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTool = tools.find(tool => tool.id === activeToolId);
  const ActiveComponent = activeTool?.component || HomePage;

  // Pass setActiveToolId to HomePage if it is the active component
  const mainContent = activeToolId === 'home'
    ? <HomePage setActiveToolId={setActiveToolId} />
    : <ActiveComponent />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            IC Productivity
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Your complete toolkit for internet productivity</p>
        </div>
        
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 h-full overflow-y-auto pb-20">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveToolId(tool.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center p-2 sm:p-3 rounded-xl transition-all duration-200 group text-left ${
                  activeToolId === tool.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={18} className="mr-2 sm:mr-3 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">{tool.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 xl:ml-80 min-h-screen">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header - Hidden on home page */}
            {activeToolId !== 'home' && (
              <div className="mb-6 sm:mb-8 mt-12 lg:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {activeTool?.name}
                </h2>
                <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            )}

            {/* Tool Component */}
            <div className={`${activeToolId === 'home' ? 'mt-12 lg:mt-0' : 'bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8'} min-h-[600px]`}>
              {mainContent}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;