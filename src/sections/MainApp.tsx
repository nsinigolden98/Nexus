import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { FloatingNav } from '@/components/FloatingNav';
import { HomeFeed } from '@/components/HomeFeed';
import { ExplorePage } from '@/components/ExplorePage';
import { CreatePostModal } from '@/components/CreatePostModal';
import { MessagesPage } from '@/components/MessagesPage';
import { ProfilePage } from '@/components/ProfilePage';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { SearchModal } from '@/components/SearchModal';
import { LiveStreamModal } from '@/components/LiveStreamModal';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { Sidebar } from '@/components/Sidebar';
import { RightPanel } from '@/components/RightPanel';
import { SettingsPage } from '@/components/SettingsPage';
import { toast } from 'sonner';

interface MainAppProps {
  onLogout: () => void;
}

export type AppTab = 'home' | 'explore' | 'messages' | 'profile';

export function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const { 
    currentUser, 
    currentMode, 
    isCreateModalOpen, 
    setCreateModalOpen,
    isSearchOpen,
    setSearchOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    setLiveModalOpen,
    unreadNotifications,
    unreadMessages,
  } = useStore();

  // Check screen size
  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // Ctrl/Cmd + N for new post
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setCreateModalOpen(true);
      }
      
      // ESC to close modals
      if (e.key === 'Escape') {
        setCreateModalOpen(false);
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCreateModalOpen, setSearchOpen, setNotificationsOpen]);

  // Welcome toast
  useEffect(() => {
    if (currentUser) {
      toast.success(`Welcome back, ${currentUser.displayName}!`, {
        description: `You're in ${currentMode} mode`,
        icon: '👋',
      });
    }
  }, [currentUser, currentMode]);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'explore':
        return <ExplorePage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Desktop Layout */}
      {isDesktop ? (
        <div className="flex min-h-screen">
          {/* Left Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onModeSwitcher={() => setShowModeSwitcher(true)}
            onSettings={() => setShowSettings(true)}
            onLogout={onLogout}
          />

          {/* Main Content */}
          <main className="flex-1 ml-72 mr-80 min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="py-6 px-6"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Right Panel */}
          <RightPanel />
        </div>
      ) : (
        /* Mobile/Tablet Layout */
        <div className="min-h-screen pb-24">
          {/* Header */}
          <header className="sticky top-0 z-40 glass-strong px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <span className="font-bold gradient-text">NEXUS</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-xl glass text-white/70 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="p-2 rounded-xl glass text-white/70 hover:text-white relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Floating Navigation */}
          <FloatingNav 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onCreate={() => setCreateModalOpen(true)}
            onLiveStream={() => setShowLiveModal(true)}
            unreadMessages={unreadMessages}
          />
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal onClose={() => setCreateModalOpen(false)} />
        )}
        
        {isSearchOpen && (
          <SearchModal onClose={() => setSearchOpen(false)} />
        )}
        
        {isNotificationsOpen && (
          <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
        )}
        
        {showModeSwitcher && (
          <ModeSwitcher onClose={() => setShowModeSwitcher(false)} />
        )}
        
        {showLiveModal && (
          <LiveStreamModal onClose={() => { setShowLiveModal(false); setLiveModalOpen(false); }} />
        )}
        
        {showSettings && (
          <SettingsPage onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
