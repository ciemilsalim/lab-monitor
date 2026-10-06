import { useState, useEffect } from 'react';
import { ViewMode, Computer } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComputerGrid from './components/ComputerGrid';
import ComputerDetail from './components/ComputerDetail';
import ActivityMonitor from './components/ActivityMonitor';
import AlertsView from './components/AlertsView';
import NetworkMap from './components/NetworkMap';
import LoginPage from './components/LoginPage';
import { computers as mockComputers, activities as mockActivities, alerts as mockAlerts } from './data/mockData';
import { Menu, X, Bell, Wifi, WifiOff, RefreshCw } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Data - menggunakan mock data untuk demo
  const computers = mockComputers;
  const activities = mockActivities;
  const alerts = mockAlerts;

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('labmonitor_token');
    if (token) {
      setIsLoggedIn(true);
      if (token === 'demo_token') {
        setIsDemoMode(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem('labmonitor_token');
    if (token === 'demo_token') {
      setIsDemoMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('labmonitor_token');
    setIsLoggedIn(false);
    setIsDemoMode(false);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadAlerts = alerts.filter(a => a.type === 'danger').length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard computers={computers} activities={activities} alerts={alerts} />;
      case 'computers':
        return <ComputerGrid computers={computers} onSelectComputer={setSelectedComputer} />;
      case 'activity':
        return <ActivityMonitor activities={activities} />;
      case 'alerts':
        return <AlertsView alerts={alerts} />;
      case 'network':
        return <NetworkMap computers={computers} />;
      default:
        return <Dashboard computers={computers} activities={activities} alerts={alerts} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full z-50">
            <Sidebar currentView={currentView} onViewChange={(view) => { setCurrentView(view); setSidebarOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Lab Komputer - Monitoring System</h1>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                Jaringan LAN • 192.168.1.0/24
                {isDemoMode && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                    DEMO MODE
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                <Wifi className="w-4 h-4" />
                <span className="font-medium">Connected</span>
              </div>
            </div>

            {/* Alert Badge */}
            <button
              onClick={() => setCurrentView('alerts')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Admin Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Admin Lab</p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderView()}
        </main>
      </div>

      {/* Computer Detail Modal */}
      {selectedComputer && (
        <ComputerDetail
          computer={selectedComputer}
          activities={activities}
          onClose={() => setSelectedComputer(null)}
        />
      )}
    </div>
  );
}

export default App;
