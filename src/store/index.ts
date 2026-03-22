import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  UserMode, 
  UserIntent,
  FeedType, 
  Notification, 
  Conversation,
  Message,
  Post,
  PostType,
  PostVisibility,
  AppState,
  CoinBalance,
  Transaction,
  Achievement,
  Streak,
  LiveStream,
  SearchResult,
  PostSpace,
  SpaceMessage,
  UserSettings
} from '@/types';

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface StoreState extends AppState {
  // User Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setCurrentMode: (mode: UserMode) => void;
  setCurrentFeed: (feed: FeedType) => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  logout: () => void;
  
  // Posts
  posts: Post[];
  comments: Record<string, Comment[]>;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  hidePost: (postId: string) => void;
  unhidePost: (postId: string) => void;
  sharePost: (postId: string, platform?: string) => void;
  repostPost: (postId: string, content?: string) => void;
  incrementPostViews: (postId: string) => void;
  
  // Comments
  addComment: (postId: string, content: string) => void;
  likeComment: (commentId: string) => void;
  unlikeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  replyToComment: (postId: string, parentCommentId: string, content: string) => void;
  
  // Stories
  stories: Story[];
  addStory: (story: Story) => void;
  viewStory: (storyId: string) => void;
  
  // Notifications
  notifications: Notification[];
  unreadNotifications: number;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Messages
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  unreadMessages: number;
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string, type?: string) => void;
  sendVoiceMessage: (conversationId: string, audioUrl: string, duration: number) => void;
  sendMediaMessage: (conversationId: string, mediaUrl: string, type: 'image' | 'video') => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  markConversationRead: (id: string) => void;
  createGroupChat: (name: string, participantIds: string[]) => void;
  searchMessages: (query: string) => Message[];
  
  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  searchHistory: string[];
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearchHistory: () => void;
  removeFromSearchHistory: (query: string) => void;
  
  // Live Streams
  liveStreams: LiveStream[];
  activeLiveStream: string | null;
  startLiveStream: (title: string, description?: string) => void;
  endLiveStream: (streamId: string) => void;
  joinLiveStream: (streamId: string) => void;
  leaveLiveStream: (streamId: string) => void;
  sendLiveComment: (streamId: string, content: string) => void;
  sendLiveGift: (streamId: string, giftType: string, amount: number) => void;
  createLivePoll: (streamId: string, question: string, options: string[]) => void;
  voteLivePoll: (streamId: string, optionId: string) => void;
  
  // Monetization
  coinBalance: CoinBalance;
  transactions: Transaction[];
  addCoins: (amount: number) => void;
  spendCoins: (amount: number, description: string) => boolean;
  sendTip: (recipientId: string, amount: number) => void;
  purchaseSubscription: (creatorId: string, tier: string) => void;
  withdrawEarnings: (amount: number, method: string) => void;
  
  // Achievements & Gamification
  achievements: Achievement[];
  streak: Streak;
  dailyMissions: DailyMission[];
  claimMission: (missionId: string) => void;
  updateStreak: () => void;
  
  // UI State
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  isLiveModalOpen: boolean;
  setLiveModalOpen: (open: boolean) => void;
  isModeSwitcherOpen: boolean;
  setModeSwitcherOpen: (open: boolean) => void;
  activeBottomSheet: string | null;
  setActiveBottomSheet: (sheet: string | null) => void;
  showReactionWheel: string | null;
  setShowReactionWheel: (postId: string | null) => void;
  
  // AI Features
  aiSuggestions: string[];
  generateAIContent: (prompt: string) => string;
  autoTagContent: (content: string) => string[];
  getContentRemix: (postId: string) => string[];
  getAISuggestedConnections: () => User[];
  
  // Post Spaces
  postSpaces: PostSpace[];
  activePostSpace: string | null;
  createPostSpace: (postId: string) => void;
  joinPostSpace: (spaceId: string) => void;
  leavePostSpace: (spaceId: string) => void;
  sendSpaceMessage: (spaceId: string, content: string) => void;
  sendSpaceReaction: (spaceId: string, emoji: string) => void;
  createSpacePoll: (spaceId: string, question: string, options: string[]) => void;
  voteSpacePoll: (spaceId: string, pollId: string, optionId: string) => void;
  getPostSpace: (postId: string) => PostSpace | undefined;
  
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateNotificationSettings: (key: keyof UserSettings['notifications'], value: boolean) => void;
  updatePrivacySettings: (key: keyof UserSettings['privacy'], value: any) => void;
  
  // Profile
  updateProfile: (data: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  type: 'image' | 'video';
  createdAt: string;
  expiresAt: string;
  views: string[];
  isViewed?: boolean;
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

const initialState: Omit<StoreState, 
  'setCurrentUser' | 'setAuthenticated' | 'setCurrentMode' | 'setCurrentFeed' | 
  'setTheme' | 'logout' | 'setPosts' | 'addPost' | 'deletePost' | 'likePost' | 
  'unlikePost' | 'savePost' | 'unsavePost' | 'hidePost' | 'unhidePost' | 
  'sharePost' | 'repostPost' | 'incrementPostViews' | 'addComment' | 'likeComment' |
  'unlikeComment' | 'deleteComment' | 'replyToComment' | 'addStory' | 'viewStory' |
  'addNotification' | 'markNotificationRead' | 'markAllNotificationsRead' | 
  'deleteNotification' | 'setActiveConversation' | 'sendMessage' | 'sendVoiceMessage' |
  'sendMediaMessage' | 'reactToMessage' | 'markConversationRead' | 'createGroupChat' |
  'searchMessages' | 'setSearchQuery' | 'performSearch' | 'clearSearchHistory' |
  'removeFromSearchHistory' | 'startLiveStream' | 'endLiveStream' | 'joinLiveStream' |
  'leaveLiveStream' | 'sendLiveComment' | 'sendLiveGift' | 'createLivePoll' |
  'voteLivePoll' | 'addCoins' | 'spendCoins' | 'sendTip' | 'purchaseSubscription' |
  'withdrawEarnings' | 'claimMission' | 'updateStreak' | 'setCreateModalOpen' |
  'setSearchOpen' | 'setNotificationsOpen' | 'setLiveModalOpen' | 'setModeSwitcherOpen' |
  'setActiveBottomSheet' | 'setShowReactionWheel' | 'generateAIContent' | 
  'autoTagContent' | 'getContentRemix' | 'getAISuggestedConnections' |
  'createPostSpace' | 'joinPostSpace' | 'leavePostSpace' | 'sendSpaceMessage' |
  'sendSpaceReaction' | 'createSpacePoll' | 'voteSpacePoll' | 'getPostSpace' |
  'updateSettings' | 'updateNotificationSettings' | 'updatePrivacySettings' |
  'updateProfile' | 'followUser' | 'unfollowUser'
> = {
  currentUser: null,
  isAuthenticated: false,
  currentMode: 'social',
  currentFeed: 'global',
  theme: 'dark',
  language: 'en',
  notifications: [],
  unreadNotifications: 0,
  conversations: [],
  messages: {},
  unreadMessages: 0,
  activeConversation: null,
  posts: [],
  comments: {},
  stories: [],
  searchQuery: '',
  searchResults: [],
  searchHistory: [],
  liveStreams: [],
  activeLiveStream: null,
  coinBalance: {
    userId: '',
    balance: 1000,
    lifetimeEarned: 0,
    lifetimeSpent: 0,
  },
  transactions: [],
  achievements: [],
  streak: {
    current: 5,
    longest: 12,
    lastActive: new Date().toISOString(),
  },
  dailyMissions: [
    { id: '1', title: 'Post Content', description: 'Create a post today', reward: 50, completed: false, progress: 0, maxProgress: 1 },
    { id: '2', title: 'Engage with Community', description: 'Like 5 posts', reward: 30, completed: false, progress: 2, maxProgress: 5 },
    { id: '3', title: 'Make Connections', description: 'Follow 3 new people', reward: 40, completed: false, progress: 1, maxProgress: 3 },
  ],
  isCreateModalOpen: false,
  isSearchOpen: false,
  isNotificationsOpen: false,
  isLiveModalOpen: false,
  isModeSwitcherOpen: false,
  activeBottomSheet: null,
  showReactionWheel: null,
  aiSuggestions: [],
  postSpaces: [],
  activePostSpace: null,
  settings: {
    theme: 'dark',
    notifications: {
      messages: true,
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      liveStreams: true,
      emailDigest: false,
    },
    privacy: {
      accountVisibility: 'public',
      allowTagging: true,
      allowMessaging: 'everyone',
      showActivityStatus: true,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
    },
  },
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'sarah_chen',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
    bio: 'Digital creator | Tech enthusiast | Building the future 🚀',
    mode: 'creative',
    followers: 125000,
    following: 850,
    posts: 342,
    isVerified: true,
    joinedAt: '2023-01-15T00:00:00Z',
    interests: ['technology', 'design', 'photography'],
    socialStats: { followers: 125000, following: 850, posts: 342 },
    workStats: { connections: 2500, projects: 45, endorsements: 180 },
    creativeStats: { followers: 125000, portfolio: 89, collaborations: 34 },
    analytics: {
      totalEngagement: 2.5,
      monthlyEarnings: 8500,
      topPosts: ['1', '2', '3'],
      audienceGrowth: 15.2,
      contentPerformance: {
        posts: 342,
        avgLikes: 8500,
        avgComments: 420,
        avgShares: 180,
      },
    },
  },
  {
    id: '2',
    username: 'marcus_j',
    displayName: 'Marcus Johnson',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
    bio: 'Product Designer @ TechCorp | Mentor | Speaker',
    mode: 'work',
    followers: 45000,
    following: 1200,
    posts: 156,
    isVerified: true,
    joinedAt: '2023-03-20T00:00:00Z',
    interests: ['design', 'business', 'leadership'],
    socialStats: { followers: 45000, following: 1200, posts: 156 },
    workStats: { connections: 3200, projects: 67, endorsements: 240 },
    creativeStats: { followers: 12000, portfolio: 34, collaborations: 12 },
  },
  {
    id: '3',
    username: 'emma_williams',
    displayName: 'Emma Williams',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&h=400&fit=crop',
    bio: 'Artist | Dreamer | Creating magic every day ✨',
    mode: 'social',
    followers: 89000,
    following: 2100,
    posts: 567,
    isVerified: false,
    joinedAt: '2023-02-10T00:00:00Z',
    interests: ['art', 'music', 'travel'],
    socialStats: { followers: 89000, following: 2100, posts: 567 },
    workStats: { connections: 800, projects: 23, endorsements: 65 },
    creativeStats: { followers: 89000, portfolio: 156, collaborations: 45 },
  },
  {
    id: '4',
    username: 'alex_rivera',
    displayName: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'Full-stack developer | Open source contributor | Coffee addict ☕',
    mode: 'work',
    followers: 67000,
    following: 980,
    posts: 234,
    isVerified: true,
    joinedAt: '2023-04-05T00:00:00Z',
    interests: ['coding', 'technology', 'open-source'],
    socialStats: { followers: 67000, following: 980, posts: 234 },
    workStats: { connections: 1800, projects: 89, endorsements: 156 },
    creativeStats: { followers: 15000, portfolio: 45, collaborations: 23 },
  },
  {
    id: '5',
    username: 'sophie_design',
    displayName: 'Sophie Chen',
    email: 'sophie@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'UI/UX Designer | Creating beautiful experiences 🎨',
    mode: 'creative',
    followers: 92000,
    following: 1500,
    posts: 412,
    isVerified: true,
    joinedAt: '2023-01-28T00:00:00Z',
    interests: ['design', 'art', 'photography'],
    socialStats: { followers: 92000, following: 1500, posts: 412 },
    workStats: { connections: 2100, projects: 78, endorsements: 198 },
    creativeStats: { followers: 92000, portfolio: 134, collaborations: 56 },
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    author: mockUsers[0],
    type: 'image',
    intent: 'entertain',
    content: 'Just finished this amazing photoshoot! The golden hour lighting was absolutely perfect. What do you think? 📸✨\n\n#photography #goldenhour #nature #landscape',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop',
        aspectRatio: 0.8,
      },
    ],
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    monetization: false,
    stats: { views: 45000, likes: 8200, comments: 342, shares: 156, saves: 890 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['photography', 'goldenhour', 'nature', 'landscape'],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    authorId: '2',
    author: mockUsers[1],
    type: 'text',
    intent: 'teach',
    content: '5 key principles of effective UX design:\n\n1. Clarity over complexity\n2. Consistency is key\n3. Feedback matters\n4. Accessibility first\n5. Test, iterate, improve\n\nWhat would you add to this list? 🤔\n\n#uxdesign #designtips #productdesign #tech',
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    monetization: true,
    stats: { views: 32000, likes: 5400, comments: 278, shares: 423, saves: 1200 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['uxdesign', 'designtips', 'productdesign', 'tech'],
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    authorId: '3',
    author: mockUsers[2],
    type: 'video',
    intent: 'entertain',
    content: 'Behind the scenes of my latest art installation! This took 3 months to complete but seeing it come to life was worth every moment 🎨\n\n#art #installation #behindthescenes #creative',
    media: [
      {
        id: 'm2',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
        duration: 184,
        aspectRatio: 1.33,
      },
    ],
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    monetization: true,
    coCreators: ['1'],
    revenueSplit: { '1': 30, '3': 70 },
    stats: { views: 78000, likes: 12400, comments: 567, shares: 234, saves: 1500 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['art', 'installation', 'behindthescenes', 'creative'],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '4',
    authorId: '1',
    author: mockUsers[0],
    type: 'poll',
    intent: 'ask',
    content: 'Which feature should we build next for creators? Your vote matters! 🗳️\n\n#poll #creators #feedback #community',
    poll: {
      id: 'p1',
      question: 'Which feature should we build next?',
      options: [
        { id: 'o1', text: 'Advanced Analytics Dashboard', votes: 2340 },
        { id: 'o2', text: 'AI Content Assistant', votes: 1890 },
        { id: 'o3', text: 'Collaboration Tools', votes: 1560 },
        { id: 'o4', text: 'Monetization Options', votes: 2100 },
      ],
      totalVotes: 7890,
    },
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    monetization: false,
    stats: { views: 25000, likes: 3200, comments: 189, shares: 67, saves: 234 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['poll', 'creators', 'feedback', 'community'],
    isLiked: true,
    isSaved: false,
  },
  {
    id: '5',
    authorId: '4',
    author: mockUsers[3],
    type: 'product',
    intent: 'sell',
    content: 'Excited to launch my new React course! Learn everything from fundamentals to advanced patterns. Early bird pricing ends soon! 🎓\n\n#course #react #javascript #education',
    product: {
      id: 'prod1',
      name: 'Master React Development',
      description: 'Complete guide to React from fundamentals to advanced patterns including hooks, context, and performance optimization',
      price: 199,
      currency: 'USD',
      images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'],
    },
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    monetization: true,
    stats: { views: 15000, likes: 2100, comments: 145, shares: 89, saves: 567 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['course', 'react', 'javascript', 'education'],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '6',
    authorId: '5',
    author: mockUsers[4],
    type: 'image',
    intent: 'teach',
    content: 'Design tip: Use the 60-30-10 rule for color balance in your designs. 60% dominant color, 30% secondary, 10% accent. It creates visual harmony every time! 🎨\n\n#designtips #color theory #uiux #designsystem',
    media: [
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
        aspectRatio: 1.33,
      },
    ],
    visibility: 'public',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    monetization: false,
    stats: { views: 28000, likes: 4200, comments: 198, shares: 312, saves: 890 },
    engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
    tags: ['designtips', 'colortheory', 'uiux', 'designsystem'],
    isLiked: false,
    isSaved: false,
  },
];

// Mock Comments
const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      postId: '1',
      authorId: '2',
      author: mockUsers[1],
      content: 'Absolutely stunning! The composition is perfect 🔥',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      isLiked: false,
    },
    {
      id: 'c2',
      postId: '1',
      authorId: '3',
      author: mockUsers[2],
      content: 'Golden hour magic! What camera did you use?',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      likes: 23,
      isLiked: true,
    },
  ],
  '2': [
    {
      id: 'c3',
      postId: '2',
      authorId: '1',
      author: mockUsers[0],
      content: 'Great list! I would add "Empathy for users" as #6',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      isLiked: false,
    },
    {
      id: 'c4',
      postId: '2',
      authorId: '4',
      author: mockUsers[3],
      content: 'Testing is so underrated. Great point!',
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      likes: 56,
      isLiked: false,
    },
  ],
};

// Mock Stories
const mockStories: Story[] = [
  {
    id: 's1',
    userId: '1',
    user: mockUsers[0],
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    type: 'image',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    views: [],
  },
  {
    id: 's2',
    userId: '2',
    user: mockUsers[1],
    mediaUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=700&fit=crop',
    type: 'image',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    views: ['1'],
    isViewed: true,
  },
  {
    id: 's3',
    userId: '3',
    user: mockUsers[2],
    mediaUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=700&fit=crop',
    type: 'video',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    views: [],
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [mockUsers[1]],
    lastMessage: {
      id: 'm1',
      senderId: '2',
      receiverId: '1',
      content: 'Hey! Loved your latest post. Would love to collaborate on something together.',
      type: 'text',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
    unreadCount: 2,
    isGroup: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    participants: [mockUsers[2]],
    lastMessage: {
      id: 'm2',
      senderId: '1',
      receiverId: '3',
      content: 'The art installation looks incredible! When is the opening?',
      type: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    isGroup: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3',
    participants: [mockUsers[3], mockUsers[4]],
    lastMessage: {
      id: 'm3',
      senderId: '4',
      receiverId: '1',
      content: 'Great work on the new feature! 🚀',
      type: 'text',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    isGroup: true,
    groupName: 'Design Team',
    groupAvatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Messages
const mockMessages: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      senderId: '2',
      receiverId: '1',
      content: 'Hey! Loved your latest post. Would love to collaborate on something together.',
      type: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: 'm2',
      senderId: '2',
      receiverId: '1',
      content: 'I have this idea for a creative project that I think you\'d be perfect for!',
      type: 'text',
      createdAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ],
  'c2': [
    {
      id: 'm3',
      senderId: '3',
      receiverId: '1',
      content: 'Thanks for the support on my post! 🙏',
      type: 'text',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: 'm4',
      senderId: '1',
      receiverId: '3',
      content: 'The art installation looks incredible! When is the opening?',
      type: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ],
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'liked your post',
    postId: '1',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'n2',
    type: 'follow',
    sender: mockUsers[2],
    recipientId: '1',
    content: 'started following you',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'n3',
    type: 'comment',
    sender: mockUsers[1],
    recipientId: '1',
    content: 'commented: "Amazing work! 🔥"',
    postId: '2',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n4',
    type: 'coCreate',
    sender: mockUsers[2],
    recipientId: '1',
    content: 'invited you to co-create a post',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n5',
    type: 'mention',
    sender: mockUsers[3],
    recipientId: '1',
    content: 'mentioned you in a comment',
    postId: '3',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Live Streams
const mockLiveStreams: LiveStream[] = [
  {
    id: 'ls1',
    hostId: '1',
    host: mockUsers[0],
    title: 'Design Systems Workshop',
    description: 'Learn how to build scalable design systems',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    status: 'live',
    viewers: 1240,
    totalViewers: 3500,
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    chatEnabled: true,
    giftsEnabled: true,
    coCreationEnabled: true,
  },
  {
    id: 'ls2',
    hostId: '4',
    host: mockUsers[3],
    title: 'Live Coding: Building a React App',
    description: 'Building a full-stack app from scratch',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    status: 'live',
    viewers: 856,
    totalViewers: 2100,
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    chatEnabled: true,
    giftsEnabled: true,
    coCreationEnabled: false,
  },
];

// Create Store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      posts: mockPosts,
      comments: mockComments,
      stories: mockStories,
      conversations: mockConversations,
      messages: mockMessages,
      notifications: mockNotifications,
      liveStreams: mockLiveStreams,
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setCurrentMode: (mode) => set({ currentMode: mode }),
      
      setCurrentFeed: (feed) => set({ currentFeed: feed }),
      
      setTheme: (theme) => set({ theme }),
      
      logout: () => {
        set({
          ...initialState,
          theme: get().theme,
          language: get().language,
        });
      },
      
      setPosts: (posts) => set({ posts }),
      
      addPost: (post) => {
        const { posts } = get();
        set({ posts: [post, ...posts] });
      },
      
      deletePost: (postId) => {
        const { posts } = get();
        set({ posts: posts.filter(p => p.id !== postId) });
      },
      
      likePost: (postId) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const updated = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, likes: post.stats.likes + 1 },
                engagement: { 
                  ...post.engagement, 
                  likedBy: [...post.engagement.likedBy, currentUser.id] 
                },
                isLiked: true 
              }
            : post
        );
        set({ posts: updated });
      },
      
      unlikePost: (postId) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const updated = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, likes: Math.max(0, post.stats.likes - 1) },
                engagement: { 
                  ...post.engagement, 
                  likedBy: post.engagement.likedBy.filter(id => id !== currentUser.id) 
                },
                isLiked: false 
              }
            : post
        );
        set({ posts: updated });
      },
      
      savePost: (postId) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const updated = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, saves: post.stats.saves + 1 },
                engagement: { 
                  ...post.engagement, 
                  savedBy: [...post.engagement.savedBy, currentUser.id] 
                },
                isSaved: true 
              }
            : post
        );
        set({ posts: updated });
      },
      
      unsavePost: (postId) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const updated = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, saves: Math.max(0, post.stats.saves - 1) },
                engagement: { 
                  ...post.engagement, 
                  savedBy: post.engagement.savedBy.filter(id => id !== currentUser.id) 
                },
                isSaved: false 
              }
            : post
        );
        set({ posts: updated });
      },
      
      hidePost: (postId) => {
        const { posts } = get();
        const updated = posts.map(post => 
          post.id === postId ? { ...post, status: 'archived' as const } : post
        );
        set({ posts: updated });
      },
      
      unhidePost: (postId) => {
        const { posts } = get();
        const updated = posts.map(post => 
          post.id === postId ? { ...post, status: 'active' as const } : post
        );
        set({ posts: updated });
      },
      
      sharePost: (postId, platform) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const updated = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { ...post.stats, shares: post.stats.shares + 1 },
                engagement: { 
                  ...post.engagement, 
                  sharedBy: [...post.engagement.sharedBy, currentUser.id] 
                },
              }
            : post
        );
        set({ posts: updated });
        
        // In a real app, this would open share dialog
        if (platform) {
          const url = `https://nexus.social/post/${postId}`;
          const shareUrls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          };
          if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank');
          }
        }
      },
      
      repostPost: (postId, content) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const originalPost = posts.find(p => p.id === postId);
        if (!originalPost) return;
        
        const repost: Post = {
          ...originalPost,
          id: `repost-${Date.now()}`,
          authorId: currentUser.id,
          author: currentUser,
          content: content ? `${content}\n\nReposting @${originalPost.author.username}:\n${originalPost.content}` : `Reposting @${originalPost.author.username}:\n${originalPost.content}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 },
          engagement: { likedBy: [], commentedBy: [], sharedBy: [], savedBy: [] },
          isLiked: false,
          isSaved: false,
        };
        
        set({ posts: [repost, ...posts] });
      },
      
      incrementPostViews: (postId) => {
        const { posts } = get();
        const updated = posts.map(post => 
          post.id === postId 
            ? { ...post, stats: { ...post.stats, views: post.stats.views + 1 } }
            : post
        );
        set({ posts: updated });
      },
      
      addComment: (postId, content) => {
        const { comments, currentUser } = get();
        if (!currentUser) return;
        
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          postId,
          authorId: currentUser.id,
          author: currentUser,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
        };
        
        set({
          comments: {
            ...comments,
            [postId]: [...(comments[postId] || []), newComment],
          },
        });
        
        // Update post comment count
        const { posts } = get();
        const updatedPosts = posts.map(post => 
          post.id === postId 
            ? { ...post, stats: { ...post.stats, comments: post.stats.comments + 1 } }
            : post
        );
        set({ posts: updatedPosts });
      },
      
      likeComment: (commentId) => {
        const { comments } = get();
        const updatedComments: Record<string, Comment[]> = {};
        
        Object.entries(comments).forEach(([postId, postComments]) => {
          updatedComments[postId] = postComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: comment.likes + 1, isLiked: true }
              : comment
          );
        });
        
        set({ comments: updatedComments });
      },
      
      unlikeComment: (commentId) => {
        const { comments } = get();
        const updatedComments: Record<string, Comment[]> = {};
        
        Object.entries(comments).forEach(([postId, postComments]) => {
          updatedComments[postId] = postComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: Math.max(0, comment.likes - 1), isLiked: false }
              : comment
          );
        });
        
        set({ comments: updatedComments });
      },
      
      deleteComment: (commentId) => {
        const { comments } = get();
        const updatedComments: Record<string, Comment[]> = {};
        
        Object.entries(comments).forEach(([postId, postComments]) => {
          updatedComments[postId] = postComments.filter(comment => comment.id !== commentId);
        });
        
        set({ comments: updatedComments });
      },
      
      replyToComment: (postId, parentCommentId, content) => {
        const { comments, currentUser } = get();
        if (!currentUser) return;
        
        const reply: Comment = {
          id: `reply-${Date.now()}`,
          postId,
          authorId: currentUser.id,
          author: currentUser,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
        };
        
        const updatedComments = comments[postId].map(comment =>
          comment.id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        );
        
        set({
          comments: {
            ...comments,
            [postId]: updatedComments,
          },
        });
      },
      
      addStory: (story) => {
        const { stories } = get();
        set({ stories: [story, ...stories] });
      },
      
      viewStory: (storyId) => {
        const { stories, currentUser } = get();
        if (!currentUser) return;
        
        const updated = stories.map(story =>
          story.id === storyId && !story.views.includes(currentUser.id)
            ? { ...story, views: [...story.views, currentUser.id] }
            : story
        );
        set({ stories: updated });
      },
      
      addNotification: (notification) => {
        const { notifications } = get();
        set({
          notifications: [notification, ...notifications],
          unreadNotifications: get().unreadNotifications + 1,
        });
      },
      
      markNotificationRead: (id) => {
        const { notifications } = get();
        const updated = notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        const unread = updated.filter(n => !n.read).length;
        set({ notifications: updated, unreadNotifications: unread });
      },
      
      markAllNotificationsRead: () => {
        const { notifications } = get();
        const updated = notifications.map(n => ({ ...n, read: true }));
        set({ notifications: updated, unreadNotifications: 0 });
      },
      
      deleteNotification: (id) => {
        const { notifications } = get();
        const updated = notifications.filter(n => n.id !== id);
        const unread = updated.filter(n => !n.read).length;
        set({ notifications: updated, unreadNotifications: unread });
      },
      
      setActiveConversation: (id) => set({ activeConversation: id }),
      
      sendMessage: (conversationId, content, type = 'text') => {
        const { messages, currentUser, conversations } = get();
        if (!currentUser) return;
        
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          receiverId: conversationId,
          content,
          type: type as 'text' | 'image' | 'video' | 'voice',
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        
        set({
          messages: {
            ...messages,
            [conversationId]: [...(messages[conversationId] || []), newMessage],
          },
        });
        
        // Update conversation last message
        const updatedConversations = conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
            : conv
        );
        set({ conversations: updatedConversations });
      },
      
      sendVoiceMessage: (conversationId, audioUrl, duration) => {
        const { sendMessage } = get();
        sendMessage(conversationId, `[Voice: ${duration}s]`, 'voice');
      },
      
      sendMediaMessage: (conversationId, mediaUrl, type) => {
        const { sendMessage } = get();
        sendMessage(conversationId, mediaUrl, type);
      },
      
      reactToMessage: (messageId, emoji) => {
        const { messages } = get();
        const updatedMessages: Record<string, Message[]> = {};
        
        Object.entries(messages).forEach(([convId, convMessages]) => {
          updatedMessages[convId] = convMessages.map(msg =>
            msg.id === messageId
              ? { ...msg, reactions: [...(msg.reactions || []), { userId: get().currentUser?.id || '', emoji }] }
              : msg
          );
        });
        
        set({ messages: updatedMessages });
      },
      
      markConversationRead: (id) => {
        const { conversations } = get();
        const updated = conversations.map(conv => 
          conv.id === id ? { ...conv, unreadCount: 0 } : conv
        );
        const unread = updated.reduce((acc, conv) => acc + conv.unreadCount, 0);
        set({ conversations: updated, unreadMessages: unread });
      },
      
      createGroupChat: (name, participantIds) => {
        const { conversations, currentUser } = get();
        if (!currentUser) return;
        
        const newConversation: Conversation = {
          id: `group-${Date.now()}`,
          participants: participantIds.map(id => mockUsers.find(u => u.id === id)!).filter(Boolean),
          unreadCount: 0,
          isGroup: true,
          groupName: name,
          groupAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({ conversations: [newConversation, ...conversations] });
      },
      
      searchMessages: (query) => {
        const { messages } = get();
        const results: Message[] = [];
        
        Object.values(messages).forEach(convMessages => {
          convMessages.forEach(msg => {
            if (msg.content.toLowerCase().includes(query.toLowerCase())) {
              results.push(msg);
            }
          });
        });
        
        return results;
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      performSearch: (query) => {
        const { posts, conversations } = get();
        const results: SearchResult[] = [];
        
        // Search posts
        posts.forEach(post => {
          if (post.content.toLowerCase().includes(query.toLowerCase()) ||
              post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
            results.push({ type: 'post', item: post, score: 1 });
          }
        });
        
        // Search users
        mockUsers.forEach(user => {
          if (user.displayName.toLowerCase().includes(query.toLowerCase()) ||
              user.username.toLowerCase().includes(query.toLowerCase()) ||
              user.bio.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'user', item: user, score: 1 });
          }
        });
        
        set({ searchResults: results });
        
        // Add to history
        const { searchHistory } = get();
        if (query && !searchHistory.includes(query)) {
          set({ searchHistory: [query, ...searchHistory].slice(0, 10) });
        }
      },
      
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      removeFromSearchHistory: (query) => {
        const { searchHistory } = get();
        set({ searchHistory: searchHistory.filter(q => q !== query) });
      },
      
      startLiveStream: (title, description) => {
        const { liveStreams, currentUser } = get();
        if (!currentUser) return;
        
        const newStream: LiveStream = {
          id: `live-${Date.now()}`,
          hostId: currentUser.id,
          host: currentUser,
          title,
          description,
          status: 'live',
          viewers: 0,
          totalViewers: 0,
          startedAt: new Date().toISOString(),
          chatEnabled: true,
          giftsEnabled: true,
          coCreationEnabled: true,
        };
        
        set({ 
          liveStreams: [newStream, ...liveStreams],
          activeLiveStream: newStream.id,
        });
      },
      
      endLiveStream: (streamId) => {
        const { liveStreams } = get();
        const updated = liveStreams.map(stream =>
          stream.id === streamId
            ? { ...stream, status: 'ended' as const, endedAt: new Date().toISOString() }
            : stream
        );
        set({ liveStreams: updated, activeLiveStream: null });
      },
      
      joinLiveStream: (streamId) => {
        const { liveStreams } = get();
        const updated = liveStreams.map(stream =>
          stream.id === streamId
            ? { ...stream, viewers: stream.viewers + 1, totalViewers: stream.totalViewers + 1 }
            : stream
        );
        set({ liveStreams: updated });
      },
      
      leaveLiveStream: (streamId) => {
        const { liveStreams } = get();
        const updated = liveStreams.map(stream =>
          stream.id === streamId
            ? { ...stream, viewers: Math.max(0, stream.viewers - 1) }
            : stream
        );
        set({ liveStreams: updated });
      },
      
      sendLiveComment: (streamId, content) => {
        // In a real app, this would send to live chat
        console.log(`Live comment in ${streamId}: ${content}`);
      },
      
      sendLiveGift: (streamId, giftType, amount) => {
        const { spendCoins } = get();
        if (spendCoins(amount, `Gift: ${giftType}`)) {
          console.log(`Sent ${giftType} gift worth ${amount} coins to stream ${streamId}`);
        }
      },
      
      createLivePoll: (streamId, question, options) => {
        console.log(`Created poll in ${streamId}: ${question}`);
      },
      
      voteLivePoll: (streamId, optionId) => {
        console.log(`Voted for ${optionId} in stream ${streamId}`);
      },
      
      addCoins: (amount) => {
        const { coinBalance } = get();
        set({
          coinBalance: {
            ...coinBalance,
            balance: coinBalance.balance + amount,
            lifetimeEarned: coinBalance.lifetimeEarned + amount,
          },
        });
      },
      
      spendCoins: (amount, description) => {
        const { coinBalance } = get();
        if (coinBalance.balance < amount) return false;
        
        set({
          coinBalance: {
            ...coinBalance,
            balance: coinBalance.balance - amount,
            lifetimeSpent: coinBalance.lifetimeSpent + amount,
          },
        });
        
        const transaction: Transaction = {
          id: `tx-${Date.now()}`,
          userId: get().currentUser?.id || '',
          type: 'tip',
          amount: -amount,
          currency: 'coins',
          status: 'completed',
          description,
          createdAt: new Date().toISOString(),
        };
        
        set({ transactions: [transaction, ...get().transactions] });
        return true;
      },
      
      sendTip: (recipientId, amount) => {
        const { spendCoins, currentUser } = get();
        if (!currentUser) return;
        
        if (spendCoins(amount, `Tip to ${recipientId}`)) {
          // Add notification for recipient
          const notification: Notification = {
            id: `notif-${Date.now()}`,
            type: 'tip',
            sender: currentUser,
            recipientId,
            content: `sent you a tip of ${amount} coins`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          get().addNotification(notification);
        }
      },
      
      purchaseSubscription: (creatorId, tier) => {
        const prices: Record<string, number> = { basic: 499, premium: 999, vip: 1999 };
        const { spendCoins } = get();
        spendCoins(prices[tier] || 499, `Subscription to ${creatorId} - ${tier}`);
      },
      
      withdrawEarnings: (amount, method) => {
        console.log(`Withdrawing ${amount} via ${method}`);
      },
      
      claimMission: (missionId) => {
        const { dailyMissions, addCoins } = get();
        const mission = dailyMissions.find(m => m.id === missionId);
        if (mission && !mission.completed && mission.progress >= mission.maxProgress) {
          addCoins(mission.reward);
          const updated = dailyMissions.map(m =>
            m.id === missionId ? { ...m, completed: true } : m
          );
          set({ dailyMissions: updated });
        }
      },
      
      updateStreak: () => {
        const { streak } = get();
        const lastActive = new Date(streak.lastActive);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          set({
            streak: {
              current: streak.current + 1,
              longest: Math.max(streak.longest, streak.current + 1),
              lastActive: today.toISOString(),
            },
          });
        } else if (diffDays > 1) {
          set({
            streak: {
              current: 1,
              longest: streak.longest,
              lastActive: today.toISOString(),
            },
          });
        }
      },
      
      setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
      
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      
      setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
      
      setLiveModalOpen: (open) => set({ isLiveModalOpen: open }),
      
      setModeSwitcherOpen: (open) => set({ isModeSwitcherOpen: open }),
      
      setActiveBottomSheet: (sheet) => set({ activeBottomSheet: sheet }),
      
      setShowReactionWheel: (postId) => set({ showReactionWheel: postId }),
      
      generateAIContent: (prompt) => {
        const suggestions = [
          'Here are 5 tips to improve your content...',
          'Consider adding more visual elements to increase engagement...',
          'Your audience responds well to personal stories...',
          'Try asking a question to encourage comments...',
        ];
        return suggestions[Math.floor(Math.random() * suggestions.length)];
      },
      
      autoTagContent: (content) => {
        const commonTags = ['technology', 'design', 'art', 'business', 'lifestyle', 'education', 'entertainment'];
        return commonTags.filter(tag => content.toLowerCase().includes(tag));
      },
      
      getContentRemix: (postId) => {
        return [
          'Turn this into a carousel post',
          'Create a short video version',
          'Make it into an infographic',
          'Transform into a poll question',
        ];
      },
      
      getAISuggestedConnections: () => {
        return mockUsers.filter(u => u.id !== get().currentUser?.id).slice(0, 3);
      },
      
      // Post Spaces
      createPostSpace: (postId) => {
        const { currentUser, postSpaces } = get();
        if (!currentUser) return;
        
        const systemMessage: SpaceMessage = {
          id: `msg-${Date.now()}`,
          userId: 'system',
          user: currentUser,
          content: `${currentUser.displayName} started a Post Space!`,
          type: 'system',
          createdAt: new Date().toISOString(),
        };
        
        const newSpace: PostSpace = {
          id: `space-${Date.now()}`,
          postId,
          isActive: true,
          participants: [currentUser.id],
          messages: [systemMessage],
          reactions: [],
          polls: [],
          createdAt: new Date().toISOString(),
        };
        
        set({ postSpaces: [...postSpaces, newSpace], activePostSpace: newSpace.id });
      },
      
      joinPostSpace: (spaceId) => {
        const { postSpaces, currentUser } = get();
        if (!currentUser) return;
        
        const joinMessage: SpaceMessage = {
          id: `msg-${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          content: `${currentUser.displayName} joined the space`,
          type: 'system',
          createdAt: new Date().toISOString(),
        };
        
        const updated = postSpaces.map(space => 
          space.id === spaceId && !space.participants.includes(currentUser.id)
            ? { 
                ...space, 
                participants: [...space.participants, currentUser.id],
                messages: [...space.messages, joinMessage]
              }
            : space
        );
        set({ postSpaces: updated, activePostSpace: spaceId });
      },
      
      leavePostSpace: (spaceId) => {
        const { postSpaces, currentUser, activePostSpace } = get();
        if (!currentUser) return;
        
        const leaveMessage: SpaceMessage = {
          id: `msg-${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          content: `${currentUser.displayName} left the space`,
          type: 'system',
          createdAt: new Date().toISOString(),
        };
        
        const updated = postSpaces.map(space => 
          space.id === spaceId
            ? { 
                ...space, 
                participants: space.participants.filter(id => id !== currentUser.id),
                messages: [...space.messages, leaveMessage]
              }
            : space
        );
        set({ 
          postSpaces: updated, 
          activePostSpace: activePostSpace === spaceId ? null : activePostSpace 
        });
      },
      
      sendSpaceMessage: (spaceId, content) => {
        const { postSpaces, currentUser } = get();
        if (!currentUser) return;
        
        const newMessage: SpaceMessage = {
          id: `msg-${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          content,
          type: 'text',
          createdAt: new Date().toISOString(),
        };
        
        const updated = postSpaces.map(space => 
          space.id === spaceId
            ? { ...space, messages: [...space.messages, newMessage] }
            : space
        );
        set({ postSpaces: updated });
      },
      
      sendSpaceReaction: (spaceId, emoji) => {
        const { postSpaces, currentUser } = get();
        if (!currentUser) return;
        
        const updated = postSpaces.map(space => 
          space.id === spaceId
            ? { 
                ...space, 
                reactions: [...space.reactions, {
                  id: `react-${Date.now()}`,
                  userId: currentUser.id,
                  emoji,
                  createdAt: new Date().toISOString(),
                }]
              }
            : space
        );
        set({ postSpaces: updated });
      },
      
      createSpacePoll: (spaceId, question, options) => {
        const { postSpaces, currentUser } = get();
        if (!currentUser) return;
        
        const newPoll = {
          id: `poll-${Date.now()}`,
          question,
          options: options.map((text, i) => ({ id: `opt-${i}`, text, votes: [] })),
          createdBy: currentUser.id,
        };
        
        const updated = postSpaces.map(space => 
          space.id === spaceId
            ? { ...space, polls: [...space.polls, newPoll] }
            : space
        );
        set({ postSpaces: updated });
      },
      
      voteSpacePoll: (spaceId, pollId, optionId) => {
        const { postSpaces, currentUser } = get();
        if (!currentUser) return;
        
        const updated = postSpaces.map(space => 
          space.id === spaceId
            ? {
                ...space,
                polls: space.polls.map(poll => 
                  poll.id === pollId
                    ? {
                        ...poll,
                        options: poll.options.map(opt => 
                          opt.id === optionId && !opt.votes.includes(currentUser.id)
                            ? { ...opt, votes: [...opt.votes, currentUser.id] }
                            : opt
                        )
                      }
                    : poll
                )
              }
            : space
        );
        set({ postSpaces: updated });
      },
      
      getPostSpace: (postId) => {
        return get().postSpaces.find(space => space.postId === postId);
      },
      
      // Settings
      updateSettings: (newSettings) => {
        const { settings } = get();
        set({ settings: { ...settings, ...newSettings } });
      },
      
      updateNotificationSettings: (key, value) => {
        const { settings } = get();
        set({
          settings: {
            ...settings,
            notifications: { ...settings.notifications, [key]: value }
          }
        });
      },
      
      updatePrivacySettings: (key, value) => {
        const { settings } = get();
        set({
          settings: {
            ...settings,
            privacy: { ...settings.privacy, [key]: value }
          }
        });
      },
      
      // Profile
      updateProfile: (data) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        const updated = { ...currentUser, ...data };
        set({ currentUser: updated });
      },
      
      followUser: (userId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        // Update following count
        set({
          currentUser: {
            ...currentUser,
            following: currentUser.following + 1,
            socialStats: {
              ...currentUser.socialStats,
              following: currentUser.socialStats.following + 1
            }
          }
        });
      },
      
      unfollowUser: (userId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        set({
          currentUser: {
            ...currentUser,
            following: Math.max(0, currentUser.following - 1),
            socialStats: {
              ...currentUser.socialStats,
              following: Math.max(0, currentUser.socialStats.following - 1)
            }
          }
        });
      },
    }),
    {
      name: 'nexus-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        currentMode: state.currentMode,
        theme: state.theme,
        language: state.language,
        coinBalance: state.coinBalance,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
