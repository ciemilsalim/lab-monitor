import { Monitor, Users, Cpu, Wifi, Clock, Globe, AlertTriangle, HardDrive, TrendingUp } from 'lucide-react';
import { Computer, BrowsingActivity, Alert } from '../types';

interface DashboardProps {
  computers: Computer[];
  activities: BrowsingActivity[];
  alerts: Alert[];
}

export default function Dashboard({ computers, activities, alerts }: DashboardProps) {
  const onlineCount = computers.filter(c => c.status === 'online').length;
  const offlineCount = computers.filter(c => c.status === 'offline').length;
  const idleCount = computers.filter(c => c.status === 'idle').length;
  const avgCpu = Math.round(computers.filter(c => c.status !== 'offline').reduce((sum, c) => sum + c.cpu, 0) / Math.max(onlineCount, 1));
  const avgRam = Math.round(computers.filter(c => c.status !== 'offline').reduce((sum, c) => sum + c.ram, 0) / Math.max(onlineCount, 1));

  const recentActivities = activities.slice(0, 8);
  const recentAlerts = alerts.slice(0, 5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'educational': return 'from-green-500 to-emerald-600';
      case 'social-media': return 'from-blue-500 to-cyan-600';
      case 'entertainment': return 'from-purple-500 to-pink-600';
      case 'search-engine': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'educational': return 'Edukasi';
      case 'social-media': return 'Media Sosial';
      case 'entertainment': return 'Hiburan';
      case 'search-engine': return 'Pencarian';
      default: return 'Lainnya';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Monitoring</h2>
          <p className="text-gray-600 text-sm mt-1">Ringkasan aktivitas lab komputer</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            {new Date().toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 font-medium">Komputer Online</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{onlineCount}</p>
          <p className="text-xs text-gray-500 mt-2">dari {computers.length} komputer</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Siswa Aktif</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{onlineCount + idleCount}</p>
          <p className="text-xs text-gray-500 mt-2">{idleCount} sedang idle</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Cpu className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Avg CPU Usage</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{avgCpu}%</p>
          <p className="text-xs text-gray-500 mt-2">RAM: {avgRam}%</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wifi className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Bandwidth</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {computers.filter(c => c.status !== 'offline').reduce((sum, c) => sum + c.networkSpeed, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Mbps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Kategori Akses</h3>
          </div>
          <div className="space-y-4">
            {['educational', 'social-media', 'entertainment', 'search-engine'].map((cat) => {
              const count = activities.filter(a => a.category === cat).length;
              const total = activities.length;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">{getCategoryLabel(cat)}</span>
                    <span className="font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${getCategoryColor(cat)} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Aktivitas Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-3 text-left text-xs font-semibold text-gray-700 uppercase">Waktu</th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-700 uppercase">Siswa</th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-700 uppercase">Website</th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-gray-600 font-mono text-xs">
                      {activity.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-semibold text-gray-900">{activity.studentName}</td>
                    <td className="py-3 text-blue-600 font-medium">{activity.domain}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(activity.category)}`}>
                        {getCategoryLabel(activity.category)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Status Sistem</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-900">Online</p>
              <p className="text-3xl font-bold text-green-700">{onlineCount}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900">Idle</p>
              <p className="text-3xl font-bold text-yellow-700">{idleCount}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm font-semibold text-red-900">Offline</p>
              <p className="text-3xl font-bold text-red-700">{offlineCount}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">Total</p>
              <p className="text-3xl font-bold text-blue-700">{computers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Peringatan Terbaru</h3>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'danger' ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500' :
                  'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.studentName} • {alert.computerId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
