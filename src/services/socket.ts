import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Re-register all listeners after reconnection
    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected');
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          this.socket?.on(event, callback as any);
        });
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Computer updates
  onComputerUpdated(callback: (data: any) => void): void {
    this.registerListener('computer-updated', callback);
  }

  emitComputerUpdate(data: any): void {
    this.socket?.emit('computer-update', data);
  }

  // Activity logs
  onNewActivity(callback: (data: any) => void): void {
    this.registerListener('new-activity', callback);
  }

  emitActivityLog(data: any): void {
    this.socket?.emit('activity-log', data);
  }

  // Remote commands
  onExecuteCommand(callback: (data: any) => void): void {
    this.registerListener('execute-command', callback);
  }

  emitRemoteCommand(data: any): void {
    this.socket?.emit('remote-command', data);
  }

  // Alert notifications
  onNewAlert(callback: (data: any) => void): void {
    this.registerListener('new-alert', callback);
  }

  // Screenshot events
  onScreenshotCaptured(callback: (data: any) => void): void {
    this.registerListener('screenshot-captured', callback);
  }

  emitScreenshotRequest(data: any): void {
    this.socket?.emit('request-screenshot', data);
  }

  // Computer list sync
  onComputerList(callback: (data: any) => void): void {
    this.registerListener('computer-list', callback);
  }

  requestComputerList(): void {
    this.socket?.emit('request-computer-list');
  }

  // Generic event listener
  on(event: string, callback: (data: any) => void): void {
    this.registerListener(event, callback);
  }

  // Generic listener registration
  private registerListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    this.socket?.on(event, callback as any);
  }
}

export const socketService = new SocketService();
export default socketService;
