import { useState } from 'react';
import {
  BookOpen, Monitor, LogIn, LayoutDashboard, Globe, AlertTriangle,
  Network, Shield, Download, Server, ChevronRight, ChevronDown,
  CheckCircle2, Info, Lightbulb, Wrench, Terminal, Users, Cpu,
  Eye, Search, Filter, Bell, MousePointer, Keyboard, Zap, HelpCircle,
  Camera, Lock, Power, RotateCcw
} from 'lucide-react';

type GuideSection =
  | 'overview'
  | 'installation'
  | 'backend-setup'
  | 'agent-setup'
  | 'login'
  | 'dashboard'
  | 'computers'
  | 'activity'
  | 'alerts'
  | 'network'
  | 'remote-control'
  | 'screenshot'
  | 'troubleshooting';

interface SectionItem {
  id: GuideSection;
  label: string;
  icon: React.ElementType;
  sub?: string;
}

const sections: SectionItem[] = [
  { id: 'overview', label: 'Ikhtisar Aplikasi', icon: BookOpen, sub: 'Tentang LabMonitor' },
  { id: 'installation', label: 'Instalasi & Persiapan', icon: Download, sub: 'Cara memasang' },
  { id: 'backend-setup', label: 'Setup Backend', icon: Server, sub: 'Node.js + Express + Socket.io' },
  { id: 'agent-setup', label: 'Setup Agent', icon: Terminal, sub: 'Agent monitoring PC siswa' },
  { id: 'login', label: 'Login & Akun', icon: LogIn, sub: 'Masuk ke sistem' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Ringkasan monitoring' },
  { id: 'computers', label: 'Monitor Komputer', icon: Monitor, sub: 'Lihat semua PC' },
  { id: 'activity', label: 'Aktivitas Internet', icon: Globe, sub: 'Pantau browsing' },
  { id: 'alerts', label: 'Peringatan', icon: AlertTriangle, sub: 'Notifikasi & alert' },
  { id: 'network', label: 'Peta Jaringan', icon: Network, sub: 'Topologi LAN' },
  { id: 'remote-control', label: 'Kontrol Remote', icon: Shield, sub: 'Mouse & keyboard control' },
  { id: 'screenshot', label: 'Screenshot Dashboard', icon: Camera, sub: 'Lihat layar siswa' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench, sub: 'Masalah & solusi' },
];

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<GuideSection>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToSection = (id: GuideSection) => {
    setActiveSection(id);
    const el = document.getElementById(`guide-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Panduan Penggunaan</h2>
                <p className="text-blue-100 text-sm mt-1">LabMonitor - Sistem Monitoring Lab Komputer v1.2.0</p>
              </div>
            </div>
            <p className="text-blue-100 max-w-2xl mt-4 leading-relaxed">
              Panduan lengkap mulai dari instalasi, konfigurasi, hingga cara menggunakan seluruh fitur aplikasi.
              Ikuti langkah-langkah berikut untuk mengoptimalkan penggunaan LabMonitor di lab komputer Anda.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Versi 1.2.0</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg sticky top-6 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Daftar Isi
              </h3>
            </div>
            <nav className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {sections.map((section, idx) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold shrink-0 ${
                      isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{section.label}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {section.sub}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ml-auto shrink-0 ${isActive ? 'text-white/70' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-8">
          {/* 1. Overview */}
          <section id="guide-overview" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">1. Ikhtisar Aplikasi</h3>
                  <p className="text-sm text-gray-600">Mengenal LabMonitor secara keseluruhan</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Apa itu LabMonitor?</p>
                    <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                      LabMonitor adalah sistem monitoring real-time untuk laboratorium komputer yang memungkinkan admin/guru
                      memantau aktivitas siswa, mengontrol komputer dari jarak jauh (mouse & keyboard), melihat screenshot layar,
                      dan mengelola jaringan LAN secara terpusat.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Fitur Utama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Monitor, title: 'Monitoring Real-time', desc: 'Pantau status CPU, RAM, dan jaringan setiap komputer secara langsung', color: 'from-green-500 to-emerald-600' },
                  { icon: Globe, title: 'Monitoring Browsing', desc: 'Lihat aktivitas internet siswa dengan kategori otomatis & semua tab browser', color: 'from-blue-500 to-cyan-600' },
                  { icon: MousePointer, title: 'Remote Control', desc: 'Ambil alih mouse & keyboard komputer siswa secara real-time', color: 'from-purple-500 to-pink-600' },
                  { icon: Camera, title: 'Screenshot Dashboard', desc: 'Lihat screenshot layar siswa secara real-time di dashboard', color: 'from-orange-500 to-red-600' },
                  { icon: AlertTriangle, title: 'Sistem Alert', desc: 'Notifikasi otomatis untuk aktivitas mencurigakan', color: 'from-red-500 to-rose-600' },
                  { icon: Network, title: 'Peta Jaringan', desc: 'Visualisasi topologi jaringan LAN lab komputer', color: 'from-indigo-500 to-blue-600' },
                  { icon: Lock, title: 'Internet Control', desc: 'Blokir internet siswa dengan whitelist server', color: 'from-yellow-500 to-amber-600' },
                  { icon: Terminal, title: 'Agent Auto-Start', desc: 'Agent otomatis berjalan saat komputer boot', color: 'from-teal-500 to-cyan-600' },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className={`w-11 h-11 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Arsitektur Sistem</h4>
              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl px-6 py-3 text-center">
                    <p className="font-bold">🖥️ Frontend React</p>
                    <p className="text-xs text-blue-100">Port 3000 - Dashboard UI</p>
                  </div>
                  <div className="text-gray-400 text-sm">↕️ HTTP + WebSocket</div>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-center">
                    <p className="font-bold">⚡ Backend Node.js + Express + Socket.io</p>
                    <p className="text-xs text-purple-100">Port 3001 - API Server</p>
                  </div>
                  <div className="text-gray-400 text-sm">↕️ SQL Queries</div>
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-6 py-3 text-center">
                    <p className="font-bold">🗄️ MySQL (via Laragon)</p>
                    <p className="text-xs text-green-100">Port 3306 - Database</p>
                  </div>
                  <div className="text-gray-400 text-sm">↕️ Agent Communication</div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold">PC-{String(i + 1).padStart(2, '0')}</p>
                        <p className="text-xs">Agent</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">... dan seterusnya hingga 30 komputer</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Installation */}
          <section id="guide-installation" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">2. Instalasi & Persiapan</h3>
                  <p className="text-sm text-gray-600">Persyaratan dan langkah pemasangan</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <h4 className="font-bold text-gray-900 text-lg">Persyaratan Sistem</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-blue-600" />
                    <p className="font-bold text-gray-900">Server (Admin)</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> OS: Windows 10/11 atau Linux</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> RAM: Minimal 4 GB</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Node.js v18+ (LTS)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Laragon (untuk MySQL)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Koneksi: LAN stabil</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> IP Statis direkomendasikan</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-purple-600" />
                    <p className="font-bold text-gray-900">Client (PC Siswa)</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> OS: Windows 10/11</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Node.js v18+ (untuk agent)</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Terhubung ke jaringan LAN</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> IP statis atau DHCP reserved</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Firewall mengizinkan port 3001</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Admin privilege untuk agent</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Langkah Instalasi</h4>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Persiapan Jaringan',
                    desc: 'Pastikan semua komputer terhubung ke jaringan LAN yang sama. Atur IP address statis untuk server.',
                    code: '# Konfigurasi IP statis di server\nIP: 192.168.100.166\nSubnet: 255.255.255.0\nGateway: 192.168.100.1\nDNS: 8.8.8.8'
                  },
                  {
                    step: 2,
                    title: 'Install Node.js',
                    desc: 'Download dan install Node.js LTS dari nodejs.org di server dan semua PC siswa.',
                    code: '# Download dari: https://nodejs.org/\n# Pilih versi LTS (Long Term Support)\n\n# Verifikasi:\nnode --version\nnpm --version'
                  },
                  {
                    step: 3,
                    title: 'Setup Laragon (MySQL)',
                    desc: 'Install Laragon untuk MySQL database. Matikan Apache, hanya gunakan MySQL.',
                    code: '# Download Laragon dari: https://laragon.org/\n# Install dan start MySQL saja\n# Matikan Apache (tidak diperlukan)\n\n# Akses phpMyAdmin:\nhttp://localhost/phpmyadmin'
                  },
                  {
                    step: 4,
                    title: 'Setup Backend & Frontend',
                    desc: 'Ikuti panduan Setup Backend dan Setup Agent di section berikutnya.',
                    code: '# Backend:\ncd D:\\labmonitor-backend\nnpm install\nnpm run dev\n\n# Frontend:\ncd D:\\labmonitor-frontend\nnpm install\nnpm run dev'
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                        {item.step}
                      </div>
                      {item.step < 4 && <div className="w-0.5 flex-1 bg-green-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      <div className="mt-3 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre">{item.code}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-900">Tips Instalasi</p>
                    <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                      <li>• Gunakan IP statis untuk server agar tidak berubah</li>
                      <li>• Matikan firewall sementara saat instalasi agent</li>
                      <li>• Restart komputer setelah instalasi agent selesai</li>
                      <li>• Pastikan waktu (NTP) sinkron di semua komputer</li>
                      <li>• Backup database secara berkala</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Backend Setup */}
          <section id="guide-backend-setup" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">3. Setup Backend (Node.js + Express + Socket.io)</h3>
                  <p className="text-sm text-gray-600">Konfigurasi server backend dengan Laragon untuk MySQL</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Arsitektur Backend LabMonitor</p>
                    <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                      Backend LabMonitor menggunakan <strong>Node.js + Express + Socket.io</strong> untuk performa real-time terbaik.
                      <strong> Laragon</strong> digunakan khusus untuk <strong>MySQL database</strong> saja, bukan untuk web server.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Langkah Setup Backend</h4>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Create Backend Project',
                    desc: 'Buat folder backend dan install dependencies',
                    code: 'mkdir D:\\labmonitor-backend\ncd D:\\labmonitor-backend\nnpm init -y\n\n# Install dependencies\nnpm install express socket.io mysql2 cors dotenv bcryptjs jsonwebtoken\nnpm install --save-dev nodemon'
                  },
                  {
                    step: 2,
                    title: 'Setup Database',
                    desc: 'Buat database di phpMyAdmin dan jalankan schema SQL',
                    code: '-- Buka phpMyAdmin: http://localhost/phpmyadmin\n-- Buat database:\nCREATE DATABASE labmonitor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n\n-- Buat tabel: students, computers, activities, browser_tabs, alerts, users\n-- (Lihat dokumentasi lengkap untuk SQL schema)'
                  },
                  {
                    step: 3,
                    title: 'Configure Environment',
                    desc: 'Setup file .env dengan konfigurasi database dan server',
                    code: '# D:\\labmonitor-backend\\.env\n\nPORT=3001\nHOST=0.0.0.0\nNODE_ENV=development\n\nDB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=\nDB_NAME=labmonitor\n\nJWT_SECRET=your-secret-key-here\nCORS_ORIGIN=http://localhost:3000\nCORS_ORIGIN_NETWORK=http://192.168.100.166:3000'
                  },
                  {
                    step: 4,
                    title: 'Create Server Files',
                    desc: 'Buat struktur folder dan file server.js, routes, controllers',
                    code: '# Struktur folder:\nD:\\labmonitor-backend\\\n├── src\\\n│   ├── config\\database.js\n│   ├── routes\\ (computers, students, activities, alerts)\n│   ├── controllers\\\n│   ├── middleware\\\n│   └── server.js\n├── .env\n└── package.json'
                  },
                  {
                    step: 5,
                    title: 'Start Backend Server',
                    desc: 'Jalankan backend server',
                    code: 'cd D:\\labmonitor-backend\nnpm run dev\n\n# Output yang diharapkan:\n# 🚀 LabMonitor Backend Server v1.2.0\n# ✅ Socket.io ready for connections\n# ✅ Real-time connection tracking ENABLED\n# ✅ Auto-offline on disconnect ENABLED'
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                        {item.step}
                      </div>
                      {item.step < 5 && <div className="w-0.5 flex-1 bg-purple-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      <div className="mt-3 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre">{item.code}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Backend Setup Selesai!</p>
                    <p className="text-green-800 text-sm mt-2 leading-relaxed">
                      Backend Node.js + Express + Socket.io sudah siap digunakan dengan Laragon MySQL.
                      Server berjalan di port <strong>3001</strong> dan terhubung ke database MySQL di port <strong>3306</strong>.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">✅ Fitur Backend:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• REST API endpoints</li>
                          <li>• Socket.io real-time</li>
                          <li>• Database integration</li>
                          <li>• Connection tracking</li>
                          <li>• Auto-offline detection</li>
                        </ul>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">🔗 Akses URLs:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• API: http://localhost:3001</li>
                          <li>• Health: http://localhost:3001/health</li>
                          <li>• Agents: http://localhost:3001/api/connected-agents</li>
                          <li>• phpMyAdmin: http://localhost/phpmyadmin</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Agent Setup */}
          <section id="guide-agent-setup" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">4. Setup Agent Monitoring</h3>
                  <p className="text-sm text-gray-600">Install agent di PC siswa untuk monitoring real-time</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Apa itu Agent?</p>
                    <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                      Agent adalah program kecil yang diinstall di <strong>setiap PC siswa</strong>. Agent berjalan di background dan mengirim data monitoring (CPU, RAM, browser tabs) ke server secara real-time. Agent juga menerima perintah remote dari admin (shutdown, lock, block internet, mouse/keyboard control, dll).
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Fitur Agent</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Cpu, title: 'System Monitoring', desc: 'CPU, RAM, Network speed real-time', color: 'from-blue-500 to-cyan-600' },
                  { icon: Globe, title: 'Browser Monitoring', desc: 'Deteksi semua tab browser yang terbuka', color: 'from-green-500 to-emerald-600' },
                  { icon: MousePointer, title: 'Remote Control', desc: 'Terima kontrol mouse & keyboard dari admin', color: 'from-purple-500 to-pink-600' },
                  { icon: Camera, title: 'Screenshot Capture', desc: 'Ambil screenshot layar dan kirim ke dashboard', color: 'from-orange-500 to-red-600' },
                  { icon: Power, title: 'Auto-start', desc: 'Berjalan otomatis saat komputer boot', color: 'from-red-500 to-rose-600' },
                  { icon: Shield, title: 'Internet Control', desc: 'Block/unblock internet dengan whitelist', color: 'from-yellow-500 to-amber-600' },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Langkah Instalasi Agent</h4>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Copy Agent ke PC Siswa',
                    desc: 'Copy folder agent dari server ke setiap PC siswa',
                    code: '# Dari server admin, copy ke PC siswa via network share\n# Atau copy manual via USB flash drive\n\n# Contoh lokasi di PC siswa:\nC:\\labmonitor-agent\\\n├── src\\\n│   ├── agent.js\n│   ├── monitors\\\n│   ├── controllers\\\n│   ├── services\\\n│   └── utils\\\n├── package.json\n├── .env\n└── install-autostart.bat'
                  },
                  {
                    step: 2,
                    title: 'Install Dependencies',
                    desc: 'Install Node.js dependencies di PC siswa',
                    code: 'cd C:\\labmonitor-agent\nnpm install\n\n# Dependencies yang diinstall:\n# - socket.io-client (real-time communication)\n# - systeminformation (CPU, RAM monitoring)\n# - active-win (active window detection)\n# - node-windows (Windows Service)\n# - winston (logging)'
                  },
                  {
                    step: 3,
                    title: 'Konfigurasi Agent',
                    desc: 'Edit file .env dengan konfigurasi yang sesuai',
                    code: '# C:\\labmonitor-agent\\.env\n\n# Backend Server URL\nBACKEND_URL=http://192.168.100.166:3001\n\n# Computer ID (harus sama dengan database)\nCOMPUTER_ID=PC-13\n\n# Student ID\nSTUDENT_ID=LAB13\n\n# Monitoring intervals (milidetik)\nSYSTEM_MONITOR_INTERVAL=5000\nBROWSER_MONITOR_INTERVAL=10000\n\n# Logging\nLOG_LEVEL=info\nLOG_FILE=logs/agent.log'
                  },
                  {
                    step: 4,
                    title: 'Setup Auto-Start',
                    desc: 'Setup agent untuk berjalan otomatis saat boot',
                    code: '# Jalankan installer sebagai Administrator\n# Right-click install-autostart.bat → Run as administrator\n\n# Installer akan:\n# ✅ Cek Node.js installation\n# ✅ Install dependencies\n# ✅ Create Task Scheduler task\n# ✅ Configure auto-start\n# ✅ Test agent running\n# ✅ Create uninstaller\n\n# Agent akan auto-start setiap kali komputer boot'
                  },
                  {
                    step: 5,
                    title: 'Test Agent',
                    desc: 'Jalankan agent dan verifikasi koneksi',
                    code: 'cd C:\\labmonitor-agent\nnpm start\n\n# Output yang diharapkan:\n# 🚀 LabMonitor Agent Starting...\n# 🚀 Computer ID: PC-13\n# ✅ Connected to backend\n# ✅ Agent started successfully\n# ✅ Monitoring started\n# ✅ Remote command listener active\n# ✅ Screenshot listener active'
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                        {item.step}
                      </div>
                      {item.step < 5 && <div className="w-0.5 flex-1 bg-teal-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      <div className="mt-3 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre">{item.code}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Agent Setup Selesai!</p>
                    <p className="text-green-800 text-sm mt-2 leading-relaxed">
                      Agent sekarang berjalan di background dan mengirim data monitoring ke server secara real-time.
                      Agent akan otomatis start setiap kali komputer boot.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">✅ Data yang Dikirim:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• CPU & RAM usage (5 detik)</li>
                          <li>• Network speed (5 detik)</li>
                          <li>• Active application (5 detik)</li>
                          <li>• Browser tabs (10 detik)</li>
                          <li>• Screenshot (saat diminta)</li>
                        </ul>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">🎮 Remote Commands:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• Mouse control (move, click, scroll)</li>
                          <li>• Keyboard control (type, press keys)</li>
                          <li>• Shutdown / Restart</li>
                          <li>• Lock screen</li>
                          <li>• Block/unblock internet</li>
                          <li>• Screenshot capture</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Login */}
          <section id="guide-login" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">5. Login & Akun</h3>
                  <p className="text-sm text-gray-600">Masuk ke sistem dengan akun yang sesuai</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Untuk mengakses LabMonitor, buka browser dan masukkan alamat server. Anda akan melihat halaman login.
                Masukkan email dan password sesuai dengan role yang dimiliki.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Tipe Akun & Hak Akses</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Role</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Password</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Hak Akses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Admin</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">admin@labmonitor.local</td>
                      <td className="px-4 py-3 font-mono text-xs">admin123</td>
                      <td className="px-4 py-3 text-xs text-gray-700">Full access: monitoring, kontrol, konfigurasi</td>
                    </tr>
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Guru</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">guru@labmonitor.local</td>
                      <td className="px-4 py-3 font-mono text-xs">guru123</td>
                      <td className="px-4 py-3 text-xs text-gray-700">Monitoring + kontrol dasar (tanpa konfigurasi)</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">Viewer</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">viewer@labmonitor.local</td>
                      <td className="px-4 py-3 font-mono text-xs">viewer123</td>
                      <td className="px-4 py-3 text-xs text-gray-700">Hanya melihat (read-only)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Langkah Login</h4>
              <div className="space-y-3">
                {[
                  'Buka browser dan akses alamat server (misal: http://localhost:3000)',
                  'Masukkan email sesuai role Anda pada kolom "Email"',
                  'Masukkan password pada kolom "Password"',
                  'Klik tombol "Masuk" untuk masuk ke dashboard',
                  'Atau klik "Mode Demo" untuk mencoba tanpa login',
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Mode Demo</p>
                    <p className="text-green-800 text-sm mt-1">
                      Jika Anda ingin mencoba aplikasi tanpa login, klik tombol "Mode Demo (Tanpa Login)" di halaman login.
                      Semua fitur akan tersedia namun data bersifat simulasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Dashboard */}
          <section id="guide-dashboard" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">6. Dashboard</h3>
                  <p className="text-sm text-gray-600">Ringkasan monitoring secara keseluruhan</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Dashboard adalah halaman utama yang menampilkan ringkasan aktivitas lab komputer secara real-time.
                Semua informasi penting ditampilkan di satu tempat untuk memudahkan monitoring.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Komponen Dashboard</h4>
              <div className="space-y-4">
                {[
                  {
                    title: 'Kartu Statistik (4 Cards)',
                    items: ['Komputer Online - Jumlah PC yang aktif (real-time)', 'Siswa Aktif - Total siswa yang sedang menggunakan', 'Avg CPU Usage - Rata-rata penggunaan prosesor', 'Total Bandwidth - Penggunaan jaringan total'],
                    color: 'from-green-500 to-emerald-600',
                    icon: Cpu
                  },
                  {
                    title: 'Kategori Akses Internet',
                    items: ['Menampilkan persentase akses berdasarkan kategori', 'Edukasi, Media Sosial, Hiburan, Pencarian', 'Progress bar berwarna untuk setiap kategori'],
                    color: 'from-blue-500 to-cyan-600',
                    icon: Globe
                  },
                  {
                    title: 'Tabel Aktivitas Terbaru',
                    items: ['8 aktivitas browsing terakhir', 'Menampilkan waktu, siswa, website, dan kategori', 'Update otomatis secara real-time via Socket.io'],
                    color: 'from-orange-500 to-red-600',
                    icon: Eye
                  },
                  {
                    title: 'Status Sistem & Peringatan',
                    items: ['Ringkasan status: Online, Idle, Offline, Total', '5 peringatan terbaru dengan tingkat urgensi', 'Klik untuk melihat detail peringatan'],
                    color: 'from-purple-500 to-pink-600',
                    icon: AlertTriangle
                  },
                ].map((comp, idx) => {
                  const Icon = comp.icon;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`bg-gradient-to-r ${comp.color} px-5 py-3 flex items-center gap-3`}>
                        <Icon className="w-5 h-5 text-white" />
                        <p className="font-bold text-white">{comp.title}</p>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {comp.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Real-time Updates</p>
                    <p className="text-blue-800 text-sm mt-1">
                      Dashboard ter-update secara real-time via Socket.io. Data komputer, aktivitas, dan peringatan
                      akan otomatis refresh tanpa perlu manual refresh. Indicator "🟢 Live" di header menunjukkan koneksi aktif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Computers */}
          <section id="guide-computers" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">7. Monitor Komputer</h3>
                  <p className="text-sm text-gray-600">Melihat status semua komputer di lab</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Halaman Monitor Komputer menampilkan semua PC dalam bentuk grid. Setiap kartu menunjukkan status,
                penggunaan CPU, RAM, dan informasi siswa yang menggunakan. Status ter-update secara real-time.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Status Indikator (Real-time)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { status: 'Online', color: 'bg-green-500', bg: 'bg-green-50 border-green-200', desc: 'Aktif digunakan, agent connected' },
                  { status: 'Idle', color: 'bg-yellow-500', bg: 'bg-yellow-50 border-yellow-200', desc: 'Tidak ada aktivitas' },
                  { status: 'Offline', color: 'bg-gray-400', bg: 'bg-gray-50 border-gray-200', desc: 'Tidak terhubung, agent disconnect' },
                  { status: 'Locked', color: 'bg-red-500', bg: 'bg-red-50 border-red-200', desc: 'Terkunci oleh admin' },
                ].map((item) => (
                  <div key={item.status} className={`rounded-xl p-4 border ${item.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${item.color} ${item.status === 'Online' ? 'animate-pulse' : ''}`} />
                      <p className="font-bold text-gray-900 text-sm">{item.status}</p>
                    </div>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Real-time Connection Tracking</p>
                    <p className="text-blue-800 text-sm mt-1">
                      Status komputer ter-update secara real-time berdasarkan koneksi agent. Saat agent disconnect,
                      status otomatis berubah ke "offline" dalam 2-3 detik. Heartbeat timeout detection (60 detik)
                      memastikan status selalu akurat.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Filter Komputer</h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-3">Gunakan tombol filter di bagian atas untuk menyaring tampilan:</p>
                <div className="flex flex-wrap gap-2">
                  {['Semua', 'Online', 'Idle', 'Offline'].map((f) => (
                    <span key={f} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Detail Komputer</h4>
              <p className="text-sm text-gray-700">
                Klik pada kartu komputer untuk membuka panel detail yang berisi 3 tab:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { tab: 'Informasi', desc: 'IP, MAC, OS, uptime, CPU, RAM', icon: Eye },
                  { tab: 'Aktivitas', desc: 'Riwayat browsing dengan semua tab', icon: Globe },
                  { tab: 'Kontrol', desc: 'Remote control, screenshot, mouse/keyboard', icon: Shield },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.tab} className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-bold text-gray-900 text-sm">{t.tab}</p>
                      <p className="text-xs text-gray-600 mt-1">{t.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 8. Activity */}
          <section id="guide-activity" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">8. Aktivitas Internet</h3>
                  <p className="text-sm text-gray-600">Memantau akses internet siswa</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Halaman ini menampilkan semua aktivitas browsing siswa secara detail. Anda dapat mencari,
                memfilter, dan mengekspor data aktivitas.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Kategori Aktivitas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { cat: 'Edukasi', color: 'from-green-500 to-emerald-600', examples: 'ruangguru.com, zenius.net, github.com' },
                  { cat: 'Media Sosial', color: 'from-blue-500 to-cyan-600', examples: 'instagram.com, tiktok.com, twitter.com' },
                  { cat: 'Hiburan', color: 'from-purple-500 to-pink-600', examples: 'youtube.com, netflix.com, spotify.com' },
                  { cat: 'Pencarian', color: 'from-yellow-500 to-orange-600', examples: 'google.com, bing.com' },
                ].map((item) => (
                  <div key={item.cat} className="rounded-xl overflow-hidden border border-gray-200">
                    <div className={`bg-gradient-to-r ${item.color} px-4 py-3`}>
                      <p className="font-bold text-white text-sm">{item.cat}</p>
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs text-gray-600">{item.examples}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">🔍 Monitoring Semua Tab Browser</p>
                    <p className="text-blue-800 text-sm mt-2 leading-relaxed">
                      LabMonitor dapat mendeteksi <strong>semua tab browser</strong> yang dibuka siswa, bukan hanya tab yang sedang aktif! 
                      Badge <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs font-bold">+N tab</span> di kolom Website 
                      menunjukkan jumlah tab tambahan yang dibuka.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-bold text-blue-900 mb-2">📊 Di Tabel Aktivitas:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Menampilkan domain utama (tab aktif)</li>
                          <li>• Badge "+N tab" untuk tab tambahan</li>
                          <li>• Klik untuk lihat detail semua tab</li>
                        </ul>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-bold text-blue-900 mb-2">🖥️ Di Detail Komputer:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Daftar lengkap semua tab browser</li>
                          <li>• Indikator tab aktif (hijau + "AKTIF")</li>
                          <li>• Judul halaman & URL lengkap</li>
                          <li>• Durasi setiap tab dibuka</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Cara Menggunakan</h4>
              <div className="space-y-3">
                {[
                  { icon: Search, text: 'Gunakan kolom pencarian untuk mencari nama siswa atau website' },
                  { icon: Filter, text: 'Pilih filter kategori untuk menyaring berdasarkan jenis akses' },
                  { icon: Download, text: 'Klik tombol "Export Log" untuk mengunduh data aktivitas' },
                  { icon: Eye, text: 'Klik baris tabel untuk melihat detail aktivitas dengan semua tab' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 9. Alerts */}
          <section id="guide-alerts" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">9. Peringatan & Notifikasi</h3>
                  <p className="text-sm text-gray-600">Memantau alert dari aktivitas siswa</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Sistem akan memberikan peringatan otomatis ketika mendeteksi aktivitas yang mencurigakan
                atau melanggar aturan. Setiap alert memiliki tingkat urgensi yang berbeda.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Tingkat Peringatan</h4>
              <div className="space-y-3">
                {[
                  {
                    level: 'KRITIS (Danger)',
                    color: 'bg-red-100 border-red-300 text-red-900',
                    examples: ['Mencoba mengakses situs yang diblokir', 'Mencoba menginstal software tidak sah'],
                    action: 'Tindakan segera diperlukan'
                  },
                  {
                    level: 'PERINGATAN (Warning)',
                    color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
                    examples: ['Mengakses situs non-edukasi', 'Bandwidth usage tinggi'],
                    action: 'Perlu dipantau'
                  },
                  {
                    level: 'INFO',
                    color: 'bg-blue-100 border-blue-300 text-blue-900',
                    examples: ['Tidak aktif lebih dari 15 menit'],
                    action: 'Informasi saja'
                  },
                ].map((alert) => (
                  <div key={alert.level} className={`rounded-xl border-2 p-4 ${alert.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold">{alert.level}</p>
                      <span className="text-xs opacity-75">{alert.action}</span>
                    </div>
                    <ul className="space-y-1">
                      {alert.examples.map((ex, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Mengelola Alert</h4>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Badge Notifikasi</p>
                    <p className="text-xs text-gray-600 mt-1">Jumlah alert kritis ditampilkan di badge merah pada icon bell di header</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Filter className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Filter Alert</p>
                    <p className="text-xs text-gray-600 mt-1">Gunakan tombol filter: Semua, Kritis, Peringatan, Info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Tandai Selesai</p>
                    <p className="text-xs text-gray-600 mt-1">Klik icon centang untuk menandai alert sudah ditindaklanjuti</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Network */}
          <section id="guide-network" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">10. Peta Jaringan</h3>
                  <p className="text-sm text-gray-600">Visualisasi topologi jaringan LAN</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Halaman ini menampilkan visualisasi topologi jaringan lab komputer. Anda dapat melihat
                bagaimana setiap komputer terhubung ke server melalui switch utama.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Komponen Visualisasi</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Server Monitor', ip: '192.168.100.166', desc: 'Pusat monitoring & data collection', color: 'from-blue-500 to-cyan-600' },
                  { name: 'Switch Utama', ip: '48-Port Gigabit', desc: 'Penghubung semua komputer', color: 'from-purple-500 to-pink-600' },
                  { name: 'Client PCs', ip: '192.168.100.100-130', desc: '30 komputer siswa dengan agent', color: 'from-green-500 to-emerald-600' },
                ].map((item) => (
                  <div key={item.name} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className={`bg-gradient-to-r ${item.color} px-4 py-3 text-white`}>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs opacity-80">{item.ip}</p>
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Statistik Jaringan</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Node', value: '30', color: 'text-gray-900' },
                  { label: 'Aktif', value: 'Online', color: 'text-green-700' },
                  { label: 'Tidak Terhubung', value: 'Offline', color: 'text-gray-700' },
                  { label: 'Total Bandwidth', value: 'Mbps', color: 'text-blue-700' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. Remote Control */}
          <section id="guide-remote-control" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">11. Kontrol Remote</h3>
                  <p className="text-sm text-gray-600">Mengontrol mouse, keyboard, dan perintah lainnya</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Perhatian!</p>
                    <p className="text-red-800 text-sm mt-1">
                      Fitur kontrol remote hanya tersedia untuk role <strong>Admin</strong> dan <strong>Guru</strong>.
                      Gunakan dengan bijak dan bertanggung jawab. Agent harus running sebagai Administrator untuk full functionality.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">🎮 Remote Desktop Control</h4>
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                    <MousePointer className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-xl">Remote Desktop Control</p>
                      <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-bold">BARU!</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Fitur canggih untuk <strong>mengambil alih mouse cursor dan keyboard</strong> komputer siswa secara real-time. 
                      Guru dapat langsung mengontrol komputer siswa untuk membantu, memberikan contoh, atau mengawasi aktivitas.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Mode "Lihat Saja" (View Only)</h4>
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Auto-Screenshot Real-time</p>
                    <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                      Mode "Lihat Saja" sekarang menampilkan <strong>screenshot real-time</strong> dari layar komputer siswa.
                      Screenshot otomatis diambil setiap X detik (default: 3 detik) dan ditampilkan di dashboard.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-bold text-blue-900 mb-1">✅ Fitur:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Auto-screenshot setiap X detik</li>
                          <li>• Manual refresh button</li>
                          <li>• Pause/resume auto-capture</li>
                          <li>• Adjustable interval (1-10 detik)</li>
                        </ul>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-bold text-blue-900 mb-1">🎮 Kontrol:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Tombol Refresh (manual capture)</li>
                          <li>• Tombol Pause/Auto</li>
                          <li>• Dropdown interval</li>
                          <li>• Last capture time display</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Mode "Kontrol" (Mouse & Keyboard)</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MousePointer className="w-5 h-5 text-purple-600" />
                      <p className="font-bold text-gray-900">🖱️ Mouse Control</p>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Move Mouse</strong> - Gerakkan cursor di komputer siswa</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Click</strong> - Klik kiri/kanan/tengah</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Scroll</strong> - Scroll halaman</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Visual Feedback</strong> - Custom cursor dengan label</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Keyboard className="w-5 h-5 text-blue-600" />
                      <p className="font-bold text-gray-900">⌨️ Keyboard Control</p>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Type Text</strong> - Ketik teks di komputer siswa</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Press Keys</strong> - Enter, Tab, Escape, dll</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Key Combinations</strong> - Ctrl+C, Alt+Tab, dll</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <strong>Visual Feedback</strong> - Typing indicator</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900">Cara Menggunakan</p>
                      <ol className="text-yellow-800 text-sm mt-2 space-y-1 list-decimal list-inside">
                        <li>Klik komputer siswa → Tab "Kontrol" → "Remote Desktop Control"</li>
                        <li>Klik tombol "Mode Kontrol" (bukan "Lihat Saja")</li>
                        <li>Aktifkan "Mouse ON" dan/atau "Keyboard ON"</li>
                        <li>Gerakkan mouse atau ketik di area layar</li>
                        <li>Input akan terkirim ke komputer siswa secara real-time</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Perintah Lainnya</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Power, label: 'Shutdown', desc: 'Mematikan komputer secara remote', color: 'from-red-500 to-rose-600' },
                  { icon: RotateCcw, label: 'Restart', desc: 'Memuat ulang sistem operasi', color: 'from-orange-500 to-amber-600' },
                  { icon: Lock, label: 'Lock Screen', desc: 'Mengunci layar komputer', color: 'from-yellow-500 to-amber-600' },
                  { icon: Camera, label: 'Screenshot', desc: 'Ambil screenshot layar siswa', color: 'from-blue-500 to-cyan-600' },
                  { icon: Terminal, label: 'Kirim Pesan', desc: 'Mengirim pesan ke layar siswa', color: 'from-green-500 to-emerald-600' },
                  { icon: Shield, label: 'Blokir Internet', desc: 'Memutus akses internet (dengan whitelist)', color: 'from-purple-500 to-pink-600' },
                ].map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <div key={cmd.label} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`bg-gradient-to-r ${cmd.color} px-4 py-3 flex items-center gap-3`}>
                        <Icon className="w-5 h-5 text-white" />
                        <p className="font-bold text-white">{cmd.label}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700">{cmd.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 12. Screenshot */}
          <section id="guide-screenshot" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">12. Screenshot Dashboard</h3>
                  <p className="text-sm text-gray-600">Melihat layar komputer siswa secara real-time</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Fitur Screenshot Dashboard</p>
                    <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                      Fitur screenshot memungkinkan admin untuk <strong>melihat layar komputer siswa secara real-time</strong> langsung dari dashboard,
                      tanpa harus datang ke komputer siswa. Screenshot otomatis diambil dan ditampilkan di modal viewer.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Cara Menggunakan</h4>
              <div className="space-y-3">
                {[
                  'Buka dashboard admin (http://localhost:3000)',
                  'Klik komputer siswa yang ingin dilihat layarnya',
                  'Tab "Kontrol" → Klik "Lihat Layar" atau "Screenshot"',
                  'Tunggu 2-5 detik untuk screenshot pertama',
                  'Screenshot akan muncul otomatis di modal viewer',
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-600 to-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Fitur Screenshot Viewer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Camera, title: 'Auto-Capture', desc: 'Screenshot otomatis setiap X detik', color: 'from-blue-500 to-cyan-600' },
                  { icon: Download, title: 'Download', desc: 'Simpan screenshot ke komputer admin', color: 'from-green-500 to-emerald-600' },
                  { icon: Monitor, title: 'Fullscreen', desc: 'Lihat screenshot dalam layar penuh', color: 'from-purple-500 to-pink-600' },
                  { icon: Info, title: 'Info Lengkap', desc: 'Nama komputer, siswa, timestamp, ukuran', color: 'from-orange-500 to-red-600' },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Alur Data Screenshot</p>
                    <div className="text-green-800 text-sm mt-2 leading-relaxed space-y-2">
                      <p>1. Admin klik "Lihat Layar" di dashboard</p>
                      <p>2. Frontend emit <code className="bg-green-200 px-1 rounded text-xs">request-screenshot</code> via Socket.io</p>
                      <p>3. Backend terima & broadcast ke agent</p>
                      <p>4. Agent ambil screenshot → convert ke base64</p>
                      <p>5. Agent emit <code className="bg-green-200 px-1 rounded text-xs">screenshot-captured</code> ke backend</p>
                      <p>6. Backend broadcast ke frontend</p>
                      <p>7. Frontend terima & tampilkan di modal viewer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-900">Tips Penggunaan</p>
                    <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                      <li>• Screenshot pertama mungkin butuh 2-5 detik</li>
                      <li>• Gunakan interval 3-5 detik untuk monitoring normal</li>
                      <li>• Gunakan interval 1-2 detik untuk monitoring intensif</li>
                      <li>• Pause auto-capture jika tidak perlu untuk hemat bandwidth</li>
                      <li>• Download screenshot untuk dokumentasi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 13. Troubleshooting */}
          <section id="guide-troubleshooting" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">13. Troubleshooting</h3>
                  <p className="text-sm text-gray-600">Masalah umum dan cara mengatasinya</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <h4 className="font-bold text-gray-900 text-lg">Pertanyaan Umum (FAQ)</h4>
              <div className="space-y-3">
                {[
                  {
                    q: 'Komputer tidak muncul di dashboard?',
                    a: 'Pastikan agent LabMonitor berjalan di komputer tersebut. Cek koneksi LAN, pastikan IP address benar, dan restart agent jika perlu. Periksa juga apakah firewall memblokir port 3001.'
                  },
                  {
                    q: 'Status komputer tetap "online" meskipun agent sudah disconnect?',
                    a: 'Pastikan backend menggunakan versi v1.2.0 atau lebih baru yang memiliki real-time connection tracking. Restart backend untuk reset semua status ke offline.'
                  },
                  {
                    q: 'Agent tidak auto-start saat komputer boot?',
                    a: 'Jalankan install-autostart.bat sebagai Administrator. Ini akan membuat Task Scheduler task yang otomatis start agent saat boot. Verifikasi di Task Scheduler.'
                  },
                  {
                    q: 'Internet diblokir tapi agent tidak bisa connect ke server?',
                    a: 'Pastikan backend menggunakan versi terbaru dengan whitelist server IP. Agent akan otomatis whitelist IP server sebelum block internet. Cek firewall rules di PC siswa.'
                  },
                  {
                    q: 'Screenshot tidak muncul di dashboard?',
                    a: 'Pastikan agent running sebagai Administrator. Cek agent log untuk error screenshot. Pastikan PowerShell execution policy mengizinkan. Coba manual unblock jika perlu.'
                  },
                  {
                    q: 'Mouse/keyboard control tidak berfungsi?',
                    a: 'Agent harus running sebagai Administrator untuk mouse/keyboard control. Pastikan "Mode Kontrol" aktif (bukan "Lihat Saja"). Cek agent log untuk error PowerShell.'
                  },
                  {
                    q: 'Data CPU/RAM tidak update?',
                    a: 'Agent mungkin mengalami masalah koneksi. Coba restart service agent di komputer client. Pastikan interval pengiriman data tidak terlalu besar.'
                  },
                  {
                    q: 'Tidak bisa melakukan remote control?',
                    a: 'Pastikan Anda login dengan role Admin atau Guru. Role Viewer hanya bisa melihat data. Cek juga apakah agent di client mendukung fitur remote.'
                  },
                  {
                    q: 'Alert tidak muncul meskipun ada aktivitas mencurigakan?',
                    a: 'Periksa pengaturan rule alert di konfigurasi. Pastikan kategori situs sudah di-set dengan benar. Cek juga apakah notifikasi browser diizinkan.'
                  },
                  {
                    q: 'Halaman loading sangat lambat?',
                    a: 'Pastikan koneksi jaringan stabil. Jika jumlah komputer sangat banyak (>50), pertimbangkan untuk meningkatkan spesifikasi server atau mengoptimasi interval polling.'
                  },
                  {
                    q: 'Bagaimana cara menambah komputer baru?',
                    a: 'Instal agent LabMonitor di komputer baru, pastikan terhubung ke jaringan yang sama. Jalankan install-autostart.bat untuk auto-start. Komputer akan otomatis terdeteksi oleh server.'
                  },
                  {
                    q: 'IP server berubah-ubah, agent tidak bisa connect?',
                    a: 'Set IP statis di server atau gunakan DHCP reservation di router. Update BACKEND_URL di .env agent dengan IP baru. Restart agent setelah update.'
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="pl-8 border-l-2 border-amber-200 ml-2.5">
                          <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Emergency Recovery</h4>
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Jika Agent Tidak Bisa Connect Setelah Block Internet</p>
                    <p className="text-red-800 text-sm mt-2 leading-relaxed">
                      Jalankan <code className="bg-red-200 px-1.5 py-0.5 rounded text-xs font-mono">manual-unblock-internet.bat</code> di PC siswa sebagai Administrator.
                      Script ini akan menghapus semua firewall rules LabMonitor dan memulihkan koneksi internet.
                    </p>
                    <div className="mt-3 bg-white/60 rounded-lg p-3 border border-red-200">
                      <p className="text-xs font-bold text-red-900 mb-1">📋 Langkah Emergency:</p>
                      <ol className="text-xs text-red-800 space-y-1 list-decimal list-inside">
                        <li>Di PC siswa, buka Command Prompt sebagai Administrator</li>
                        <li>Navigate ke folder agent: <code className="bg-red-200 px-1 rounded">cd C:\labmonitor-agent</code></li>
                        <li>Jalankan: <code className="bg-red-200 px-1 rounded">manual-unblock-internet.bat</code></li>
                        <li>Tunggu script selesai (5-10 detik)</li>
                        <li>Agent akan auto-reconnect dalam 5-10 detik</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Perintah Diagnostik</h4>
              <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono space-y-2">
{`# Cek status agent
labmonitor-agent --status

# Cek koneksi ke server
ping 192.168.100.166

# Lihat log agent
type C:\\labmonitor-agent\\logs\\agent.log

# Restart agent
cd C:\\labmonitor-agent
npm start

# Cek port yang digunakan
netstat -ano | findstr :3001

# Test koneksi agent ke server
labmonitor-agent --test-connection

# Cek connected agents
curl http://localhost:3001/api/connected-agents

# Manual unblock internet (emergency)
C:\\labmonitor-agent\\manual-unblock-internet.bat

# Setup auto-start
C:\\labmonitor-agent\\install-autostart.bat

# Uninstall auto-start
C:\\labmonitor-agent\\uninstall-autostart.bat`}
                </pre>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Kontak Support</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Terminal className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Email Support</p>
                    <p className="text-xs text-gray-600 mt-1">support@labmonitor.local</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Response Time</p>
                    <p className="text-xs text-gray-600 mt-1">Maks. 1x24 jam kerja</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Keyboard className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Dokumentasi</p>
                    <p className="text-xs text-gray-600 mt-1">docs.labmonitor.local</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">LabMonitor</h4>
            </div>
            <p className="text-gray-400 text-sm">Sistem Monitoring Lab Komputer v1.2.0</p>
            <p className="text-gray-500 text-xs mt-2">© 2024 LabMonitor. Panduan penggunaan lengkap.</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✅ Real-time Monitoring</span>
              <span>✅ Mouse & Keyboard Control</span>
              <span>✅ Screenshot Dashboard</span>
              <span>✅ Agent Auto-Start</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
