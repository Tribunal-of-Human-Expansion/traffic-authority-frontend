import { useAuthStore } from '../store/auth';
import type { Booking, BookingRequest, RouteSegment } from '../store/booking';

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE ||
    '/api';

interface BackendBookingResponse {
    booking_id: string;
    user_id: string;
    state: Booking['state'];
    map_version: string;
    coordinator_region?: string;
    created_at: string;
}

interface BackendVerificationProof {
    booking_id: string;
    proof_token: string;
    map_version: string;
    time_window_start: string;
    time_window_end: string;
    segment_scope: string[];
}

interface BackendError {
    error?: string;
    message?: string;
}

async function parseJson<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
            const errorBody = (await response.json()) as BackendError;
            errorMessage = errorBody.error || errorBody.message || errorMessage;
        } catch {
            // Ignore JSON parse failures and fall back to generic HTTP message.
        }

        throw new Error(errorMessage);
    }

    return (await response.json()) as T;
}

function resolveUserId(): string {
    return useAuthStore.getState().username || 'civilian-demo';
}

function makeIdempotencyKey(request: BookingRequest): string {
    const userId = resolveUserId();
    return [
        userId,
        request.origin,
        request.destination,
        request.departureTime,
        request.timeWindow,
    ].join(':');
}

function toBackendRequest(request: BookingRequest) {
    const departure = new Date(request.departureTime);
    const end = new Date(departure.getTime() + request.timeWindow * 60_000);

    return {
        user_id: resolveUserId(),
        origin: request.origin,
        destination: request.destination,
        time_window_start: departure.toISOString(),
        time_window_end: end.toISOString(),
        idempotency_key: makeIdempotencyKey(request),
    };
}

function toFrontendBooking(
    response: BackendBookingResponse,
    requestContext?: BookingRequest,
    verificationToken?: string
): Booking {
    const departureTime = requestContext?.departureTime || response.created_at;
    const arrivalTime = new Date(
        new Date(departureTime).getTime() + (requestContext?.timeWindow || 60) * 60_000
    ).toISOString();

    return {
        id: response.booking_id,
        origin: requestContext?.origin || 'Unavailable',
        destination: requestContext?.destination || 'Unavailable',
        departureTime,
        arrivalTime,
        segments: [],
        state: response.state,
        createdAt: response.created_at,
        verificationToken,
        mapVersion: response.map_version,
    };
}

async function fetchVerificationToken(bookingId: string): Promise<string | undefined> {
    const response = await fetch(
        `${API_BASE}/bookings/${encodeURIComponent(bookingId)}/verify`
    );
    const proof = await parseJson<BackendVerificationProof>(response);
    return proof.proof_token;
}

export const bookingApiService = {
    async requestBooking(request: BookingRequest): Promise<Booking> {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(toBackendRequest(request)),
        });

        const booking = await parseJson<BackendBookingResponse>(response);
        const verificationToken =
            booking.state === 'CONFIRMED'
                ? await fetchVerificationToken(booking.booking_id)
                : undefined;

        return toFrontendBooking(booking, request, verificationToken);
    },

    async getBooking(bookingId: string): Promise<Booking> {
        const response = await fetch(
            `${API_BASE}/bookings/${encodeURIComponent(bookingId)}`
        );
        const booking = await parseJson<BackendBookingResponse>(response);
        const verificationToken =
            booking.state === 'CONFIRMED'
                ? await fetchVerificationToken(booking.booking_id)
                : undefined;

        return toFrontendBooking(booking, undefined, verificationToken);
    },

    async cancelBooking(bookingId: string): Promise<Booking> {
        const response = await fetch(
            `${API_BASE}/bookings/${encodeURIComponent(bookingId)}/cancel`,
            {
                method: 'POST',
            }
        );
        const booking = await parseJson<BackendBookingResponse>(response);
        return toFrontendBooking(booking);
    },

    async getSegments(_origin: string, _destination: string): Promise<RouteSegment[]> {
        return [];
    },

    async getAllSegments(): Promise<RouteSegment[]> {
        return [];
    },

    async verifyBooking(bookingId: string, token: string): Promise<boolean> {
        const response = await fetch(
            `${API_BASE}/bookings/${encodeURIComponent(bookingId)}/verify`
        );
        const proof = await parseJson<BackendVerificationProof>(response);
        return proof.proof_token === token;
    },
};
