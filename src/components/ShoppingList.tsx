import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, Trash2, Edit3, X } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
  price?: number;
  notes?: string;
  createdAt: string;
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'pcs',
    category: 'grocery',
    price: '',
    notes: '',
  });

  const categories = [
    'grocery', 'dairy', 'meat', 'produce', 'bakery', 'household', 'personal care', 'other'
  ];

  const units = ['pcs', 'kg', 'g', 'l', 'ml', 'dozen', 'pack', 'bottle', 'can', 'box'];

  useEffect(() => {
    const savedItems = getFromLocalStorage<ShoppingItem[]>('shoppingList', []);
    setItems(savedItems);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('shoppingList', items);
    }
  }, [items, isLoaded]);

  const quickAddItem = () => {
    if (newItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem.trim(),
        quantity: 1,
        unit: 'pcs',
        category: 'grocery',
        purchased: false,
        createdAt: new Date().toISOString(),
      };
      setItems([item, ...items]);
      setNewItem('');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: 'pcs',
      category: 'grocery',
      price: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const saveItem = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setItems(items.map(item =>
        item.id === editingId
          ? {
              ...item,
              ...formData,
              price: formData.price ? parseFloat(formData.price) : undefined,
            }
          : item
      ));
    } else {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        purchased: false,
        createdAt: new Date().toISOString(),
      };
      setItems([newItem, ...items]);
    }

    resetForm();
  };

  const editItem = (item: ShoppingItem) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      price: item.price?.toString() || '',
      notes: item.notes || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const togglePurchased = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.purchased));
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const purchasedItems = filteredItems.filter(item => item.purchased);
  const unpurchasedItems = filteredItems.filter(item => !item.purchased);

  const totalPrice = items
    .filter(item => item.purchased && item.price)
    .reduce((sum, item) => sum + (item.price! * item.quantity), 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      grocery: 'bg-green-100 text-green-800',
      dairy: 'bg-blue-100 text-blue-800',
      meat: 'bg-red-100 text-red-800',
      produce: 'bg-yellow-100 text-yellow-800',
      bakery: 'bg-orange-100 text-orange-800',
      household: 'bg-purple-100 text-purple-800',
      'personal care': 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
          <p className="text-gray-600">Keep track of your shopping items</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          <Plus size={20} className="mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{items.length}</div>
          <div className="text-sm opacity-90">Total Items</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{purchasedItems.length}</div>
          <div className="text-sm opacity-90">Purchased</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{unpurchasedItems.length}</div>
          <div className="text-sm opacity-90">Remaining</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
          <div className="text-sm opacity-90">Total Spent</div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && quickAddItem()}
            placeholder="Quick add item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={quickAddItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Brand, size, etc."
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
              {editingId ? 'Update' : 'Save'} Item
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {purchasedItems.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearCompleted}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Clear Completed
          </button>
        </div>
      )}

      {/* Shopping Items */}
      <div className="space-y-4">
        {/* Unpurchased Items */}
        {unpurchasedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Shopping List ({unpurchasedItems.length})
            </h3>
            <div className="space-y-2">
              {unpurchasedItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => togglePurchased(item.id)}
                    className="mr-4 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                      {item.price && <span className="ml-2">${(item.price * item.quantity).toFixed(2)}</span>}
                      {item.notes && <span className="ml-2 italic">({item.notes})</span>}
                    </div>
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
          </div>
        )}

        {/* Purchased Items */}
        {purchasedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Purchased ({purchasedItems.length})
            </h3>
            <div className="space-y-2">
              {purchasedItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg opacity-75"
                >
                  <button
                    onClick={() => togglePurchased(item.id)}
                    className="mr-4 text-green-500 hover:text-gray-400 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 line-through">{item.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                      {item.price && <span className="ml-2">${(item.price * item.quantity).toFixed(2)}</span>}
                      {item.notes && <span className="ml-2 italic">({item.notes})</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No items in your shopping list</p>
          <p className="text-sm mt-2">Add items to start shopping!</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;