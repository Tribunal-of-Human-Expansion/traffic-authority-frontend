export function Topbar() {
    return (
        <div className="flex items-center justify-between px-8 h-16 bg-traffic-panel border-b border-traffic-border relative overflow-hidden">
            {/* Animated top border */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-traffic-red to-transparent"
                style={{
                    animation: 'scanH 4s ease-in-out infinite',
                }}
            />

            {/* Logo Section */}
            <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 border-2 border-traffic-red flex items-center justify-center font-mono text-sm text-traffic-red relative animate-crest-pulse">
                    TA
                </div>
                <div>
                    <div className="font-barlow font-black text-base uppercase tracking-widest text-traffic-white">
                        The Traffic Authority
                    </div>
                    <div className="font-mono text-xs text-traffic-text-3 uppercase tracking-widest">
                        Movement Control Division — Sector 7
                    </div>
                </div>
            </div>

            {/* Center Status */}
            <div className="font-mono text-xs text-traffic-amber uppercase tracking-wide animate-blink">
                ● PEAK-HOUR RESTRICTIONS ACTIVE — EU-WEST / NA-EAST ●
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-traffic-text-2 uppercase tracking-wide">
                    CIT-0049271-B
                </div>
                <div className="px-2.5 py-0.5 border border-traffic-blue font-mono text-xs text-traffic-blue uppercase tracking-widest">
                    Civilian
                </div>
            </div>
        </div>
    );
}
