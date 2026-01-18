import { Booking, Court, Sport } from '../types';
import { bookings, courts, sports } from '../data/mockData';

// Simulate network delay (500ms) to make it feel real
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    // --- Sports ---
    getSports: async (): Promise<Sport[]> => {
        await delay(300);
        return sports;
    },

    // --- Courts ---
    getCourts: async (): Promise<Court[]> => {
        await delay(300);
        return courts;
    },

    getCourtsBySport: async (sportId: string): Promise<Court[]> => {
        await delay(300);
        return courts.filter((court) => court.sportId === sportId);
    },

    // --- Bookings ---
    getBookings: async (): Promise<Booking[]> => {
        await delay(500);
        return bookings;
    },

    getBookingsByDate: async (date: string): Promise<Booking[]> => {
        await delay(400);
        return bookings.filter((b) => b.date === date);
    },

    createBooking: async (newBooking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
        await delay(800);

        // Simple conflict check (Logic: overlap detection)
        const isConflict = bookings.some(
            (b) =>
                b.courtId === newBooking.courtId &&
                b.date === newBooking.date &&
                // Check if times overlap
                ((newBooking.startTime >= b.startTime && newBooking.startTime < b.endTime) ||
                    (newBooking.endTime > b.startTime && newBooking.endTime <= b.endTime))
        );

        if (isConflict) {
            throw new Error('This slot is already booked!');
        }

        const booking: Booking = {
            ...newBooking,
            id: Math.random().toString(36).substr(2, 9),
            status: 'confirmed',
        };

        // In a real app, we would push to database. 
        // Here we push to local array so the UI updates.
        bookings.push(booking);

        return booking;
    },

    cancelBooking: async (bookingId: string): Promise<void> => {
        await delay(500);
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings[index].status = 'canceled';
        }
    }
};
