import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Hash, MapPin, Filter } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'people', label: 'People', icon: Users },
  { id: 'topics', label: 'Topics', icon: Hash },
  { id: 'places', label: 'Places', icon: MapPin },
];

const trendingTopics = [
  { id: '1', name: 'AI Revolution', posts: '2.4M posts', category: 'Technology', trending: true },
  { id: '2', name: 'Creative Design', posts: '1.8M posts', category: 'Design', trending: true },
  { id: '3', name: 'Remote Work', posts: '1.2M posts', category: 'Business', trending: false },
  { id: '4', name: 'Digital Art', posts: '956K posts', category: 'Art', trending: true },
  { id: '5', name: 'Mental Health', posts: '834K posts', category: 'Wellness', trending: false },
  { id: '6', name: 'Sustainable Living', posts: '723K posts', category: 'Lifestyle', trending: false },
];

const suggestedPeople = [
  {
    id: '1',
    name: 'Alex Rivera',
    username: 'alex_rivera',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    bio: 'Tech enthusiast & developer',
    followers: '245K',
  },
  {
    id: '2',
    name: 'Sophie Chen',
    username: 'sophie_chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    bio: 'Designer & creative director',
    followers: '189K',
  },
  {
    id: '3',
    name: 'Jordan Smith',
    username: 'jordan_smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: 'Entrepreneur & investor',
    followers: '412K',
  },
  {
    id: '4',
    name: 'Maya Patel',
    username: 'maya_patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    bio: 'Artist & illustrator',
    followers: '156K',
  },
];

const exploreImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop',
];

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search people, topics, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Trending Topics */}
      {(activeCategory === 'all' || activeCategory === 'topics') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Trending Now</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">See all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trendingTopics.map((topic, i) => (
              <motion.button
                key={topic.id}
                className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/10 transition-all text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">#{topic.name}</span>
                    {topic.trending && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50">{topic.posts}</p>
                </div>
                <span className="text-sm text-white/40">{topic.category}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested People */}
      {(activeCategory === 'all' || activeCategory === 'people') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Who to Follow</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">See all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedPeople.map((person, i) => (
              <motion.div
                key={person.id}
                className="flex items-center gap-4 p-4 rounded-xl glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{person.name}</p>
                  <p className="text-sm text-white/50 truncate">@{person.username}</p>
                  <p className="text-sm text-white/40 truncate">{person.bio}</p>
                </div>
                <motion.button
                  onClick={() => handleFollow(person.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    followedUsers.includes(person.id)
                      ? 'bg-white/10 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {followedUsers.includes(person.id) ? 'Following' : 'Follow'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Grid */}
      {(activeCategory === 'all' || activeCategory === 'places') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Discover</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">See all</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exploreImages.map((image, i) => (
              <motion.div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image}
                  alt={`Explore ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
