import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Edit3, 
  Settings, 
  Grid3X3, 
  Bookmark, 
  Heart,
  Users,
  Briefcase,
  Palette,
  TrendingUp,
  DollarSign,
  Award,
  Zap,
  Share2,
  MessageCircle,
  Check,
  Plus,
  Coins,
  Flame,
  Target,
  Crown,
  Star
} from 'lucide-react';
import { useStore, mockUsers } from '@/store';
import { SettingsPage } from '@/components/SettingsPage';
import type { UserMode } from '@/types';

const modeConfig: Record<UserMode, { 
  icon: typeof Users; 
  color: string; 
  gradient: string; 
  label: string;
  bgGradient: string;
}> = {
  social: { 
    icon: Users, 
    color: '#3B82F6', 
    gradient: 'from-blue-500 to-cyan-500',
    label: 'Social',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  work: { 
    icon: Briefcase, 
    color: '#8B5CF6', 
    gradient: 'from-purple-500 to-pink-500',
    label: 'Work',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  },
  creative: { 
    icon: Palette, 
    color: '#22D3EE', 
    gradient: 'from-cyan-500 to-green-500',
    label: 'Creative',
    bgGradient: 'from-cyan-500/20 to-green-500/20'
  },
};

const achievements = [
  { id: '1', name: 'Early Adopter', description: 'Joined during beta', icon: '🚀', tier: 'platinum', unlockedAt: '2023-01-15' },
  { id: '2', name: 'Content Creator', description: 'Created 100+ posts', icon: '✨', tier: 'gold', unlockedAt: '2023-03-20' },
  { id: '3', name: 'Community Builder', description: 'Gained 10K followers', icon: '🤝', tier: 'silver', unlockedAt: '2023-05-10' },
  { id: '4', name: 'Viral Sensation', description: 'Post reached 100K views', icon: '🔥', tier: 'gold', unlockedAt: '2023-06-15' },
  { id: '5', name: 'Engagement King', description: '10K likes received', icon: '❤️', tier: 'bronze', unlockedAt: '2023-04-01' },
  { id: '6', name: 'Streak Master', description: '30-day streak', icon: '🔥', tier: 'silver', unlockedAt: '2023-07-20' },
];

const tierColors: Record<string, string> = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-gray-300 to-gray-400',
  gold: 'from-yellow-400 to-yellow-500',
  platinum: 'from-cyan-300 to-purple-400',
};

// Tip Modal
function TipModal({ isOpen, onClose, creator }: { isOpen: boolean; onClose: () => void; creator: any }) {
  const { coinBalance, sendTip } = useStore();
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const tipAmounts = [50, 100, 250, 500, 1000];

  const handleSendTip = () => {
    sendTip(creator.id, amount);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
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
            className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {sent ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tip Sent!</h3>
                <p className="text-white/60">Thank you for supporting {creator.displayName}</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={creator.avatar} alt={creator.displayName} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="text-lg font-bold">Send Tip to {creator.displayName}</h3>
                      <p className="text-white/60 text-sm">Show your appreciation</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-white/60 mb-3">Select amount</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {tipAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt)}
                        className={`p-3 rounded-xl border transition-all ${
                          amount === amt 
                            ? 'border-yellow-400 bg-yellow-400/10' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="font-bold">{amt}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 mb-4"
                  />
                  
                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <span>Your balance</span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      {coinBalance.balance}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSendTip}
                    disabled={coinBalance.balance < amount}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold disabled:opacity-50"
                  >
                    Send {amount} Coins
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Analytics Dashboard
function AnalyticsDashboard({ isOpen, onClose, analytics }: { isOpen: boolean; onClose: () => void; analytics: any }) {
  const chartData = [
    { day: 'Mon', views: 12000, engagement: 850 },
    { day: 'Tue', views: 15000, engagement: 1200 },
    { day: 'Wed', views: 18000, engagement: 1500 },
    { day: 'Thu', views: 14000, engagement: 980 },
    { day: 'Fri', views: 22000, engagement: 2100 },
    { day: 'Sat', views: 28000, engagement: 2800 },
    { day: 'Sun', views: 25000, engagement: 2400 },
  ];

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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-auto glass-card rounded-2xl"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Creator Analytics
              </h3>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <p className="text-sm text-white/60 mb-1">Total Engagement</p>
                  <p className="text-2xl font-bold">{analytics.totalEngagement}M</p>
                  <p className="text-xs text-green-400">+12.5% this week</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <p className="text-sm text-white/60 mb-1">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${analytics.monthlyEarnings.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+8.3% this month</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <p className="text-sm text-white/60 mb-1">Audience Growth</p>
                  <p className="text-2xl font-bold text-blue-400">+{analytics.audienceGrowth}%</p>
                  <p className="text-xs text-blue-400">+2,450 new followers</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <p className="text-sm text-white/60 mb-1">Avg. Engagement</p>
                  <p className="text-2xl font-bold">{analytics.contentPerformance.avgLikes.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+5.2% vs last week</p>
                </div>
              </div>

              {/* Chart */}
              <div className="p-4 rounded-xl glass">
                <h4 className="font-semibold mb-4">Weekly Performance</h4>
                <div className="flex items-end justify-between h-40 gap-2">
                  {chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1 h-32 items-end">
                        <div 
                          className="flex-1 bg-blue-500/50 rounded-t"
                          style={{ height: `${(data.views / 30000) * 100}%` }}
                        />
                        <div 
                          className="flex-1 bg-purple-500/50 rounded-t"
                          style={{ height: `${(data.engagement / 3000) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/50">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500/50" />
                    <span className="text-sm text-white/60">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500/50" />
                    <span className="text-sm text-white/60">Engagement</span>
                  </div>
                </div>
              </div>

              {/* Top Posts */}
              <div>
                <h4 className="font-semibold mb-4">Top Performing Posts</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Design Systems Workshop', views: '45.2K', engagement: '8.5K', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=100&fit=crop' },
                    { title: 'React Best Practices', views: '38.1K', engagement: '6.2K', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop' },
                    { title: 'UI/UX Tips Collection', views: '32.8K', engagement: '5.1K', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop' },
                  ].map((post, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl glass">
                      <img src={post.image} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{post.title}</p>
                        <div className="flex gap-4 text-sm text-white/50">
                          <span>{post.views} views</span>
                          <span>{post.engagement} engagements</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">#{i + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Edit Profile Modal
function EditProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser } = useStore();
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    bio: currentUser?.bio || '',
    location: 'San Francisco, CA',
    website: 'nexus.social/sarah',
  });

  const handleSave = () => {
    // Save profile logic
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
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={currentUser?.avatar} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white/10"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl glass hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProfilePage() {
  const { currentUser, currentMode, setModeSwitcherOpen, coinBalance, dailyMissions, streak, claimMission } = useStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'likes' | 'achievements'>('posts');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const modeInfo = modeConfig[currentMode];
  const ModeIcon = modeInfo.icon;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-white/50">Please sign in to view your profile</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const joinedDate = new Date(currentUser.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-16">
        <img
          src={currentUser.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 p-2 rounded-lg glass text-white/70 hover:text-white transition-colors">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 -mt-12 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1"
              style={{ background: `linear-gradient(135deg, ${modeInfo.color}, transparent)` }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full rounded-full object-cover ring-4 ring-[#0B0B0F]"
              />
            </div>
            <div 
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: modeInfo.color }}
            >
              <ModeIcon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{currentUser.displayName}</h1>
              {currentUser.isVerified && (
                <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </div>
            <p className="text-white/50">@{currentUser.username}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl glass text-white/70 hover:text-white flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl glass text-white/70 hover:text-white flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl glass text-white/70 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-white/80">{currentUser.bio}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            San Francisco, CA
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="text-blue-400 hover:underline">nexus.social/sarah</a>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {joinedDate}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <button className="text-white/70 hover:text-white transition-colors">
            <span className="font-bold text-white">{formatNumber(currentUser.following)}</span>{' '}
            <span className="text-white/50">Following</span>
          </button>
          <button className="text-white/70 hover:text-white transition-colors">
            <span className="font-bold text-white">{formatNumber(currentUser.followers)}</span>{' '}
            <span className="text-white/50">Followers</span>
          </button>
          <button className="text-white/70 hover:text-white transition-colors">
            <span className="font-bold text-white">{formatNumber(currentUser.posts)}</span>{' '}
            <span className="text-white/50">Posts</span>
          </button>
        </div>
      </div>

      {/* Streak & Coins */}
      <div className="px-4 mb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="font-bold">{streak.current}</span>
            <span className="text-white/50 text-sm">day streak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">{coinBalance.balance}</span>
            <span className="text-white/50 text-sm">coins</span>
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="px-4 mb-8">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Daily Missions</h3>
        <div className="space-y-2">
          {dailyMissions.map((mission) => (
            <div key={mission.id} className="flex items-center gap-3 p-3 rounded-xl glass">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mission.completed ? 'bg-green-500/20' : 'bg-white/5'}`}>
                {mission.completed ? <Check className="w-5 h-5 text-green-400" /> : <Target className="w-5 h-5 text-white/50" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${mission.completed ? 'text-white/50 line-through' : 'text-white'}`}>{mission.title}</p>
                <p className="text-sm text-white/50">{mission.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-400">+{mission.reward}</p>
                <p className="text-xs text-white/30">{mission.progress}/{mission.maxProgress}</p>
              </div>
              {!mission.completed && mission.progress >= mission.maxProgress && (
                <button 
                  onClick={() => claimMission(mission.id)}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-sm"
                >
                  Claim
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 mb-8">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Achievements</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer group"
              title={achievement.description}
            >
              <span className="text-xl">{achievement.icon}</span>
              <span className="text-sm text-white">{achievement.name}</span>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl glass mx-4 mb-6">
        {[
          { id: 'posts', icon: Grid3X3, label: 'Posts' },
          { id: 'saved', icon: Bookmark, label: 'Saved' },
          { id: 'likes', icon: Heart, label: 'Likes' },
          { id: 'achievements', icon: Award, label: 'Badges' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer group relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${[
                    '1618005182384-a83a8bd57fbe',
                    '1561214115-f2f134cc4912',
                    '1558591710-4b4a1ae0f04d',
                    '1614850523459-c2f4c699c52e',
                    '1579546929518-9e396f3cc809',
                    '1550745165-9bc0b252726f',
                    '1611162617474-5b21e879e113',
                    '1618556450994-a6a128ef0d9d',
                    '1614851099518-94d0e2f1d622',
                  ][i]}?w=400&h=400&fit=crop`}
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-white">
                    <Heart className="w-4 h-4 fill-current" /> {Math.floor(Math.random() * 10000)}
                  </span>
                  <span className="flex items-center gap-1 text-white">
                    <MessageCircle className="w-4 h-4" /> {Math.floor(Math.random() * 500)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No saved posts yet</p>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No liked posts yet</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                className="p-4 rounded-xl glass hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]} flex items-center justify-center text-3xl mb-3 mx-auto`}>
                  {achievement.icon}
                </div>
                <h4 className="text-center font-semibold">{achievement.name}</h4>
                <p className="text-center text-sm text-white/50">{achievement.description}</p>
                <p className="text-center text-xs text-white/30 mt-2">Unlocked {timeAgo(achievement.unlockedAt)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnalyticsDashboard 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
        analytics={currentUser.analytics}
      />
      <TipModal 
        isOpen={showTipModal} 
        onClose={() => setShowTipModal(false)} 
        creator={currentUser}
      />
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)}
      />
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsPage onClose={() => setShowSettings(false)} />
      )}
    </div>
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
