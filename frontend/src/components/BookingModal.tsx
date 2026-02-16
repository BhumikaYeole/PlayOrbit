import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Turf, sportIcons } from "@/data/mockData";
import { Clock, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

interface BookingModalProps {
    turf: Turf;
    isOpen: boolean;
    onClose: () => void;
}

const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
    "08:00 PM", "09:00 PM", "10:00 PM"
];

const BookingModal = ({ turf, isOpen, onClose }: BookingModalProps) => {
    const { user } = useUser();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [step, setStep] = useState(1);
    const [wantsMatchmaking, setWantsMatchmaking] = useState(true);

    const handleBook = () => {
        if (!selectedSlot || !date) return;
        setIsBooking(true);

        // Simulate booking and creation of a matchmaking request
        setTimeout(() => {
            setIsBooking(false);
            setStep(3);
            toast.success(wantsMatchmaking
                ? "Booking confirmed! Your match is live for players to join."
                : "Booking confirmed! Venue reserved.");
        }, 2000);
    };

    const resetAndClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            setSelectedSlot(null);
            setDate(new Date());
            setWantsMatchmaking(true);
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-[500px] glass-strong border-border p-0 overflow-hidden">
                {step === 1 && (
                    <>
                        <DialogHeader className="p-6 pb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{sportIcons[turf.sport]}</span>
                                <div>
                                    <DialogTitle className="text-xl font-bold">{turf.name}</DialogTitle>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {turf.location}
                                    </div>
                                </div>
                            </div>
                            <DialogDescription>
                                Select a date and time slot to book your session.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Date</label>
                                    <div className="rounded-md border border-border bg-background/50 p-2">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md"
                                            disabled={(date) => date < new Date() || date > new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Available Slots</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-3 text-xs rounded-md border transition-all ${selectedSlot === slot
                                                        ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                                                        : "bg-background/40 border-border hover:border-primary/50 text-foreground"
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Open Matchmaking</p>
                                    <p className="text-[10px] text-muted-foreground">Let others join your game (You will be Admin)</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={wantsMatchmaking}
                                    onChange={(e) => setWantsMatchmaking(e.target.checked)}
                                    className="w-5 h-5 accent-primary cursor-pointer rounded border-white/20 bg-white/5"
                                />
                            </div>
                        </div>

                        <DialogFooter className="p-6 pt-0">
                            <Button
                                className="w-full gradient-primary text-primary-foreground h-11"
                                disabled={!date || !selectedSlot}
                                onClick={() => setStep(2)}
                            >
                                Continue to Booking
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 2 && (
                    <div className="p-6 space-y-6">
                        <DialogHeader className="p-0">
                            <DialogTitle className="text-xl font-bold">Booking Summary</DialogTitle>
                            <DialogDescription>
                                Review your booking details before confirming.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 rounded-xl border border-border bg-background/40 p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-foreground">{turf.name}</h4>
                                    <p className="text-sm text-muted-foreground">{turf.location}</p>
                                </div>
                                <span className="text-2xl">{sportIcons[turf.sport]}</span>
                            </div>

                            <div className="h-px bg-border w-full" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                                    <p className="text-sm font-medium">{date ? format(date, "PPP") : "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                                    <p className="text-sm font-medium">{selectedSlot}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Sport</p>
                                    <p className="text-sm font-medium capitalize">{turf.sport}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Price</p>
                                    <p className="text-sm font-medium">₹{turf.pricePerHour}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Access Level</p>
                                    <p className="text-sm font-bold text-primary">{wantsMatchmaking ? "Team Admin (Public Match)" : "Private Booking"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full gradient-primary text-primary-foreground h-11"
                                disabled={isBooking}
                                onClick={handleBook}
                            >
                                {isBooking ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    `Confirm Booking (₹${turf.pricePerHour})`
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep(1)}
                                disabled={isBooking}
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-12 text-center space-y-6">
                        <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative overflow-hidden">
                            <motion.div
                                initial={{ y: 50 }}
                                animate={{ y: 0 }}
                                className="absolute inset-x-0 bottom-0 bg-primary/20 h-[40%]"
                            />
                            <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in duration-500 relative z-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-foreground">TRANSACTION COMPLETE</h2>
                            <p className="text-muted-foreground text-sm pt-2">
                                Your slot at <span className="text-foreground font-bold">{turf.name}</span> is confirmed for {date ? format(date, "MMM do") : ""} at {selectedSlot}.
                            </p>
                            {wantsMatchmaking && (
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl mt-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Squad Management Active</p>
                                    <p className="text-xs italic text-muted-foreground">"As Admin, you now have the authority to approve or deny skill requests from other players."</p>
                                </div>
                            )}
                        </div>
                        <Button
                            className="w-full h-12 flex items-center justify-center gap-2 font-bold"
                            onClick={resetAndClose}
                        >
                            {wantsMatchmaking ? "GO TO SQUAD DASHBOARD" : "VIEW MY BOOKINGS"}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
