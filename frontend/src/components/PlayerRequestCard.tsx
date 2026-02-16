import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { PlayerRequest, sportIcons, sportColors } from "@/data/mockData";
import JoinGameModal from "./JoinGameModal";

interface Props {
  request: PlayerRequest;
  index: number;
}

const skillColors = {
  beginner: "text-accent bg-accent/10 border-accent/30",
  intermediate: "text-primary bg-primary/10 border-primary/30",
  advanced: "text-secondary bg-secondary/10 border-secondary/30",
};

const PlayerRequestCard = ({ request, index }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const spotsLeft = request.playersNeeded;
  const progress = (request.playersJoined / (request.playersJoined + request.playersNeeded)) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className={`rounded-xl p-5 border bg-gradient-to-br ${sportColors[request.sport]} backdrop-blur-xl hover:shadow-lg transition-all duration-300 cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-2xl mr-2">{sportIcons[request.sport]}</span>
            <span className="font-display font-semibold text-foreground">{request.turfName}</span>
          </div>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${skillColors[request.skillLevel]}`}>
            {request.skillLevel}
          </span>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> {request.location}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{request.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{request.time}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {request.playersJoined} joined · {spotsLeft} needed
            </span>
            <span className="text-foreground font-medium">by {request.createdBy}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          className="w-full py-2 text-sm font-medium rounded-lg gradient-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          Join Game
        </button>
      </motion.div>

      <JoinGameModal
        request={request}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PlayerRequestCard;
