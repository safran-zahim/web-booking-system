import type { Booking, Court, Sport } from '../types';

// Helper to get dynamic dates so the demo always looks fresh
const getTodayDate = () => new Date().toISOString().split('T')[0];
const getTomorrowDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};

export const sports: Sport[] = [
    {
        id: 's1',
        name: 'Badminton',
        image: 'https://images.unsplash.com/photo-1626224583764-847890e05395?q=80&w=200&auto=format&fit=crop',
        description: 'Indoor wooden courts with BWF standard mats.'
    },
    {
        id: 's2',
        name: 'Tennis',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=200&auto=format&fit=crop',
        description: 'Professional clay and hard courts.'
    },
    {
        id: 's3',
        name: 'Futsal',
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=200&auto=format&fit=crop',
        description: '5-a-side indoor football turf.'
    }
];

export const courts: Court[] = [
    { id: 'c1', name: 'Court A (Premium)', sportId: 's1', type: 'Indoor', pricePerHour: 15 },
    { id: 'c2', name: 'Court B (Standard)', sportId: 's1', type: 'Indoor', pricePerHour: 10 },
    { id: 'c3', name: 'Center Court', sportId: 's2', type: 'Clay', pricePerHour: 25 },
    { id: 'c4', name: 'Practice Court', sportId: 's2', type: 'Hard', pricePerHour: 18 },
    { id: 'c5', name: 'Arena 1', sportId: 's3', type: 'Turf', pricePerHour: 30 },
];

export const bookings: Booking[] = [
    {
        id: 'b1',
        courtId: 'c1',
        userId: 'u1',
        userName: 'John Doe',
        sportId: 's1',
        date: getTodayDate(),
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
    },
    {
        id: 'b2',
        courtId: 'c1',
        userId: 'u2',
        userName: 'Sarah Smith',
        sportId: 's1',
        date: getTodayDate(),
        startTime: '14:00',
        endTime: '16:00', // 2 hour booking
        status: 'confirmed',
    },
    {
        id: 'b3',
        courtId: 'c3',
        userId: 'u3',
        userName: 'Mike Ross',
        sportId: 's2',
        date: getTomorrowDate(),
        startTime: '09:00',
        endTime: '10:00',
        status: 'confirmed',
    },
];
