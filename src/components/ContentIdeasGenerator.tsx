import React, { useState, useEffect } from 'react';
import { Lightbulb, Copy, Shuffle, Star, Search } from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

const ContentIdeasGenerator: React.FC = () => {
  const [ideas] = useState<ContentIdea[]>([
    {
      id: '1',
      title: 'How to Build a Morning Routine',
      description: 'Create a comprehensive guide on establishing and maintaining a productive morning routine.',
      category: 'lifestyle',
      difficulty: 'beginner',
      tags: ['productivity', 'health', 'habits']
    },
    {
      id: '2',
      title: 'JavaScript ES6 Features Explained',
      description: 'Deep dive into modern JavaScript features like arrow functions, destructuring, and async/await.',
      category: 'programming',
      difficulty: 'intermediate',
      tags: ['javascript', 'es6', 'web development']
    },
    {
      id: '3',
      title: 'The Psychology of Color in Design',
      description: 'Explore how different colors affect user behavior and emotions in design.',
      category: 'design',
      difficulty: 'intermediate',
      tags: ['psychology', 'ui/ux', 'branding']
    },
    {
      id: '4',
      title: 'Investing for Beginners',
      description: 'A complete guide to getting started with investing, including risk management and portfolio basics.',
      category: 'finance',
      difficulty: 'beginner',
      tags: ['investing', 'money', 'retirement']
    },
    {
      id: '5',
      title: 'Building Microservices with Node.js',
      description: 'Learn how to architect and implement microservices using Node.js and Docker.',
      category: 'programming',
      difficulty: 'advanced',
      tags: ['microservices', 'nodejs', 'docker']
    },
    {
      id: '6',
      title: 'Content Marketing Strategy in 2024',
      description: 'Latest trends and strategies for effective content marketing in the digital age.',
      category: 'marketing',
      difficulty: 'intermediate',
      tags: ['content marketing', 'seo', 'social media']
    },
    {
      id: '7',
      title: 'Home Organization Hacks',
      description: 'Practical tips and tricks for organizing every room in your home efficiently.',
      category: 'lifestyle',
      difficulty: 'beginner',
      tags: ['organization', 'home', 'productivity']
    },
    {
      id: '8',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
      category: 'programming',
      difficulty: 'advanced',
      tags: ['machine learning', 'ai', 'python']
    },
    {
      id: '9',
      title: 'Sustainable Living Tips',
      description: 'Easy ways to reduce your environmental impact and live more sustainably.',
      category: 'lifestyle',
      difficulty: 'beginner',
      tags: ['sustainability', 'environment', 'lifestyle']
    },
    {
      id: '10',
      title: 'React Performance Optimization',
      description: 'Advanced techniques for optimizing React applications for better performance.',
      category: 'programming',
      difficulty: 'advanced',
      tags: ['react', 'performance', 'optimization']
    },
    {
      id: '11',
      title: 'Personal Branding on Social Media',
      description: 'How to build and maintain a strong personal brand across social platforms.',
      category: 'marketing',
      difficulty: 'intermediate',
      tags: ['personal branding', 'social media', 'career']
    },
    {
      id: '12',
      title: 'Budget-Friendly Meal Planning',
      description: 'Strategies for planning healthy, delicious meals on a tight budget.',
      category: 'lifestyle',
      difficulty: 'beginner',
      tags: ['meal planning', 'budget', 'cooking']
    },
    {
      id: '13',
      title: 'Cybersecurity Best Practices',
      description: 'Essential security measures for protecting personal and business data online.',
      category: 'technology',
      difficulty: 'intermediate',
      tags: ['cybersecurity', 'privacy', 'data protection']
    },
    {
      id: '14',
      title: 'Freelancing Success Guide',
      description: 'Complete guide to starting and scaling a successful freelance business.',
      category: 'business',
      difficulty: 'intermediate',
      tags: ['freelancing', 'business', 'career']
    },
    {
      id: '15',
      title: 'Minimalist Design Principles',
      description: 'Understanding and applying minimalist design principles in digital and print media.',
      category: 'design',
      difficulty: 'beginner',
      tags: ['minimalism', 'design principles', 'ui/ux']
    },
    {
      id: '16',
      title: 'Cryptocurrency Explained',
      description: 'Comprehensive guide to understanding blockchain technology and cryptocurrencies.',
      category: 'finance',
      difficulty: 'intermediate',
      tags: ['cryptocurrency', 'blockchain', 'investing']
    },
    {
      id: '17',
      title: 'Time Management Techniques',
      description: 'Proven methods for managing time effectively and increasing productivity.',
      category: 'productivity',
      difficulty: 'beginner',
      tags: ['time management', 'productivity', 'work-life balance']
    },
    {
      id: '18',
      title: 'API Design Best Practices',
      description: 'Guidelines for designing robust, scalable, and user-friendly APIs.',
      category: 'programming',
      difficulty: 'advanced',
      tags: ['api design', 'rest', 'backend development']
    },
    {
      id: '19',
      title: 'Digital Photography Basics',
      description: 'Getting started with digital photography, from camera settings to composition.',
      category: 'creative',
      difficulty: 'beginner',
      tags: ['photography', 'camera', 'composition']
    },
    {
      id: '20',
      title: 'E-commerce Growth Strategies',
      description: 'Proven strategies for growing and scaling an online store.',
      category: 'business',
      difficulty: 'intermediate',
      tags: ['e-commerce', 'growth', 'online business']
    }
  ]);

  const [displayedIdeas, setDisplayedIdeas] = useState<ContentIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const filtered = ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || idea.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    setDisplayedIdeas(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, ideas]);

  const getRandomIdeas = () => {
    const shuffled = [...ideas].sort(() => 0.5 - Math.random());
    setDisplayedIdeas(shuffled.slice(0, 6));
  };

  const copyIdea = (idea: ContentIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nCategory: ${idea.category}\nDifficulty: ${idea.difficulty}\nTags: ${idea.tags.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      programming: 'bg-blue-100 text-blue-800',
      design: 'bg-purple-100 text-purple-800',
      marketing: 'bg-orange-100 text-orange-800',
      lifestyle: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      business: 'bg-red-100 text-red-800',
      technology: 'bg-indigo-100 text-indigo-800',
      productivity: 'bg-pink-100 text-pink-800',
      creative: 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Lightbulb size={32} className="mr-3 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-800">Content Ideas Generator</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Get inspired with creative content ideas for your blog, social media, or projects
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ideas..."
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
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
          
          <button
            onClick={getRandomIdeas}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Shuffle size={20} className="mr-2" />
            Random Ideas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{ideas.length}</div>
          <div className="text-sm opacity-90">Total Ideas</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{displayedIdeas.length}</div>
          <div className="text-sm opacity-90">Filtered Results</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{categories.length - 1}</div>
          <div className="text-sm opacity-90">Categories</div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedIdeas.map((idea) => (
          <div key={idea.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{idea.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{idea.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(idea.category)}`}>
                    {idea.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(idea.difficulty)}`}>
                    {idea.difficulty}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => copyIdea(idea)}
                className="ml-2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Copy idea"
              >
                {copiedId === idea.id ? (
                  <Star size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayedIdeas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No ideas match your current filters</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Using Content Ideas</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Click the copy button to copy the entire idea to your clipboard</li>
          <li>• Use the random generator to discover new ideas you might not have found</li>
          <li>• Filter by difficulty to match your current skill level</li>
          <li>• Combine ideas from different categories for unique content</li>
          <li>• Use tags to find related topics and build content series</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentIdeasGenerator;