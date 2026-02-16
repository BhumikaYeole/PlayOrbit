import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayerRequest, sportIcons, sportColors } from "@/data/mockData";
import { Users, MapPin, Calendar, Clock, CheckCircle2, User, Timer, ShieldCheck, XCircle, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface JoinGameModalProps {
    request: PlayerRequest;
    isOpen: boolean;
    onClose: () => void;
}

const mockJoinedPlayers = [
    { name: "Rahul M.", role: "Striker", avatar: "RM", skill: "advanced" },
    { name: "Priya S.", role: "Goalie", avatar: "PS", skill: "intermediate" },
    { name: "Arjun K.", role: "Midfielder", avatar: "AK", skill: "advanced" },
];

const mockWaitlist = [
    { id: "w1", name: "Suresh R.", skill: "intermediate", role: "Defender", avatar: "SR" },
    { id: "w2", name: "Ananya P.", skill: "beginner", role: "Striker", avatar: "AP" },
];

const JoinGameModal = ({ request, isOpen, onClose }: JoinGameModalProps) => {
    const { user } = useUser();
    const isAdmin = user?.email === request.creatorEmail;

    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [pendingRequests, setPendingRequests] = useState(mockWaitlist);
    const [joinedCount, setJoinedCount] = useState(request.playersJoined);

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            setHasApplied(true);
            toast.success("Application sent to team admin!");
        }, 1500);
    };

    const handleApprove = (player: typeof mockWaitlist[0]) => {
        setPendingRequests((prev) => prev.filter((p) => p.id !== player.id));
        setJoinedCount((prev) => prev + 1);
        toast.success(`Approved ${player.name} based on skills!`);
    };

    const handleReject = (player: typeof mockWaitlist[0]) => {
        setPendingRequests((prev) => prev.filter((p) => p.id !== player.id));
        toast.error(`Declined ${player.name}`);
    };

    const resetAndClose = () => {
        onClose();
        setTimeout(() => {
            setHasApplied(false);
        }, 300);
    };

    const totalPlayers = joinedCount + request.playersNeeded;
    const progress = (joinedCount / totalPlayers) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-[500px] glass-strong border-border p-0 overflow-hidden">
                <div className={`h-28 bg-gradient-to-br ${sportColors[request.sport]} relative items-end flex p-6`}>
                    <div className="flex items-center gap-4">
                        <span className="text-4xl bg-background/20 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl">
                            {sportIcons[request.sport]}
                        </span>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter text-foreground drop-shadow-md">
                                {request.turfName}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white border border-white/10 uppercase font-bold tracking-widest">
                                    {request.sport} Match
                                </span>
                                {isAdmin && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 uppercase font-bold tracking-widest flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Admin View
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Game Info Bar */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
                        <div className="text-center">
                            <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{request.date}</p>
                        </div>
                        <div className="text-center border-x border-border/50">
                            <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{request.time}</p>
                        </div>
                        <div className="text-center">
                            <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold truncate px-1">{request.location}</p>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                            <span>Squad Capacity</span>
                            <span className="text-primary">{joinedCount} / {totalPlayers} PLAYERS</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden p-[2px] border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            />
                        </div>
                    </div>

                    {/* Dynamic Content based on User Role */}
                    <AnimatePresence mode="wait">
                        {isAdmin ? (
                            <motion.div key="admin-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-black italic tracking-tighter uppercase mb-4 flex items-center gap-2">
                                        <Timer className="h-4 w-4 text-amber-500" /> Pending Approvals
                                    </h3>
                                    <div className="space-y-3">
                                        {pendingRequests.length > 0 ? (
                                            pendingRequests.map((player) => (
                                                <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-white/10 group-hover:border-primary/20 transition-all">
                                                            <AvatarFallback>{player.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-bold">{player.name}</p>
                                                            <div className="flex gap-2 mt-1">
                                                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase font-black">
                                                                    {player.skill}
                                                                </span>
                                                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10 uppercase font-black">
                                                                    {player.role}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleReject(player)}
                                                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-95 transition-all"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(player)}
                                                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all"
                                                        >
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                                                <p className="text-sm text-muted-foreground italic">No pending requests at the moment.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black italic tracking-tighter uppercase mb-4 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" /> Confirmed Teammates
                                    </h3>
                                    <div className="flex -space-x-3 overflow-hidden p-1">
                                        {mockJoinedPlayers.map((p, i) => (
                                            <Avatar key={i} className="h-10 w-10 ring-2 ring-[#030708] border border-white/10">
                                                <AvatarFallback className="bg-primary/20 text-[10px] font-bold">{p.avatar}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        <div className="h-10 w-10 ring-2 ring-[#030708] rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                            <span className="text-[10px] text-muted-foreground">+{request.playersNeeded}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="player-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                {!hasApplied ? (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                                <Zap className="h-12 w-12 text-primary" />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Message from Admin ({request.createdBy})</h4>
                                            <p className="text-sm italic text-muted-foreground">
                                                "Looking for {request.skillLevel} {request.sport} players. Quality game guaranteed. Apply with your preferred role below!"
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Active Squad</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {mockJoinedPlayers.map((p, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2 px-4 rounded-xl bg-white/5 border border-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-sm font-bold">{p.name}</p>
                                                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/20 uppercase font-black">{p.role}</span>
                                                        </div>
                                                        <span className="text-[8px] text-muted-foreground uppercase font-black">{p.skill}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-14 gradient-primary text-primary-foreground font-black italic text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                                            onClick={handleApply}
                                            disabled={isApplying}
                                        >
                                            {isApplying ? (
                                                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            ) : (
                                                "APPLY FOR A SPOT"
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-center text-muted-foreground italic">
                                            Administrators carefully review each application. Please ensure your profile is up to date.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center space-y-6">
                                        <div className="mx-auto w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 relative">
                                            <Timer className="h-12 w-12 text-amber-500 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-amber-500">REQUEST PENDING</h2>
                                            <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
                                                Your skill profile has been sent to <span className="text-foreground font-bold">{request.createdBy}</span>. You'll be notified once they approve your slot.
                                            </p>
                                        </div>
                                        <Button variant="ghost" className="w-full font-bold" onClick={resetAndClose}>DISMISS</Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {isAdmin && (
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" className="w-full h-12 font-bold" onClick={resetAndClose}>
                            CLOSE DASHBOARD
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default JoinGameModal;
