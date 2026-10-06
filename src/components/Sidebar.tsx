import { Monitor, LayoutDashboard, Globe, AlertTriangle, Network, Activity } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'computers' as ViewMode, label: 'Komputer', icon: Monitor },
    { id: 'activity' as ViewMode, label: 'Aktivitas', icon: Globe },
    { id: 'alerts' as ViewMode, label: 'Peringatan', icon: AlertTriangle },
    { id: 'network' as ViewMode, label: 'Jaringan', icon: Network },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col min-h-screen shadow-2xl">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">LabMonitor</h1>
            <p className="text-xs text-gray-400">Monitoring System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <Activity className="w-4 h-4 text-green-400" />
              <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-semibold text-green-400">Server Aktif</span>
          </div>
          <p className="text-xs text-gray-400">30 komputer terdaftar</p>
        </div>
      </div>
    </aside>
  );
}
