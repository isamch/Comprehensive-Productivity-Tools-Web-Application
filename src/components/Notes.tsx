import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedNotes = getFromLocalStorage<Note[]>('notes', []);
    setNotes(savedNotes);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToLocalStorage('notes', notes);
    }
  }, [notes, isLoaded]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      title: title || 'Untitled',
      content,
      updatedAt: new Date().toISOString(),
    };
    
    setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      <div className="lg:w-1/3 lg:pr-6 lg:border-r border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">All Notes</h3>
          <button
            onClick={createNewNote}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm sm:text-base"
          >
            <Plus size={16} className="mr-2" />
            New Note
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 lg:max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{note.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 lg:pl-6 mt-6 lg:mt-0">
        {selectedNote ? (
          <div className="h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl sm:text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full"
                    placeholder="Note title..."
                  />
                ) : (
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedNote.title}</h3>
                )}
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <button
                    onClick={saveNote}
                    className="flex items-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 sm:h-80 lg:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
                placeholder="Start writing your note..."
              />
            ) : (
              <div className="h-64 sm:h-80 lg:h-96 p-3 sm:p-4 bg-gray-50 rounded-lg overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm sm:text-base">
                  {content || 'No content yet. Click Edit to add content.'}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Edit3 size={64} className="mb-4" />
            <p className="text-lg sm:text-xl text-center">Select a note to view or edit</p>
            <p className="text-sm mt-2">Create a new note to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;