import { useState } from 'react';
import { useBookingStore } from '../../store/booking';
import { bookingApiService } from '../../services/bookingApi';
import { Button } from '../common/Button';

export function BookingJourneyForm() {
    const { setCurrentBooking, setLoading, setError } = useBookingStore();
    const [origin, setOrigin] = useState('London');
    const [destination, setDestination] = useState('Manchester');
    const [departureTime, setDepartureTime] = useState(
        new Date(Date.now() + 24 * 3600000).toISOString().split('T')[0]
    );
    const [departureHour, setDepartureHour] = useState('09');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const routes = [
        // UK Routes
        { origin: 'London', destination: 'Manchester' },
        { origin: 'Manchester', destination: 'London' },

        // France Routes
        { origin: 'Paris', destination: 'Lyon' },
        { origin: 'Lyon', destination: 'Paris' },

        // Germany Routes
        { origin: 'Munich', destination: 'Berlin' },
        { origin: 'Berlin', destination: 'Munich' },

        // USA Routes
        { origin: 'Boston', destination: 'New-York' },
        { origin: 'New-York', destination: 'Boston' },
        { origin: 'New-York', destination: 'Washington' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            setLoading(true);

            const fullDepartureTime = new Date(
                `${departureTime}T${departureHour}:00:00`
            ).toISOString();

            const booking = await bookingApiService.requestBooking({
                origin,
                destination,
                departureTime: fullDepartureTime,
                timeWindow: 60,
            });

            setCurrentBooking(booking);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Booking failed');
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-traffic-panel border border-traffic-border p-6">
            <div className="mb-6">
                <h2 className="font-barlow font-bold text-lg uppercase tracking-wider text-traffic-white mb-2">
                    Request Journey Booking
                </h2>
                <p className="font-mono text-xs text-traffic-text-2">
          // Select route and departure time
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Route Selection */}
                <div>
                    <label className="block font-mono text-xs text-traffic-text-3 uppercase mb-2">
                        Route
                    </label>
                    <select
                        value={`${origin}-${destination}`}
                        onChange={(e) => {
                            const parts = e.target.value.split('-');
                            const o = parts[0] || '';
                            const d = parts[1] || '';
                            setOrigin(o);
                            setDestination(d);
                        }}
                        className="w-full bg-traffic-bg border border-traffic-accent text-traffic-text px-3 py-2 font-mono text-sm"
                    >
                        {routes.map((route) => (
                            <option
                                key={`${route.origin}-${route.destination}`}
                                value={`${route.origin}-${route.destination}`}
                            >
                                {route.origin} → {route.destination}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-mono text-xs text-traffic-text-3 uppercase mb-2">
                            Departure Date
                        </label>
                        <input
                            type="date"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            className="w-full bg-traffic-bg border border-traffic-accent text-traffic-text px-3 py-2 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs text-traffic-text-3 uppercase mb-2">
                            Departure Time
                        </label>
                        <select
                            value={departureHour}
                            onChange={(e) => setDepartureHour(e.target.value)}
                            className="w-full bg-traffic-bg border border-traffic-accent text-traffic-text px-3 py-2 font-mono text-sm"
                        >
                            {Array.from({ length: 24 }).map((_, i) => {
                                const hour = String(i).padStart(2, '0');
                                return (
                                    <option key={hour} value={hour}>
                                        {hour}:00
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    variant="primary"
                >
                    {isSubmitting ? 'Requesting Booking...' : 'Request Booking'}
                </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 pt-6 border-t border-traffic-border text-xs text-traffic-text-2 font-mono space-y-1">
                <p>Booking latency: &lt; 800ms (single-region)</p>
                <p>Idempotency: Safe to retry</p>
                <p>Cancellation: Available until departure</p>
            </div>
        </div>
    );
}
