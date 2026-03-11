import { Button } from '../common/Button';
import { Broadcast } from './Broadcast';
import { StatsRow } from './StatsRow';
import { ActivePermits } from './ActivePermits';
import { AuditTrail } from './AuditTrail';
import { JourneyRequest } from './JourneyRequest';
import { BookingJourneyForm } from './BookingJourneyForm';
import { BookingStatus } from './BookingStatus';
import { AuthorityDashboard } from '../authority/AuthorityDashboard';
import type { PermitItem, AuditTrailEvent, UserPermitRequest } from '../../types/index';
import { mockStats } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { useBookingStore } from '../../store/booking';

interface CenterProps {
    permits: PermitItem[];
    auditTrail: AuditTrailEvent[];
    currentRequest: UserPermitRequest;
    onPermitClick?: (id: string) => void;
}

export function Center({
    permits,
    auditTrail,
    currentRequest,
    onPermitClick,
}: CenterProps) {
    const { isCivilian, isAdmin } = useAuth();
    const { currentBooking } = useBookingStore();

    return (
        <div className="bg-traffic-bg-2 overflow-y-auto h-full">
            {isCivilian ? (
                // CIVILIAN VIEW
                <div className="px-8 py-7">
                    <Broadcast />

                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <div className="font-barlow font-black text-2xl uppercase tracking-wider text-traffic-white">
                                Journey Booking
                            </div>
                            <div className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest mt-1.5">
                                // Request and manage journey bookings
                            </div>
                        </div>
                    </div>

                    {/* Booking Form and Status */}
                    <div className="space-y-6">
                        <BookingJourneyForm />
                        {currentBooking && (
                            <BookingStatus booking={currentBooking} />
                        )}
                    </div>
                </div>
            ) : (
                // ADMIN VIEW - Authority Dashboard
                <AuthorityDashboard />
            )}
        </div>
    );
}
