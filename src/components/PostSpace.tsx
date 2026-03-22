import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  MessageSquare,
  Send,
  Smile,
  BarChart3,
  Plus,
  Heart,
  ThumbsUp,
  Zap,
  Star,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStore, mockUsers } from '@/store';
import type { PostSpace as PostSpaceType } from '@/types';

interface PostSpaceProps {
  space: PostSpaceType;
  onClose: () => void;
}

const reactions = ['❤️', '👍', '🔥', '😂', '😮', '👏', '💯', '🎉'];

export function PostSpaceView({ space, onClose }: PostSpaceProps) {
  const { currentUser, joinPostSpace, leavePostSpace, sendSpaceMessage, sendSpaceReaction, createSpacePoll, voteSpacePoll } = useStore();
  const [messageInput, setMessageInput] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isParticipant = currentUser && space.participants.includes(currentUser.id);

  useEffect(() => {
    if (!isParticipant && currentUser) {
      joinPostSpace(space.id);
    }
  }, [space.id, isParticipant, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [space.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendSpaceMessage(space.id, messageInput);
    setMessageInput('');
  };

  const handleReaction = (emoji: string) => {
    sendSpaceReaction(space.id, emoji);
    setShowReactions(false);
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;
    createSpacePoll(space.id, pollQuestion, pollOptions.filter(o => o.trim()));
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollCreator(false);
  };

  const handleLeave = () => {
    leavePostSpace(space.id);
    onClose();
  };

  const participants = space.participants.map(id => mockUsers.find(u => u.id === id) || currentUser).filter(Boolean);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleLeave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg max-h-[85vh] overflow-hidden glass-card flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Post Space</h3>
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="flex items-center gap-1 text-sm text-white/50 hover:text-white"
              >
                <Users className="w-3 h-3" />
                {space.participants.length} participants
                {showParticipants ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/5 overflow-hidden"
            >
              <div className="p-4 max-h-40 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {participants.map((user) => (
                    <div
                      key={user?.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5"
                    >
                      <img
                        src={user?.avatar}
                        alt={user?.displayName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{user?.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Reactions */}
        <div className="px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {reactions.map((emoji) => {
              const count = space.reactions.filter(r => r.emoji === emoji).length;
              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg">{emoji}</span>
                  {count > 0 && <span className="text-xs text-white/60">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
          {space.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.type === 'system' ? 'justify-center' : ''}`}
            >
              {msg.type === 'system' ? (
                <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              ) : (
                <>
                  <img
                    src={msg.user?.avatar}
                    alt={msg.user?.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.user?.displayName}</span>
                      <span className="text-xs text-white/40">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-white/80">{msg.content}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Polls */}
        {space.polls.length > 0 && (
          <div className="px-4 py-2 border-t border-white/5 space-y-2">
            {space.polls.map((poll) => (
              <div key={poll.id} className="p-3 rounded-xl bg-white/5">
                <p className="text-sm font-medium mb-2">{poll.question}</p>
                <div className="space-y-1">
                  {poll.options.map((option) => {
                    const totalVotes = poll.options.reduce((acc, o) => acc + o.votes.length, 0);
                    const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    const hasVoted = currentUser && option.votes.includes(currentUser.id);
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => !hasVoted && voteSpacePoll(space.id, poll.id, option.id)}
                        className={`w-full relative p-2 rounded-lg overflow-hidden text-left ${
                          hasVoted ? 'bg-blue-500/20' : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div
                          className="absolute inset-0 bg-blue-500/10"
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative flex items-center justify-between">
                          <span className="text-sm">{option.text}</span>
                          <span className="text-xs text-white/60">
                            {option.votes.length} votes ({Math.round(percentage)}%)
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Poll Creator */}
        <AnimatePresence>
          {showPollCreator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {pollOptions.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollOptions];
                      newOptions[i] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm"
                  >
                    Add Option
                  </button>
                  <button
                    onClick={handleCreatePoll}
                    className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm"
                  >
                    Create Poll
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPollCreator(!showPollCreator)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Post Space Button (for posts)
interface PostSpaceButtonProps {
  postId: string;
}

export function PostSpaceButton({ postId }: PostSpaceButtonProps) {
  const { postSpaces, getPostSpace, currentUser, joinPostSpace } = useStore();
  const [showSpace, setShowSpace] = useState(false);
  
  const space = getPostSpace(postId);
  
  if (!space) return null;

  return (
    <>
      <button
        onClick={() => {
          if (currentUser && !space.participants.includes(currentUser.id)) {
            joinPostSpace(space.id);
          }
          setShowSpace(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">Join Space</span>
        <span className="text-xs bg-blue-500/30 px-2 py-0.5 rounded-full">
          {space.participants.length}
        </span>
      </button>

      <AnimatePresence>
        {showSpace && (
          <PostSpaceView
            space={space}
            onClose={() => setShowSpace(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
