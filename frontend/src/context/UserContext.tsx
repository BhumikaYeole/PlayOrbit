import React, { createContext, useContext, useState, useEffect } from "react";

export type UserProfile = {
    name: string;
    email: string;
    sports: string[];
    experience: "beginner" | "intermediate" | "advanced";
    role: string;
    avatar?: string;
};

export type MatchRequest = {
    id: string;
    playerName: string;
    playerEmail?: string;
    playerAvatar: string;
    sport: string;
    experience: string;
    role: string;
    turfName: string;
    turfId?: string;
    date: string;
    time?: string;
    matchesPlayed: number;
    rating: number;
    status: "pending" | "approved" | "rejected";
};

export type Turf = {
    id: string;
    name: string;
    location: string;
    pricePerHour: number;
    rating: number;
    availableSlots: number;
    totalSlots: number;
    sport: string;
    image: string;
    providerEmail: string;
    slots?: { time: string; price: number; available: boolean; bookedBy?: string }[];
};

interface UserContextType {
    user: UserProfile | null;
    pendingRequests: MatchRequest[];
    userMatches: {
        played: number;
        pending: number;
        history: { turf: string; date: string; sport: string }[];
    };
    allTurfs: Turf[];
    login: (profile: UserProfile) => void;
    logout: () => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    addTurf: (turf: Omit<Turf, "id" | "providerEmail">, email?: string) => void;
    bookSlot: (turfId: string, slotTime: string, date: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockRequests: MatchRequest[] = [
    { id: "1", playerName: "Varun K.", playerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", sport: "football", experience: "advanced", role: "Striker", turfName: "Green Arena", date: "Feb 15", matchesPlayed: 42, rating: 4.8, status: "pending" },
    { id: "2", playerName: "Sneha L.", playerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", sport: "badminton", experience: "intermediate", role: "All-rounder", turfName: "Smash Point", date: "Feb 16", matchesPlayed: 15, rating: 4.5, status: "pending" },
    { id: "3", playerName: "Ishan G.", playerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", sport: "football", experience: "beginner", role: "Goalie", turfName: "Thunder Ground", date: "Feb 15", matchesPlayed: 5, rating: 4.2, status: "pending" },
    { id: "4", playerName: "Rahul M.", playerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop", sport: "football", experience: "advanced", role: "Midfielder", turfName: "Green Arena", date: "Feb 15", matchesPlayed: 28, rating: 4.7, status: "pending" },
    { id: "5", playerName: "Ananya S.", playerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", sport: "badminton", experience: "pro", role: "Singles", turfName: "Smash Point", date: "Feb 16", matchesPlayed: 52, rating: 4.9, status: "pending" },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem("user_profile");
        return saved ? JSON.parse(saved) : null;
    });

    const [pendingRequests, setPendingRequests] = useState<MatchRequest[]>(() => {
        const saved = localStorage.getItem("pending_requests");
        return saved ? JSON.parse(saved) : mockRequests;
    });
    const [userMatches] = useState({
        played: 28,
        pending: 3,
        history: [
            { turf: "Green Arena", date: "Feb 10", sport: "football" },
            { turf: "Ace Academy", date: "Feb 08", sport: "tennis" },
            { turf: "Smash Point", date: "Feb 05", sport: "badminton" },
        ]
    });

    const [allTurfs, setAllTurfs] = useState<Turf[]>(() => {
        const saved = localStorage.getItem("all_turfs");
        if (saved) return JSON.parse(saved);
        // Default turfs belonging to a single provider
        return [
            { id: "1", name: "Green Arena", location: "Bandra, Mumbai", pricePerHour: 1500, rating: 4.8, availableSlots: 12, totalSlots: 20, sport: "football", image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800", providerEmail: "provider@example.com" },
            { id: "2", name: "Smash Point", location: "Andheri, Mumbai", pricePerHour: 500, rating: 4.5, availableSlots: 8, totalSlots: 15, sport: "badminton", image: "https://images.unsplash.com/photo-1626225967045-94408822605d?q=80&w=800", providerEmail: "provider@example.com" },
            { id: "3", name: "Ace Academy", location: "Powai, Mumbai", pricePerHour: 800, rating: 4.7, availableSlots: 3, totalSlots: 10, sport: "tennis", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800", providerEmail: "provider@example.com" },
        ];
    });

    useEffect(() => {
        localStorage.setItem("all_turfs", JSON.stringify(allTurfs));
    }, [allTurfs]);

    useEffect(() => {
        localStorage.setItem("pending_requests", JSON.stringify(pendingRequests));
    }, [pendingRequests]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "all_turfs" && e.newValue) {
                setAllTurfs(JSON.parse(e.newValue));
            }
            if (e.key === "pending_requests" && e.newValue) {
                setPendingRequests(JSON.parse(e.newValue));
            }
            if (e.key === "user_profile" && e.newValue) {
                setUser(JSON.parse(e.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = (profile: UserProfile) => {
        setUser(profile);
        localStorage.setItem("user_profile", JSON.stringify(profile));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user_profile");
    };

    const approveRequest = (id: string) => {
        const request = pendingRequests.find(r => r.id === id);
        if (request && request.turfId && request.time) {
            // Disable the slot in allTurfs only when approved
            setAllTurfs(prev => prev.map(turf => {
                if (turf.id === request.turfId) {
                    const updatedSlots = turf.slots ? turf.slots.map(slot =>
                        slot.time === request.time ? { ...slot, available: false, bookedBy: request.playerName } : slot
                    ) : [{ time: request.time!, price: turf.pricePerHour, available: false, bookedBy: request.playerName }];

                    return {
                        ...turf,
                        slots: updatedSlots,
                        availableSlots: Math.max(0, turf.availableSlots - 1)
                    };
                }
                return turf;
            }));
        }
        setPendingRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as const } : r));
    };

    const rejectRequest = (id: string) => {
        setPendingRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r));
    };

    const addTurf = (turfData: Omit<Turf, "id" | "providerEmail">, email?: string) => {
        const ownerEmail = email || user?.email;
        if (!ownerEmail) return;

        const newTurf: Turf = {
            ...turfData,
            id: Math.random().toString(36).substr(2, 9),
            providerEmail: ownerEmail,
        };
        setAllTurfs(prev => [...prev, newTurf]);
    };

    const bookSlot = (turfId: string, slotTime: string, date: string) => {
        if (!user) return;

        // In this new workflow, we don't disable the slot here. 
        // We just create the pending request.

        const turf = allTurfs.find(t => t.id === turfId);
        const newRequest: MatchRequest = {
            id: Math.random().toString(36).substr(2, 9),
            playerName: user.name,
            playerEmail: user.email,
            playerAvatar: user.avatar || "",
            sport: turf?.sport || "N/A",
            experience: user.experience,
            role: user.role,
            turfName: turf?.name || "N/A",
            turfId: turfId,
            date: date,
            time: slotTime,
            matchesPlayed: 0,
            rating: 5.0,
            status: "pending"
        };
        setPendingRequests(prev => [newRequest, ...prev]);
    };

    return (
        <UserContext.Provider value={{ user, pendingRequests, userMatches, allTurfs, login, logout, approveRequest, rejectRequest, addTurf, bookSlot }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
