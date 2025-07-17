import React, { useState, useEffect } from 'react';
import { FileText, Copy, BarChart3 } from 'lucide-react';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  averageWordsPerSentence: number;
  readingTime: number;
}

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    averageWordsPerSentence: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      if (!text) {
        setStats({
          characters: 0,
          charactersNoSpaces: 0,
          words: 0,
          sentences: 0,
          paragraphs: 0,
          averageWordsPerSentence: 0,
          readingTime: 0,
        });
        return;
      }

      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const averageWordsPerSentence = sentences > 0 ? words / sentences : 0;
      const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        averageWordsPerSentence,
        readingTime,
      });
    };

    calculateStats();
  }, [text]);

  const copyStats = () => {
    const statsText = `
Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Average words per sentence: ${stats.averageWordsPerSentence.toFixed(1)}
- Estimated reading time: ${stats.readingTime} minute${stats.readingTime !== 1 ? 's' : ''}
    `.trim();

    navigator.clipboard.writeText(statsText);
  };

  const clearText = () => {
    setText('');
  };

  const sampleText = `Paste your text here to analyze it. This tool will count words, characters, sentences, and paragraphs. It will also estimate reading time and provide additional statistics about your text.

You can use this for analyzing essays, articles, blog posts, or any other written content. The statistics update in real-time as you type or paste content.`;

  const loadSampleText = () => {
    setText(sampleText);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Text Input */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Text Input</h3>
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
              <button
                onClick={copyStats}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Copy statistics"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Characters</span>
                <span className="font-semibold text-gray-800">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Characters (no spaces)</span>
                <span className="font-semibold text-gray-800">{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words</span>
                <span className="font-semibold text-blue-600 text-lg">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sentences</span>
                <span className="font-semibold text-gray-800">{stats.sentences.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paragraphs</span>
                <span className="font-semibold text-gray-800">{stats.paragraphs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Advanced Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <BarChart3 size={20} className="mr-2 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Advanced</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. words/sentence</span>
                <span className="font-semibold text-gray-800">{stats.averageWordsPerSentence.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reading time</span>
                <span className="font-semibold text-green-600">
                  {stats.readingTime} min{stats.readingTime !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Visual Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Characters</span>
                  <span>{stats.characters}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{width: `${Math.min(100, (stats.characters / 1000) * 100)}%`}}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Words</span>
                  <span>{stats.words}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{width: `${Math.min(100, (stats.words / 200) * 100)}%`}}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sentences</span>
                  <span>{stats.sentences}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{width: `${Math.min(100, (stats.sentences / 20) * 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;