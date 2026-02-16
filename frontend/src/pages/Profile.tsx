import { useUser, MatchRequest } from "@/context/UserContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User as UserIcon,
    Trophy,
    Users,
    ShieldCheck,
    Check,
    X,
    Zap,
    Activity,
    History,
    Timer,
    Star,
    Target
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { sportIcons } from "@/data/mockData";
import { toast } from "sonner";
import SquadCarousel from "@/components/SquadCarousel";

const Profile = () => {
    const { user, pendingRequests, userMatches, approveRequest, rejectRequest, allTurfs } = useUser();

    // Filter requests made by the current user
    const personalRequests = pendingRequests.filter(req => req.playerEmail === user?.email);

    if (!user) return null;

    const handleApprove = (id: string, name: string) => {
        console.log("Profile handling approve for:", id, name);
        approveRequest(id);
        toast.success(`Authorized ${name} for the game!`);
    };

    const handleReject = (id: string, name: string) => {
        console.log("Profile handling reject for:", id, name);
        rejectRequest(id);
        toast.error(`Scout declined: ${name}`);
    };

    return (
        <main className="pt-24 pb-16 min-h-screen bg-[#030708]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Column: Personal Dossier */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-strong p-8 rounded-[3rem] border border-white/10 text-center relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
                                <Zap className="h-32 w-32 text-primary" />
                            </div>

                            <div className="relative inline-block mb-8">
                                <Avatar className="h-36 w-36 mx-auto ring-8 ring-primary/10 border-4 border-[#030708]">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary font-black uppercase">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-[#030708] shadow-lg flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-white" />
                                </div>
                            </div>

                            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none text-white">{user.name}</h1>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-8">
                                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{user.role}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-2 tracking-widest">Total Played</p>
                                    <p className="text-3xl font-black italic text-primary">{userMatches.played}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-2 tracking-widest">In Pipeline</p>
                                    <p className="text-3xl font-black italic text-amber-500">{userMatches.pending}</p>
                                </div>
                            </div>

                            <div className="mt-10 space-y-4 text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center mb-6">Mastered Disciplines</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {user.sports.map((sport) => (
                                        <span
                                            key={sport}
                                            className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-foreground text-[10px] font-black uppercase tracking-tighter flex items-center gap-2.5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default"
                                        >
                                            <span className="text-lg">{sportIcons[sport as keyof typeof sportIcons]}</span>
                                            {sport}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <History className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-black italic tracking-tighter uppercase leading-none">Scout Repository</h2>
                            </div>
                            <div className="space-y-4">
                                {userMatches.history.map((game, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                        <div>
                                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{game.turf}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{game.date} • {game.sport}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Tactical Control Hub */}
                    <div className="lg:col-span-8 space-y-8">
                        {user.role === "Player" ? (
                            <>
                                {/* Squad Verification Hub (For Players) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-strong p-20 rounded-[3.5rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

                                    <div className="flex items-center justify-between mb-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 rounded-3xl bg-primary/10 border-2 border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
                                                <Users className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">Squad Authorization</h2>
                                                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-2">Tactical approval for your upcoming matches</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-5xl font-black italic text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]">{pendingRequests.filter(r => r.playerEmail !== user.email && r.status === 'pending').length}</span>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pending Scopes</span>
                                        </div>
                                    </div>

                                    <div className="relative min-h-[850px] flex items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {pendingRequests.filter(r => r.playerEmail !== user.email && r.status === 'pending').length > 0 ? (
                                                <motion.div
                                                    key="carousel"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="w-full"
                                                >
                                                    <SquadCarousel
                                                        requests={pendingRequests.filter(r => r.playerEmail !== user.email && r.status === 'pending')}
                                                        onApprove={handleApprove}
                                                        onReject={handleReject}
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="w-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5"
                                                >
                                                    <ShieldCheck className="h-20 w-20 text-primary/10 mx-auto mb-6" />
                                                    <p className="text-muted-foreground italic text-xl font-medium px-10">All squads currently deployed. Tactical hub quiet.</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Tactical Status & Deployment Log (For Players) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-strong p-10 rounded-[3.5rem] border border-white/10 shadow-2xl"
                                >
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20">
                                            <Timer className="h-8 w-8 text-amber-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">Deployment Logistics</h2>
                                            <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-2">Active facility operations and transit status</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {personalRequests.length > 0 ? (
                                            personalRequests.map((req) => (
                                                <div key={req.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between hover:border-primary/40 transition-all group">
                                                    <div className="mb-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="text-lg font-black italic uppercase text-white truncate">{req.turfName}</h4>
                                                            <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                                                    req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                                                                        'bg-red-500/20 text-red-500'
                                                                }`}>
                                                                {req.status === 'pending' ? 'WAITING' : req.status === 'approved' ? 'CONFIRMED' : 'DECLINED'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-4">{req.date} • {req.time}</p>

                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            <p className="text-[10px] font-bold text-white/60 uppercase">{req.sport}</p>
                                                        </div>
                                                    </div>

                                                    {req.status === 'approved' && (
                                                        <div className="mt-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                                                            <Check className="h-3 w-3 text-emerald-500" />
                                                            <p className="text-[9px] font-black text-emerald-500 uppercase">SLOT SECURED & FACILITY DECREMENTED</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Active Deployments</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {/* Facility Overview (For Providers) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-strong p-10 rounded-[3.5rem] border border-white/10 shadow-2xl"
                                >
                                    <header className="flex justify-between items-center mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 rounded-3xl bg-primary/10 border-2 border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
                                                <Zap className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">Facility Network</h2>
                                                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-2">Manage your sports empire logistics</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => window.location.href = '/provider/dashboard'}
                                            className="h-12 gradient-primary text-primary-foreground font-black px-8 rounded-2xl shadow-lg hover:scale-105 transition-all"
                                        >
                                            OPEN DASHBOARD <Target className="ml-2 h-4 w-4" />
                                        </Button>
                                    </header>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {allTurfs.filter(t => t.providerEmail === user.email).length > 0 ? (
                                            allTurfs.filter(t => t.providerEmail === user.email).map((turf) => (
                                                <div key={turf.id} className="glass-strong rounded-[2rem] overflow-hidden border border-white/5 group hover:border-primary/30 transition-all">
                                                    <div className="h-32 relative">
                                                        <img src={turf.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={turf.name} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                        <div className="absolute bottom-4 left-4">
                                                            <h4 className="text-lg font-black italic uppercase text-white truncate">{turf.name}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Registered Facilities</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Active Incoming Logistics (For Providers) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-strong p-10 rounded-[3.5rem] border border-white/10 shadow-2xl"
                                >
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="p-4 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20">
                                            <Users className="h-8 w-8 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">Live Logistics</h2>
                                            <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-2">Personal incoming booking operations</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {pendingRequests.filter(r => allTurfs.filter(t => t.providerEmail === user.email).some(t => t.id === r.turfId)).length > 0 ? (
                                            pendingRequests.filter(r => allTurfs.filter(t => t.providerEmail === user.email).some(t => t.id === r.turfId)).map((req) => (
                                                <div key={req.id} className="p-5 flex items-center justify-between rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={req.playerAvatar} />
                                                            <AvatarFallback className="font-black text-xs">{req.playerName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-black text-white">{req.playerName}</p>
                                                            <p className="text-[9px] text-muted-foreground uppercase font-black">{req.turfName} • {req.time}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[8px] font-black px-2 py-1 rounded-md ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                                            req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                                                                'bg-red-500/20 text-red-500'
                                                        } uppercase tracking-widest`}>
                                                        {req.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Incoming Operations</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Tactical Stats & Activity Report */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="glass p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-2xl relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Activity className="h-32 w-32 text-white" />
                                </div>

                                <div className="flex items-center gap-4 mb-10 relative z-10">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                        <Trophy className="h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Performance Log</h2>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="p-8 rounded-[2.5rem] bg-[#050a0d] border border-white/10 flex items-center justify-between hover:border-primary transition-all shadow-xl group/card">
                                        <div>
                                            <p className="text-4xl font-black italic text-primary leading-none mb-1 tracking-tighter shadow-primary/20">{userMatches.played}</p>
                                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Matches Logged</p>
                                        </div>
                                        <Check className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] bg-[#050a0d] border border-white/10 flex items-center justify-between hover:border-amber-500 transition-all shadow-xl group/card">
                                        <div>
                                            <p className="text-4xl font-black italic text-amber-500 leading-none mb-1 tracking-tighter">{personalRequests.length}</p>
                                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Bookings</p>
                                        </div>
                                        <Timer className="h-10 w-10 text-amber-500/40 group-hover:text-amber-500 transition-colors" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between"
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                                        <Star className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Tactical Status</h2>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Community Rank", value: "ELITE CAPTAIN", icon: ShieldCheck, color: "text-primary" },
                                        { label: "Reliability score", value: "100% ATTENDANCE", icon: Zap, color: "text-green-500" },
                                        { label: "Match Integrity", value: "ADMIN VERIFIED", icon: Check, color: "text-blue-400" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-5 flex items-center justify-between rounded-2xl bg-[#050a0d] border border-white/5 group hover:border-white/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`h-4 w-4 ${item.color}`} />
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase text-foreground ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-5 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-between overflow-hidden relative">
                                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-primary uppercase">Current Reputation</p>
                                        <p className="text-lg font-black italic text-white leading-none mt-1">S-CLASS OPERATOR</p>
                                    </div>
                                    <Trophy className="h-8 w-8 text-primary relative z-10" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
