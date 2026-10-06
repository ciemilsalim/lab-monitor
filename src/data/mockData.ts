import { Computer, BrowsingActivity, Alert } from '../types';

const studentNames = [
  'Ahmad Rizki', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Lestari',
  'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Hidayat', 'Hani Permata',
  'Irfan Maulana', 'Joko Widodo', 'Kartika Sari', 'Lukman Hakim',
  'Maya Anggraeni', 'Naufal Azizi', 'Olivia Putri', 'Putra Aditya',
  'Qori Amelia', 'Rendi Saputra', 'Sari Wulandari', 'Taufik Ismail',
  'Umar Faruq', 'Vina Maharani', 'Wahyu Setiawan', 'Xena Purnama',
  'Yusuf Ibrahim', 'Zahra Aulia', 'Arif Rahman', 'Bella Safitri',
  'Candra Kusuma', 'Dina Mariana'
];

const educationalSites = [
  { url: 'https://ruangguru.com', domain: 'ruangguru.com', category: 'educational' as const },
  { url: 'https://zenius.net', domain: 'zenius.net', category: 'educational' as const },
  { url: 'https://khanacademy.org', domain: 'khanacademy.org', category: 'educational' as const },
  { url: 'https://stackoverflow.com', domain: 'stackoverflow.com', category: 'educational' as const },
  { url: 'https://github.com', domain: 'github.com', category: 'educational' as const },
  { url: 'https://w3schools.com', domain: 'w3schools.com', category: 'educational' as const },
];

const socialMediaSites = [
  { url: 'https://instagram.com', domain: 'instagram.com', category: 'social-media' as const },
  { url: 'https://tiktok.com', domain: 'tiktok.com', category: 'social-media' as const },
  { url: 'https://twitter.com', domain: 'twitter.com', category: 'social-media' as const },
  { url: 'https://facebook.com', domain: 'facebook.com', category: 'social-media' as const },
];

const entertainmentSites = [
  { url: 'https://youtube.com', domain: 'youtube.com', category: 'entertainment' as const },
  { url: 'https://netflix.com', domain: 'netflix.com', category: 'entertainment' as const },
  { url: 'https://spotify.com', domain: 'spotify.com', category: 'entertainment' as const },
];

const searchSites = [
  { url: 'https://google.com/search', domain: 'google.com', category: 'search-engine' as const },
  { url: 'https://bing.com/search', domain: 'bing.com', category: 'search-engine' as const },
];

const allSites = [...educationalSites, ...socialMediaSites, ...entertainmentSites, ...searchSites];

const apps = [
  'Visual Studio Code', 'Chrome', 'Firefox', 'Python IDLE',
  'Microsoft Word', 'Excel', 'Notepad++', 'Terminal'
];

const statuses: Computer['status'][] = ['online', 'online', 'online', 'online', 'online', 'idle', 'idle', 'offline', 'offline', 'locked'];

function generateComputers(): Computer[] {
  const computers: Computer[] = [];
  for (let i = 0; i < 30; i++) {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const site = allSites[Math.floor(Math.random() * allSites.length)];
    const app = apps[Math.floor(Math.random() * apps.length)];

    computers.push({
      id: `PC-${String(i + 1).padStart(2, '0')}`,
      name: `Komputer ${i + 1}`,
      ipAddress: `192.168.1.${100 + i}`,
      macAddress: `AA:BB:CC:DD:EE:${String(i + 1).padStart(2, '0').toUpperCase()}`,
      status,
      studentName: studentNames[i],
      studentId: `STD${String(2024001 + i)}`,
      cpu: status === 'offline' ? 0 : Math.floor(Math.random() * 80) + 10,
      ram: status === 'offline' ? 0 : Math.floor(Math.random() * 60) + 20,
      networkSpeed: status === 'offline' ? 0 : Math.floor(Math.random() * 100) + 1,
      os: 'Windows 11 Pro',
      uptime: status === 'offline' ? 0 : Math.floor(Math.random() * 180) + 10,
      currentApp: app,
      currentUrl: site.url,
      row, col,
    });
  }
  return computers;
}

function generateActivities(computers: Computer[]): BrowsingActivity[] {
  const activities: BrowsingActivity[] = [];
  const now = new Date();
  for (let i = 0; i < 200; i++) {
    const computer = computers[Math.floor(Math.random() * computers.length)];
    if (computer.status === 'offline') continue;
    const site = allSites[Math.floor(Math.random() * allSites.length)];
    const minutesAgo = Math.floor(Math.random() * 120);
    activities.push({
      id: `ACT-${String(i).padStart(4, '0')}`,
      timestamp: new Date(now.getTime() - minutesAgo * 60000),
      url: site.url,
      domain: site.domain,
      category: site.category,
      duration: Math.floor(Math.random() * 600) + 10,
      studentName: computer.studentName,
      computerId: computer.id,
    });
  }
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateAlerts(computers: Computer[]): Alert[] {
  const alerts: Alert[] = [];
  const alertMessages = [
    { type: 'warning' as const, message: 'Mengakses situs non-edukasi' },
    { type: 'danger' as const, message: 'Mencoba mengakses situs yang diblokir' },
    { type: 'info' as const, message: 'Tidak aktif lebih dari 15 menit' },
    { type: 'warning' as const, message: 'Bandwidth usage tinggi' },
    { type: 'danger' as const, message: 'Mencoba menginstal software tidak sah' },
  ];
  const now = new Date();
  for (let i = 0; i < 15; i++) {
    const computer = computers[Math.floor(Math.random() * computers.length)];
    const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    alerts.push({
      id: `ALT-${String(i).padStart(3, '0')}`,
      type: alert.type,
      message: alert.message,
      timestamp: new Date(now.getTime() - Math.floor(Math.random() * 60) * 60000),
      computerId: computer.id,
      studentName: computer.studentName,
    });
  }
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const computers = generateComputers();
export const activities = generateActivities(computers);
export const alerts = generateAlerts(computers);
