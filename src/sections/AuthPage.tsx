import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Sparkles,
  Check,
  Users,
  Briefcase,
  Palette
} from 'lucide-react';
import { useStore, mockUsers } from '@/store';
import type { UserMode } from '@/types';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user?: typeof mockUsers[0]) => void;
  onBack: () => void;
}

const interests = [
  'Technology', 'Design', 'Photography', 'Music', 'Art', 'Writing',
  'Business', 'Science', 'Gaming', 'Fitness', 'Travel', 'Food',
  'Fashion', 'Sports', 'Movies', 'Books', 'Politics', 'Health',
];

export function AuthPage({ initialMode, onAuthSuccess, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<UserMode>('social');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { setCurrentUser, setAuthenticated } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    const user = mockUsers[0];
    setCurrentUser(user);
    setAuthenticated(true);
    setIsLoading(false);
    onAuthSuccess(user);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new user
    const newUser = {
      ...mockUsers[0],
      id: Date.now().toString(),
      username,
      displayName: displayName || username,
      email,
      mode: selectedMode,
      interests: selectedInterests,
      joinedAt: new Date().toISOString(),
    };
    
    setCurrentUser(newUser);
    setAuthenticated(true);
    setIsLoading(false);
    onAuthSuccess(newUser);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const modeOptions: { id: UserMode; label: string; icon: typeof Users; color: string; description: string }[] = [
    { id: 'social', label: 'Social', icon: Users, color: '#3B82F6', description: 'Connect with friends and share moments' },
    { id: 'work', label: 'Work', icon: Briefcase, color: '#8B5CF6', description: 'Professional networking and career growth' },
    { id: 'creative', label: 'Creative', icon: Palette, color: '#22D3EE', description: 'Showcase your art and find inspiration' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="absolute top-6 left-6 p-3 rounded-xl glass text-white/70 hover:text-white hover:bg-white/10 transition-all z-20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Logo */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">NEXUS</span>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                  <p className="text-white/50">Sign in to continue your journey</p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {step === 1 && 'Create Account'}
                    {step === 2 && 'Your Interests'}
                    {step === 3 && 'Choose Your Mode'}
                  </h1>
                  <p className="text-white/50">
                    {step === 1 && 'Start your Nexus journey'}
                    {step === 2 && 'Help us personalize your experience'}
                    {step === 3 && 'Select your primary identity'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Indicator (Signup only) */}
            {mode === 'signup' && (
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                        : s < step
                        ? 'w-4 bg-green-500'
                        : 'w-4 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login-form"
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-12"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glass pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-white/60">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[#0B0B0F] text-white/40 text-sm">or</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    GitHub
                  </button>
                </div>

                {/* Switch to Signup */}
                <p className="text-center text-white/60 text-sm mt-6">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                onSubmit={handleSignup}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-glass pl-12"
                        required
                      />
                    </div>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Display Name (optional)"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="input-glass pl-12"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-glass pl-12"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-glass pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <button type="submit" className="w-full btn-primary">
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Interests */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto scrollbar-hide">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            selectedInterests.includes(interest)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'glass text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>

                    <p className="text-white/50 text-sm text-center">
                      {selectedInterests.length} interests selected
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Mode Selection */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      {modeOptions.map((modeOption) => {
                        const Icon = modeOption.icon;
                        return (
                          <button
                            key={modeOption.id}
                            type="button"
                            onClick={() => setSelectedMode(modeOption.id)}
                            className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                              selectedMode === modeOption.id
                                ? 'border-transparent'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                            style={{
                              background: selectedMode === modeOption.id 
                                ? `${modeOption.color}20` 
                                : 'rgba(255,255,255,0.05)',
                              borderColor: selectedMode === modeOption.id ? modeOption.color : undefined,
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: `${modeOption.color}30` }}
                            >
                              <Icon className="w-6 h-6" style={{ color: modeOption.color }} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{modeOption.label}</h4>
                              <p className="text-white/50 text-sm">{modeOption.description}</p>
                            </div>
                            {selectedMode === modeOption.id && (
                              <Check className="w-5 h-5" style={{ color: modeOption.color }} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Switch to Login */}
                <p className="text-center text-white/60 text-sm mt-6">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setStep(1); }}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Terms */}
        <p className="text-center text-white/40 text-xs mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}
