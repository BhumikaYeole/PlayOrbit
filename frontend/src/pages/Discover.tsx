import { useState } from "react";
import { Search } from "lucide-react";
import { turfs, SportType } from "@/data/mockData";
import SportFilter from "@/components/SportFilter";
import TurfCard from "@/components/TurfCard";
import { useUser } from "@/context/UserContext";

const Discover = () => {
  const { allTurfs } = useUser();
  const [sport, setSport] = useState<SportType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = allTurfs.filter((t) => {
    const matchesSport = sport === "all" || t.sport === sport;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    return matchesSport && matchesSearch;
  });

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Turfs</h1>
        <p className="text-muted-foreground mb-8">Find and book the best sports venues near you</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search turfs or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg glass border-border bg-card/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="mb-8">
          <SportFilter selected={sport} onSelect={setSport} />
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((turf, i) => (
              <TurfCard key={turf.id} turf={turf as any} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No turfs found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Discover;
