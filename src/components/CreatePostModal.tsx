import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image, 
  Video, 
  BarChart3, 
  ShoppingBag, 
  BookOpen, 
  Theater, 
  ShoppingCart, 
  HelpCircle,
  Globe,
  Users,
  Lock,
  Calendar,
  DollarSign,
  Sparkles,
  Plus,
  Minus,
  Check,
  Wand2,
  RefreshCw,
  UserPlus,
  Clock,
  ChevronRight,
  ChevronLeft,
  Mic,
  Link as LinkIcon,
  AtSign,
  Hash,
  MessageSquare,
  Zap,
  Radio,
  Save,
  Send,
  Search,
  FileText
} from 'lucide-react';
import { useStore, mockUsers } from '@/store';
import type { UserIntent, PostType, PostVisibility } from '@/types';

interface CreatePostModalProps {
  onClose: () => void;
  initialTab?: 'intent' | 'content' | 'tags' | 'space' | 'publish';
}

const intents: { 
  id: UserIntent; 
  label: string; 
  icon: typeof BookOpen; 
  color: string; 
  gradient: string;
  description: string;
  aiPrompt: string;
}[] = [
  { 
    id: 'teach', 
    label: 'Teach', 
    icon: BookOpen, 
    color: '#10B981', 
    gradient: 'from-green-500 to-emerald-500',
    description: 'Share knowledge and insights',
    aiPrompt: 'Help me create an educational post about...'
  },
  { 
    id: 'entertain', 
    label: 'Entertain', 
    icon: Theater, 
    color: '#F59E0B', 
    gradient: 'from-amber-500 to-orange-500',
    description: 'Create joy and engagement',
    aiPrompt: 'Help me create an entertaining post that will...'
  },
  { 
    id: 'sell', 
    label: 'Sell', 
    icon: ShoppingCart, 
    color: '#EC4899', 
    gradient: 'from-pink-500 to-rose-500',
    description: 'Showcase products and services',
    aiPrompt: 'Help me create a compelling product description for...'
  },
  { 
    id: 'ask', 
    label: 'Ask', 
    icon: HelpCircle, 
    color: '#8B5CF6', 
    gradient: 'from-purple-500 to-violet-500',
    description: 'Seek opinions and answers',
    aiPrompt: 'Help me frame a question that will get good responses about...'
  },
];

const visibilityOptions: { id: PostVisibility; label: string; icon: typeof Globe; description: string }[] = [
  { id: 'public', label: 'Public', icon: Globe, description: 'Everyone can see' },
  { id: 'friends', label: 'Friends', icon: Users, description: 'Only friends' },
  { id: 'private', label: 'Private', icon: Lock, description: 'Only you' },
];

const tabs = [
  { id: 'intent', label: 'Intent', icon: Sparkles },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'tags', label: 'Tags', icon: AtSign },
  { id: 'space', label: 'Space', icon: MessageSquare },
  { id: 'publish', label: 'Publish', icon: Send },
];

// AI Assistant Panel
function AIAssistantPanel({ 
  content, 
  intent, 
  onApplySuggestion 
}: { 
  content: string; 
  intent: UserIntent | null;
  onApplySuggestion: (suggestion: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateAIContent, autoTagContent, getContentRemix } = useStore();

  const generateSuggestions = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const newSuggestions = [
      'Add a call-to-action at the end to boost engagement',
      'Include 2-3 relevant hashtags for better discoverability',
      'Consider adding an emoji to make it more approachable',
      'Try starting with a question to hook readers',
    ];
    setSuggestions(newSuggestions);
    setIsGenerating(false);
  };

  const generateRemix = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1000));
    const remixes = [
      'Turn this into a carousel post with 5 slides',
      'Create a short video script based on this content',
      'Transform into a poll question for engagement',
      'Make it into an infographic-friendly format',
    ];
    setSuggestions(remixes);
    setIsGenerating(false);
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <span className="font-medium text-white">AI Assistant</span>
      </div>
      
      {suggestions.length === 0 ? (
        <div className="space-y-2">
          <button 
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Enhance my post</span>
            {isGenerating && <RefreshCw className="w-4 h-4 animate-spin ml-auto" />}
          </button>
          <button 
            onClick={generateRemix}
            disabled={isGenerating}
            className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">Remix content</span>
          </button>
          <button 
            onClick={() => onApplySuggestion(autoTagContent(content).map(t => `#${t}`).join(' '))}
            className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm">Auto-generate tags</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onApplySuggestion(suggestion)}
              className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left text-sm"
            >
              {suggestion}
            </button>
          ))}
          <button 
            onClick={() => setSuggestions([])}
            className="w-full text-center text-sm text-white/50 hover:text-white"
          >
            Generate more
          </button>
        </div>
      )}
    </div>
  );
}

// Tagging Panel
function TaggingPanel({
  content,
  taggedUsers,
  onTagUser,
  taggedPosts,
  onTagPost,
  hashtags,
  onAddHashtag,
  onRemoveHashtag,
}: {
  content: string;
  taggedUsers: string[];
  onTagUser: (userId: string) => void;
  taggedPosts: string[];
  onTagPost: (postId: string) => void;
  hashtags: string[];
  onAddHashtag: (tag: string) => void;
  onRemoveHashtag: (tag: string) => void;
}) {
  const [userSearch, setUserSearch] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const availableUsers = mockUsers.filter(u => 
    u.id !== '1' && 
    !taggedUsers.includes(u.id) &&
    (u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
     u.username.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      onAddHashtag(hashtagInput.trim().replace(/^#/, ''));
      setHashtagInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tag Users */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
          <AtSign className="w-4 h-4" />
          Tag People
        </h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        {userSearch && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => { onTagUser(user.id); setUserSearch(''); }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-white/50">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {taggedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {taggedUsers.map((userId) => {
              const user = mockUsers.find(u => u.id === userId);
              return (
                <span key={userId} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  @{user?.username}
                  <button onClick={() => onTagUser(userId)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Hashtags */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Topics
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHashtag()}
            placeholder="Add hashtag..."
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddHashtag}
            className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
              #{tag}
              <button onClick={() => onRemoveHashtag(tag)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Post Space Panel
function PostSpacePanel({
  enabled,
  onToggle,
  onGoLive,
}: {
  enabled: boolean;
  onToggle: () => void;
  onGoLive: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">Enable Post Space</h3>
            <p className="text-sm text-white/50">Turn this post into an interactive space</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`w-14 h-7 rounded-full transition-colors relative ${enabled ? 'bg-blue-500' : 'bg-white/20'}`}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white"
            animate={{ left: enabled ? '32px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                What is a Post Space?
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Users can join and chat inside your post
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Live reactions and participation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Host polls and interactive events
                </li>
              </ul>
            </div>

            <button
              onClick={onGoLive}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium"
            >
              <Radio className="w-5 h-5" />
              Go Live Instead
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreatePostModal({ onClose, initialTab = 'intent' }: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('text');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [monetization, setMonetization] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coCreators, setCoCreators] = useState<string[]>([]);
  const [revenueSplit, setRevenueSplit] = useState<Record<string, number>>({});
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCoCreation, setShowCoCreation] = useState(false);
  
  // Tagging state
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [taggedPosts, setTaggedPosts] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  // Post Space state
  const [postSpaceEnabled, setPostSpaceEnabled] = useState(false);
  
  const { currentUser, addPost, createPostSpace, setLiveModalOpen } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleToggleCoCreator = (userId: string) => {
    setCoCreators(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    if (!coCreators.includes(userId)) {
      setRevenueSplit(prev => ({ ...prev, [userId]: 0 }));
    }
  };

  const handleUpdateRevenueSplit = (userId: string, percentage: number) => {
    setRevenueSplit(prev => ({ ...prev, [userId]: percentage }));
  };

  const handleTagUser = (userId: string) => {
    setTaggedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const handleAISuggestion = (suggestion: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + suggestion);
  };

  const handleGoLive = () => {
    onClose();
    setLiveModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedIntent || !content.trim()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPost: any = {
      id: Date.now().toString(),
      authorId: currentUser?.id || '1',
      author: currentUser || mockUsers[0],
      type: selectedType,
      intent: selectedIntent,
      content,
      visibility,
      status: scheduledDate ? 'scheduled' : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledFor: scheduledDate || undefined,
      monetization,
      coCreators: coCreators.length > 0 ? coCreators : undefined,
      revenueSplit: coCreators.length > 0 ? revenueSplit : undefined,
      stats: { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 },
      engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
      tags: [...hashtags, ...(content.match(/#\w+/g) || [])],
      taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined,
      isLiked: false,
      isSaved: false,
    };

    if (selectedType === 'poll' && pollQuestion) {
      newPost.poll = {
        id: `poll-${Date.now()}`,
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim()).map((text, i) => ({
          id: `opt-${i}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    if (selectedType === 'product' && productData.name) {
      newPost.product = {
        id: `prod-${Date.now()}`,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price) || 0,
        currency: 'USD',
        images: mediaPreviews.slice(0, 1),
      };
    }

    if (mediaPreviews.length > 0 && (selectedType === 'image' || selectedType === 'video')) {
      newPost.media = mediaPreviews.map((url, i) => ({
        id: `media-${i}`,
        type: selectedType,
        url,
        aspectRatio: 1,
      }));
    }
    
    addPost(newPost);
    
    // Create Post Space if enabled
    if (postSpaceEnabled) {
      createPostSpace(newPost.id);
    }
    
    setIsSubmitting(false);
    onClose();
  };

  const canSubmit = selectedIntent && content.trim().length > 0;
  const canProceed = {
    intent: !!selectedIntent,
    content: content.trim().length > 0,
    tags: true,
    space: true,
    publish: true,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'intent':
        return (
          <div className="space-y-4">
            <p className="text-white/60 mb-6">What&apos;s the purpose of your post?</p>
            <div className="grid grid-cols-2 gap-4">
              {intents.map((intent) => {
                const Icon = intent.icon;
                const isSelected = selectedIntent === intent.id;
                
                return (
                  <motion.button
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-transparent'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      background: isSelected ? `${intent.color}20` : 'rgba(255,255,255,0.05)',
                      borderColor: isSelected ? intent.color : undefined,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${intent.color}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: intent.color }} />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{intent.label}</h3>
                    <p className="text-sm text-white/50">{intent.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 'content':
        const intent = intents.find(i => i.id === selectedIntent);
        
        return (
          <div className="space-y-4">
            {/* Content Type Selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {[
                { id: 'text', icon: Sparkles, label: 'Text' },
                { id: 'image', icon: Image, label: 'Image' },
                { id: 'video', icon: Video, label: 'Video' },
                { id: 'poll', icon: BarChart3, label: 'Poll' },
                { id: 'product', icon: ShoppingBag, label: 'Product' },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as PostType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                      selectedType === type.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={intent?.aiPrompt || "What's on your mind?"}
              className="w-full h-32 bg-transparent border border-white/10 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />

            {/* Media Upload */}
            {(selectedType === 'image' || selectedType === 'video') && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={selectedType === 'image' ? 'image/*' : 'video/*'}
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex gap-2 flex-wrap">
                  {mediaPreviews.map((preview, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeMedia(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <Plus className="w-6 h-6 text-white/40" />
                    <span className="text-xs text-white/40">Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Poll Form */}
            {selectedType === 'poll' && (
              <div className="space-y-3 p-4 rounded-xl glass">
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
                {pollOptions.map((option, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handlePollOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        onClick={() => handleRemovePollOption(i)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <button
                    onClick={handleAddPollOption}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add option
                  </button>
                )}
              </div>
            )}

            {/* Product Form */}
            {selectedType === 'product' && (
              <div className="space-y-3 p-4 rounded-xl glass">
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  placeholder="Product name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    placeholder="Price"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  />
                  <span className="px-4 py-3 rounded-xl bg-white/5 text-white/60">USD</span>
                </div>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 resize-none focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* AI Assistant Toggle */}
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                showAIAssistant ? 'bg-blue-500/20 text-blue-400' : 'glass text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {showAIAssistant ? 'Hide AI Assistant' : 'Get AI Suggestions'}
            </button>

            {showAIAssistant && (
              <AIAssistantPanel
                content={content}
                intent={selectedIntent}
                onApplySuggestion={handleAISuggestion}
              />
            )}
          </div>
        );

      case 'tags':
        return (
          <TaggingPanel
            content={content}
            taggedUsers={taggedUsers}
            onTagUser={handleTagUser}
            taggedPosts={taggedPosts}
            onTagPost={(postId) => setTaggedPosts(prev => [...prev, postId])}
            hashtags={hashtags}
            onAddHashtag={handleAddHashtag}
            onRemoveHashtag={handleRemoveHashtag}
          />
        );

      case 'space':
        return (
          <PostSpacePanel
            enabled={postSpaceEnabled}
            onToggle={() => setPostSpaceEnabled(!postSpaceEnabled)}
            onGoLive={handleGoLive}
          />
        );

      case 'publish':
        return (
          <div className="space-y-6">
            {/* Visibility */}
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3">Who can see this?</h3>
              <div className="space-y-2">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setVisibility(option.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        visibility === option.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white/60" />
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium">{option.label}</p>
                        <p className="text-sm text-white/50">{option.description}</p>
                      </div>
                      {visibility === option.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monetization */}
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3">Monetization</h3>
              <button
                onClick={() => setMonetization(!monetization)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  monetization
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <DollarSign className={`w-5 h-5 ${monetization ? 'text-green-400' : 'text-white/60'}`} />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">Enable Monetization</p>
                  <p className="text-sm text-white/50">Earn from engagement and tips</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${monetization ? 'bg-green-500' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${monetization ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </button>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3">Schedule (Optional)</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-white/60" />
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl glass">
              <h3 className="text-sm font-medium text-white/60 mb-3">Preview</h3>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <img src={currentUser?.avatar} alt="You" className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{currentUser?.displayName}</span>
                  {selectedIntent && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ 
                        background: `${intents.find(i => i.id === selectedIntent)?.color}30`,
                        color: intents.find(i => i.id === selectedIntent)?.color 
                      }}
                    >
                      {intents.find(i => i.id === selectedIntent)?.label}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm line-clamp-3">{content || 'Your post content will appear here...'}</p>
                {mediaPreviews.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {mediaPreviews.slice(0, 3).map((preview, i) => (
                      <img key={i} src={preview} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    ))}
                    {mediaPreviews.length > 3 && (
                      <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                        +{mediaPreviews.length - 3}
                      </div>
                    )}
                  </div>
                )}
                {postSpaceEnabled && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    <MessageSquare className="w-3 h-3" />
                    Post Space Enabled
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

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
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden glass-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Create Post</h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = !canProceed[tab.id as keyof typeof canProceed];
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id as any)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white border-b-2 border-blue-500'
                    : isDisabled
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/5">
          <button
            onClick={() => {
              const prevTab = tabs[currentTabIndex - 1];
              if (prevTab) setActiveTab(prevTab.id as any);
            }}
            disabled={isFirstTab}
            className="px-6 py-2 rounded-xl glass text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          {!isLastTab ? (
            <button
              onClick={() => {
                const nextTab = tabs[currentTabIndex + 1];
                if (nextTab) setActiveTab(nextTab.id as any);
              }}
              disabled={!canProceed[activeTab as keyof typeof canProceed]}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : scheduledDate ? (
                <>
                  <Clock className="w-4 h-4" />
                  Schedule
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
