import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Users, Calendar, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import HeroScene3D from "./HeroScene3D";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Determine which micro-elements to show based on scroll
  const showTitle = scrollProgress < 0.4;
  const showMicroElements = scrollProgress > 0.4 && scrollProgress < 0.75;
  const showFinalMessage = scrollProgress > 0.78;

  return (
    <div ref={containerRef} className="relative" style={{ height: "350vh" }}>
      {/* Sticky viewport for 3D scene */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Scene */}
        <HeroScene3D scrollProgress={scrollProgress} />

        {/* Dark overlay gradient for readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/40 via-transparent to-background/60" />

        {/* UI Overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="container mx-auto px-4">
            {/* Phase 1: Title and CTAs */}
            <AnimatePresence>
              {showTitle && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-primary border border-primary/30 rounded-full bg-primary/5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-neon" />
                    AI-Powered Sports Matchmaking
                  </span>

                  <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 font-display">
                    Play Anytime.{" "}
                    <span className="gradient-text">Find Players</span>{" "}
                    Instantly.
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10">
                    Book sports turfs, find teammates, and never miss a game.
                    Scroll to see the magic ↓
                  </p>

                  <div className="flex flex-wrap gap-4 pointer-events-auto">
                    <Link
                      to="/discover"
                      className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300"
                    >
                      Book a Turf
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/find-players"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg glass border-primary/20 text-foreground hover:border-primary/40 transition-all"
                    >
                      Find Players
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2: Micro UI elements during ball pass */}
            <AnimatePresence>
              {showMicroElements && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[
                    { text: "Player Found", icon: Users, x: "-20%", y: "-15%", delay: 0 },
                    { text: "Slot Available", icon: Calendar, x: "15%", y: "-25%", delay: 0.2 },
                    { text: "Match Confirmed", icon: CheckCircle, x: "0%", y: "10%", delay: 0.4 },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: item.delay, duration: 0.4 }}
                      className="absolute glass-strong rounded-lg px-4 py-2.5 flex items-center gap-2"
                      style={{ left: `calc(50% + ${item.x})`, top: `calc(50% + ${item.y})` }}
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Phase 3: Final message */}
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-4xl md:text-6xl font-bold font-display mb-4">
                    One Pass. One Game.{" "}
                    <span className="neon-text text-primary">Endless Matches.</span>
                  </h2>

                  <div className="flex justify-center gap-4 mt-8 pointer-events-auto">
                    <Link
                      to="/landing"
                      className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300"
                    >
                      Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-8 mt-12">
                    {[
                      { icon: MapPin, label: "Turfs Listed", value: "250+" },
                      { icon: Users, label: "Active Players", value: "10K+" },
                      { icon: Calendar, label: "Games Played", value: "50K+" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <stat.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll indicator */}
            {scrollProgress < 0.1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
                >
                  <div className="w-1 h-2 rounded-full bg-primary" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
