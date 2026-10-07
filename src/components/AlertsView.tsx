import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Info, Filter } from 'lucide-react';
import { Alert } from '../types';

interface AlertsViewProps {
  alerts: Alert[];
}

export default function AlertsView({ alerts }: AlertsViewProps) {
  const [filter, setFilter] = useState<'all' | 'danger' | 'warning' | 'info'>('all');
  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'info': return <Info className="w-6 h-6 text-blue-600" />;
      default: return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const getAlertGradient = (type: string) => {
    switch (type) {
      case 'danger': return 'from-red-50 to-rose-50 border-red-300';
      case 'warning': return 'from-yellow-50 to-amber-50 border-yellow-300';
      case 'info': return 'from-blue-50 to-cyan-50 border-blue-300';
      default: return 'from-gray-50 to-slate-50 border-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Peringatan & Notifikasi</h2>
        <p className="text-gray-600 text-sm mt-1">Monitor semua peringatan aktivitas siswa</p>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
        <Filter className="w-5 h-5 text-gray-500 ml-2" />
        {(['all', 'danger', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === f ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'danger' ? 'Kritis' : f === 'warning' ? 'Peringatan' : 'Info'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border-2 p-5 bg-gradient-to-r ${getAlertGradient(alert.type)} transition-all hover:shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-lg">{alert.message}</p>
                  <span className="text-xs text-gray-500 font-mono">
                    {alert.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-gray-700 font-medium">👤 {alert.studentName}</span>
                  <span className="text-sm text-gray-700 font-medium">🖥️ {alert.computerId}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.type === 'danger' ? 'bg-red-200 text-red-900' :
                    alert.type === 'warning' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-blue-200 text-blue-900'
                  }`}>
                    {alert.type === 'danger' ? 'KRITIS' : alert.type === 'warning' ? 'PERINGATAN' : 'INFO'}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition-all">
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-16">
          <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">Tidak ada peringatan</p>
        </div>
      )}
    </div>
  );
}
