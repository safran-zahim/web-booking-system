import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TimeSlotGrid } from '@/components/booking/TimeSlotGrid';
import { api } from '@/services/api';
import { CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

import type { Sport, Court } from '@/types';

export default function BookingWizard() {
    const navigate = useNavigate();
    const { toast } = useToast();

    // --- State ---
    const [step, setStep] = useState(1);
    const [sports, setSports] = useState<Sport[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);

    const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [timeSlot, setTimeSlot] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Sports on Mount
    useEffect(() => {
        api.getSports().then(setSports);
    }, []);

    // Load Courts when Sport Changes
    useEffect(() => {
        if (selectedSport) {
            api.getCourtsBySport(selectedSport.id).then(setCourts);
        }
    }, [selectedSport]);

    const handleBook = async () => {
        if (!selectedCourt || !date || !timeSlot || !selectedSport) return;

        setIsSubmitting(true);
        try {
            // Calculate End Time (Assuming 1 hour slots for simplicity)
            const [hour] = timeSlot.split(':').map(Number);
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

            await api.createBooking({
                courtId: selectedCourt.id,
                sportId: selectedSport.id,
                userId: 'u1', // Hardcoded user for now
                userName: 'Current User',
                date: format(date, 'yyyy-MM-dd'),
                startTime: timeSlot,
                endTime: endTime,
            });

            toast({
                title: "Booking Confirmed! 🎉",
                description: `You are booked for ${selectedSport.name} on ${format(date, 'MMM dd')} at ${timeSlot}.`,
            });

            navigate('/my-bookings');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Booking Failed",
                description: "That slot might have just been taken. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Book a Court</h1>
                <div className="flex items-center text-sm text-slate-500 gap-2">
                    <span className={step >= 1 ? "text-orange-600 font-bold" : ""}>1. Sport</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className={step >= 2 ? "text-orange-600 font-bold" : ""}>2. Date & Court</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className={step >= 3 ? "text-orange-600 font-bold" : ""}>3. Confirm</span>
                </div>
            </div>

            {/* --- Step 1: Select Sport --- */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sports.map((sport) => (
                        <Card
                            key={sport.id}
                            className="cursor-pointer hover:border-orange-500 transition-all hover:shadow-md"
                            onClick={() => { setSelectedSport(sport); setStep(2); }}
                        >
                            <CardHeader>
                                <img src={sport.image} alt={sport.name} className="w-full h-32 object-cover rounded-md mb-2" />
                                <CardTitle>{sport.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-500">
                                {sport.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- Step 2: Select Date, Court & Time --- */}
            {step === 2 && selectedSport && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Column: Calendar & Court List */}
                    <div className="md:col-span-5 space-y-6">
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm"
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="font-medium">Select Court:</h3>
                            {courts.map((court) => (
                                <div
                                    key={court.id}
                                    onClick={() => setSelectedCourt(court)}
                                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${selectedCourt?.id === court.id ? 'border-orange-500 bg-orange-50' : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div>
                                        <div className="font-semibold">{court.name}</div>
                                        <div className="text-xs text-slate-500">{court.type}</div>
                                    </div>
                                    <div className="font-bold text-slate-700">${court.pricePerHour}/hr</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Time Slots */}
                    <div className="md:col-span-7">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Available Slots</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!selectedCourt ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                        <p>Select a court on the left to see times.</p>
                                    </div>
                                ) : (
                                    <TimeSlotGrid
                                        selectedDate={date}
                                        selectedCourt={selectedCourt}
                                        onSlotSelect={(time) => setTimeSlot(time)}
                                    />
                                )}

                                <div className="mt-8 flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                    <Button
                                        disabled={!timeSlot || !selectedCourt || !date}
                                        onClick={() => setStep(3)}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        Review Booking
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* --- Step 3: Confirmation --- */}
            {step === 3 && selectedSport && selectedCourt && date && timeSlot && (
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <CardTitle>Confirm Booking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-md space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Sport</span>
                                    <span className="font-medium">{selectedSport.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-medium">{format(date, 'PPP')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Time</span>
                                    <span className="font-medium">{timeSlot} - {parseInt(timeSlot) + 1}:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Court</span>
                                    <span className="font-medium">{selectedCourt.name}</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span>${selectedCourt.pricePerHour}.00</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                                onClick={handleBook}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                Confirm & Pay
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>Cancel</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
