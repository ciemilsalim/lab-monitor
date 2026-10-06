import { Computer } from '../types';
import { Monitor, Wifi, Server } from 'lucide-react';

interface NetworkMapProps {
  computers: Computer[];
}

export default function NetworkMap({ computers }: NetworkMapProps) {
  const onlineComputers = computers.filter(c => c.status === 'online');
  const offlineComputers = computers.filter(c => c.status === 'offline');
  const idleComputers = computers.filter(c => c.status === 'idle');

  const getStatusColor = (status: Computer['status']) => {
    switch (status) {
      case 'online': return 'from-green-500 to-emerald-600';
      case 'offline': return 'from-gray-400 to-gray-500';
      case 'idle': return 'from-yellow-500 to-amber-600';
      case 'locked': return 'from-red-500 to-rose-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Topologi Jaringan</h2>
          <p className="text-gray-600 text-sm mt-1">Visualisasi jaringan LAN lab komputer</p>
        </div>
        <div className="flex items-center gap-6 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-700 font-medium">Online ({onlineComputers.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-700 font-medium">Idle ({idleComputers.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm text-gray-700 font-medium">Offline ({offlineComputers.length})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Server className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Server Monitor</p>
              <p className="font-bold text-gray-900 text-lg">192.168.1.1</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wifi className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Switch Utama</p>
              <p className="font-bold text-gray-900 text-lg">48-Port Gigabit</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Subnet</p>
              <p className="font-bold text-gray-900 text-lg">192.168.1.0/24</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
        <h3 className="font-bold text-gray-900 mb-8 text-xl text-center">Diagram Jaringan LAN</h3>
        <div className="relative">
          <div className="flex justify-center mb-10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 flex flex-col items-center shadow-2xl">
              <Server className="w-10 h-10 mb-3" />
              <span className="font-bold text-lg">Server Monitor</span>
              <span className="text-sm text-gray-400 mt-1">192.168.1.1</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-1 h-10 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full" />
          </div>

          <div className="flex justify-center mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl px-10 py-4 flex items-center gap-4 shadow-2xl">
              <Wifi className="w-8 h-8" />
              <div>
                <span className="font-bold text-lg">Switch Utama (48-Port)</span>
                <span className="text-sm block text-blue-100 mt-1">Gigabit Ethernet</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-200 rounded-full" />
          </div>

          <div className="space-y-8">
            {[0, 1, 2].map(row => (
              <div key={row}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-600 font-bold uppercase tracking-wider">Baris {row + 1}</span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                  {computers.filter(c => c.row === row).map((computer) => (
                    <div key={computer.id} className="flex flex-col items-center group">
                      <div className={`w-2 h-8 bg-gradient-to-b ${getStatusColor(computer.status)} rounded-full mb-2 transition-all group-hover:scale-110`} />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(computer.status)} flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl`}>
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-600 mt-2 font-semibold">{computer.id.replace('PC-', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-6 text-xl">Statistik Jaringan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
            <p className="text-4xl font-bold text-gray-900">{computers.length}</p>
            <p className="text-sm text-gray-600 mt-2 font-medium">Total Node</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <p className="text-4xl font-bold text-green-700">{onlineComputers.length}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">Aktif</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
            <p className="text-4xl font-bold text-gray-700">{offlineComputers.length}</p>
            <p className="text-sm text-gray-600 mt-2 font-medium">Tidak Terhubung</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
            <p className="text-4xl font-bold text-blue-700">
              {Math.round(computers.filter(c => c.status !== 'offline').reduce((sum, c) => sum + c.networkSpeed, 0))}
            </p>
            <p className="text-sm text-blue-600 mt-2 font-medium">Total Mbps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
