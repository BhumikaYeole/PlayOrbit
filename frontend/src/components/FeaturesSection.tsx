import { motion } from "framer-motion";
import { Search, Users, Zap, Shield, Calendar, BarChart3 } from "lucide-react";

const features = [
  { icon: Search, title: "Discover Turfs", description: "Find the best sports venues near you with real-time slot availability.", color: "text-primary" },
  { icon: Users, title: "Smart Matchmaking", description: "AI connects you with players at your skill level for the perfect game.", color: "text-secondary" },
  { icon: Calendar, title: "Instant Booking", description: "Book slots in seconds with live calendar and conflict-free scheduling.", color: "text-accent" },
  { icon: Shield, title: "Verified Venues", description: "Every turf is verified for quality, safety, and amenities.", color: "text-primary" },
  { icon: Zap, title: "Need Players?", description: "Create a request and get matched with nearby players instantly.", color: "text-secondary" },
  { icon: BarChart3, title: "Provider Analytics", description: "Turf owners get real-time booking stats and revenue insights.", color: "text-accent" },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Play</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From discovering turfs to finding teammates — one platform for all your sports needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:neon-border transition-all duration-300 group"
            >
              <div className="p-2.5 rounded-lg bg-muted/50 w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
