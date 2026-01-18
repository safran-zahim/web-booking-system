export type Role = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Sport {
    id: string;
    name: string;
    image: string; // URL to an icon or image
    description?: string;
}

export interface Court {
    id: string;
    name: string;
    sportId: string;
    type: string; // e.g., "Indoor", "Outdoor", "Grass", "Clay"
    pricePerHour: number;
}

export interface Booking {
    id: string;
    courtId: string;
    userId: string; // In a real app, this links to the user
    userName: string; // Storing name here for easy UI display in mock mode
    sportId: string;
    date: string; // ISO Date String (YYYY-MM-DD)
    startTime: string; // "09:00"
    endTime: string; // "10:00"
    status: 'confirmed' | 'canceled' | 'pending';
}
