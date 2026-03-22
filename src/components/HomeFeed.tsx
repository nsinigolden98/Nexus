import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Briefcase, 
  DollarSign, 
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Zap,
  X,
  Send,
  Repeat2,
  EyeOff,
  Flag,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { useStore } from '@/store';
import { PostSpaceButton } from '@/components/PostSpace';
import type { FeedType, Post, UserIntent, Comment } from '@/types';

const feedTabs: { id: FeedType; label: string; icon: typeof Globe }[] = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'opportunity', label: 'Opportunity', icon: Briefcase },
  { id: 'creator', label: 'Creator', icon: DollarSign },
  { id: 'trending', label: 'Trending', icon: Flame },
];

const intentColors: Record<UserIntent, { bg: string; text: string; icon: string; label: string }> = {
  teach: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '📚', label: 'Teach' },
  entertain: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '🎭', label: 'Entertain' },
  sell: { bg: 'bg-pink-500/20', text: 'text-pink-400', icon: '🛍️', label: 'Sell' },
  ask: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '❓', label: 'Ask' },
};

const reactions = ['❤️', '🔥', '👏', '😂', '😮', '💯', '🎉', '👍'];

// Story Viewer Component
function StoryViewer({ story, onClose, onNext, onPrev }: { 
  story: any; 
  onClose: () => void; 
  onNext: () => void;
  onPrev: () => void;
}) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          onNext();
          return 0;
        }
        return p + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden z-10">
        <motion.div 
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src={story.user.avatar} alt={story.user.displayName} className="w-10 h-10 rounded-full ring-2 ring-white/30" />
          <span className="text-white font-medium">{story.user.displayName}</span>
          <span className="text-white/50 text-sm">{timeAgo(story.createdAt)}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Story Content */}
      <div className="absolute inset-0 flex items-center justify-center" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 3) onPrev();
        else if (x > (rect.width * 2) / 3) onNext();
      }}>
        <img src={story.mediaUrl} alt="Story" className="max-w-full max-h-full object-contain" />
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-0 flex">
        <div className="w-1/3 cursor-pointer" onClick={onPrev} />
        <div className="w-1/3" />
        <div className="w-1/3 cursor-pointer" onClick={onNext} />
      </div>

      {/* Reply Input */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder={`Reply to ${story.user.displayName}...`}
            className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Comment Modal
function CommentModal({ post, isOpen, onClose }: { post: Post; isOpen: boolean; onClose: () => void }) {
  const { comments, addComment, likeComment, unlikeComment, currentUser } = useStore();
  const [newComment, setNewComment] = useState('');
  const postComments = comments[post.id] || [];
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(post.id, newComment);
    setNewComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            className="relative w-full max-w-lg max-h-[80vh] glass-card rounded-t-3xl sm:rounded-3xl overflow-hidden"
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-semibold">Comments ({postComments.length})</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="overflow-y-auto max-h-[50vh] p-4 space-y-4">
              {postComments.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first!</p>
                </div>
              ) : (
                postComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img src={comment.author.avatar} alt={comment.author.displayName} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="glass rounded-2xl rounded-tl-none px-4 py-2">
                        <p className="font-medium text-sm">{comment.author.displayName}</p>
                        <p className="text-white/80">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 ml-2">
                        <button 
                          onClick={() => comment.isLiked ? unlikeComment(comment.id) : likeComment(comment.id)}
                          className={`text-xs ${comment.isLiked ? 'text-red-400' : 'text-white/50'} hover:text-red-400`}
                        >
                          {comment.likes > 0 && comment.likes} Like
                        </button>
                        <button className="text-xs text-white/50 hover:text-white">Reply</button>
                        <span className="text-xs text-white/30">{timeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 flex gap-3">
              <img src={currentUser?.avatar} alt="You" className="w-10 h-10 rounded-full" />
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Share Modal
function ShareModal({ post, isOpen, onClose }: { post: Post; isOpen: boolean; onClose: () => void }) {
  const { sharePost } = useStore();
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: Copy },
    { id: 'twitter', label: 'Twitter', icon: ExternalLink },
    { id: 'facebook', label: 'Facebook', icon: ExternalLink },
    { id: 'linkedin', label: 'LinkedIn', icon: ExternalLink },
    { id: 'whatsapp', label: 'WhatsApp', icon: ExternalLink },
  ];

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(`https://nexus.social/post/${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      sharePost(post.id, platform);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            className="relative w-full max-w-sm glass-card rounded-t-3xl sm:rounded-3xl overflow-hidden p-6"
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Share Post</h3>
            <div className="grid grid-cols-3 gap-4">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button 
                    key={option.id}
                    onClick={() => handleShare(option.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      {option.id === 'copy' && copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-sm">{option.id === 'copy' && copied ? 'Copied!' : option.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl glass hover:bg-white/10">
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Post Options Menu
function PostOptionsMenu({ post, isOpen, onClose, onHide }: { 
  post: Post; 
  isOpen: boolean; 
  onClose: () => void;
  onHide: () => void;
}) {
  const { currentUser, hidePost } = useStore();
  const isOwner = currentUser?.id === post.authorId;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="absolute right-0 top-10 z-20 w-48 glass-card rounded-xl overflow-hidden shadow-xl">
            {!isOwner && (
              <button 
                onClick={() => { onHide(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide Post</span>
              </button>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left">
              <Bookmark className="w-4 h-4" />
              <span>Save Post</span>
            </button>
            {!isOwner && (
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left text-red-400">
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            )}
            {isOwner && (
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left text-red-400">
                <X className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
          <div className="fixed inset-0 z-10" onClick={onClose} />
        </>
      )}
    </AnimatePresence>
  );
}

// Repost Modal
function RepostModal({ post, isOpen, onClose }: { post: Post; isOpen: boolean; onClose: () => void }) {
  const { repostPost } = useStore();
  const [content, setContent] = useState('');

  const handleRepost = () => {
    repostPost(post.id, content);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Repost</h3>
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                className="w-full h-24 bg-transparent resize-none focus:outline-none"
              />
              <div className="mt-4 p-4 glass rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <img src={post.author.avatar} alt={post.author.displayName} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{post.author.displayName}</span>
                </div>
                <p className="text-white/70 text-sm line-clamp-2">{post.content}</p>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl glass">Cancel</button>
              <button onClick={handleRepost} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                Repost
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Post Card Component
function PostCard({ post, index }: { post: Post; index: number }) {
  const { 
    likePost, 
    unlikePost, 
    savePost, 
    unsavePost, 
    hidePost,
    sharePost,
    currentUser,
    setShowReactionWheel,
    showReactionWheel,
    incrementPostViews
  } = useStore();
  
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likeCount, setLikeCount] = useState(post.stats.likes);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showRepost, setShowRepost] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const intentStyle = intentColors[post.intent];

  useEffect(() => {
    incrementPostViews(post.id);
  }, [post.id]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      unlikePost(post.id);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      likePost(post.id);
    }
  };

  const handleReactionSelect = (reaction: string) => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      likePost(post.id);
    }
    setShowReactionPicker(false);
  };

  const handleSave = () => {
    if (isSaved) {
      setIsSaved(false);
      unsavePost(post.id);
    } else {
      setIsSaved(true);
      savePost(post.id);
    }
  };

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowReactionPicker(true);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleHide = () => {
    hidePost(post.id);
  };

  if (post.status === 'archived') return null;

  return (
    <>
      <motion.article
        className="glass-card p-5 mb-4 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        {/* Sponsored Badge */}
        {post.monetization && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs font-medium">
            Sponsored
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{post.author.displayName}</span>
                {post.author.isVerified && (
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>@{post.author.username}</span>
                <span>•</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Intent Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${intentStyle.bg} ${intentStyle.text}`}>
              {intentStyle.icon} {intentStyle.label}
            </span>
            
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <PostOptionsMenu 
                post={post} 
                isOpen={showOptions} 
                onClose={() => setShowOptions(false)}
                onHide={handleHide}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-white/90 whitespace-pre-wrap">{post.content}</p>
          
          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className={`mt-4 grid gap-2 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.media.map((media, i) => (
                <div key={media.id} className="relative rounded-xl overflow-hidden">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Post media"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={media.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      {media.duration && (
                        <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-xs text-white">
                          {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Poll */}
          {post.poll && (
            <div className="mt-4 space-y-2">
              <p className="font-medium text-white">{post.poll.question}</p>
              {post.poll.options.map((option) => {
                const percentage = post.poll!.totalVotes > 0 
                  ? (option.votes / post.poll!.totalVotes) * 100 
                  : 0;
                return (
                  <div key={option.id} className="relative">
                    <div 
                      className="absolute inset-0 rounded-lg bg-blue-500/20"
                      style={{ width: `${percentage}%` }}
                    />
                    <button className="relative w-full flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <span className="text-white">{option.text}</span>
                      <span className="text-white/60">{Math.round(percentage)}%</span>
                    </button>
                  </div>
                );
              })}
              <p className="text-sm text-white/40">{post.poll.totalVotes.toLocaleString()} votes</p>
            </div>
          )}

          {/* Product */}
          {post.product && (
            <div className="mt-4 p-4 rounded-xl glass flex gap-4">
              <img
                src={post.product.images[0]}
                alt={post.product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{post.product.name}</h4>
                <p className="text-sm text-white/60 line-clamp-2">{post.product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-green-400">
                    ${post.product.price}
                  </span>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-shadow">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm text-blue-400 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-6">
            {/* Like with Reaction Picker */}
            <div className="relative">
              <motion.button
                onClick={handleLike}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-400' : 'text-white/50 hover:text-red-400'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{formatNumber(likeCount)}</span>
              </motion.button>
              
              {/* Reaction Picker */}
              <AnimatePresence>
                {showReactionPicker && (
                  <motion.div
                    className="absolute -top-14 left-0 flex gap-1 p-2 rounded-full glass shadow-xl"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  >
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactionSelect(emoji)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-xl transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Comment */}
            <button 
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 text-white/50 hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{formatNumber(post.stats.comments)}</span>
            </button>

            {/* Repost */}
            <button 
              onClick={() => setShowRepost(true)}
              className="flex items-center gap-2 text-white/50 hover:text-green-400 transition-colors"
            >
              <Repeat2 className="w-5 h-5" />
              <span className="text-sm">{formatNumber(post.stats.shares)}</span>
            </button>

            {/* Share */}
            <button 
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 text-white/50 hover:text-blue-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Post Space */}
            <PostSpaceButton postId={post.id} />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`transition-colors ${
              isSaved ? 'text-blue-400' : 'text-white/50 hover:text-blue-400'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Views Count */}
        <div className="mt-3 text-xs text-white/30">
          {formatNumber(post.stats.views)} views
        </div>
      </motion.article>

      {/* Modals */}
      <CommentModal post={post} isOpen={showComments} onClose={() => setShowComments(false)} />
      <ShareModal post={post} isOpen={showShare} onClose={() => setShowShare(false)} />
      <RepostModal post={post} isOpen={showRepost} onClose={() => setShowRepost(false)} />
    </>
  );
}

// Stories Row
function StoriesRow() {
  const { stories, viewStory, currentUser } = useStore();
  const [viewingStory, setViewingStory] = useState<number | null>(null);

  const handleStoryClick = (index: number) => {
    setViewingStory(index);
    viewStory(stories[index].id);
  };

  const handleNext = () => {
    if (viewingStory !== null && viewingStory < stories.length - 1) {
      setViewingStory(viewingStory + 1);
    } else {
      setViewingStory(null);
    }
  };

  const handlePrev = () => {
    if (viewingStory !== null && viewingStory > 0) {
      setViewingStory(viewingStory - 1);
    }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mb-4">
        {/* Your Story */}
        <button className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="relative p-0.5 rounded-full">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20">
              <img
                src={currentUser?.avatar}
                alt="Your Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#0B0B0F]">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <span className="text-xs text-white/70 truncate max-w-[64px]">Your Story</span>
        </button>

        {/* Other Stories */}
        {stories.map((story, i) => (
          <button 
            key={story.id} 
            className="flex flex-col items-center gap-2 flex-shrink-0"
            onClick={() => handleStoryClick(i)}
          >
            <div className={`relative p-0.5 rounded-full ${story.isViewed ? '' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={story.user.avatar}
                  alt={story.user.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-white/70 truncate max-w-[64px]">{story.user.displayName}</span>
          </button>
        ))}
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewingStory !== null && (
          <StoryViewer 
            story={stories[viewingStory]} 
            onClose={() => setViewingStory(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Main HomeFeed Component
export function HomeFeed() {
  const { posts, currentFeed, setCurrentFeed } = useStore();
  const [activeTab, setActiveTab] = useState<FeedType>(currentFeed);

  useEffect(() => {
    setCurrentFeed(activeTab);
  }, [activeTab, setCurrentFeed]);

  // Filter posts based on active feed
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'global') return true;
    if (activeTab === 'trending') return post.stats.likes > 5000;
    if (activeTab === 'creator') return post.monetization;
    if (activeTab === 'friends') return true; // Would filter by friends in real app
    if (activeTab === 'opportunity') return post.intent === 'sell' || post.intent === 'ask';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Feed Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4 sticky top-0 z-10 bg-[#0B0B0F]/80 backdrop-blur-xl py-2">
        {feedTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Stories */}
      <StoriesRow />

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More */}
      <div className="py-8 text-center">
        <motion.button
          className="px-6 py-3 rounded-xl glass text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Load More
        </motion.button>
      </div>
    </div>
  );
}
