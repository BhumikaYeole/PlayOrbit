import { motion } from "framer-motion";
import { MapPin, Star, Clock } from "lucide-react";
import { sportIcons } from "@/data/mockData";
import { Turf } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";


interface TurfCardProps {
  turf: Turf;
  index: number;
}

const TurfCard = ({ turf, index }: TurfCardProps) => {
  const availabilityPercent = (turf.availableSlots / turf.totalSlots) * 100;
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="glass rounded-xl overflow-hidden group hover:neon-border transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/turf/${turf.id}`)}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={turf.image}
            alt={turf.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-md glass-strong">
            {sportIcons[turf.sport]} {turf.sport.charAt(0).toUpperCase() + turf.sport.slice(1)}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md glass-strong">
            <Star className="h-3 w-3 text-primary fill-primary" />
            {turf.rating}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground mb-1 truncate">{turf.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            {turf.location}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-foreground">₹{turf.pricePerHour}<span className="text-xs text-muted-foreground font-normal">/hr</span></span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {turf.availableSlots} slots left
            </div>
          </div>

          {/* Availability bar */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${availabilityPercent > 50 ? "bg-accent" : availabilityPercent > 20 ? "bg-amber-500" : "bg-destructive"}`}
              style={{ width: `${availabilityPercent}%` }}
            />
          </div>

          <button
            className="w-full mt-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
            onClick={() => {

              navigate(`/turf/${turf.id}`)
            }}
          >
            View Slots & Book
          </button>
        </div>
      </motion.div>

    </>
  );
};

export default TurfCard;
