import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Plus, 
  MessageCircle, 
  User, 
  Video, 
  Image, 
  BarChart3, 
  Mic,
  X
} from 'lucide-react';
import type { AppTab } from '@/sections/MainApp';

interface FloatingNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onCreate: () => void;
  onLiveStream: () => void;
  unreadMessages: number;
}

const navItems: { id: AppTab; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'messages', icon: MessageCircle, label: 'Messages' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const createOptions = [
  { id: 'post', icon: Plus, label: 'Post', color: 'from-blue-500 to-purple-500' },
  { id: 'image', icon: Image, label: 'Photo', color: 'from-green-500 to-emerald-500' },
  { id: 'poll', icon: BarChart3, label: 'Poll', color: 'from-orange-500 to-red-500' },
  { id: 'live', icon: Video, label: 'Live', color: 'from-red-500 to-pink-500' },
];

export function FloatingNav({ activeTab, onTabChange, onCreate, onLiveStream, unreadMessages }: FloatingNavProps) {
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleCreateClick = (type: string) => {
    setShowCreateMenu(false);
    if (type === 'live') {
      onLiveStream();
    } else {
      onCreate();
    }
  };

  return (
    <>
      <motion.nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl shadow-black/50 border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative p-3 rounded-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    layoutId="nav-indicator"
                  />
                )}
                
                {/* Unread badge */}
                {item.id === 'messages' && unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-medium">
                    {unreadMessages}
                  </span>
                )}
              </motion.button>
            );
          })}
          
          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-1" />
          
          {/* Create Button */}
          <motion.button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className={`p-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30 transition-all ${
              showCreateMenu ? 'rotate-45' : ''
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Create Menu Overlay */}
      <AnimatePresence>
        {showCreateMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[99]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateMenu(false)}
            />
            <motion.div
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[101]"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
              <div className="glass-strong rounded-2xl p-2 shadow-2xl shadow-black/50 border border-white/10">
                <div className="flex gap-2">
                  {createOptions.map((option, i) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleCreateClick(option.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-br ${option.color} text-white min-w-[70px]`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
