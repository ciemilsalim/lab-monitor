import { useState, useEffect } from 'react';
import {
  X, Maximize2, Minimize2, MousePointer, Keyboard, Eye, Unlock,
  MessageSquare, Camera, VolumeX, Monitor,
  Wifi, Zap
} from 'lucide-react';
import { Computer, RemoteControlSession } from '../types';
import socketService from '../services/socket';

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
  
  // View Only mode states
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(true);
  const [captureInterval, setCaptureInterval] = useState(3000); // 3 seconds default

  // Simulasi koneksi quality
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities: ('excellent' | 'good' | 'poor')[] = ['excellent', 'good', 'excellent', 'good', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-capture screenshot saat mode "Lihat Saja" aktif
  useEffect(() => {
    if (!session.viewOnly || !autoCaptureEnabled) return;

    // Request screenshot pertama kali
    requestScreenshot();

    // Setup interval untuk auto-capture
    const interval = setInterval(() => {
      if (session.viewOnly && autoCaptureEnabled) {
        requestScreenshot();
      }
    }, captureInterval);

    return () => clearInterval(interval);
  }, [session.viewOnly, autoCaptureEnabled, captureInterval]);

  // Listen untuk screenshot dari backend
  useEffect(() => {
    const handleScreenshot = (data: any) => {
      if (data.computerId === computer.id && data.image) {
        console.log('📸 Screenshot received for view-only mode');
        setCurrentScreenshot(data.image);
        setLastCaptureTime(new Date());
        setIsCapturing(false);
      }
    };

    socketService.on('screenshot-captured', handleScreenshot);

    return () => {
      socketService.off('screenshot-captured', handleScreenshot);
    };
  }, [computer.id]);

  // Fungsi untuk request screenshot
  const requestScreenshot = () => {
    if (isCapturing) return; // Jangan request jika sedang capture
    
    setIsCapturing(true);
    console.log('📸 Requesting screenshot for view-only mode');
    
    socketService.emitScreenshotRequest({
      computerId: computer.id,
      computerName: computer.name,
      studentName: computer.studentName,
      timestamp: new Date().toISOString()
    });
  };

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
    
    // Emit command ke backend via socket
    console.log('🎮 Sending key combination:', combo);
    socketService.emitRemoteCommand({
      action: 'key_combination',
      computerId: computer.id,
      keys: combo,
      timestamp: new Date().toISOString()
    });
    
    notify(`⌨️ Kombinasi tombol "${combo}" dikirim ke ${computer.id}`);
  };

  // Fungsi untuk mengirim command remote control
  const sendRemoteCommand = (action: string, params: Record<string, any> = {}) => {
    console.log('🎮 Sending remote command:', { action, computerId: computer.id, ...params });
    
    socketService.emitRemoteCommand({
      action,
      computerId: computer.id,
      ...params,
      timestamp: new Date().toISOString()
    });
    
    notify(`✅ Perintah "${action}" dikirim ke ${computer.id}`);
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
            onClick={() => sendRemoteCommand('screenshot')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Screenshot
          </button>
          <button
            onClick={() => sendRemoteCommand('mute_audio')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            <VolumeX className="w-4 h-4" />
            Mute
          </button>
          <button
            onClick={() => {
              const msg = prompt('Masukkan pesan untuk siswa:');
              if (msg) sendRemoteCommand('message', { message: msg });
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
        {/* View Only Mode - Tampilkan Screenshot */}
        {session.viewOnly ? (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            {currentScreenshot ? (
              <>
                {/* Screenshot Display */}
                <img 
                  src={currentScreenshot} 
                  alt="Live Screen" 
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Loading Indicator */}
                {isCapturing && (
                  <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Mengambil screenshot...</span>
                  </div>
                )}

                {/* Last Capture Info */}
                {lastCaptureTime && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-xs">
                      Terakhir: {lastCaptureTime.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </span>
                    {autoCaptureEnabled && (
                      <span className="text-xs text-green-400 ml-2">
                        • Auto-refresh setiap {captureInterval / 1000}s
                      </span>
                    )}
                  </div>
                )}

                {/* View Only Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={requestScreenshot}
                    disabled={isCapturing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                  <button
                    onClick={() => setAutoCaptureEnabled(!autoCaptureEnabled)}
                    className={`${autoCaptureEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                  >
                    <span className="text-sm font-medium">
                      {autoCaptureEnabled ? '⏸️ Pause' : '▶️ Auto'}
                    </span>
                  </button>
                  <select
                    value={captureInterval}
                    onChange={(e) => setCaptureInterval(Number(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    <option value={1000}>1 detik</option>
                    <option value={2000}>2 detik</option>
                    <option value={3000}>3 detik</option>
                    <option value={5000}>5 detik</option>
                    <option value={10000}>10 detik</option>
                  </select>
                </div>

                {/* View Only Badge */}
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">Mode Lihat Saja</span>
                </div>
              </>
            ) : (
              /* No Screenshot Yet */
              <div className="text-center">
                {isCapturing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white text-lg">Mengambil screenshot pertama...</p>
                    <p className="text-gray-400 text-sm">Mohon tunggu beberapa detik</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Camera className="w-16 h-16 text-gray-600" />
                    <p className="text-white text-lg">Belum ada screenshot</p>
                    <button
                      onClick={requestScreenshot}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="font-medium">Ambil Screenshot</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Control Mode - Simulated Desktop */
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
