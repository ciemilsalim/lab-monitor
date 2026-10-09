import { Computer } from '../types';
import { Monitor, Wifi, Server } from 'lucide-react';

interface NetworkMapProps {
  computers: Computer[];
}

export default function NetworkMap({ computers }: NetworkMapProps) {
  const onlineComputers = computers.filter(c => c.status === 'online');
  const offlineComputers = computers.filter(c => c.status === 'offline');
  const idleComputers = computers.filter(c => c.status === 'idle');

  // Get server IP from environment or use default
  const serverIP = import.meta.env.VITE_SERVER_IP || '192.168.100.166';
  const subnet = import.meta.env.VITE_SUBNET || '192.168.100.0/24';
  
  // Extract unique subnet from computers
  const computerSubnets = [...new Set(computers.map(c => {
    const parts = c.ipAddress.split('.');
    return parts.slice(0, 3).join('.') + '.0/24';
  }))];
  const networkSubnet = computerSubnets.length > 0 ? computerSubnets[0] : subnet;

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
              <p className="font-bold text-gray-900 text-lg">{serverIP}</p>
              <p className="text-xs text-gray-500 mt-0.5">Port: 3001</p>
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
              <p className="text-xs text-gray-500 mt-0.5">Active: {onlineComputers.length} ports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Network Subnet</p>
              <p className="font-bold text-gray-900 text-lg">{networkSubnet}</p>
              <p className="text-xs text-gray-500 mt-0.5">Gateway: {serverIP}</p>
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
              <span className="text-sm text-gray-400 mt-1">{serverIP}</span>
              <span className="text-xs text-gray-500 mt-1">Backend API Active</span>
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
                    <div key={computer.id} className="flex flex-col items-center group relative">
                      <div className={`w-2 h-8 bg-gradient-to-b ${getStatusColor(computer.status)} rounded-full mb-2 transition-all group-hover:scale-110`} />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(computer.status)} flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl`}>
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-600 mt-2 font-semibold">{computer.id.replace('PC-', '')}</span>
                      
                      {/* Tooltip dengan detail komputer */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="bg-gray-900 text-white rounded-lg p-3 shadow-xl min-w-[200px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-blue-400" />
                              <span className="font-bold text-sm">{computer.id}</span>
                            </div>
                            <div className="text-xs text-gray-300">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">IP:</span>
                                <span className="font-mono text-green-400">{computer.ipAddress}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-semibold ${
                                  computer.status === 'online' ? 'text-green-400' :
                                  computer.status === 'idle' ? 'text-yellow-400' :
                                  'text-gray-400'
                                }`}>{computer.status.toUpperCase()}</span>
                              </div>
                              {computer.studentName && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">User:</span>
                                  <span className="text-blue-300">{computer.studentName}</span>
                                </div>
                              )}
                              {computer.status === 'online' && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500">CPU:</span>
                                    <span className="text-orange-400">{computer.cpu}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500">RAM:</span>
                                    <span className="text-purple-400">{computer.ram}%</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daftar Komputer dengan IP Address */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-6 text-xl">Daftar Komputer & IP Address</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pengguna</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPU</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">RAM</th>
              </tr>
            </thead>
            <tbody>
              {computers.map((computer) => (
                <tr key={computer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        computer.status === 'online' ? 'bg-green-500 animate-pulse' :
                        computer.status === 'idle' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="font-semibold text-gray-900">{computer.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {computer.ipAddress}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      computer.status === 'online' ? 'bg-green-100 text-green-800' :
                      computer.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
                      computer.status === 'locked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {computer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {computer.studentName || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {computer.status === 'online' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              computer.cpu > 80 ? 'bg-red-500' :
                              computer.cpu > 50 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${computer.cpu}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{computer.cpu}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {computer.status === 'online' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              computer.ram > 80 ? 'bg-red-500' :
                              computer.ram > 50 ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${computer.ram}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{computer.ram}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
