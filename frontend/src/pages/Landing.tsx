import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Check, Trophy, Target, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, UserProfile } from "@/context/UserContext";
import { toast } from "sonner";

const sportsOptions = [
    { id: "football", label: "Football", icon: "⚽" },
    { id: "badminton", label: "Badminton", icon: "🏸" },
    { id: "tennis", label: "Tennis", icon: "🎾" },
    { id: "pickleball", label: "Pickleball", icon: "🏓" },
];

const Landing = () => {
    const navigate = useNavigate();
    const { login, addTurf } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        sports: [],
        experience: "beginner",
        role: "",
        // Provider specific
        turfName: "",
        turfLocation: "",
        turfImage: "",
        turfPrice: 1000,
        turfSport: "football",
        turfSlots: 10,
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleSportToggle = (sport: string) => {
        setFormData((prev) => ({
            ...prev,
            sports: prev.sports?.includes(sport)
                ? prev.sports.filter((s) => s !== sport)
                : [...(prev.sports || []), sport],
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, turfImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinish = () => {
        if (!formData.name || !formData.email) {
            toast.error("Please fill in your basic details");
            return;
        }

        if (formData.role === "Player" && formData.sports?.length === 0) {
            toast.error("Please select at least one sport");
            return;
        }

        if (formData.role === "Provider" && (!formData.turfName || !formData.turfLocation)) {
            toast.error("Please fill in your turf details");
            return;
        }

        const profile: UserProfile = {
            name: formData.name,
            email: formData.email,
            sports: formData.sports || [],
            experience: formData.experience,
            role: formData.role || "Player",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        };

        login(profile);

        if (profile.role === "Provider") {
            addTurf({
                name: formData.turfName,
                location: formData.turfLocation,
                image: formData.turfImage || "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800",
                pricePerHour: formData.turfPrice,
                sport: formData.turfSport,
                totalSlots: formData.turfSlots,
                availableSlots: formData.turfSlots,
                rating: 5.0
            }, formData.email);
            toast.success("Turf registered successfully!");
            navigate("/provider/dashboard");
        } else {
            toast.success("Welcome to the community!");
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-[#030708] text-foreground flex flex-col relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-neon" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000')] bg-cover opacity-10 grayscale" />
            </div>

            <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl"
                >
                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-2 mb-12">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-12 bg-primary" : "w-6 bg-border"
                                    }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-strong p-10 rounded-3xl border border-white/10 shadow-2xl"
                            >
                                <div className="text-center mb-8">
                                    <Zap className="h-12 w-12 text-primary mx-auto mb-4 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                                    <h1 className="text-4xl font-black italic tracking-tighter mb-2">JOIN THE LEAGUE</h1>
                                    <p className="text-muted-foreground">Start your journey with PlayOrbit</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button
                                            onClick={() => setFormData({ ...formData, role: "Player" })}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === "Player" ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"}`}
                                        >
                                            <Users className="h-6 w-6" />
                                            <span className="text-sm font-bold uppercase">Player</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, role: "Provider" })}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === "Provider" ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10"}`}
                                        >
                                            <MapPin className="h-6 w-6" />
                                            <span className="text-sm font-bold uppercase">Provider</span>
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Full Name</label>
                                        <Input
                                            placeholder="Enter your name"
                                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-14 mt-4 gradient-primary text-primary-foreground text-lg font-bold group"
                                        onClick={nextStep}
                                        disabled={!formData.name || !formData.email || !formData.role}
                                    >
                                        CONTINUE <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-strong p-10 rounded-3xl border border-white/10 shadow-2xl"
                            >
                                {formData.role === "Player" ? (
                                    <>
                                        <div className="text-center mb-8">
                                            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                                            <h1 className="text-4xl font-black italic tracking-tighter mb-2">PICK YOUR SPORTS</h1>
                                            <p className="text-muted-foreground">Select the sports you want to play</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {sportsOptions.map((sport) => {
                                                const isSelected = formData.sports?.includes(sport.id);
                                                return (
                                                    <button
                                                        key={sport.id}
                                                        onClick={() => handleSportToggle(sport.id)}
                                                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${isSelected
                                                            ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                                            }`}
                                                    >
                                                        <span className="text-4xl">{sport.icon}</span>
                                                        <span className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                                                            {sport.label}
                                                        </span>
                                                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-8">
                                            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                                            <h1 className="text-4xl font-black italic tracking-tighter mb-2">TURF DETAILS</h1>
                                            <p className="text-muted-foreground">Enter your facility information</p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Turf Name</label>
                                                <Input
                                                    placeholder="e.g. Neo Football Arena"
                                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                                    value={formData.turfName}
                                                    onChange={(e) => setFormData({ ...formData, turfName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Location</label>
                                                <Input
                                                    placeholder="e.g. Bandra West, Mumbai"
                                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                                    value={formData.turfLocation}
                                                    onChange={(e) => setFormData({ ...formData, turfLocation: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4">
                                    <Button variant="ghost" className="h-14 flex-1" onClick={prevStep}>BACK</Button>
                                    <Button
                                        className="h-14 flex-[2] gradient-primary text-primary-foreground text-lg font-bold"
                                        onClick={nextStep}
                                        disabled={formData.role === "Player" ? formData.sports?.length === 0 : !formData.turfName || !formData.turfLocation}
                                    >
                                        NEXT STEP
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-strong p-10 rounded-3xl border border-white/10 shadow-2xl"
                            >
                                {formData.role === "Player" ? (
                                    <>
                                        <div className="text-center mb-8">
                                            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                                            <h1 className="text-4xl font-black italic tracking-tighter mb-2">ALMOST THERE</h1>
                                            <p className="text-muted-foreground">Define your playstyle and experience</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Experience level</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {["beginner", "intermediate", "advanced"].map((lvl) => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setFormData({ ...formData, experience: lvl as any })}
                                                            className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-tighter transition-all ${formData.experience === lvl
                                                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                                                }`}
                                                        >
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Your Preferred Role</label>
                                                <Input
                                                    placeholder="e.g. Striker, Goalie, Midfielder"
                                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-8">
                                            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                                            <h1 className="text-4xl font-black italic tracking-tighter mb-2">FINAL SETUP</h1>
                                            <p className="text-muted-foreground">Deploy your sports facility</p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Turf Photo</label>
                                                <div className="flex flex-col gap-4">
                                                    <div className={`h-40 w-full rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group transition-all ${formData.turfImage ? 'border-primary/50' : 'hover:border-white/20'}`}>
                                                        {formData.turfImage ? (
                                                            <>
                                                                <img src={formData.turfImage} className="w-full h-full object-cover" alt="Preview" />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                    <p className="text-white text-xs font-bold">CHANGE PHOTO</p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center">
                                                                <Zap className="h-8 w-8 text-white/20 mx-auto mb-2" />
                                                                <p className="text-white/40 text-xs font-medium">UPLOAD TURF PHOTO</p>
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
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Price/Hr (₹)</label>
                                                    <Input
                                                        type="number"
                                                        className="h-14 bg-white/5 border-white/10 focus:border-primary/50"
                                                        value={formData.turfPrice}
                                                        onChange={(e) => setFormData({ ...formData, turfPrice: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Total Slots</label>
                                                    <Input
                                                        type="number"
                                                        className="h-14 bg-white/5 border-white/10 focus:border-primary/50"
                                                        value={formData.turfSlots}
                                                        onChange={(e) => setFormData({ ...formData, turfSlots: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold ml-1 uppercase tracking-widest text-primary/80">Sport Type</label>
                                                <select
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-foreground focus:outline-none focus:border-primary/50"
                                                    value={formData.turfSport}
                                                    onChange={(e) => setFormData({ ...formData, turfSport: e.target.value })}
                                                >
                                                    <option value="football">Football</option>
                                                    <option value="badminton">Badminton</option>
                                                    <option value="tennis">Tennis</option>
                                                    <option value="pickleball">Pickleball</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button className="flex-1 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity" onClick={prevStep}>
                                        GO BACK
                                    </button>
                                    <Button
                                        className="flex-[3] h-14 gradient-primary text-primary-foreground text-lg font-bold shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                                        onClick={handleFinish}
                                    >
                                        {formData.role === "Provider" ? "DEPLOY TURF" : "COMPLETE PROFILE"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Footer info */}
            <footer className="relative z-10 p-8 text-center">
                <div className="flex justify-center gap-12 text-muted-foreground/60">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 10k+ Players</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 250+ Venues</div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
