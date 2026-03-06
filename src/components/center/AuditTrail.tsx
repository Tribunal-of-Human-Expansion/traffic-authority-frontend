import type { AuditTrailEvent } from '../../types/index';

interface AuditTrailProps {
    events: AuditTrailEvent[];
    permitRoute?: string;
}

export function AuditTrail({ events, permitRoute = 'PERMIT-9912 · LDN → AMS' }: AuditTrailProps) {
    return (
        <div className="bg-traffic-panel border border-traffic-border p-5">
            <div className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                <span>Consensus Audit Trail</span>
                <div className="flex-1 h-px bg-traffic-border" />
            </div>

            <div className="font-mono text-xs text-traffic-text-3 uppercase mb-4">{permitRoute}</div>

            <div className="space-y-3.5">
                {events.map((event, index) => (
                    <div key={event.id} className="flex gap-3.5 relative">
                        {/* Timeline line */}
                        {index < events.length - 1 && (
                            <div
                                className="absolute left-3 top-6 bottom-0 w-0.5 bg-traffic-border"
                            />
                        )}

                        {/* Dot */}
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
                            <div
                                className={`w-2 h-2 rounded-full ${event.status === 'completed'
                                        ? 'bg-traffic-green'
                                        : 'bg-traffic-amber-2 animate-amb-pulse'
                                    }`}
                                style={{
                                    boxShadow:
                                        event.status === 'completed'
                                            ? '0 0 6px rgb(0, 255, 136)'
                                            : '0 0 6px rgb(243, 156, 18)',
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className={`font-mono text-xs ${event.status === 'pending' ? 'text-traffic-amber-2' : 'text-traffic-text-2'
                                }`}>
                                {event.message}
                            </div>
                            <div className="font-mono text-xs text-traffic-text-3 mt-1">
                                {event.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
