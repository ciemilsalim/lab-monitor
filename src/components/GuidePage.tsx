import { useState } from 'react';
import {
  BookOpen, Monitor, LogIn, LayoutDashboard, Globe, AlertTriangle,
  Network, Shield, Settings, Download, Server, ChevronRight, ChevronDown,
  CheckCircle2, Info, Lightbulb, Wrench, Terminal, Users, Cpu,
  HardDrive, Wifi, Eye, Lock, Power, RotateCcw, Search, Filter,
  Bell, MousePointer, Keyboard, Zap, HelpCircle
} from 'lucide-react';

// MousePointer already imported above

type GuideSection =
  | 'overview'
  | 'installation'
  | 'login'
  | 'dashboard'
  | 'computers'
  | 'activity'
  | 'alerts'
  | 'network'
  | 'controls'
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
  { id: 'login', label: 'Login & Akun', icon: LogIn, sub: 'Masuk ke sistem' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Ringkasan monitoring' },
  { id: 'computers', label: 'Monitor Komputer', icon: Monitor, sub: 'Lihat semua PC' },
  { id: 'activity', label: 'Aktivitas Internet', icon: Globe, sub: 'Pantau browsing' },
  { id: 'alerts', label: 'Peringatan', icon: AlertTriangle, sub: 'Notifikasi & alert' },
  { id: 'network', label: 'Peta Jaringan', icon: Network, sub: 'Topologi LAN' },
  { id: 'controls', label: 'Kontrol Remote', icon: Shield, sub: 'Remote control PC' },
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
                <p className="text-blue-100 text-sm mt-1">LabMonitor - Sistem Monitoring Lab Komputer</p>
              </div>
            </div>
            <p className="text-blue-100 max-w-2xl mt-4 leading-relaxed">
              Panduan lengkap mulai dari instalasi, konfigurasi, hingga cara menggunakan seluruh fitur aplikasi.
              Ikuti langkah-langkah berikut untuk mengoptimalkan penggunaan LabMonitor di lab komputer Anda.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Versi 1.0.0</span>
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
                      memantau aktivitas siswa, mengontrol komputer dari jarak jauh, dan mengelola jaringan LAN secara terpusat.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Fitur Utama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Monitor, title: 'Monitoring Real-time', desc: 'Pantau status CPU, RAM, dan jaringan setiap komputer secara langsung', color: 'from-green-500 to-emerald-600' },
                  { icon: Globe, title: 'Monitoring Browsing', desc: 'Lihat aktivitas internet siswa dengan kategori otomatis', color: 'from-blue-500 to-cyan-600' },
                  { icon: Shield, title: 'Remote Control', desc: 'Shutdown, restart, lock screen, dan blokir internet dari jarak jauh', color: 'from-purple-500 to-pink-600' },
                  { icon: AlertTriangle, title: 'Sistem Alert', desc: 'Notifikasi otomatis untuk aktivitas mencurigakan', color: 'from-orange-500 to-red-600' },
                  { icon: Network, title: 'Peta Jaringan', desc: 'Visualisasi topologi jaringan LAN lab komputer', color: 'from-indigo-500 to-blue-600' },
                  { icon: Users, title: 'Multi-User', desc: 'Dukungan untuk admin, guru, dan viewer dengan hak akses berbeda', color: 'from-teal-500 to-cyan-600' },
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
                    <p className="font-bold">🖥️ Server Monitor</p>
                    <p className="text-xs text-blue-100">192.168.1.1</p>
                  </div>
                  <div className="w-0.5 h-6 bg-gray-600" />
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-center">
                    <p className="font-bold">📡 Switch Utama (48-Port)</p>
                    <p className="text-xs text-purple-100">Gigabit Ethernet</p>
                  </div>
                  <div className="w-0.5 h-6 bg-gray-600" />
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold">PC-{String(i + 1).padStart(2, '0')}</p>
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
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Browser: Chrome/Firefox/Edge terbaru</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Koneksi: LAN stabil ke semua PC</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Resolusi: Minimal 1366x768</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-purple-600" />
                    <p className="font-bold text-gray-900">Client (PC Siswa)</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> OS: Windows 10/11</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Agent LabMonitor terinstal</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Terhubung ke jaringan LAN</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> IP statis atau DHCP reserved</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Firewall mengizinkan port 8080</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Langkah Instalasi</h4>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Persiapan Jaringan',
                    desc: 'Pastikan semua komputer terhubung ke jaringan LAN yang sama. Atur IP address statis atau DHCP reservation untuk setiap PC.',
                    code: '# Contoh konfigurasi IP statis\nIP: 192.168.1.100 - 192.168.1.130\nSubnet: 255.255.255.0\nGateway: 192.168.1.1\nDNS: 8.8.8.8'
                  },
                  {
                    step: 2,
                    title: 'Instalasi Agent di PC Client',
                    desc: 'Download dan instal LabMonitor Agent di setiap komputer siswa. Agent akan berjalan di background dan mengirim data ke server.',
                    code: '# Download agent dari server\nwget http://192.168.1.1/agent/installer.exe\n\n# Jalankan installer\ninstaller.exe --server=192.168.1.1 --port=8080'
                  },
                  {
                    step: 3,
                    title: 'Konfigurasi Server',
                    desc: 'Buka browser di komputer admin dan akses alamat server. Login dengan kredensial yang telah dibuat.',
                    code: '# Akses via browser\nhttp://192.168.1.1:3000\n\n# Atau gunakan hostname\nhttp://labmonitor.local'
                  },
                  {
                    step: 4,
                    title: 'Verifikasi Koneksi',
                    desc: 'Pastikan semua komputer muncul di dashboard dengan status "Online". Agent akan otomatis terhubung ke server.',
                    code: '# Cek status agent di client\nlabmonitor-agent --status\n\n# Output yang diharapkan:\n# Status: Connected\n# Server: 192.168.1.1:8080\n# Last heartbeat: 2 seconds ago'
                  },
                  {
                    step: 5,
                    title: 'Konfigurasi Auto-Start (Penting!)',
                    desc: 'Agar agent otomatis berjalan setiap kali komputer di-restart, aktifkan service agent. Tanpa langkah ini, agent harus dijalankan manual setiap kali komputer menyala.',
                    code: '# Windows - Daftarkan sebagai Service (otomatis start)\nlabmonitor-agent --install-service\n\n# Verifikasi service terdaftar\nsc query LabMonitorAgent\n\n# Aktifkan auto-start\nsc config LabMonitorAgent start= auto\n\n# Untuk Linux (systemd)\nsudo systemctl enable labmonitor-agent\nsudo systemctl start labmonitor-agent\n\n# Cek status service\nsudo systemctl status labmonitor-agent'
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                        {item.step}
                      </div>
                      {item.step < 5 && <div className="w-0.5 flex-1 bg-green-200 mt-2" />}
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
                      <li>• Gunakan IP statis untuk menghindari perubahan alamat</li>
                      <li>• Matikan firewall sementara saat instalasi agent</li>
                      <li>• Restart komputer setelah instalasi agent selesai</li>
                      <li>• Pastikan waktu (NTP) sinkron di semua komputer</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Auto-Start Setelah Restart</p>
                    <p className="text-green-800 text-sm mt-2 leading-relaxed">
                      Setelah menjalankan perintah <code className="bg-green-200 px-1.5 py-0.5 rounded text-xs font-mono">labmonitor-agent --install-service</code>, 
                      agent akan <strong>otomatis berjalan setiap kali komputer di-restart</strong> tanpa perlu login atau intervensi manual. 
                      Agent berjalan sebagai <em>Windows Service</em> (di Windows) atau <em>systemd service</em> (di Linux) yang dimulai sebelum user login.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">✅ Setelah Auto-Start Aktif:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• Agent start otomatis saat boot</li>
                          <li>• Berjalan di background (tanpa window)</li>
                          <li>• Auto-reconnect jika koneksi putus</li>
                          <li>• Tidak perlu login user</li>
                        </ul>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-1">⚙️ Cara Verifikasi:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• Buka Task Manager → Services</li>
                          <li>• Cari "LabMonitorAgent"</li>
                          <li>• Status harus "Running"</li>
                          <li>• Startup Type: "Automatic"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Login */}
          <section id="guide-login" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">3. Login & Akun</h3>
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
                  'Buka browser dan akses alamat server (misal: http://192.168.1.1:3000)',
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

          {/* 4. Dashboard */}
          <section id="guide-dashboard" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">4. Dashboard</h3>
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
                    items: ['Komputer Online - Jumlah PC yang aktif', 'Siswa Aktif - Total siswa yang sedang menggunakan', 'Avg CPU Usage - Rata-rata penggunaan prosesor', 'Total Bandwidth - Penggunaan jaringan total'],
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
                    items: ['8 aktivitas browsing terakhir', 'Menampilkan waktu, siswa, website, dan kategori', 'Update otomatis secara real-time'],
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
            </div>
          </section>

          {/* 5. Computers */}
          <section id="guide-computers" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">5. Monitor Komputer</h3>
                  <p className="text-sm text-gray-600">Melihat status semua komputer di lab</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Halaman Monitor Komputer menampilkan semua PC dalam bentuk grid. Setiap kartu menunjukkan status,
                penggunaan CPU, RAM, dan informasi siswa yang menggunakan.
              </p>

              <h4 className="font-bold text-gray-900 text-lg">Status Indikator</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { status: 'Online', color: 'bg-green-500', bg: 'bg-green-50 border-green-200', desc: 'Aktif digunakan' },
                  { status: 'Idle', color: 'bg-yellow-500', bg: 'bg-yellow-50 border-yellow-200', desc: 'Tidak ada aktivitas' },
                  { status: 'Offline', color: 'bg-gray-400', bg: 'bg-gray-50 border-gray-200', desc: 'Tidak terhubung' },
                  { status: 'Locked', color: 'bg-red-500', bg: 'bg-red-50 border-red-200', desc: 'Terkunci' },
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
                  { tab: 'Aktivitas', desc: 'Riwayat browsing siswa', icon: Globe },
                  { tab: 'Kontrol', desc: 'Remote control & perintah', icon: Shield },
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

          {/* 6. Activity */}
          <section id="guide-activity" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">6. Aktivitas Internet</h3>
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

              <h4 className="font-bold text-gray-900 text-lg">Cara Menggunakan</h4>
              <div className="space-y-3">
                {[
                  { icon: Search, text: 'Gunakan kolom pencarian untuk mencari nama siswa atau website' },
                  { icon: Filter, text: 'Pilih filter kategori untuk menyaring berdasarkan jenis akses' },
                  { icon: Download, text: 'Klik tombol "Export Log" untuk mengunduh data aktivitas' },
                  { icon: MousePointer, text: 'Klik baris tabel untuk melihat detail aktivitas' },
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
            </div>
          </section>

          {/* 7. Alerts */}
          <section id="guide-alerts" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">7. Peringatan & Notifikasi</h3>
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
                    iconColor: 'text-red-600',
                    examples: ['Mencoba mengakses situs yang diblokir', 'Mencoba menginstal software tidak sah'],
                    action: 'Tindakan segera diperlukan'
                  },
                  {
                    level: 'PERINGATAN (Warning)',
                    color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
                    iconColor: 'text-yellow-600',
                    examples: ['Mengakses situs non-edukasi', 'Bandwidth usage tinggi'],
                    action: 'Perlu dipantau'
                  },
                  {
                    level: 'INFO',
                    color: 'bg-blue-100 border-blue-300 text-blue-900',
                    iconColor: 'text-blue-600',
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

          {/* 8. Network */}
          <section id="guide-network" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">8. Peta Jaringan</h3>
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
                  { name: 'Server Monitor', ip: '192.168.1.1', desc: 'Pusat monitoring & data collection', color: 'from-blue-500 to-cyan-600' },
                  { name: 'Switch Utama', ip: '48-Port Gigabit', desc: 'Penghubung semua komputer', color: 'from-purple-500 to-pink-600' },
                  { name: 'Client PCs', ip: '192.168.1.100-130', desc: '30 komputer siswa', color: 'from-green-500 to-emerald-600' },
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

          {/* 9. Controls */}
          <section id="guide-controls" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">9. Kontrol Remote</h3>
                  <p className="text-sm text-gray-600">Mengontrol komputer dari jarak jauh</p>
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
                      Gunakan dengan bijak dan bertanggung jawab.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Perintah yang Tersedia</h4>
              
              {/* Remote Desktop Control - Featured */}
              <div className="mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                    <MousePointer className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-xl">🎮 Remote Desktop Control</p>
                      <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-bold">BARU!</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Fitur canggih untuk <strong>mengambil alih mouse cursor dan keyboard</strong> komputer siswa secara real-time. 
                      Guru dapat langsung mengontrol komputer siswa untuk membantu, memberikan contoh, atau mengawasi aktivitas.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="font-bold text-sm mb-1">🖱️ Kontrol Mouse</p>
                        <p className="text-xs text-white/80">Gerakkan cursor, klik, drag & drop</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="font-bold text-sm mb-1">⌨️ Kontrol Keyboard</p>
                        <p className="text-xs text-white/80">Ketik teks, kirim shortcut keys</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <p className="font-bold text-sm mb-1">👁️ Lihat Saja</p>
                        <p className="text-xs text-white/80">Monitor tanpa mengontrol</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Power, label: 'Shutdown', desc: 'Mematikan komputer secara remote', color: 'from-red-500 to-rose-600', warning: 'Data yang belum disimpan akan hilang' },
                  { icon: RotateCcw, label: 'Restart', desc: 'Memuat ulang sistem operasi', color: 'from-orange-500 to-amber-600', warning: 'Sama seperti restart manual' },
                  { icon: Lock, label: 'Lock Screen', desc: 'Mengunci layar komputer', color: 'from-yellow-500 to-amber-600', warning: 'Siswa harus memasukkan password' },
                  { icon: Eye, label: 'Lihat Layar', desc: 'Melihat tampilan layar siswa', color: 'from-blue-500 to-cyan-600', warning: 'Real-time screen viewing' },
                  { icon: Terminal, label: 'Kirim Pesan', desc: 'Mengirim pesan ke layar siswa', color: 'from-green-500 to-emerald-600', warning: 'Pesan muncul sebagai notifikasi' },
                  { icon: Shield, label: 'Blokir Internet', desc: 'Memutus akses internet komputer', color: 'from-purple-500 to-pink-600', warning: 'Hanya internet, LAN tetap aktif' },
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
                        <p className="text-xs text-gray-500 mt-2 italic">⚠️ {cmd.warning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Cara Menggunakan Remote Desktop Control</h4>
              <div className="space-y-3 mb-6">
                {[
                  'Buka halaman "Komputer" dari sidebar',
                  'Klik pada komputer siswa yang ingin dikontrol',
                  'Pilih tab "Kontrol" pada panel detail',
                  'Klik tombol besar "🎮 Remote Desktop Control"',
                  'Pilih mode: "Lihat Saja" atau "Mode Kontrol"',
                  'Jika Mode Kontrol: aktifkan Mouse dan/atau Keyboard',
                  'Gunakan mouse untuk menggerakkan cursor di layar siswa',
                  'Gunakan keyboard untuk mengetik atau kirim shortcut keys',
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 text-lg">Cara Menggunakan Perintah Lainnya</h4>
              <div className="space-y-3">
                {[
                  'Buka halaman "Komputer" dari sidebar',
                  'Klik pada komputer yang ingin dikontrol',
                  'Pilih tab "Kontrol" pada panel detail',
                  'Klik tombol perintah yang diinginkan',
                  'Konfirmasi akan muncul untuk perintah kritis (Shutdown/Restart)',
                  'Tunggu feedback "Perintah berhasil dikirim"',
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 10. Troubleshooting */}
          <section id="guide-troubleshooting" className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">10. Troubleshooting</h3>
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
                    a: 'Pastikan agent LabMonitor berjalan di komputer tersebut. Cek koneksi LAN, pastikan IP address benar, dan restart agent jika perlu. Periksa juga apakah firewall memblokir port 8080.'
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
                    a: 'Instal agent LabMonitor di komputer baru, pastikan terhubung ke jaringan yang sama. Komputer akan otomatis terdeteksi oleh server dalam waktu 30 detik.'
                  },
                  {
                    q: 'Agent tidak otomatis berjalan setelah komputer restart?',
                    a: 'Pastikan Anda sudah menjalankan perintah "labmonitor-agent --install-service" dan mengonfigurasi startup type ke "Automatic". Buka Services (services.msc), cari "LabMonitorAgent", pastikan Startup Type = Automatic dan Status = Running. Jika masih bermasalah, jalankan "sc config LabMonitorAgent start= auto" di Command Prompt (Admin).'
                  },
                  {
                    q: 'Agent berjalan tapi tidak terkoneksi ke server setelah restart?',
                    a: 'Kemungkinan server belum siap saat agent start. Agent memiliki mekanisme auto-reconnect yang akan mencoba setiap 30 detik. Jika setelah 5 menit masih tidak terhubung, restart service agent dengan perintah "net stop LabMonitorAgent && net start LabMonitorAgent".'
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

              <h4 className="font-bold text-gray-900 text-lg">Perintah Diagnostik</h4>
              <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono space-y-2">
{`# Cek status agent
labmonitor-agent --status

# Cek koneksi ke server
ping 192.168.1.1

# Lihat log agent
labmonitor-agent --log --last 50

# Restart agent
labmonitor-agent --restart

# Cek port yang digunakan
netstat -tlnp | grep 8080

# Test koneksi agent ke server
labmonitor-agent --test-connection`}
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
            <p className="text-gray-400 text-sm">Sistem Monitoring Lab Komputer v1.0.0</p>
            <p className="text-gray-500 text-xs mt-2">© 2024 LabMonitor. Panduan penggunaan lengkap.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
