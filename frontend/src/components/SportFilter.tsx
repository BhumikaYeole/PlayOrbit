import { SportType, sportIcons } from "@/data/mockData";

interface SportFilterProps {
  selected: SportType | "all";
  onSelect: (sport: SportType | "all") => void;
}

const sports: { key: SportType | "all"; label: string }[] = [
  { key: "all", label: "🏟️ All Sports" },
  { key: "football", label: `${sportIcons.football} Football` },
  { key: "badminton", label: `${sportIcons.badminton} Badminton` },
  { key: "tennis", label: `${sportIcons.tennis} Tennis` },
  { key: "pickleball", label: `${sportIcons.pickleball} Pickleball` },
];

const SportFilter = ({ selected, onSelect }: SportFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sports.map((sport) => (
        <button
          key={sport.key}
          onClick={() => onSelect(sport.key)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
            selected === sport.key
              ? "bg-primary/15 border-primary/40 text-primary neon-border"
              : "glass border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
          }`}
        >
          {sport.label}
        </button>
      ))}
    </div>
  );
};

export default SportFilter;
