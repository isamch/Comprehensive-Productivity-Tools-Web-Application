import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Edit3, Trash2, ExternalLink, Search } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
  tags: string[];
}

const BookmarksManager: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'general',
    tags: '',
  });

  useEffect(() => {
    const savedBookmarks = getFromLocalStorage<BookmarkItem[]>('bookmarks', []);
    setBookmarks(savedBookmarks);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('bookmarks', bookmarks);
    }
  }, [bookmarks, isLoaded]);

  const categories = ['all', ...new Set(bookmarks.map(b => b.category))];

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      category: 'general',
      tags: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const saveBookmark = () => {
    if (!formData.title.trim() || !formData.url.trim()) return;

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (editingId) {
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.id === editingId 
          ? { ...bookmark, ...formData, tags, updatedAt: new Date().toISOString() }
          : bookmark
      ));
    } else {
      const newBookmark: BookmarkItem = {
        id: Date.now().toString(),
        ...formData,
        tags,
        createdAt: new Date().toISOString(),
      };
      setBookmarks([newBookmark, ...bookmarks]);
    }
    
    resetForm();
  };

  const editBookmark = (bookmark: BookmarkItem) => {
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      category: bookmark.category,
      tags: bookmark.tags.join(', '),
    });
    setEditingId(bookmark.id);
    setShowForm(true);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bookmarks Manager</h2>
          <p className="text-gray-600">Organize your favorite websites and resources</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          <Plus size={20} className="mr-2" />
          Add Bookmark
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Bookmark' : 'Add New Bookmark'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bookmark title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the bookmark"
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
              onClick={saveBookmark}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingId ? 'Update' : 'Save'} Bookmark
            </button>
          </div>
        </div>
      )}

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{bookmark.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{bookmark.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bookmark.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {bookmark.category}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => editBookmark(bookmark)}
                  className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink size={16} className="mr-2" />
              Visit Website
            </a>
          </div>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No bookmarks found</p>
          <p className="text-sm mt-2">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Add your first bookmark to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksManager;