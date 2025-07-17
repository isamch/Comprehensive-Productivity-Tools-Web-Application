import React, { useState } from 'react';
import { Type, Copy, ArrowRight } from 'lucide-react';

const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const conversions = [
    {
      name: 'UPPERCASE',
      description: 'Convert all text to uppercase letters',
      convert: (text: string) => text.toUpperCase(),
      example: 'HELLO WORLD'
    },
    {
      name: 'lowercase',
      description: 'Convert all text to lowercase letters',
      convert: (text: string) => text.toLowerCase(),
      example: 'hello world'
    },
    {
      name: 'Title Case',
      description: 'Capitalize the first letter of each word',
      convert: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      example: 'Hello World'
    },
    {
      name: 'Sentence case',
      description: 'Capitalize only the first letter of each sentence',
      convert: (text: string) => text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      example: 'Hello world. This is a sentence.'
    },
    {
      name: 'camelCase',
      description: 'First word lowercase, subsequent words capitalized',
      convert: (text: string) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, ''),
      example: 'helloWorld'
    },
    {
      name: 'PascalCase',
      description: 'All words capitalized and joined together',
      convert: (text: string) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
        word.toUpperCase()
      ).replace(/\s+/g, ''),
      example: 'HelloWorld'
    },
    {
      name: 'snake_case',
      description: 'All lowercase with underscores between words',
      convert: (text: string) => text.toLowerCase().replace(/\s+/g, '_'),
      example: 'hello_world'
    },
    {
      name: 'kebab-case',
      description: 'All lowercase with hyphens between words',
      convert: (text: string) => text.toLowerCase().replace(/\s+/g, '-'),
      example: 'hello-world'
    },
    {
      name: 'SCREAMING_SNAKE_CASE',
      description: 'All uppercase with underscores between words',
      convert: (text: string) => text.toUpperCase().replace(/\s+/g, '_'),
      example: 'HELLO_WORLD'
    },
    {
      name: 'Reverse Case',
      description: 'Swap the case of each letter',
      convert: (text: string) => text.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      ).join(''),
      example: 'hELLO wORLD'
    },
    {
      name: 'Alternating Case',
      description: 'Alternate between uppercase and lowercase',
      convert: (text: string) => text.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join(''),
      example: 'hElLo WoRlD'
    },
    {
      name: 'Random Case',
      description: 'Randomly capitalize letters',
      convert: (text: string) => text.split('').map(char => 
        Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
      ).join(''),
      example: 'HeLLo WoRld'
    }
  ];

  const copyToClipboard = (text: string, conversionName: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(conversionName);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const clearText = () => {
    setInputText('');
  };

  const loadSampleText = () => {
    setInputText('Hello World! This is a sample text for case conversion.');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Type size={32} className="mr-3 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800">Case Converter</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Convert text between different case formats instantly
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Input Text</h3>
          <div className="flex space-x-2">
            <button
              onClick={loadSampleText}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={clearText}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here to convert between different cases..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>Characters: {inputText.length}</span>
          <span>Words: {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</span>
        </div>
      </div>

      {/* Conversions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conversions.map((conversion) => {
          const convertedText = inputText ? conversion.convert(inputText) : '';
          
          return (
            <div key={conversion.name} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{conversion.name}</h3>
                  <p className="text-sm text-gray-600">{conversion.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(convertedText, conversion.name)}
                  disabled={!convertedText}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy to clipboard"
                >
                  {copySuccess === conversion.name ? (
                    <span className="text-green-500 text-sm">Copied!</span>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Example:</div>
                  <div className="font-mono text-sm text-gray-700">{conversion.example}</div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Result:</div>
                  <div className="font-mono text-sm text-blue-800 break-all">
                    {convertedText || 'Enter text above to see result...'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setInputText(inputText.toUpperCase())}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border"
          >
            <ArrowRight size={16} className="mr-2" />
            To UPPER
          </button>
          <button
            onClick={() => setInputText(inputText.toLowerCase())}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border"
          >
            <ArrowRight size={16} className="mr-2" />
            To lower
          </button>
          <button
            onClick={() => setInputText(inputText.replace(/\w\S*/g, (txt) => 
              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            ))}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border"
          >
            <ArrowRight size={16} className="mr-2" />
            To Title
          </button>
          <button
            onClick={() => setInputText(inputText.split('').reverse().join(''))}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border"
          >
            <ArrowRight size={16} className="mr-2" />
            Reverse
          </button>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Usage Tips</h3>
        <ul className="space-y-2 text-yellow-700">
          <li>• Use camelCase for JavaScript variables and functions</li>
          <li>• Use PascalCase for class names and components</li>
          <li>• Use snake_case for Python variables and functions</li>
          <li>• Use kebab-case for CSS classes and URL slugs</li>
          <li>• Use SCREAMING_SNAKE_CASE for constants</li>
          <li>• Click any result to copy it to your clipboard</li>
        </ul>
      </div>
    </div>
  );
};

export default CaseConverter;