import type { PermitItem } from '../../types/index';
import { PermitCard } from '../common/PermitCard';
import { Button } from '../common/Button';

interface ActivePermitsProps {
    permits: PermitItem[];
    onPermitClick?: (id: string) => void;
}

export function ActivePermits({ permits, onPermitClick }: ActivePermitsProps) {
    return (
        <div className="bg-traffic-panel border border-traffic-border p-5">
            <div className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                <span>Active Permits</span>
                <div className="flex-1 h-px bg-traffic-border" />
            </div>

            <div className="space-y-2">
                {permits.map((permit) => (
                    <PermitCard
                        key={permit.id}
                        permit={permit}
                        onClick={() => onPermitClick?.(permit.id)}
                    />
                ))}
            </div>

            <div className="flex gap-2 mt-3.5">
                <Button variant="ghost" size="sm">
                    View All Permits
                </Button>
                <Button variant="danger" size="sm">
                    Cancel Selected
                </Button>
            </div>
        </div>
    );
}
