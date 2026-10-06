import { useState, useEffect } from 'react';
import {
  X, Maximize2, Minimize2, MousePointer, Keyboard, Eye, Lock, Unlock,
  Power, RotateCcw, MessageSquare, Camera, Volume2, VolumeX, Monitor,
  AlertTriangle, CheckCircle2, Info, Wifi, WifiOff, Zap
} from 'lucide-react';
import { Computer, RemoteControlSession } from '../types';

interface RemoteDesktopViewerProps {
  computer: Computer;
  onClose: () => void;
}

export default function RemoteDesktopViewer({ computer, onClose }: RemoteDesktopViewerProps) {
  const [session, setSession] = useState<RemoteControlSession>({
    id: `RCS-${Date.now()}`,
    computerId: computer.id,
    startTime: new Date(),
    isActive: true,
    mouseControl: false,
    keyboardControl: false,
    viewOnly: true,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  // Simulasi koneksi quality
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities: ('excellent' | 'good' | 'poor')[] = ['excellent', 'good', 'excellent', 'good', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const toggleMouseControl = () => {
    if (session.viewOnly) {
      notify('⚠️ Aktifkan kontrol terlebih dahulu untuk mengontrol mouse');
      return;
    }
    setSession({ ...session, mouseControl: !session.mouseControl });
    notify(session.mouseControl ? '🖱️ Kontrol mouse dinonaktifkan' : '🖱️ Kontrol mouse diaktifkan - Anda dapat menggerakkan cursor');
  };

  const toggleKeyboardControl = () => {
    if (session.viewOnly) {
      notify('⚠️ Aktifkan kontrol terlebih dahulu untuk mengontrol keyboard');
      return;
    }
    setSession({ ...session, keyboardControl: !session.keyboardControl });
    notify(session.keyboardControl ? '⌨️ Kontrol keyboard dinonaktifkan' : '⌨️ Kontrol keyboard diaktifkan - Anda dapat mengetik');
  };

  const toggleViewOnly = () => {
    if (!session.viewOnly) {
      // Switching to view-only
      setSession({ ...session, viewOnly: true, mouseControl: false, keyboardControl: false });
      notify('👁️ Mode lihat saja diaktifkan');
    } else {
      // Switching to control mode
      setSession({ ...session, viewOnly: false });
      notify('🎮 Mode kontrol diaktifkan - Anda dapat mengontrol mouse & keyboard');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!session.mouseControl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!session.keyboardControl) return;
    e.preventDefault();
    setIsTyping(true);
    setTypedText(prev => prev + e.key);
    setTimeout(() => setIsTyping(false), 500);
  };

  const sendKeyCombination = (combo: string) => {
    if (!session.keyboardControl) {
      notify('⚠️ Aktifkan kontrol keyboard terlebih dahulu');
      return;
    }
    notify(`⌨️ Kombinasi tombol "${combo}" dikirim ke ${computer.id}`);
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
    }
  };

  const getConnectionLabel = () => {
    switch (connectionQuality) {
      case 'excellent': return 'Sangat Baik';
      case 'good': return 'Baik';
      case 'poor': return 'Buruk';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/90 z-50 flex flex-col ${isFullscreen ? '' : 'p-4'}`}>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700 animate-pulse">
          <p className="text-sm font-medium">{notificationMsg}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-3 flex items-center justify-between shrink-0 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${session.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {session.isActive ? 'Terhubung' : 'Terputus'}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="font-bold">{computer.name}</span>
            <span className="text-gray-400 text-sm">({computer.ipAddress})</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">👤 {computer.studentName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Quality */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 ${getConnectionColor()}`}>
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{getConnectionLabel()}</span>
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-mono">
              {Math.floor((Date.now() - session.startTime.getTime()) / 60000)}m
            </span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* View Only Toggle */}
          <button
            onClick={toggleViewOnly}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              session.viewOnly
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {session.viewOnly ? <Eye className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {session.viewOnly ? 'Lihat Saja' : 'Mode Kontrol'}
          </button>

          <div className="h-6 w-px bg-gray-700" />

          {/* Mouse Control */}
          <button
            onClick={toggleMouseControl}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              session.mouseControl
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={session.viewOnly}
          >
            <MousePointer className="w-4 h-4" />
            Mouse {session.mouseControl ? 'ON' : 'OFF'}
          </button>

          {/* Keyboard Control */}
          <button
            onClick={toggleKeyboardControl}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              session.keyboardControl
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={session.viewOnly}
          >
            <Keyboard className="w-4 h-4" />
            Keyboard {session.keyboardControl ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <button
            onClick={() => notify(`📸 Screenshot disimpan dari ${computer.id}`)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Screenshot
          </button>
          <button
            onClick={() => notify(`🔊 Audio dimatikan di ${computer.id}`)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <VolumeX className="w-4 h-4" />
            Mute
          </button>
          <button
            onClick={() => {
              const msg = prompt('Masukkan pesan untuk siswa:');
              if (msg) notify(`💬 Pesan dikirim ke ${computer.id}: "${msg}"`);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Kirim Pesan
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Bar */}
      {!session.viewOnly && (
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 mr-2">Kirim Kombinasi Tombol:</span>
          {[
            { label: 'Ctrl+Alt+Del', combo: 'Ctrl+Alt+Del' },
            { label: 'Ctrl+C', combo: 'Ctrl+C' },
            { label: 'Ctrl+V', combo: 'Ctrl+V' },
            { label: 'Alt+Tab', combo: 'Alt+Tab' },
            { label: 'Alt+F4', combo: 'Alt+F4' },
            { label: 'Windows', combo: 'Win' },
            { label: 'Esc', combo: 'Esc' },
          ].map((shortcut) => (
            <button
              key={shortcut.combo}
              onClick={() => sendKeyCombination(shortcut.combo)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded text-xs font-mono hover:bg-gray-700 hover:border-gray-600 transition-colors"
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      )}

      {/* Screen Area */}
      <div
        className="flex-1 relative overflow-hidden bg-gray-950"
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Simulated Desktop Screen */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          {/* Simulated Desktop Elements */}
          <div className="absolute inset-0 p-8">
            {/* Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex items-center px-4 gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-white text-xs">📁</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-white text-xs">🌐</span>
              </div>
              <div className="flex-1" />
              <span className="text-white text-xs font-mono">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Desktop Icons */}
            <div className="grid grid-cols-6 gap-4">
              {['This PC', 'Documents', 'Chrome', 'VS Code', 'Terminal', 'Recycle Bin'].map((icon, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 cursor-pointer">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                    {['💻', '📄', '🌐', '💻', '⬛', '🗑️'][i]}
                  </div>
                  <span className="text-white text-xs text-center">{icon}</span>
                </div>
              ))}
            </div>

            {/* Active Window Simulation */}
            <div className="absolute top-20 left-20 right-20 bottom-20 bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-600 ml-2">{computer.currentApp} - {computer.studentName}</span>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-20 bg-gray-100 rounded mt-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Remote Cursor */}
          {session.mouseControl && (
            <div
              className="absolute pointer-events-none transition-all duration-75"
              style={{ left: `${mousePosition.x}%`, top: `${mousePosition.y}%` }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-lg">
                <path d="M0,0 L0,16 L4,12 L7,18 L9,17 L6,11 L12,11 Z" fill="white" stroke="black" strokeWidth="1" />
              </svg>
              <div className="absolute -top-6 left-4 bg-black/80 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                Admin Remote
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && session.keyboardControl && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 animate-pulse">
              <Keyboard className="w-3 h-3" />
              Mengetik...
            </div>
          )}
        </div>

        {/* View Only Overlay */}
        {session.viewOnly && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white px-6 py-3 rounded-xl flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span className="font-medium">Mode Lihat Saja - Kontrol Dinonaktifkan</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-400">
              {session.isActive ? 'Sesi Aktif' : 'Sesi Terputus'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Resolusi: 1920x1080 | FPS: 30 | Latency: {connectionQuality === 'excellent' ? '<10ms' : connectionQuality === 'good' ? '10-50ms' : '>50ms'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session.mouseControl && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <MousePointer className="w-3 h-3" /> Mouse Aktif
            </span>
          )}
          {session.keyboardControl && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Keyboard className="w-3 h-3" /> Keyboard Aktif
            </span>
          )}
          <span className="text-xs text-gray-500">
            Sesi: {session.id}
          </span>
        </div>
      </div>
    </div>
  );
}
