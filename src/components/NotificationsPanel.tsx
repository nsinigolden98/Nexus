import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, UserPlus, AtSign, Video, Users, DollarSign, Bell } from 'lucide-react';
import { useStore, mockNotifications } from '@/store';

const notificationIcons: Record<string, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
  live: Video,
  coCreate: Users,
  tip: DollarSign,
  system: Bell,
};

const notificationColors: Record<string, string> = {
  like: 'text-red-400 bg-red-500/20',
  comment: 'text-blue-400 bg-blue-500/20',
  follow: 'text-green-400 bg-green-500/20',
  mention: 'text-purple-400 bg-purple-500/20',
  live: 'text-orange-400 bg-orange-500/20',
  coCreate: 'text-cyan-400 bg-cyan-500/20',
  tip: 'text-yellow-400 bg-yellow-500/20',
  system: 'text-gray-400 bg-gray-500/20',
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  const formatTime = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-md h-full glass-strong border-l border-white/5 overflow-hidden"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-2 border-b border-white/5">
          {['All', 'Mentions', 'Likes', 'Follows'].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {displayNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 mb-2">No notifications yet</p>
              <p className="text-white/40 text-sm">When you get notifications, they&apos;ll appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {displayNotifications.map((notification, i) => {
                const Icon = notificationIcons[notification.type] || Bell;
                const colorClass = notificationColors[notification.type] || notificationColors.system;
                
                return (
                  <motion.button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={`w-full flex items-start gap-4 p-4 hover:bg-white/5 transition-colors text-left ${
                      !notification.read ? 'bg-blue-500/5' : ''
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Avatar or Icon */}
                    {notification.sender ? (
                      <div className="relative">
                        <img
                          src={notification.sender.avatar}
                          alt={notification.sender.displayName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white">
                        {notification.sender && (
                          <span className="font-semibold">{notification.sender.displayName} </span>
                        )}
                        <span className="text-white/70">{notification.content}</span>
                      </p>
                      <p className="text-sm text-white/40 mt-1">{formatTime(notification.createdAt)}</p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
