export type ComputerStatus = 'online' | 'offline' | 'idle' | 'locked';

export interface BrowserTab {
  id: string;
  url: string;
  domain: string;
  title: string;
  category: 'educational' | 'social-media' | 'entertainment' | 'search-engine' | 'shopping' | 'news' | 'other';
  isActive: boolean;
  openTime: Date;
  duration: number;
}

export interface BrowsingActivity {
  id: string;
  timestamp: Date;
  url: string;
  domain: string;
  category: 'educational' | 'social-media' | 'entertainment' | 'search-engine' | 'shopping' | 'news' | 'other';
  duration: number;
  studentName: string;
  computerId: string;
  tabs?: BrowserTab[];
}

export interface Computer {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  status: ComputerStatus;
  studentName: string;
  studentId: string;
  cpu: number;
  ram: number;
  networkSpeed: number;
  os: string;
  uptime: number;
  currentApp: string;
  currentUrl: string;
  row: number;
  col: number;
  screenCapture?: string;
  isConnected?: boolean; // Real-time connection status
  lastHeartbeat?: string | Date; // Last time agent sent data
}

export interface Screenshot {
  id: string;
  computerId: string;
  computerName: string;
  studentName: string;
  image: string; // base64 encoded image
  timestamp: Date;
  size: number;
  path?: string;
}

export interface RemoteControlSession {
  id: string;
  computerId: string;
  startTime: Date;
  isActive: boolean;
  mouseControl: boolean;
  keyboardControl: boolean;
  viewOnly: boolean;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: Date;
  computerId: string;
  studentName: string;
  is_read?: boolean;
}

export type ViewMode = 'dashboard' | 'computers' | 'activity' | 'alerts' | 'network' | 'guide' | 'cleanup';
