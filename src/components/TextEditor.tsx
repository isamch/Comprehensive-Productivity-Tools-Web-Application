import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Save, Download, Upload } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

const TextEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedContent = getFromLocalStorage<string>('textEditor_content', '');
    const savedTitle = getFromLocalStorage<string>('textEditor_title', '');
    setContent(savedContent);
    setTitle(savedTitle);
  }, []);

  useEffect(() => {
    setToLocalStorage('textEditor_content', content);
  }, [content]);

  useEffect(() => {
    setToLocalStorage('textEditor_title', title);
  }, [title]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const toggleBold = () => {
    execCommand('bold');
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    execCommand('italic');
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    execCommand('underline');
    setIsUnderline(!isUnderline);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const saveDocument = () => {
    const now = new Date().toISOString();
    const doc = {
      title: title || 'Untitled Document',
      content,
      savedAt: now,
    };
    
    const savedDocs = getFromLocalStorage<any[]>('textEditor_documents', []);
    savedDocs.unshift(doc);
    setToLocalStorage('textEditor_documents', savedDocs);
    
    alert('Document saved successfully!');
  };

  const downloadDocument = () => {
    const docTitle = title || 'Untitled Document';
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full mb-4"
        />
        
        {/* Toolbar */}
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border">
          <button
            onClick={toggleBold}
            className={`p-2 rounded-md transition-colors ${
              isBold ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bold size={20} />
          </button>
          
          <button
            onClick={toggleItalic}
            className={`p-2 rounded-md transition-colors ${
              isItalic ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Italic size={20} />
          </button>
          
          <button
            onClick={toggleUnderline}
            className={`p-2 rounded-md transition-colors ${
              isUnderline ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Underline size={20} />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            onClick={saveDocument}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
          
          <button
            onClick={downloadDocument}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Download
          </button>
          
          <label className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors cursor-pointer">
            <Upload size={16} className="mr-2" />
            Upload
            <input
              type="file"
              accept=".html,.txt"
              onChange={uploadDocument}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          className="min-h-96 p-6 outline-none"
          style={{ 
            minHeight: '400px',
            lineHeight: '1.6',
            fontSize: '16px',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Use the toolbar buttons to format your text. Your work is automatically saved locally.</p>
      </div>
    </div>
  );
};

export default TextEditor;