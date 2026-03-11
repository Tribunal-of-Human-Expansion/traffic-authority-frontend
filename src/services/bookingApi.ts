import type { Booking, BookingRequest, RouteSegment } from '../store/booking';
import type { BookingState } from '../store/booking';

// Mock segments database - Car journey routes within/across regions
const mockSegments: Record<string, RouteSegment> = {
    // UK Segments
    'SEG-UK-M1-001': {
        id: 'SEG-UK-M1-001',
        name: 'M1 Motorway - North Section',
        ownerRegion: 'UK-North',
        capacity: 200,
        available: 145,
    },
    'SEG-UK-M25-001': {
        id: 'SEG-UK-M25-001',
        name: 'M25 Orbital - East Section',
        ownerRegion: 'UK-South',
        capacity: 180,
        available: 92,
    },

    // France Segments
    'SEG-FR-A6-001': {
        id: 'SEG-FR-A6-001',
        name: 'Autoroute A6 - Île-de-France',
        ownerRegion: 'France-North',
        capacity: 220,
        available: 118,
    },
    'SEG-FR-A7-001': {
        id: 'SEG-FR-A7-001',
        name: 'Autoroute A7 - Rhône Valley',
        ownerRegion: 'France-South',
        capacity: 250,
        available: 167,
    },

    // Germany Segments
    'SEG-DE-A9-001': {
        id: 'SEG-DE-A9-001',
        name: 'Autobahn A9 - Bavaria',
        ownerRegion: 'Germany-South',
        capacity: 190,
        available: 78,
        restriction: 'Speed limit 100 km/h',
    },
    'SEG-DE-A3-001': {
        id: 'SEG-DE-A3-001',
        name: 'Autobahn A3 - Central',
        ownerRegion: 'Germany-Central',
        capacity: 210,
        available: 142,
    },

    // USA Segments
    'SEG-US-I95-001': {
        id: 'SEG-US-I95-001',
        name: 'Interstate 95 - Northeast Corridor',
        ownerRegion: 'USA-Northeast',
        capacity: 300,
        available: 156,
    },
    'SEG-US-I90-001': {
        id: 'SEG-US-I90-001',
        name: 'Interstate 90 - Cross-State',
        ownerRegion: 'USA-Northeast',
        capacity: 280,
        available: 203,
    },
};

// Mock route lookup - Realistic car journey routes
const routeMap: Record<string, string[]> = {
    // UK Routes
    'London-Manchester': ['SEG-UK-M25-001', 'SEG-UK-M1-001'],
    'Manchester-London': ['SEG-UK-M1-001', 'SEG-UK-M25-001'],

    // France Routes
    'Paris-Lyon': ['SEG-FR-A6-001', 'SEG-FR-A7-001'],
    'Lyon-Paris': ['SEG-FR-A7-001', 'SEG-FR-A6-001'],

    // Germany Routes
    'Munich-Berlin': ['SEG-DE-A9-001', 'SEG-DE-A3-001'],
    'Berlin-Munich': ['SEG-DE-A3-001', 'SEG-DE-A9-001'],

    // USA Routes
    'Boston-New-York': ['SEG-US-I95-001'],
    'New-York-Boston': ['SEG-US-I95-001'],
    'New-York-Washington': ['SEG-US-I95-001'],
};

export const bookingApiService = {
    /**
     * Request a new journey booking
     */
    async requestBooking(request: BookingRequest): Promise<Booking> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const route = `${request.origin}-${request.destination}`;
        const segmentIds = routeMap[route];

        if (!segmentIds) {
            throw new Error(`Route from ${request.origin} to ${request.destination} not found`);
        }

        // Get segments
        const segments = segmentIds.map((id) => mockSegments[id]);

        // Check if all segments have available capacity
        const canConfirm = segments.every((seg) => seg.available > 0 && !seg.closure);

        // Generate booking
        const booking: Booking = {
            id: `BOOK-${Date.now()}`,
            origin: request.origin,
            destination: request.destination,
            departureTime: request.departureTime,
            arrivalTime: new Date(
                new Date(request.departureTime).getTime() + 120 * 60000
            ).toISOString(),
            segments,
            state: canConfirm ? 'CONFIRMED' : 'REJECTED',
            createdAt: new Date().toISOString(),
            verificationToken: `TOKEN-${Math.random().toString(36).substring(7).toUpperCase()}`,
            mapVersion: 'v1.2.0',
        };

        // Simulate capacity update
        if (canConfirm) {
            segments.forEach((seg) => {
                if (mockSegments[seg.id]) {
                    mockSegments[seg.id].available -= 1;
                }
            });
        }

        return booking;
    },

    /**
     * Get booking status
     */
    async getBooking(bookingId: string): Promise<Booking> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        // In a real app, fetch from backend
        // For now, return a mock booking
        return {
            id: bookingId,
            origin: 'London',
            destination: 'Paris',
            departureTime: new Date().toISOString(),
            arrivalTime: new Date(Date.now() + 2 * 3600000).toISOString(),
            segments: [mockSegments['SEG-EU-WEST-001']],
            state: 'CONFIRMED',
            createdAt: new Date().toISOString(),
            verificationToken: 'TOKEN-ABC123XYZ',
            mapVersion: 'v1.2.0',
        };
    },

    /**
     * Cancel a booking
     */
    async cancelBooking(bookingId: string): Promise<Booking> {
        // Simulate network delay and compensation
        await new Promise((resolve) => setTimeout(resolve, 600));

        // In a real app, trigger saga compensation
        // For now, return cancelled booking
        return {
            id: bookingId,
            origin: 'London',
            destination: 'Paris',
            departureTime: new Date().toISOString(),
            arrivalTime: new Date(Date.now() + 2 * 3600000).toISOString(),
            segments: [],
            state: 'CANCELLED',
            createdAt: new Date().toISOString(),
            mapVersion: 'v1.2.0',
        };
    },

    /**
     * Get available segments for a route
     */
    async getSegments(origin: string, destination: string): Promise<RouteSegment[]> {
        await new Promise((resolve) => setTimeout(resolve, 150));

        const route = `${origin}-${destination}`;
        const segmentIds = routeMap[route] || [];

        return segmentIds.map((id) => mockSegments[id]);
    },

    /**
     * Get all segments (for capacity map)
     */
    async getAllSegments(): Promise<RouteSegment[]> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return Object.values(mockSegments);
    },

    /**
     * Verify a booking for enforcement
     */
    async verifyBooking(bookingId: string, token: string): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        // In real app, check against authoritative booking store
        return token.startsWith('TOKEN-');
    },
};
