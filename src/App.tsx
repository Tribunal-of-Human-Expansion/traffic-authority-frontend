import { useEffect } from 'react';
import { Topbar } from './components/layout/Topbar';
import { Ticker } from './components/layout/Ticker';
import { Sidebar } from './components/layout/Sidebar';
import { Center } from './components/center/Center';
import { RightPanel } from './components/layout/RightPanel';
import { Footer } from './components/layout/Footer';
import { usePermitStore } from './store/permits';
import { useSystemStore } from './store/system';
import { useMockData } from './hooks/useMockData';
import './App.css';

function App() {
  const { permits, auditTrail, currentRequest } = usePermitStore();
  const { healthCheckpoints, regionalCapacity, congestedCorridors, globalCongestion } =
    useSystemStore();

  // Load mock data on mount
  useMockData();

  return (
    <div className="bg-traffic-bg text-traffic-text min-h-screen w-screen cursor-crosshair overflow-hidden">
      {/* Scanlines effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.03) 2px, rgba(0, 255, 136, 0.03) 4px)',
          animation: 'scanMove 8s linear infinite',
        }}
      />

      {/* Topbar */}
      <Topbar />

      {/* Ticker */}
      <Ticker />

      {/* Main Grid Layout - 3 columns × 2 rows */}
      <div className="grid grid-cols-[260px_1fr_280px] grid-rows-[1fr_auto] gap-0" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Sidebar - row 1, col 1 */}
        <div className="overflow-hidden row-start-1 col-start-1">
          <Sidebar healthCheckpoints={healthCheckpoints} />
        </div>

        {/* Center Content - row 1, col 2 */}
        <div className="overflow-hidden row-start-1 col-start-2">
          <Center
            permits={permits}
            auditTrail={auditTrail}
            currentRequest={currentRequest}
          />
        </div>

        {/* Right Panel - row 1, col 3 */}
        <div className="overflow-hidden row-start-1 col-start-3">
          <RightPanel
            regionalCapacity={regionalCapacity}
            congestedCorridors={congestedCorridors}
            globalCongestion={globalCongestion}
          />
        </div>

        {/* Footer - row 2, spans all columns */}
        <div className="row-start-2 col-start-1 col-end-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
