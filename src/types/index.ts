// User Types
export type UserMode = 'social' | 'work' | 'creative';

export type UserIntent = 'teach' | 'entertain' | 'sell' | 'ask';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  mode: UserMode;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  joinedAt: string;
  interests: string[];
  socialStats: {
    followers: number;
    following: number;
    posts: number;
  };
  workStats: {
    connections: number;
    projects: number;
    endorsements: number;
  };
  creativeStats: {
    followers: number;
    portfolio: number;
    collaborations: number;
  };
  analytics?: CreatorAnalytics;
}

export interface CreatorAnalytics {
  totalEngagement: number;
  monthlyEarnings: number;
  topPosts: string[];
  audienceGrowth: number;
  contentPerformance: {
    posts: number;
    avgLikes: number;
    avgComments: number;
    avgShares: number;
  };
}

// Post Types
export type PostType = 'text' | 'image' | 'video' | 'poll' | 'product' | 'live';

export type PostVisibility = 'public' | 'friends' | 'private';

export type PostStatus = 'active' | 'archived' | 'scheduled';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  type: PostType;
  intent: UserIntent;
  content: string;
  media?: MediaItem[];
  poll?: Poll;
  product?: Product;
  visibility: PostVisibility;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  monetization: boolean;
  coCreators?: string[];
  revenueSplit?: Record<string, number>;
  stats: PostStats;
  engagement: Engagement;
  tags: string[];
  location?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  aspectRatio?: number;
  duration?: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  link?: string;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export interface Engagement {
  likedBy: string[];
  commentedBy: string[];
  sharedBy: string[];
  savedBy: string[];
}

// Feed Types
export type FeedType = 'global' | 'friends' | 'opportunity' | 'creator' | 'trending';

export interface FeedConfig {
  type: FeedType;
  title: string;
  icon: string;
  description: string;
}

// Comment Types
export interface Comment {
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

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice';
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'message' 
  | 'live' 
  | 'coCreate' 
  | 'tip' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  sender?: User;
  recipientId: string;
  content: string;
  postId?: string;
  read: boolean;
  createdAt: string;
}

// Live Stream Types
export interface LiveStream {
  id: string;
  hostId: string;
  host: User;
  title: string;
  description?: string;
  thumbnail?: string;
  status: 'live' | 'ended' | 'scheduled';
  viewers: number;
  totalViewers: number;
  startedAt: string;
  endedAt?: string;
  coHosts?: User[];
  chatEnabled: boolean;
  giftsEnabled: boolean;
  coCreationEnabled: boolean;
}

// Monetization Types
export interface Transaction {
  id: string;
  userId: string;
  type: 'tip' | 'subscription' | 'content' | 'coCreate' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

export interface CoinBalance {
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

// Search Types
export interface SearchResult {
  type: 'user' | 'post' | 'topic' | 'opportunity';
  item: User | Post | Topic | Opportunity;
  score: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  postCount: number;
  trending: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'collaboration' | 'sponsorship';
  company?: string;
  location?: string;
  compensation?: string;
  postedBy: User;
  createdAt: string;
  expiresAt?: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Streak {
  current: number;
  longest: number;
  lastActive: string;
}

// App State Types
export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  currentMode: UserMode;
  currentFeed: FeedType;
  theme: 'dark' | 'light' | 'auto';
  language: string;
  notifications: Notification[];
  unreadNotifications: number;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  unreadMessages: number;
}

// AI Feature Types
export interface AIRecommendation {
  type: 'user' | 'content' | 'connection' | 'coCreate';
  item: User | Post;
  reason: string;
  confidence: number;
}

export interface ContentRemix {
  originalPostId: string;
  suggestedVariations: string[];
  aiGeneratedContent?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  interests: string[];
  initialMode: UserMode;
}

export interface PostFormData {
  content: string;
  type: PostType;
  intent: UserIntent;
  media?: File[];
  visibility: PostVisibility;
  monetization: boolean;
  scheduledFor?: Date;
  coCreators?: string[];
  poll?: {
    question: string;
    options: string[];
  };
  product?: {
    name: string;
    price: number;
    description: string;
  };
}

// Responsive Breakpoints
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  stagger?: number;
}

// Post Space Types
export interface PostSpace {
  id: string;
  postId: string;
  isActive: boolean;
  participants: string[];
  messages: SpaceMessage[];
  reactions: SpaceReaction[];
  polls: SpacePoll[];
  createdAt: string;
  endedAt?: string;
}

export interface SpaceMessage {
  id: string;
  userId: string;
  user: User;
  content: string;
  type: 'text' | 'reaction' | 'system';
  createdAt: string;
}

export interface SpaceReaction {
  id: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface SpacePoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: string[] }[];
  createdBy: string;
  endsAt?: string;
}

// Settings Types
export interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: {
    messages: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    liveStreams: boolean;
    emailDigest: boolean;
  };
  privacy: {
    accountVisibility: 'public' | 'private';
    allowTagging: boolean;
    allowMessaging: 'everyone' | 'friends' | 'none';
    showActivityStatus: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}
