import { motion } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Plus, 
  MessageCircle, 
  User, 
  Sparkles,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  Briefcase,
  Palette,
  Zap
} from 'lucide-react';
import { useStore } from '@/store';
import type { AppTab } from '@/sections/MainApp';
import type { UserMode } from '@/types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onModeSwitcher: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

const mainNavItems: { id: AppTab; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'messages', icon: MessageCircle, label: 'Messages' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const modeConfig: Record<UserMode, { icon: typeof Users; color: string; label: string }> = {
  social: { icon: Users, color: '#3B82F6', label: 'Social Mode' },
  work: { icon: Briefcase, color: '#8B5CF6', label: 'Work Mode' },
  creative: { icon: Palette, color: '#22D3EE', label: 'Creative Mode' },
};

export function Sidebar({ activeTab, onTabChange, onModeSwitcher, onSettings, onLogout }: SidebarProps) {
  const { currentUser, currentMode, setCreateModalOpen, unreadNotifications, unreadMessages } = useStore();
  const modeInfo = modeConfig[currentMode];
  const ModeIcon = modeInfo.icon;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 glass-strong border-r border-white/5 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">NEXUS</h1>
            <p className="text-xs text-white/40">v2.0.4</p>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <motion.button
          onClick={() => setCreateModalOpen(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Create Post
        </motion.button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                
                {/* Badges */}
                {item.id === 'messages' && unreadMessages > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
                
                {isActive && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    layoutId="sidebar-indicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <p className="px-4 text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
            Quick Actions
          </p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
              <TrendingUp className="w-5 h-5" />
              <span>Trending</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
              <Zap className="w-5 h-5" />
              <span>Live Streams</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mode Switcher */}
      <div className="p-4 border-t border-white/5">
        <motion.button
          onClick={onModeSwitcher}
          className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `${modeInfo.color}30` }}
          >
            <ModeIcon className="w-5 h-5" style={{ color: modeInfo.color }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">{modeInfo.label}</p>
            <p className="text-xs text-white/40">Click to switch</p>
          </div>
        </motion.button>
      </div>

      {/* User Profile */}
      {currentUser && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.displayName}</p>
              <p className="text-xs text-white/40 truncate">@{currentUser.username}</p>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={onSettings}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
