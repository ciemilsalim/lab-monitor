import { useState } from 'react';
import { X, Power, RotateCcw, Lock, Eye, Monitor, Terminal, Shield, Check, MousePointer } from 'lucide-react';
import { Computer, BrowsingActivity } from '../types';
import RemoteDesktopViewer from './RemoteDesktopViewer';
import socketService from '../services/socket';

interface ComputerDetailProps {
  computer: Computer;
  activities: BrowsingActivity[];
  onClose: () => void;
}

export default function ComputerDetail({ computer, activities, onClose }: ComputerDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'control'>('info');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showRemoteDesktop, setShowRemoteDesktop] = useState(false);

  const computerActivities = activities.filter(a => a.computerId === computer.id).slice(0, 20);

  const handleAction = (action: string) => {
    console.log('🎮 Sending remote command from ComputerDetail:', { action, computerId: computer.id });
    
    // Emit command ke backend via socket
    socketService.emitRemoteCommand({
      action,
      computerId: computer.id,
      timestamp: new Date().toISOString()
    });
    
    setActionFeedback(`Perintah "${action}" berhasil dikirim ke ${computer.id}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Monitor className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{computer.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{computer.id} • {computer.ipAddress}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-xs font-medium">Siswa</p>
              <p className="font-semibold mt-2 text-sm">{computer.studentName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-xs font-medium">CPU</p>
              <p className="font-semibold mt-2 text-sm">{computer.cpu}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-xs font-medium">RAM</p>
              <p className="font-semibold mt-2 text-sm">{computer.ram}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-gray-300 text-xs font-medium">Network</p>
              <p className="font-semibold mt-2 text-sm">{computer.networkSpeed} Mbps</p>
            </div>
          </div>
        </div>

        <div className="border-b-2 border-gray-200 px-6 bg-gray-50">
          <div className="flex gap-2">
            {[
              { id: 'info', label: 'Informasi', icon: Eye },
              { id: 'activity', label: 'Aktivitas', icon: Terminal },
              { id: 'control', label: 'Kontrol', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {actionFeedback && (
            <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">{actionFeedback}</span>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-4">Detail Komputer</h4>
                <div className="space-y-3">
                  {[
                    { label: 'IP Address', value: computer.ipAddress },
                    { label: 'MAC Address', value: computer.macAddress },
                    { label: 'Sistem Operasi', value: computer.os },
                    { label: 'Status', value: computer.status },
                    { label: 'Uptime', value: `${computer.uptime} menit` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 text-sm font-medium">{item.label}</span>
                      <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-4">Resource Usage</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">CPU Usage</span>
                      <span className="font-bold text-gray-900">{computer.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className={`h-3 rounded-full ${computer.cpu > 80 ? 'bg-gradient-to-r from-red-500 to-rose-600' : computer.cpu > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`} style={{ width: `${computer.cpu}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">RAM Usage</span>
                      <span className="font-bold text-gray-900">{computer.ram}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className={`h-3 rounded-full ${computer.ram > 80 ? 'bg-gradient-to-r from-red-500 to-rose-600' : computer.ram > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`} style={{ width: `${computer.ram}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-4">Riwayat Browsing</h4>
              {computerActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tidak ada aktivitas</p>
              ) : (
                <div className="space-y-4">
                  {computerActivities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600 font-mono text-xs">
                              {activity.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-blue-600 font-semibold text-sm">{activity.domain}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.tabs && activity.tabs.length > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                {activity.tabs.length} Tab
                              </span>
                            )}
                            <span className="text-gray-500 text-xs">{Math.floor(activity.duration / 60)}m</span>
                          </div>
                        </div>
                      </div>
                      
                      {activity.tabs && activity.tabs.length > 0 && (
                        <div className="p-3 bg-white">
                          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase">Semua Tab Browser:</p>
                          <div className="space-y-2">
                            {activity.tabs.map((tab) => (
                              <div 
                                key={tab.id} 
                                className={`flex items-center gap-3 p-2 rounded-lg ${
                                  tab.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${tab.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{tab.title}</p>
                                  <p className="text-xs text-gray-600 truncate">{tab.url}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs text-gray-500">{Math.floor(tab.duration / 60)}m</p>
                                  {tab.isActive && (
                                    <span className="text-xs font-semibold text-green-600">AKTIF</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'control' && (
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-4">Panel Kontrol Remote</h4>
              
              {/* Remote Desktop Control - Featured Button */}
              <button
                onClick={() => setShowRemoteDesktop(true)}
                className="w-full mb-6 flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <MousePointer className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-lg">🎮 Remote Desktop Control</p>
                  <p className="text-sm text-white/80 mt-0.5">
                    Ambil alih mouse & keyboard komputer siswa secara real-time
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                  <span className="text-xs font-bold">MULAI</span>
                  <span className="text-lg">→</span>
                </div>
              </button>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { action: 'shutdown', icon: Power, label: 'Shutdown', color: 'from-red-500 to-rose-600', bg: 'from-red-50 to-rose-50 border-red-200' },
                  { action: 'restart', icon: RotateCcw, label: 'Restart', color: 'from-orange-500 to-amber-600', bg: 'from-orange-50 to-amber-50 border-orange-200' },
                  { action: 'lock', icon: Lock, label: 'Lock Screen', color: 'from-yellow-500 to-amber-600', bg: 'from-yellow-50 to-amber-50 border-yellow-200' },
                  { action: 'view', icon: Eye, label: 'Lihat Layar', color: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50 border-blue-200' },
                  { action: 'message', icon: Terminal, label: 'Kirim Pesan', color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50 border-green-200' },
                  { action: 'block', icon: Shield, label: 'Blokir Internet', color: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50 border-purple-200' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.action}
                      onClick={() => handleAction(item.action)}
                      className={`flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${item.bg} border-2 rounded-2xl hover:shadow-lg transition-all active:scale-95`}
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remote Desktop Viewer */}
      {showRemoteDesktop && (
        <RemoteDesktopViewer
          computer={computer}
          onClose={() => setShowRemoteDesktop(false)}
        />
      )}
    </div>
  );
}
