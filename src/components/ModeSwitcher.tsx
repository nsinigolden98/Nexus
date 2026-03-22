import { motion } from 'framer-motion';
import { Users, Briefcase, Palette, X, Check, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import type { UserMode } from '@/types';

const modes: { id: UserMode; label: string; icon: typeof Users; color: string; gradient: string; description: string; features: string[] }[] = [
  {
    id: 'social',
    label: 'Social Mode',
    icon: Users,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Connect with friends, share moments, and build your personal community.',
    features: ['Friend Circles', 'Story Sharing', 'Event Planning', 'Group Chats'],
  },
  {
    id: 'work',
    label: 'Work Mode',
    icon: Briefcase,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Professional networking, project collaboration, and career growth.',
    features: ['Professional Network', 'Project Management', 'Skill Showcase', 'Job Board'],
  },
  {
    id: 'creative',
    label: 'Creative Mode',
    icon: Palette,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-green-500',
    description: 'Showcase your art, find inspiration, and collaborate on creative projects.',
    features: ['Portfolio Display', 'Collaboration Tools', 'Creative Community', 'Monetization'],
  },
];

export function ModeSwitcher({ onClose }: { onClose: () => void }) {
  const { currentMode, setCurrentMode } = useStore();

  const handleModeSelect = (mode: UserMode) => {
    setCurrentMode(mode);
    setTimeout(onClose, 300);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
        className="relative w-full max-w-4xl glass-card overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Identity</h2>
            <p className="text-white/50 mt-1">Switch between modes to change your experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Cards */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            
            return (
              <motion.button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  isActive
                    ? 'border-transparent'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{
                  background: isActive ? `${mode.color}15` : 'rgba(255,255,255,0.03)',
                  borderColor: isActive ? mode.color : undefined,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: mode.color }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${mode.gradient}`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{mode.label}</h3>
                <p className="text-white/60 text-sm mb-4">{mode.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {mode.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white/50">
                      <Sparkles className="w-3 h-3" style={{ color: mode.color }} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Glow Effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 60px ${mode.color}30`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5">
          <p className="text-center text-white/50 text-sm">
            Your mode preference is saved and will be restored when you return
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
