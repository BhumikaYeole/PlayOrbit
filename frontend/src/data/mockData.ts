export type SportType = "football" | "badminton" | "tennis" | "pickleball";

export interface Turf {
  id: string;
  name: string;
  location: string;
  sport: SportType;
  pricePerHour: number;
  rating: number;
  image: string;
  availableSlots: number;
  totalSlots: number;
  providerEmail: string;
}

export interface PlayerRequest {
  id: string;
  sport: SportType;
  turfName: string;
  location: string;
  date: string;
  time: string;
  playersNeeded: number;
  playersJoined: number;
  skillLevel: "beginner" | "intermediate" | "advanced";
  createdBy: string;
  creatorEmail: string;
}

export const sportIcons: Record<SportType, string> = {
  football: "⚽",
  badminton: "🏸",
  tennis: "🎾",
  pickleball: "🏓",
};

export const sportColors: Record<SportType, string> = {
  football: "from-neon-green/20 to-neon-green/5 border-neon-green/30",
  badminton: "from-primary/20 to-primary/5 border-primary/30",
  tennis: "from-neon-purple/20 to-neon-purple/5 border-neon-purple/30",
  pickleball: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
};

export const turfs: Turf[] = [
  { id: "1", name: "Green Arena Football Turf", location: "Koramangala, Bangalore", sport: "football", pricePerHour: 1500, rating: 4.8, image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop", availableSlots: 5, totalSlots: 12, providerEmail: "provider1@example.com" },
  { id: "2", name: "Smash Point Badminton", location: "HSR Layout, Bangalore", sport: "badminton", pricePerHour: 800, rating: 4.6, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop", availableSlots: 3, totalSlots: 8, providerEmail: "provider1@example.com" },
  { id: "3", name: "Ace Tennis Academy", location: "Indiranagar, Bangalore", sport: "tennis", pricePerHour: 1200, rating: 4.9, image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop", availableSlots: 2, totalSlots: 6, providerEmail: "provider1@example.com" },
  { id: "4", name: "Rally Pickleball Hub", location: "Whitefield, Bangalore", sport: "pickleball", pricePerHour: 600, rating: 4.5, image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop", availableSlots: 7, totalSlots: 10, providerEmail: "provider2@example.com" },
  { id: "5", name: "Thunder Football Ground", location: "Jayanagar, Bangalore", sport: "football", pricePerHour: 1800, rating: 4.7, image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop", availableSlots: 4, totalSlots: 10, providerEmail: "provider2@example.com" },
  { id: "6", name: "Shuttle Kings Court", location: "BTM Layout, Bangalore", sport: "badminton", pricePerHour: 900, rating: 4.4, image: "https://images.unsplash.com/photo-1613918431703-aa50889e3be3?w=600&h=400&fit=crop", availableSlots: 6, totalSlots: 8, providerEmail: "provider2@example.com" },
];

export const playerRequests: PlayerRequest[] = [
  { id: "1", sport: "football", turfName: "Green Arena Football Turf", location: "Koramangala", date: "2026-02-15", time: "18:00", playersNeeded: 4, playersJoined: 7, skillLevel: "intermediate", createdBy: "Rahul M.", creatorEmail: "rahul@example.com" },
  { id: "2", sport: "badminton", turfName: "Smash Point Badminton", location: "HSR Layout", date: "2026-02-15", time: "19:30", playersNeeded: 1, playersJoined: 3, skillLevel: "beginner", createdBy: "Priya S.", creatorEmail: "priya@example.com" },
  { id: "3", sport: "tennis", turfName: "Ace Tennis Academy", location: "Indiranagar", date: "2026-02-16", time: "07:00", playersNeeded: 1, playersJoined: 1, skillLevel: "advanced", createdBy: "Arjun K.", creatorEmail: "arjun@example.com" },
  { id: "4", sport: "pickleball", turfName: "Rally Pickleball Hub", location: "Whitefield", date: "2026-02-16", time: "16:00", playersNeeded: 3, playersJoined: 1, skillLevel: "beginner", createdBy: "Sneha R.", creatorEmail: "sneha@example.com" },
  { id: "5", sport: "football", turfName: "Thunder Football Ground", location: "Jayanagar", date: "2026-02-17", time: "20:00", playersNeeded: 6, playersJoined: 5, skillLevel: "intermediate", createdBy: "Vikram D.", creatorEmail: "vikram@example.com" },
];
