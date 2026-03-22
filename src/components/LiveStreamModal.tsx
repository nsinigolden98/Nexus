import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Settings,
  Users,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical,
  Sparkles
} from 'lucide-react';

const mockViewers = [
  { id: '1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop' },
  { id: '2', name: 'Sophie', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop' },
  { id: '3', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
  { id: '4', name: 'Maya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop' },
];

const mockChat = [
  { id: '1', user: 'Alex', message: 'This is amazing! 🔥', color: '#3B82F6' },
  { id: '2', user: 'Sophie', message: 'Love the content!', color: '#8B5CF6' },
  { id: '3', user: 'Jordan', message: 'Can you talk about AI?', color: '#22D3EE' },
  { id: '4', user: 'Maya', message: 'Subscribed! 💜', color: '#EC4899' },
];

export function LiveStreamModal({ onClose }: { onClose: () => void }) {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 5));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleGoLive = () => {
    setIsLive(true);
    setViewerCount(1);
  };

  const handleEndStream = () => {
    setIsLive(false);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90"
        onClick={!isLive ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-6xl h-[90vh] glass-card overflow-hidden flex"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Main Stream Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {isLive && (
                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </span>
              )}
              {isLive && (
                <span className="text-white/70 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {viewerCount.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleEndStream}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Preview */}
          <div className="flex-1 relative bg-black/50 m-4 rounded-2xl overflow-hidden">
            {!isVideoOn ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">You</span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                {/* Simulated video feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">Camera Preview</p>
                  </div>
                </div>
              </div>
            )}

            {/* Viewer Avatars */}
            {isLive && (
              <div className="absolute top-4 right-4 flex -space-x-2">
                {mockViewers.map((viewer) => (
                  <img
                    key={viewer.id}
                    src={viewer.avatar}
                    alt={viewer.name}
                    className="w-8 h-8 rounded-full ring-2 ring-black"
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs text-white ring-2 ring-black">
                  +{viewerCount}
                </div>
              </div>
            )}

            {/* Start Stream Overlay */}
            {!isLive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <motion.button
                  onClick={handleGoLive}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold shadow-2xl shadow-red-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-3">
                    <Video className="w-6 h-6" />
                    Go Live
                  </span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 flex items-center justify-center gap-4">
            <motion.button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition-colors ${
                isMicOn ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </motion.button>
            
            <motion.button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </motion.button>

            {isLive && (
              <motion.button
                onClick={handleEndStream}
                className="px-6 py-3 rounded-full bg-red-500 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                End Stream
              </motion.button>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {isLive && (
          <div className="w-80 border-l border-white/5 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockChat.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <span className="font-medium text-sm" style={{ color: msg.color }}>
                    {msg.user}:
                  </span>
                  <span className="text-white/80 text-sm">{msg.message}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Say something..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
