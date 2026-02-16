import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { turfs, playerRequests } from "@/data/mockData";
import TurfCard from "@/components/TurfCard";
import PlayerRequestCard from "@/components/PlayerRequestCard";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />

      {/* Popular Turfs Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Trending Turfs</h2>
              <p className="text-muted-foreground text-sm mt-1">Top-rated venues with slots available now</p>
            </div>
            <Link to="/discover" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turfs.slice(0, 3).map((turf, i) => (
              <TurfCard key={turf.id} turf={turf} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Active Matchmaking Preview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Players Looking for a Match</h2>
              <p className="text-muted-foreground text-sm mt-1">Jump into a game — spots filling fast!</p>
            </div>
            <Link to="/find-players" className="flex items-center gap-1 text-sm text-primary hover:underline">
              See all requests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerRequests.slice(0, 3).map((req, i) => (
              <PlayerRequestCard key={req.id} request={req} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="neon-text text-primary">Play</span>?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join thousands of players who never miss a game. Book turfs and find teammates in seconds.
            </p>
            <Link
              to="/landing"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 PlayOrbit. Play Anytime. Find Players Instantly.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
