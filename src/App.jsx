import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getMetrics, getAlgorithms } from './utils/content';
import Sidebar from './components/Sidebar';
import CreditsModal from './components/CreditsModal';
import ScrollToTop from './components/ScrollToTop';
import AlgorithmDetail from './pages/AlgorithmDetail';
import MetricDetail from './pages/MetricDetail';
import LandingPage from './pages/LandingPage';

const metrics = getMetrics();
const algorithms = getAlgorithms();

function App() {
  const [showCredits, setShowCredits] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-bg text-text-main selection:bg-accent-yellow selection:text-black overflow-x-hidden">
        <div className="flex relative">
          <Sidebar
            metrics={metrics}
            algorithms={algorithms}
            onShowCredits={() => setShowCredits(true)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={setIsSidebarCollapsed}
          />
          <main className={`flex-1 min-h-screen w-full overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
            <Routes>
              <Route path="/" element={<LandingPage metrics={metrics} />} />
              <Route path="/metric/:id" element={<MetricDetail metrics={metrics} />} />
              <Route path="/algorithm/:id" element={<AlgorithmDetail algorithms={algorithms} metrics={metrics} />} />
            </Routes>
          </main>
        </div>

        <CreditsModal
          isOpen={showCredits}
          onClose={() => setShowCredits(false)}
        />
      </div>
    </Router>
  );
}

export default App;
