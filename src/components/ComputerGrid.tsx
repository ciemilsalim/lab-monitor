import { useState } from 'react';
import { Monitor, Cpu, HardDrive } from 'lucide-react';
import { Computer } from '../types';

interface ComputerGridProps {
  computers: Computer[];
  onSelectComputer: (computer: Computer) => void;
}

export default function ComputerGrid({ computers, onSelectComputer }: ComputerGridProps) {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'idle'>('all');

  const filteredComputers = filter === 'all' ? computers : computers.filter(c => c.status === filter);

  const getStatusGradient = (status: Computer['status']) => {
    switch (status) {
      case 'online': return 'from-green-50 to-emerald-50 border-green-500';
      case 'offline': return 'from-gray-50 to-slate-50 border-gray-300';
      case 'idle': return 'from-yellow-50 to-amber-50 border-yellow-500';
      case 'locked': return 'from-red-50 to-rose-50 border-red-500';
    }
  };

  const getStatusDot = (status: Computer['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'idle': return 'bg-yellow-500';
      case 'locked': return 'bg-red-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Monitor Komputer</h2>
          <p className="text-gray-600 text-sm mt-1">Klik komputer untuk detail & kontrol</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
          {(['all', 'online', 'idle', 'offline'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filteredComputers.map((computer) => (
          <div
            key={computer.id}
            onClick={() => onSelectComputer(computer)}
            className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${getStatusGradient(computer.status)}`}
          >
            <div className="absolute top-3 right-3">
              <div className={`w-3 h-3 rounded-full ${getStatusDot(computer.status)} ${computer.status === 'online' ? 'animate-pulse' : ''}`} />
            </div>

            <div className="flex flex-col items-center mt-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${computer.status === 'offline' ? 'bg-gray-200' : 'bg-white shadow-md'}`}>
                <Monitor className={`w-8 h-8 ${computer.status === 'offline' ? 'text-gray-400' : 'text-gray-700'}`} />
              </div>
              <p className="font-bold text-sm text-gray-900">{computer.id}</p>
              <p className="text-xs text-gray-600 mt-1">{computer.studentName.split(' ')[0]}</p>

              {/* Real-time connection indicator */}
              {computer.status === 'online' && computer.isConnected !== undefined && (
                <div className={`mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  computer.isConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {computer.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </div>
              )}

              {/* Last heartbeat indicator */}
              {computer.lastHeartbeat && computer.status === 'online' && (
                <p className="text-xs text-gray-500 mt-1">
                  Last seen: {new Date(computer.lastHeartbeat).toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              )}

              {computer.status !== 'offline' && (
                <div className="mt-3 w-full space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Cpu className="w-3.5 h-3.5 text-gray-500" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${computer.cpu > 80 ? 'bg-red-500' : computer.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${computer.cpu}%` }} />
                    </div>
                    <span className="text-gray-700 font-semibold w-8 text-right">{computer.cpu}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <HardDrive className="w-3.5 h-3.5 text-gray-500" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${computer.ram > 80 ? 'bg-red-500' : computer.ram > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${computer.ram}%` }} />
                    </div>
                    <span className="text-gray-700 font-semibold w-8 text-right">{computer.ram}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
