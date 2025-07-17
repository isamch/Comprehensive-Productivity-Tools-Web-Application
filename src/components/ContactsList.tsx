import React, { useState, useEffect } from 'react';
import { User, Plus, Edit3, Trash2, Phone, Mail, MapPin, Search } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  favorite: boolean;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    const savedContacts = getFromLocalStorage<Contact[]>('contacts', []);
    setContacts(savedContacts);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('contacts', contacts);
    }
  }, [contacts, isLoaded]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const saveContact = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setContacts(contacts.map(contact =>
        contact.id === editingId
          ? { ...contact, ...formData }
          : contact
      ));
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        favorite: false,
      };
      setContacts([newContact, ...contacts]);
    }

    resetForm();
  };

  const editContact = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes,
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setContacts(contacts.map(contact =>
      contact.id === id
        ? { ...contact, favorite: !contact.favorite }
        : contact
    ));
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    
    const matchesFavorites = !showFavorites || contact.favorite;
    
    return matchesSearch && matchesFavorites;
  });

  const favoriteContacts = contacts.filter(contact => contact.favorite);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
          <p className="text-gray-600">Manage your personal and professional contacts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          <Plus size={20} className="mr-2" />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{contacts.length}</div>
          <div className="text-sm opacity-90">Total Contacts</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{favoriteContacts.length}</div>
          <div className="text-sm opacity-90">Favorites</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{filteredContacts.length}</div>
          <div className="text-sm opacity-90">Filtered Results</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-3 rounded-lg transition-colors ${
            showFavorites
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⭐ Favorites Only
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="City, State, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
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
              onClick={saveContact}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingId ? 'Update' : 'Save'} Contact
            </button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => toggleFavorite(contact.id)}
                  className={`p-1 transition-colors ${
                    contact.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  ⭐
                </button>
                <button
                  onClick={() => editContact(contact)}
                  className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {contact.email && (
                <div className="flex items-center text-gray-600">
                  <Mail size={14} className="mr-2" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone size={14} className="mr-2" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin size={14} className="mr-2" />
                  <span className="truncate">{contact.address}</span>
                </div>
              )}
              {contact.notes && (
                <div className="text-gray-600 text-xs mt-2 p-2 bg-gray-50 rounded">
                  {contact.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <User size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No contacts found</p>
          <p className="text-sm mt-2">
            {searchTerm || showFavorites 
              ? 'Try adjusting your search or filters' 
              : 'Add your first contact to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactsList;