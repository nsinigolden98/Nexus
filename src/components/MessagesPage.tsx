import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  Smile, 
  Send,
  ChevronLeft,
  Check,
  CheckCheck
} from 'lucide-react';
import { useStore, mockConversations } from '@/store';

const mockMessages = [
  {
    id: '1',
    senderId: '2',
    content: 'Hey! Loved your latest post. The design insights were really valuable.',
    timestamp: '10:30 AM',
    isRead: true,
  },
  {
    id: '2',
    senderId: '1',
    content: 'Thanks Marcus! I appreciate the feedback. Working on something new too.',
    timestamp: '10:32 AM',
    isRead: true,
  },
  {
    id: '3',
    senderId: '2',
    content: 'Would love to collaborate on a project together. Are you open to that?',
    timestamp: '10:35 AM',
    isRead: true,
  },
  {
    id: '4',
    senderId: '1',
    content: 'Absolutely! Let\'s set up a call to discuss ideas.',
    timestamp: '10:38 AM',
    isRead: false,
  },
];

const reactions = ['❤️', '👍', '😂', '😮', '🔥', '👏'];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would send the message
    setMessageInput('');
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-120px)]">
      <div className="flex h-full glass-card overflow-hidden">
        {/* Conversations List */}
        <AnimatePresence>
          {(!selectedConversation || !isMobile) && (
            <motion.div
              className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-white/5`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {mockConversations.map((conv, i) => {
                  const otherUser = conv.participants[0];
                  return (
                    <motion.button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left ${
                        selectedConversation === conv.id ? 'bg-white/10' : ''
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="relative">
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.displayName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                        />
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-xs flex items-center justify-center font-medium">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white truncate">{otherUser.displayName}</p>
                          {conv.lastMessage && (
                            <span className="text-xs text-white/40">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white/80' : 'text-white/50'}`}>
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <AnimatePresence>
          {selectedConversation && selectedConv && (
            <motion.div
              className="flex-1 flex flex-col"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <img
                    src={selectedConv.participants[0].avatar}
                    alt={selectedConv.participants[0].displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="font-medium text-white">{selectedConv.participants[0].displayName}</p>
                    <p className="text-xs text-green-400">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg, i) => {
                  const isMe = msg.senderId === '1';
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div
                        className={`relative max-w-[70%] group ${
                          isMe
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'glass text-white'
                        } rounded-2xl px-4 py-2.5`}
                        onMouseEnter={() => setShowReactions(msg.id)}
                        onMouseLeave={() => setShowReactions(null)}
                      >
                        <p>{msg.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-60">{msg.timestamp}</span>
                          {isMe && (
                            msg.isRead ? (
                              <CheckCheck className="w-3 h-3 opacity-60" />
                            ) : (
                              <Check className="w-3 h-3 opacity-60" />
                            )
                          )}
                        </div>

                        {/* Reaction Bar */}
                        <AnimatePresence>
                          {showReactions === msg.id && (
                            <motion.div
                              className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 p-1.5 rounded-full glass"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              {reactions.map((emoji) => (
                                <button
                                  key={emoji}
                                  className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60">
                    <Smile className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!selectedConversation && (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
