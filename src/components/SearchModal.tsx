import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';

const recentSearches = ['UX Design', 'Sarah Chen', 'Creative Coding', '#AIRevolution'];

const trendingSearches = [
  'AI Revolution',
  'Design Systems',
  'Remote Work',
  'Digital Art',
  'Web3',
  'Creator Economy',
];

const quickFilters = [
  { label: 'People', color: 'from-blue-500 to-cyan-500' },
  { label: 'Posts', color: 'from-purple-500 to-pink-500' },
  { label: 'Topics', color: 'from-orange-500 to-red-500' },
  { label: 'Live', color: 'from-green-500 to-emerald-500' },
];

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl glass-card overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search className="w-5 h-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, posts, topics..."
            className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/40" />
            </button>
          )}
          <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded">ESC</span>
        </div>

        {/* Quick Filters */}
        {!query && (
          <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto scrollbar-hide">
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r ${filter.color} text-white`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query ? (
            <div className="p-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-white/50">Search results for &quot;{query}&quot;</p>
                  {/* Mock results */}
                  {[
                    { type: 'user', name: 'Sarah Chen', handle: '@sarah_chen', followers: '125K' },
                    { type: 'post', title: 'The Future of AI in Design', author: 'Marcus Johnson', likes: '2.4K' },
                    { type: 'topic', name: '#AIRevolution', posts: '2.4M' },
                  ].map((result, i) => (
                    <motion.button
                      key={i}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {result.type === 'user' && (
                        <>
                          <img
                            src={`https://images.unsplash.com/photo-${['1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1438761681033-6461ffad8d80'][i]}?w=100&h=100&fit=crop`}
                            alt={result.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-white">{result.name}</p>
                            <p className="text-sm text-white/50">{result.handle} • {result.followers} followers</p>
                          </div>
                        </>
                      )}
                      {result.type === 'post' && (
                        <>
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{result.title}</p>
                            <p className="text-sm text-white/50">by {result.author} • {result.likes} likes</p>
                          </div>
                        </>
                      )}
                      {result.type === 'topic' && (
                        <>
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400 text-lg">#</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{result.name}</p>
                            <p className="text-sm text-white/50">{result.posts} posts</p>
                          </div>
                        </>
                      )}
                      <ArrowRight className="w-4 h-4 text-white/40" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-3">Recent</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(search)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-white">{search}</span>
                      <X className="w-4 h-4 text-white/40 ml-auto hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {trendingSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(search)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-white">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
