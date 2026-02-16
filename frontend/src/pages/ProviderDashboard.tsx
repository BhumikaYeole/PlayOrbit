import { useState } from "react";
import { useUser, Turf } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    LayoutDashboard,
    Calendar,
    Check,
    X,
    MapPin,
    Image as ImageIcon,
    Clock,
    Zap,
    Trophy,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProviderDashboard = () => {
    const { user, allTurfs, addTurf, pendingRequests, approveRequest, rejectRequest } = useUser();
    const [isAddingTurf, setIsAddingTurf] = useState(false);
    const [newTurf, setNewTurf] = useState<Partial<Turf>>({
        name: "",
        location: "",
        pricePerHour: 1000,
        sport: "football",
        image: "",
        totalSlots: 10,
        availableSlots: 10,
    });

    const providerTurfs = allTurfs.filter(t => t.providerEmail === user?.email);

    // All requests for this provider's turfs
    const allProviderRequests = pendingRequests.filter(req =>
        providerTurfs.some(t => t.id === req.turfId)
    );

    const pendingRequestsList = allProviderRequests.filter(req => req.status === "pending");
    const confirmedBookings = allProviderRequests.filter(req => req.status === "approved");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewTurf({ ...newTurf, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTurf = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTurf.name || !newTurf.location || !newTurf.image) {
            toast.error("Please fill all fields");
            return;
        }

        addTurf({
            name: newTurf.name!,
            location: newTurf.location!,
            pricePerHour: Number(newTurf.pricePerHour!),
            image: newTurf.image!,
            sport: newTurf.sport!,
            totalSlots: Number(newTurf.totalSlots!),
            availableSlots: Number(newTurf.totalSlots!),
            rating: 5.0,
        });

        toast.success("Turf added successfully!");
        setIsAddingTurf(false);
        setNewTurf({
            name: "",
            location: "",
            pricePerHour: 1000,
            sport: "football",
            image: "",
            totalSlots: 10,
            availableSlots: 10,
        });
    };

    return (
        <main className="pt-24 pb-16 min-h-screen bg-[#030708] text-foreground">
            <div className="container mx-auto px-4 max-w-7xl">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
                            Provider <span className="text-primary italic">Dashboard</span>
                        </h1>
                        <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.3em] mt-2">Manage your sports empire</p>
                    </div>
                    <Button
                        onClick={() => setIsAddingTurf(true)}
                        className="h-12 gradient-primary text-primary-foreground font-black px-8 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <Plus className="mr-2 h-5 w-5" /> ADD NEW TURF
                    </Button>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Stats & Requests */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Zap className="h-32 w-32 text-primary" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Live Turfs</p>
                                    <p className="text-3xl font-black italic text-primary">{providerTurfs.length}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Live Turfs</p>
                                    <p className="text-3xl font-black italic text-primary">{providerTurfs.length}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Active Players</p>
                                    <p className="text-3xl font-black italic text-amber-500">{confirmedBookings.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <h3 className="text-sm font-black italic tracking-tighter uppercase mb-6 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" /> Pending Requests
                            </h3>
                            <div className="space-y-4">
                                {pendingRequestsList.length > 0 ? (
                                    pendingRequestsList.map((req) => (
                                        <div key={req.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar className="h-10 w-10 border border-white/10">
                                                    <AvatarImage src={req.playerAvatar} />
                                                    <AvatarFallback>{req.playerName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{req.playerName}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black">{req.turfName} • {req.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => approveRequest(req.id)}
                                                    variant="ghost"
                                                    className="flex-1 h-9 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20 hover:bg-primary hover:text-black transition-all"
                                                >
                                                    APPROVE
                                                </Button>
                                                <Button
                                                    onClick={() => rejectRequest(req.id)}
                                                    variant="ghost"
                                                    className="flex-1 h-9 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    REJECT
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <p className="text-[10px] text-muted-foreground italic font-black uppercase tracking-widest">No pending requests</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <h3 className="text-sm font-black italic tracking-tighter uppercase mb-6 flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-500" /> Confirmed Players
                            </h3>
                            <div className="space-y-3">
                                {confirmedBookings.length > 0 ? (
                                    confirmedBookings.map((req) => (
                                        <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={req.playerAvatar} />
                                                <AvatarFallback>{req.playerName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{req.playerName}</p>
                                                <p className="text-[8px] text-muted-foreground uppercase font-black">{req.turfName} • {req.time}</p>
                                            </div>
                                            <div className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                                                <Check className="h-3 w-3 text-emerald-500" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">No confirmed bookings</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Turf List */}
                    <div className="lg:col-span-8 space-y-8">
                        {providerTurfs.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {providerTurfs.map((turf) => (
                                    <motion.div
                                        key={turf.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-strong rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-primary/30 transition-all shadow-2xl flex flex-col"
                                    >
                                        <div className="h-48 relative overflow-hidden">
                                            <img src={turf.image} alt={turf.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#030708] to-transparent" />
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                                                {turf.sport}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-black italic tracking-tighter uppercase text-white mb-1">{turf.name}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">
                                                    <MapPin className="h-3 w-3 text-primary" /> {turf.location}
                                                </div>

                                                {/* Players booked on this specific turf */}
                                                <div className="mb-6">
                                                    <p className="text-[8px] text-muted-foreground uppercase font-black mb-2 tracking-widest">Active Bookings</p>
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {confirmedBookings.filter(b => b.turfId === turf.id).length > 0 ? (
                                                            confirmedBookings.filter(b => b.turfId === turf.id).map((b, idx) => (
                                                                <Avatar key={b.id} className="h-8 w-8 border-2 border-[#030708] shadow-lg" style={{ zIndex: 10 - idx }}>
                                                                    <AvatarImage src={b.playerAvatar} title={b.playerName} />
                                                                    <AvatarFallback className="text-[8px] font-black">{b.playerName.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                            ))
                                                        ) : (
                                                            <div className="h-8 flex items-center">
                                                                <p className="text-[10px] text-muted-foreground/40 italic font-medium tracking-tight">No players currently booked</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center transition-colors group-hover:bg-white/10">
                                                        <p className="text-[8px] text-muted-foreground uppercase font-black mb-1">Price</p>
                                                        <p className="text-sm font-black text-emerald-400">₹{turf.pricePerHour}/hr</p>
                                                    </div>
                                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center transition-colors group-hover:bg-white/10">
                                                        <p className="text-[8px] text-muted-foreground uppercase font-black mb-1">Capacity</p>
                                                        <p className="text-sm font-black text-primary">{turf.availableSlots}/{turf.totalSlots}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full h-12 rounded-2xl font-black italic uppercase tracking-tighter border-white/10 hover:border-primary group/btn active:scale-95 transition-all">
                                                MANAGE FACILITY <Zap className="ml-2 h-4 w-4 text-primary group-hover/btn:animate-pulse" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[500px] flex flex-col items-center justify-center glass-strong rounded-[3.5rem] border border-dashed border-white/10">
                                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <Trophy className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">No Turfs Registered</h3>
                                <p className="text-muted-foreground text-sm max-w-[300px] text-center mb-8">Start your sports venue business by adding your first turf today.</p>
                                <Button
                                    onClick={() => setIsAddingTurf(true)}
                                    className="h-14 gradient-primary text-primary-foreground font-black px-10 rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                                >
                                    GET STARTED NOW
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for adding Turf */}
            <AnimatePresence>
                {isAddingTurf && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsAddingTurf(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-strong p-10 rounded-[3rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
                        >
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-2">Register <span className="text-primary italic">Turf</span></h2>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-8">Deploy a new sports facility to the network</p>

                            <form onSubmit={handleAddTurf} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Facility Name</label>
                                    <Input
                                        placeholder="e.g. Neo Football Arena"
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold"
                                        value={newTurf.name}
                                        onChange={e => setNewTurf({ ...newTurf, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Turf Photo</label>
                                    <div className="flex flex-col gap-4">
                                        <div className={`h-40 w-full rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group transition-all ${newTurf.image ? 'border-primary/50' : 'hover:border-white/20'}`}>
                                            {newTurf.image ? (
                                                <>
                                                    <img src={newTurf.image} className="w-full h-full object-cover" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <p className="text-white text-[10px] font-black">CHANGE PHOTO</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <Plus className="h-8 w-8 text-white/20 mx-auto mb-2" />
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">UPLOAD TURF PHOTO</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Location</label>
                                        <Input
                                            placeholder="City, Area"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold"
                                            value={newTurf.location}
                                            onChange={e => setNewTurf({ ...newTurf, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Sport Type</label>
                                        <select
                                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white font-bold appearance-none outline-none focus:border-primary/30"
                                            value={newTurf.sport}
                                            onChange={e => setNewTurf({ ...newTurf, sport: e.target.value })}
                                        >
                                            <option value="football">Football</option>
                                            <option value="badminton">Badminton</option>
                                            <option value="tennis">Tennis</option>
                                            <option value="pickleball">Pickleball</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Price / Hour</label>
                                        <Input
                                            type="number"
                                            placeholder="1500"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold"
                                            value={newTurf.pricePerHour}
                                            onChange={e => setNewTurf({ ...newTurf, pricePerHour: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-primary/80 ml-2 tracking-widest">Total Slots</label>
                                        <Input
                                            type="number"
                                            placeholder="20"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold"
                                            value={newTurf.totalSlots}
                                            onChange={e => setNewTurf({ ...newTurf, totalSlots: Number(e.target.value), availableSlots: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest"
                                        onClick={() => setIsAddingTurf(false)}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-14 gradient-primary text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20"
                                    >
                                        INITIATE FACILITY
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default ProviderDashboard;
