import { useState } from "react";
import { playerRequests, SportType } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import PlayerRequestCard from "@/components/PlayerRequestCard";

const FindPlayers = () => {
  const [sport, setSport] = useState<SportType | "all">("all");

  const filtered = playerRequests.filter(
    (r) => sport === "all" || r.sport === sport
  );

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Players</h1>
            <p className="text-muted-foreground">Join a game or create a request to find teammates</p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all">
            + Need Players
          </button>
        </div>

        <div className="mb-8">
          <SportFilter selected={sport} onSelect={setSport} />
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((req, i) => (
              <PlayerRequestCard key={req.id} request={req} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No player requests for this sport yet.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default FindPlayers;
