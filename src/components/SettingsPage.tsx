import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Lock,
  Mail,
  Moon,
  Sun,
  Bell,
  Shield,
  Eye,
  Wallet,
  CreditCard,
  History,
  ChevronRight,
  Check,
  Globe,
  Smartphone,
  LogOut,
  Trash2,
  Camera,
  Edit2,
  Save
} from 'lucide-react';
import { useStore } from '@/store';

interface SettingsPageProps {
  onClose: () => void;
}

const settingsTabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Moon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'security', label: 'Security', icon: Shield },
];

// Account Section
function AccountSection() {
  const { currentUser, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || '',
  });

  const handleSave = () => {
    updateProfile({
      displayName: formData.displayName,
      username: formData.username,
      bio: formData.bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl glass">
        <div className="relative">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.displayName}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{currentUser?.displayName}</h3>
          <p className="text-white/50">@{currentUser?.username}</p>
          <p className="text-sm text-white/40 mt-1">{currentUser?.bio}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-white/60 mb-1 block">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1 block">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1 block">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium"
          >
            Save Changes
          </button>
        </motion.div>
      )}

      {/* Email Settings */}
      <div className="p-4 rounded-xl glass">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Settings
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">{currentUser?.email}</p>
              <p className="text-sm text-white/50">Primary email</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              Verified
            </span>
          </div>
          <button className="text-sm text-blue-400 hover:text-blue-300">
            Change email address
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="p-4 rounded-xl glass">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Password
        </h4>
        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left px-4">
          Change password
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <h4 className="font-medium mb-4 text-red-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h4>
        <div className="space-y-2">
          <button className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
            Deactivate Account
          </button>
          <button className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Appearance Section
function AppearanceSection() {
  const { settings, updateSettings } = useStore();
  const [previewTheme, setPreviewTheme] = useState(settings.theme);

  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon, color: 'from-gray-700 to-gray-900' },
    { id: 'light', label: 'Light', icon: Sun, color: 'from-gray-200 to-white' },
    { id: 'auto', label: 'Auto', icon: Globe, color: 'from-blue-400 to-purple-500' },
  ];

  const handleThemeChange = (theme: 'dark' | 'light' | 'auto') => {
    setPreviewTheme(theme);
    updateSettings({ theme });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = previewTheme === theme.id;
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.color} mx-auto mb-3 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${theme.id === 'light' ? 'text-gray-800' : 'text-white'}`} />
                </div>
                <p className="text-sm font-medium text-center">{theme.label}</p>
                {isSelected && (
                  <div className="flex justify-center mt-2">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl glass">
        <h4 className="font-medium mb-3">Preview</h4>
        <div className={`p-4 rounded-xl ${previewTheme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
            <div>
              <p className={`font-medium ${previewTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Sample Post
              </p>
              <p className={`text-sm ${previewTheme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                This is how your content will look
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications Section
function NotificationsSection() {
  const { settings, updateNotificationSettings } = useStore();

  const notificationOptions = [
    { key: 'messages', label: 'Messages', description: 'When someone sends you a message' },
    { key: 'likes', label: 'Likes', description: 'When someone likes your post' },
    { key: 'comments', label: 'Comments', description: 'When someone comments on your post' },
    { key: 'follows', label: 'Follows', description: 'When someone follows you' },
    { key: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
    { key: 'liveStreams', label: 'Live Streams', description: 'When someone you follow goes live' },
    { key: 'emailDigest', label: 'Email Digest', description: 'Weekly summary of your activity' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {notificationOptions.map((option) => {
            const key = option.key as keyof typeof settings.notifications;
            const isEnabled = settings.notifications[key];
            
            return (
              <div
                key={option.key}
                className="flex items-center justify-between p-4 rounded-xl glass"
              >
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-white/50">{option.description}</p>
                </div>
                <button
                  onClick={() => updateNotificationSettings(key, !isEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isEnabled ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{ x: isEnabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Wallet Section
function WalletSection() {
  const { coinBalance, transactions, addCoins } = useStore();
  const [showRecharge, setShowRecharge] = useState(false);

  const rechargeOptions = [
    { amount: 100, price: '$0.99' },
    { amount: 500, price: '$4.99' },
    { amount: 1000, price: '$9.99' },
    { amount: 5000, price: '$49.99' },
  ];

  const handleRecharge = (amount: number) => {
    addCoins(amount);
    setShowRecharge(false);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
        <p className="text-white/70 mb-1">Your Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{coinBalance.balance.toLocaleString()}</span>
          <span className="text-white/70">coins</span>
        </div>
        <div className="flex gap-4 mt-4 text-sm text-white/70">
          <span>Lifetime earned: {coinBalance.lifetimeEarned}</span>
          <span>Lifetime spent: {coinBalance.lifetimeSpent}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowRecharge(true)}
          className="p-4 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Recharge
        </button>
        <button className="p-4 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
          <History className="w-5 h-5" />
          History
        </button>
      </div>

      {/* Recharge Modal */}
      <AnimatePresence>
        {showRecharge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 rounded-xl glass"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Select Amount</h4>
              <button onClick={() => setShowRecharge(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {rechargeOptions.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleRecharge(option.amount)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="text-2xl font-bold">{option.amount}</p>
                  <p className="text-sm text-white/50">{option.price}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Transactions */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Transactions
        </h4>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl glass"
            >
              <div>
                <p className="text-sm">{tx.description}</p>
                <p className="text-xs text-white/50">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-white/50 py-4">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Privacy Section
function PrivacySection() {
  const { settings, updatePrivacySettings } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        
        {/* Account Visibility */}
        <div className="p-4 rounded-xl glass mb-4">
          <h4 className="font-medium mb-3">Account Visibility</h4>
          <div className="space-y-2">
            {['public', 'private'].map((option) => (
              <button
                key={option}
                onClick={() => updatePrivacySettings('accountVisibility', option)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  settings.privacy.accountVisibility === option
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="capitalize">{option}</span>
                {settings.privacy.accountVisibility === option && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messaging */}
        <div className="p-4 rounded-xl glass mb-4">
          <h4 className="font-medium mb-3">Who can message you</h4>
          <div className="space-y-2">
            {['everyone', 'friends', 'none'].map((option) => (
              <button
                key={option}
                onClick={() => updatePrivacySettings('allowMessaging', option)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  settings.privacy.allowMessaging === option
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="capitalize">{option}</span>
                {settings.privacy.allowMessaging === option && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { key: 'allowTagging', label: 'Allow others to tag you', description: 'People can tag you in posts and photos' },
            { key: 'showActivityStatus', label: 'Show activity status', description: 'Others can see when you\'re online' },
          ].map((item) => {
            const key = item.key as keyof typeof settings.privacy;
            const isEnabled = settings.privacy[key] as boolean;
            
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl glass"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-white/50">{item.description}</p>
                </div>
                <button
                  onClick={() => updatePrivacySettings(key, !isEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isEnabled ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{ x: isEnabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Users */}
      <div className="p-4 rounded-xl glass">
        <h4 className="font-medium mb-3">Blocked Users</h4>
        <p className="text-sm text-white/50 mb-3">You haven&apos;t blocked anyone yet</p>
        <button className="text-sm text-blue-400 hover:text-blue-300">
          Manage blocked accounts
        </button>
      </div>
    </div>
  );
}

// Security Section
function SecuritySection() {
  const { settings, updateSettings } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        
        {/* Two-Factor Auth */}
        <div className="flex items-center justify-between p-4 rounded-xl glass mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-white/50">Add an extra layer of security</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({
              security: { ...settings.security, twoFactorEnabled: !settings.security.twoFactorEnabled }
            })}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.security.twoFactorEnabled ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-white"
              animate={{ x: settings.security.twoFactorEnabled ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Login Alerts */}
        <div className="flex items-center justify-between p-4 rounded-xl glass mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium">Login Alerts</p>
              <p className="text-sm text-white/50">Get notified of new logins</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({
              security: { ...settings.security, loginAlerts: !settings.security.loginAlerts }
            })}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.security.loginAlerts ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-white"
              animate={{ x: settings.security.loginAlerts ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Login Activity */}
      <div className="p-4 rounded-xl glass">
        <h4 className="font-medium mb-3">Login Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">iPhone 14 Pro</p>
                <p className="text-xs text-white/50">San Francisco, CA • Current</p>
              </div>
            </div>
            <span className="text-xs text-green-400">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Chrome on Mac</p>
                <p className="text-xs text-white/50">San Francisco, CA • 2 hours ago</p>
              </div>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('account');
  const { logout } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'wallet':
        return <WalletSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <AccountSection />;
    }
  };

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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card flex"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 p-4 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 md:hidden">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide p-2 border-b border-white/5 md:hidden">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Close Button */}
          <div className="hidden md:flex items-center justify-end p-4 border-b border-white/5">
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
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
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
