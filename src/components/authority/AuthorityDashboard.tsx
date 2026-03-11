import { RoadClosureManager } from './RoadClosureManager';
import { CapacityOverridePanel } from './CapacityOverridePanel';
import { BookingVerificationTool } from './BookingVerificationTool';
import { useAuthorityStore } from '../../store/authority';

export function AuthorityDashboard() {
    const { closures, overrides, restrictions } = useAuthorityStore();

    const totalImpact = closures.length + overrides.length + restrictions.length;

    return (
        <div className="bg-traffic-bg-2 px-8 py-7">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-barlow font-black text-3xl uppercase tracking-wider text-traffic-white mb-2">
                    Traffic Authority Control Panel
                </h1>
                <p className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest">
          // Regional Road Network Management & Enforcement Verification
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-traffic-panel border border-traffic-border p-4">
                    <p className="font-mono text-xs text-traffic-text-3 uppercase mb-2">
                        Active Closures
                    </p>
                    <p className="font-barlow font-black text-3xl text-traffic-red">
                        {closures.length}
                    </p>
                </div>

                <div className="bg-traffic-panel border border-traffic-border p-4">
                    <p className="font-mono text-xs text-traffic-text-3 uppercase mb-2">
                        Capacity Overrides
                    </p>
                    <p className="font-barlow font-black text-3xl text-traffic-amber">
                        {overrides.length}
                    </p>
                </div>

                <div className="bg-traffic-panel border border-traffic-border p-4">
                    <p className="font-mono text-xs text-traffic-text-3 uppercase mb-2">
                        Active Restrictions
                    </p>
                    <p className="font-barlow font-black text-3xl text-traffic-accent">
                        {restrictions.length}
                    </p>
                </div>

                <div className="bg-traffic-panel border border-traffic-border p-4">
                    <p className="font-mono text-xs text-traffic-text-3 uppercase mb-2">
                        Total Active
                    </p>
                    <p className="font-barlow font-black text-3xl text-traffic-green">
                        {totalImpact}
                    </p>
                </div>
            </div>

            {/* Main Controls - Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-8 max-h-[calc(100vh-400px)] overflow-y-auto">
                {/* Left Column */}
                <div className="space-y-6">
                    <RoadClosureManager />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <CapacityOverridePanel />
                </div>
            </div>

            {/* Full-Width Verification Tool */}
            <div className="mb-8">
                <BookingVerificationTool />
            </div>

            {/* Authority Information Footer */}
            <div className="border-t border-traffic-border pt-6 mt-8">
                <p className="font-mono text-xs text-traffic-text-2 mb-3 uppercase tracking-widest">
                    Authority Information
                </p>
                <div className="grid grid-cols-3 gap-4 font-mono text-xs text-traffic-text-3">
                    <div>
                        <p className="text-traffic-text-2 mb-2">Current Region:</p>
                        <p>UK-North, UK-South</p>
                    </div>
                    <div>
                        <p className="text-traffic-text-2 mb-2">Managed Segments:</p>
                        <p>5 highway segments</p>
                    </div>
                    <div>
                        <p className="text-traffic-text-2 mb-2">Last Update:</p>
                        <p>{new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
