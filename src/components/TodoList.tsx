import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTodos = getFromLocalStorage<Todo[]>('todos', []);
    setTodos(savedTodos);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('todos', todos);
    }
  }, [todos, isLoaded]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority,
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold">{todos.length}</div>
          <div className="text-sm opacity-90">Total Tasks</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold">{completedCount}</div>
          <div className="text-sm opacity-90">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold">{todos.length - completedCount}</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
          />
          <div className="flex gap-2 sm:gap-4">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={addTodo}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center text-sm sm:text-base whitespace-nowrap"
            >
              <Plus size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm sm:text-base">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 sm:px-4 py-2 rounded-md capitalize transition-all duration-200 ${
                filter === filterType
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center p-3 sm:p-4 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`mr-3 sm:mr-4 transition-colors flex-shrink-0 ${
                todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              {todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span
                  className={`text-sm sm:text-base ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  } break-words`}
                >
                  {todo.text}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)} flex-shrink-0`}>
                    {todo.priority}
                  </span>
                  <div className="text-xs text-gray-500 sm:hidden">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                {new Date(todo.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 transition-colors ml-2 sm:ml-4 flex-shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-base sm:text-lg">No tasks {filter === 'all' ? '' : filter}</p>
          <p className="text-sm mt-2">
            {filter === 'all' ? 'Add a task to get started!' : `Switch to 'all' to see other tasks`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;