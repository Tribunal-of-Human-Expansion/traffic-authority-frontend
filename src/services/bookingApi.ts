import type { Booking, BookingRequest, RouteSegment } from '../store/booking';
import { httpClient } from './httpClient';

export const bookingApiService = {
  async requestBooking(request: BookingRequest): Promise<Booking> {
    // Assumes POST /bookings on the gateway creates a booking
    return httpClient.post<Booking>('/bookings', request);
  },

  async getBooking(bookingId: string): Promise<Booking> {
    return httpClient.get<Booking>(`/bookings/${encodeURIComponent(bookingId)}`);
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    // Assumes POST /bookings/:id/cancel performs a cancellation and returns updated booking
    return httpClient.post<Booking>(
      `/bookings/${encodeURIComponent(bookingId)}/cancel`,
      {},
    );
  },

  async getSegments(origin: string, destination: string): Promise<RouteSegment[]> {
    return httpClient.get<RouteSegment[]>(
      `/compatibility/segments?origin=${encodeURIComponent(
        origin,
      )}&destination=${encodeURIComponent(destination)}`,
    );
  },

  async getAllSegments(): Promise<RouteSegment[]> {
    return httpClient.get<RouteSegment[]>('/compatibility/segments');
  },

  async verifyBooking(bookingId: string, token: string): Promise<boolean> {
    // Assumes POST /audit/bookings/verify performs an enforcement check
    const result = await httpClient.post<{ valid: boolean }>(
      '/audit/bookings/verify',
      {
        bookingId,
        token,
      },
    );
    return result.valid;
  },
};

