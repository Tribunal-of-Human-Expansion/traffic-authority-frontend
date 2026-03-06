import { Button } from '../common/Button';
import { Broadcast } from './Broadcast';
import { StatsRow } from './StatsRow';
import { ActivePermits } from './ActivePermits';
import { AuditTrail } from './AuditTrail';
import { JourneyRequest } from './JourneyRequest';
import type { PermitItem, AuditTrailEvent, UserPermitRequest } from '../../types/index';
import { mockStats } from '../../utils/mockData';

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
    return (
        <div className="bg-traffic-bg-2 px-8 py-7 overflow-y-auto">
            <Broadcast />

            {/* Page Header */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <div className="font-barlow font-black text-2xl uppercase tracking-wider text-traffic-white">
                        Command Center
                    </div>
                    <div className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest mt-1.5">
            // Sector 7 · Movement Authorization Dashboard
                    </div>
                </div>
                <Button variant="primary">+ Request Passage</Button>
            </div>

            {/* Stats Row */}
            <StatsRow
                permitsGranted={mockStats.permitsGranted}
                permitsGrantedDelta={mockStats.permitsGrantedDelta}
                permitsDenied={mockStats.permitsDenied}
                permitsDeniedDelta={mockStats.permitsDeniedDelta}
                pendingConsensus={mockStats.pendingConsensus}
                pendingConsensusDelta={mockStats.pendingConsensusDelta}
                globalCongestion={mockStats.globalCongestion}
                globalCongestionDelta={mockStats.globalCongestionDelta}
            />

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <ActivePermits permits={permits} onPermitClick={onPermitClick} />
                <AuditTrail events={auditTrail} />
            </div>

            {/* Journey Request Form */}
            <JourneyRequest request={currentRequest} />
        </div>
    );
}
