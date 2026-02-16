import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Users, ChevronLeft, ChevronRight, Target, ShieldCheck } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function TurfBookingSlots() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allTurfs, bookSlot, pendingRequests } = useUser();
    const turf = allTurfs.find(t => t.id === id);

    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dateAvailability = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const currentDay = today.getDate();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        const availability: { [key: number]: { hasSlots: boolean; slotsLeft: number } } = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const isPast = isCurrentMonth && day < currentDay;

            if (isPast) {
                availability[day] = { hasSlots: false, slotsLeft: 0 };
            } else {
                const confirmedForTurf = pendingRequests.filter(r =>
                    r.turfId === id &&
                    r.status === 'approved' &&
                    r.date?.includes(`${day} ${monthNames[currentMonth.getMonth()]}`)
                ).length;

                const baseSlots = (day % 3 === 0) ? 0 : 8;
                const remaining = Math.max(0, baseSlots - confirmedForTurf);

                availability[day] = {
                    hasSlots: remaining > 0,
                    slotsLeft: remaining
                };
            }
        }
        return availability;
    }, [currentMonth, id, pendingRequests]);

    // Generate calendar dates
    const generateCalendarDates = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const dates: (number | null)[] = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            dates.push(null);
        }

        // Add actual dates
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(i);
        }

        return dates;
    };

    // Generate time slots based on selected date availability
    const generateTimeSlots = () => {
        if (!selectedDate || !dateAvailability[selectedDate]?.hasSlots) {
            return [];
        }

        const basePrice = turf?.pricePerHour || 1500;

        const allSlots = [
            { time: '06:00 - 07:00', price: basePrice - 300 },
            { time: '07:00 - 08:00', price: basePrice - 300 },
            { time: '08:00 - 09:00', price: basePrice - 200 },
            { time: '09:00 - 10:00', price: basePrice - 200 },
            { time: '14:00 - 15:00', price: basePrice },
            { time: '15:00 - 16:00', price: basePrice },
            { time: '16:00 - 17:00', price: basePrice },
            { time: '17:00 - 18:00', price: basePrice + 200 },
            { time: '18:00 - 19:00', price: basePrice + 300 },
            { time: '19:00 - 20:00', price: basePrice + 300 },
            { time: '20:00 - 21:00', price: basePrice + 400 },
            { time: '21:00 - 22:00', price: basePrice + 400 },
        ];

        // Check global state for booked slots
        return allSlots.map((slot) => {
            const dateStr = `${selectedDate} ${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
            const isBookedPrivately = turf?.slots?.some(s => s.time === slot.time && !s.available);
            return {
                ...slot,
                available: !isBookedPrivately
            };
        });
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const timeSlots = generateTimeSlots();

    const handleBooking = () => {
        if (selectedSlot === null || !turf || !selectedDate) return;

        const slot = timeSlots[selectedSlot];
        const dateStr = `${selectedDate} ${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

        bookSlot(turf.id, slot.time, dateStr);
        toast.success("Engagement request dispatched!");
        navigate("/");
    };

    const amenities = [
        'First-Aid',
        'Changing Room',
        'Kit Provided',
        'Artificial Grass',
        'Free Parking',
        '6v6'
    ];

    const dates = generateCalendarDates();

    const navigateMonth = (direction) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
        setSelectedDate(null);
        setSelectedSlot(null);
    };

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();
    const currentDay = today.getDate();

    // Calculate total available days in current month
    const availableDaysCount = Object.values(dateAvailability).filter(d => d.hasSlots).length;

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                                    Top 10
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {turf?.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-400" />
                                    <span>{turf?.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-semibold">{turf?.rating}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-blue-400" />
                                    <span>{turf?.availableSlots} slots available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Availability Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Total Slots</div>
                            <div className="text-2xl font-bold text-blue-400">{turf?.totalSlots}</div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Available Days</div>
                            <div className="text-2xl font-bold text-emerald-400">{availableDaysCount}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Price Range</div>
                            <div className="text-2xl font-bold text-purple-400">₹{turf?.pricePerHour}/hr</div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        {amenities.map((amenity, idx) => (
                            <span
                                key={idx}
                                className="px-5 py-2.5 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-default text-gray-300"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Calendar Section */}
                    <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                    <Calendar className="text-primary" size={24} />
                                </div>
                                <h2 className="text-2xl font-black italic tracking-tighter">SELECT DATE</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-lg font-semibold px-4">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                            {dates.map((date, idx) => {
                                if (date === null) {
                                    return <div key={`empty-${idx}`} className="aspect-square" />;
                                }

                                const isSelected = date === selectedDate;
                                const isPast = isCurrentMonth && date < currentDay;
                                const availability = dateAvailability[date];
                                const hasSlots = availability?.hasSlots;
                                const slotsLeft = availability?.slotsLeft || 0;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => date && !isPast && hasSlots && setSelectedDate(date)}
                                        disabled={!date || isPast || !hasSlots}
                                        className={`
                                            aspect-square rounded-2xl font-bold text-base transition-all duration-300 relative flex flex-col items-center justify-center
                                            ${isPast
                                                ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-50'
                                                : !hasSlots
                                                    ? 'bg-red-500/10 text-white/30 cursor-not-allowed border border-red-500/10'
                                                    : isSelected
                                                        ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)] scale-110 z-10'
                                                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 text-white'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10">{date}</span>
                                        {!isPast && hasSlots && (
                                            <div className={`mt-1 text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-primary-foreground/80' : 'text-primary'}`}>
                                                {slotsLeft} slots
                                            </div>
                                        )}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="selectedDate"
                                                className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Calendar Legend */}
                        <div className="flex items-center justify-center gap-4 text-xs mt-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                                <span className="text-gray-400">Selected</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-gray-800/50 border border-gray-700/50"></div>
                                <span className="text-gray-400">Available</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-gray-800/30"></div>
                                <span className="text-gray-400">Unavailable</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Slots Section */}
                    <div className="glass-strong p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                                <Clock className="text-primary" size={24} />
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tighter">SELECT TIME</h2>
                        </div>

                        {!selectedDate ? (
                            <div className="flex flex-col items-center justify-center h-[350px] relative z-10">
                                <div className="p-8 bg-white/5 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center gap-6 group/placeholder hover:bg-white/10 transition-all duration-500">
                                    <div className="relative">
                                        <Calendar size={64} className="text-white/20 group-hover/placeholder:text-primary/40 transition-colors duration-500" />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Awaiting Intelligence</p>
                                        <p className="text-white/60 text-sm font-medium">Initialize deployment by selecting a date</p>
                                    </div>
                                </div>
                            </div>
                        ) : timeSlots.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                <div className="text-center">
                                    <Clock size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>No slots available for this date</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {timeSlots.map((slot, idx) => {
                                        const isSelected = selectedSlot === idx;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => slot.available && setSelectedSlot(idx)}
                                                disabled={!slot.available}
                                                className={`
                                                    relative p-5 rounded-[1.5rem] font-bold transition-all duration-300 border
                                                    ${!slot.available
                                                        ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed opacity-40'
                                                        : isSelected
                                                            ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] scale-[1.02]'
                                                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary/40 text-white'
                                                    }
                                                `}
                                            >
                                                <div className="text-sm tracking-tight mb-1">{slot.time}</div>
                                                <div className={`text-xl font-black italic ${isSelected ? 'text-primary-foreground/90' : 'text-primary'}`}>₹{slot.price}</div>

                                                {!slot.available && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[7px] text-red-400 font-black uppercase tracking-widest">
                                                            SOLD OUT
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Booking Summary */}
                                {selectedSlot !== null && (
                                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/30 mb-6">
                                        <h3 className="text-lg font-bold mb-3">Booking Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Turf:</span>
                                                <span className="font-semibold">{turf?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Date:</span>
                                                <span className="font-semibold">
                                                    {selectedDate} {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Time:</span>
                                                <span className="font-semibold">{timeSlots[selectedSlot].time}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-gray-700/50">
                                                <span className="text-gray-400">Total Price:</span>
                                                <span className="text-2xl font-bold text-emerald-400">
                                                    ₹{timeSlots[selectedSlot].price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Book Button */}
                                <button
                                    disabled={selectedSlot === null}
                                    onClick={handleBooking}
                                    className={`
                                        w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 uppercase tracking-widest
                                        ${selectedSlot !== null
                                            ? 'gradient-primary text-primary-foreground shadow-2xl hover:scale-[1.02] active:scale-95'
                                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                        }
                                    `}
                                >
                                    {selectedSlot !== null ? 'Confirm Engagement' : 'Select Deployment Time'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
