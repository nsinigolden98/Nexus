import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, ArrowUpRight, Search } from 'lucide-react';
import { useStore } from '@/store';
import { useState } from 'react';

const trendingTopics = [
  { id: '1', name: '#AIRevolution', posts: '125K' },
  { id: '2', name: '#CreativeCoding', posts: '89K' },
  { id: '3', name: '#FutureOfWork', posts: '67K' },
  { id: '4', name: '#DigitalArt', posts: '54K' },
  { id: '5', name: '#TechTrends', posts: '43K' },
];

const suggestedUsers = [
  {
    id: '2',
    name: 'Marcus Johnson',
    username: 'marcus_j',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    followers: '45K',
  },
  {
    id: '3',
    name: 'Emma Williams',
    username: 'emma_williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    followers: '89K',
  },
  {
    id: '4',
    name: 'David Park',
    username: 'david_park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    followers: '32K',
  },
];

const liveStreams = [
  {
    id: '1',
    title: 'Design Systems Workshop',
    host: 'Sarah Chen',
    viewers: 1240,
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: 'Live Coding Session',
    host: 'Alex Rivera',
    viewers: 856,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=120&fit=crop',
  },
];

export function RightPanel() {
  const { setSearchOpen } = useStore();
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-80 glass-strong border-l border-white/5 z-40 overflow-y-auto scrollbar-hide">
      <div className="p-6 space-y-8">
        {/* Search */}
        <motion.button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl glass text-white/50 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <Search className="w-5 h-5" />
          <span>Search Nexus...</span>
          <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded">⌘K</span>
        </motion.button>

        {/* Trending Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Trending Now</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, i) => (
              <motion.button
                key={topic.id}
                className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-white/10 transition-all text-left"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div>
                  <p className="font-medium text-white">{topic.name}</p>
                  <p className="text-sm text-white/40">{topic.posts} posts</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Live Streams */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <h3 className="font-semibold text-white">Live Now</h3>
          </div>
          <div className="space-y-3">
            {liveStreams.map((stream, i) => (
              <motion.div
                key={stream.id}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-red-500 text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-sm font-medium text-white truncate">{stream.title}</p>
                  <p className="text-xs text-white/60">{stream.host} • {stream.viewers.toLocaleString()} watching</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Who to Follow</h3>
          </div>
          <div className="space-y-3">
            {suggestedUsers.map((user, i) => (
              <motion.div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/10 transition-all"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-sm text-white/40 truncate">@{user.username}</p>
                </div>
                <motion.button
                  onClick={() => handleFollow(user.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    followedUsers.includes(user.id)
                      ? 'bg-white/10 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {followedUsers.includes(user.id) ? 'Following' : 'Follow'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
            <a href="#" className="hover:text-white/60 transition-colors">Accessibility</a>
            <a href="#" className="hover:text-white/60 transition-colors">Ads</a>
          </div>
          <p className="text-xs text-white/20 mt-2">© 2024 Nexus Social, Inc.</p>
        </div>
      </div>
    </aside>
  );
}
