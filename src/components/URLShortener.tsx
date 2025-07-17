import React, { useState, useEffect } from 'react';
import { Link, Copy, Trash2, ExternalLink } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

const URLShortener: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const savedUrls = getFromLocalStorage<ShortenedURL[]>('shortenedUrls', []);
    setUrls(savedUrls);
  }, []);

  useEffect(() => {
    setToLocalStorage('shortenedUrls', urls);
  }, [urls]);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const shortenUrl = () => {
    if (!inputUrl.trim()) return;

    const shortCode = customCode.trim() || generateShortCode();
    
    // Check if custom code already exists
    if (urls.some(url => url.shortCode === shortCode)) {
      alert('This short code already exists. Please choose a different one.');
      return;
    }

    const newUrl: ShortenedURL = {
      id: Date.now().toString(),
      originalUrl: inputUrl.trim(),
      shortCode,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    setUrls([newUrl, ...urls]);
    setInputUrl('');
    setCustomCode('');
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `https://short.ly/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess(shortCode);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const deleteUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const simulateClick = (id: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* URL Shortener Form */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-8 border border-blue-100">
        <div className="flex items-center mb-6">
          <Link size={32} className="mr-3 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">URL Shortener</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Short Code (optional)
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-custom-code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <button
            onClick={shortenUrl}
            disabled={!inputUrl.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Shorten URL
          </button>
        </div>
      </div>

      {/* URL List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Shortened URLs</h3>
        
        {urls.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Link size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No shortened URLs yet</p>
            <p className="text-sm text-gray-500 mt-2">Create your first short URL above</p>
          </div>
        ) : (
          urls.map((url) => (
            <div key={url.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="text-lg font-semibold text-blue-600">
                      https://short.ly/{url.shortCode}
                    </div>
                    <button
                      onClick={() => copyToClipboard(url.shortCode)}
                      className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </button>
                    {copySuccess === url.shortCode && (
                      <span className="ml-2 text-green-600 text-sm">Copied!</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <ExternalLink size={16} className="mr-2" />
                    <span className="truncate">{url.originalUrl}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                    <span>Clicks: {url.clicks}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => simulateClick(url.id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Simulate Click
                  </button>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default URLShortener;