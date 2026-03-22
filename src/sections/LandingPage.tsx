import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Users, Zap, Globe, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onEnterWorld: () => void;
  onLogin: () => void;
}

// Particle Field Component
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = ['#3B82F6', '#8B5CF6', '#22D3EE'];
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();

          // Draw connections (limited per frame)
          if (i % 3 === 0) {
            let connections = 0;
            for (let j = i + 1; j < particlesRef.current.length && connections < 2; j++) {
              const other = particlesRef.current[j];
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = particle.color;
                ctx.globalAlpha = 0.1 * (1 - dist / 100);
                ctx.stroke();
                connections++;
              }
            }
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

// Navigation Component
function Navigation({ onLogin }: { onLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`mx-4 md:mx-8 rounded-2xl transition-all duration-300 ${
          scrolled ? 'glass-strong' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NEXUS</span>
          </motion.div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Features', id: 'features' },
              { label: 'Community', id: 'community' },
              { label: 'About', id: 'about' },
            ].map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-1/2 transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onLogin}
              className="hidden sm:block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={onLogin}
              className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Hero Section
function HeroSection({ onEnterWorld }: { onEnterWorld: () => void }) {
  const [count, setCount] = useState({ users: 0, connections: 0, uptime: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { users: 2, connections: 50, uptime: 99.9 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount({
        users: Math.floor(targets.users * easeOut),
        connections: Math.floor(targets.connections * easeOut),
        uptime: Math.round(targets.uptime * easeOut * 10) / 10,
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <ParticleField />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        {/* Eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-white/80">Welcome to the Future</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-hero mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-white">Connect.</span>
          <span className="block gradient-text">Create.</span>
          <span className="block text-white">Collaborate.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Experience social networking reimagined through adaptive identity modes, 
          intent-driven interactions, and AI-powered discovery.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            onClick={onEnterWorld}
            className="group px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/30 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Your World
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            className="px-8 py-4 text-lg font-medium rounded-xl glass flex items-center gap-3 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[
            { value: `${count.users}M+`, label: 'Active Users' },
            { value: `${count.connections}M+`, label: 'Connections' },
            { value: `${count.uptime}%`, label: 'Uptime' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: 'Identity Modes',
      description: 'Switch seamlessly between Social, Work, and Creative modes. Each mode offers a unique experience tailored to your context.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Intent-Driven Posts',
      description: 'Every post has a purpose. Choose from Teach, Entertain, Sell, or Ask to signal your intent and reach the right audience.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'AI-Powered Discovery',
      description: 'Our adaptive feed learns from your behavior, mood, and goals to surface content that truly matters to you.',
      color: 'from-cyan-500 to-green-500',
    },
  ];

  return (
    <section id="features" className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-h1 mb-4">
            <span className="gradient-text">Three Modes.</span>
            <br />
            <span className="text-white">Infinite Possibilities.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Switch between identities seamlessly. Each mode is designed for a specific context,
            with unique features and experiences.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass-card p-8 card-hover group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Identity Modes Section
function IdentityModesSection() {
  const modes = [
    {
      id: 'social',
      name: 'Social Mode',
      description: 'Connect with friends, share moments, and build your personal community.',
      features: ['Friend Circles', 'Story Sharing', 'Event Planning'],
      color: '#3B82F6',
      icon: Users,
    },
    {
      id: 'work',
      name: 'Work Mode',
      description: 'Professional networking, project collaboration, and career growth.',
      features: ['Professional Network', 'Project Management', 'Skill Showcase'],
      color: '#8B5CF6',
      icon: Zap,
    },
    {
      id: 'creative',
      name: 'Creative Mode',
      description: 'Showcase your art, find inspiration, and collaborate on creative projects.',
      features: ['Portfolio Display', 'Collaboration Tools', 'Creative Community'],
      color: '#22D3EE',
      icon: Sparkles,
    },
  ];

  const [activeMode, setActiveMode] = useState(0);

  return (
    <section id="community" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${modes[activeMode].color}20 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-h1 mb-4">
            <span className="text-white">Choose Your</span>{' '}
            <span className="gradient-text">Identity</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Each mode offers a unique experience. Switch between them seamlessly based on your context.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {modes.map((mode, i) => (
            <motion.button
              key={mode.id}
              onClick={() => setActiveMode(i)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeMode === i
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={{
                background: activeMode === i ? `${mode.color}30` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeMode === i ? mode.color : 'rgba(255,255,255,0.1)'}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode.name}
            </motion.button>
          ))}
        </div>

        {/* Active Mode Display */}
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Icon */}
            <motion.div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: `${modes[activeMode].color}30` }}
              animate={{ 
                boxShadow: [`0 0 0 ${modes[activeMode].color}00`, `0 0 30px ${modes[activeMode].color}50`, `0 0 0 ${modes[activeMode].color}00`]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {(() => {
                const Icon = modes[activeMode].icon;
                return <Icon className="w-10 h-10" style={{ color: modes[activeMode].color }} />;
              })()}
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">
                {modes[activeMode].name}
              </h3>
              <p className="text-white/60 text-lg mb-6">
                {modes[activeMode].description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {modes[activeMode].features.map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{ 
                      background: `${modes[activeMode].color}20`,
                      color: modes[activeMode].color,
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ onEnterWorld }: { onEnterWorld: () => void }) {
  return (
    <section id="about" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-h1 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">Ready to Transform Your</span>
          <br />
          <span className="gradient-text">Social Experience?</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join millions of users already connecting, creating, and collaborating on Nexus.
          Your next-generation social network awaits.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={onEnterWorld}
            className="px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-500/30 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="px-10 py-4 text-lg font-medium rounded-xl glass hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Sales
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Resources: ['Blog', 'Help Center', 'Community', 'API'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'Security'],
  };

  return (
    <footer className="relative py-16 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NEXUS</span>
            </div>
            <p className="text-white/50 text-sm max-w-xs">
              The future of social connection. Connect, create, and collaborate like never before.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-white/30 text-sm">
            © 2024 Nexus. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['Twitter', 'Discord', 'GitHub', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="text-xs">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page Component
export function LandingPage({ onEnterWorld, onLogin }: LandingPageProps) {
  return (
    <div className="relative">
      <Navigation onLogin={onLogin} />
      <HeroSection onEnterWorld={onEnterWorld} />
      <FeaturesSection />
      <IdentityModesSection />
      <CTASection onEnterWorld={onEnterWorld} />
      <Footer />
    </div>
  );
}
