import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, mockUsers, mockPosts, mockConversations, mockNotifications } from '@/store';
import { LandingPage } from '@/sections/LandingPage';
import { AuthPage } from '@/sections/AuthPage';
import { MainApp } from '@/sections/MainApp';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobile, setIsMobile] = useState(false);
  
  const { 
    isAuthenticated, 
    setCurrentUser, 
    setAuthenticated, 
    setPosts, 
    setCreateModalOpen 
  } = useStore();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize mock data
  useEffect(() => {
    const init = async () => {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set mock data
      setPosts(mockPosts);
      
      // Check if user was previously logged in
      const savedUser = localStorage.getItem('nexus-storage');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.state?.isAuthenticated && parsed.state?.currentUser) {
            setCurrentUser(parsed.state.currentUser);
            setAuthenticated(true);
            setCurrentView('app');
          } else if (isMobile) {
            // On mobile without saved auth, go directly to app (browse mode)
            setCurrentView('app');
          }
        } catch (e) {
          console.error('Failed to parse saved user');
          if (isMobile) {
            setCurrentView('app');
          }
        }
      } else if (isMobile) {
        // On mobile without saved auth, go directly to app (browse mode)
        setCurrentView('app');
      }
      
      setIsLoading(false);
    };
    
    init();
  }, [setPosts, setCurrentUser, setAuthenticated, isMobile]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new post
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setCreateModalOpen(true);
      }
      
      // ESC to close modals
      if (e.key === 'Escape') {
        setCreateModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCreateModalOpen]);

  const handleEnterWorld = () => {
    setCurrentView('auth');
    setAuthMode('signup');
  };

  const handleLogin = () => {
    setCurrentView('auth');
    setAuthMode('login');
  };

  const handleAuthSuccess = (user = mockUsers[0]) => {
    setCurrentUser(user);
    setAuthenticated(true);
    setCurrentView('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthenticated(false);
    setCurrentView('landing');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage 
              onEnterWorld={handleEnterWorld}
              onLogin={handleLogin}
            />
          </motion.div>
        )}
        
        {currentView === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AuthPage 
              initialMode={authMode}
              onAuthSuccess={handleAuthSuccess}
              onBack={() => setCurrentView('landing')}
            />
          </motion.div>
        )}
        
        {currentView === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainApp onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}

export default App;
