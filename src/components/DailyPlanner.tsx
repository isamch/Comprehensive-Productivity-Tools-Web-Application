import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface PlannerItem {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<Record<string, PlannerItem[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'work',
  });

  const categories = ['work', 'personal', 'health', 'learning', 'social', 'other'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  useEffect(() => {
    const savedItems = getFromLocalStorage<Record<string, PlannerItem[]>>('dailyPlanner', {});
    setItems(savedItems);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('dailyPlanner', items);
    }
  }, [items, isLoaded]);

  const resetForm = () => {
    setFormData({
      time: '',
      title: '',
      description: '',
      priority: 'medium',
      category: 'work',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const saveItem = () => {
    if (!formData.time || !formData.title.trim()) return;

    const newItem: PlannerItem = {
      id: editingId || Date.now().toString(),
      ...formData,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => {
      const dateItems = prev[selectedDate] || [];
      
      if (editingId) {
        const updatedItems = dateItems.map(item => 
          item.id === editingId ? { ...item, ...formData } : item
        );
        return { ...prev, [selectedDate]: updatedItems };
      } else {
        return { ...prev, [selectedDate]: [...dateItems, newItem] };
      }
    });

    resetForm();
  };

  const editItem = (item: PlannerItem) => {
    setFormData({
      time: item.time,
      title: item.title,
      description: item.description,
      priority: item.priority,
      category: item.category,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const deleteItem = (id: string) => {
    setItems(prev => {
      const dateItems = prev[selectedDate] || [];
      return { ...prev, [selectedDate]: dateItems.filter(item => item.id !== id) };
    });
  };

  const toggleCompleted = (id: string) => {
    setItems(prev => {
      const dateItems = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: dateItems.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      };
    });
  };

  const currentItems = items[selectedDate] || [];
  const sortedItems = [...currentItems].sort((a, b) => a.time.localeCompare(b.time));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-purple-100 text-purple-800',
      health: 'bg-green-100 text-green-800',
      learning: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  const completedCount = currentItems.filter(item => item.completed).length;
  const totalCount = currentItems.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Planner</h2>
          <p className="text-gray-600">Plan your day hour by hour</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{totalCount}</div>
          <div className="text-sm opacity-90">Total Tasks</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-sm opacity-90">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{totalCount - completedCount}</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Task' : 'Add New Task'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingId ? 'Update' : 'Save'} Task
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Schedule for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {sortedItems.length > 0 ? (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start p-4 rounded-lg border transition-all duration-200 ${
                  item.completed
                    ? 'bg-green-50 border-green-200 opacity-75'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleCompleted(item.id)}
                  className={`mr-4 mt-1 transition-colors ${
                    item.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                  }`}
                >
                  <Check size={20} />
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span className="font-mono text-sm">{item.time}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  
                  <h4 className={`font-medium mb-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.title}
                  </h4>
                  
                  {item.description && (
                    <p className={`text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => editItem(item)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tasks scheduled for this day</p>
            <p className="text-sm mt-2">Add your first task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;