import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Booking, Court } from '@/types';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TimeSlotGridProps {
    selectedDate: Date | undefined;
    selectedCourt: Court;
    onSlotSelect: (startTime: string) => void;
}

export function TimeSlotGrid({ selectedDate, selectedCourt, onSlotSelect }: TimeSlotGridProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate slots from 8 AM to 9 PM (21:00)
    const timeSlots = Array.from({ length: 14 }, (_, i) => {
        const hour = i + 8;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    useEffect(() => {
        if (selectedDate) {
            setLoading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            api.getBookingsByDate(dateStr).then((data) => {
                setBookings(data);
                setLoading(false);
            });
        }
    }, [selectedDate, selectedCourt]);

    const handleSelect = (time: string) => {
        setSelectedTime(time);
        onSlotSelect(time);
    };

    if (!selectedDate) return <div className="text-muted-foreground">Please select a date first.</div>;
    if (loading) return <div className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Checking availability...</div>;

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {timeSlots.map((time) => {
                // Check if this specific time is already booked for this specific court
                const isBooked = bookings.some(
                    (b) => b.courtId === selectedCourt.id && b.startTime === time && b.status !== 'canceled'
                );

                return (
                    <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`w-full ${isBooked ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                        disabled={isBooked}
                        onClick={() => !isBooked && handleSelect(time)}
                    >
                        {time}
                    </Button>
                );
            })}
        </div>
    );
}
