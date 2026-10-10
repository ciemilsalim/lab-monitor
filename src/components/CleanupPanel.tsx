import { useState, useEffect } from 'react';
import { Trash2, Database, HardDrive, AlertTriangle, CheckCircle, Loader, RefreshCw, Activity, Bell, Image, TrendingDown } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CleanupStats {
  activities: {
    total: number;
    older_than_7_days: number;
    older_than_30_days: number;
  };
  browser_tabs: {
    total: number;
  };
  alerts: {
    total: number;
  };
  database_size: {
    tables: any[];
    total_mb: string;
  };
}

interface CleanupResult {
  success: boolean;
  message: string;
  data?: any;
}

export default function CleanupPanel() {
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [cleanupOptions, setCleanupOptions] = useState({
    activities_days: 7,
    alerts_days: 30,
    screenshots_days: 7
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/cleanup/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async (type: string) => {
    setCleaning(true);
    setResult(null);
    
    try {
      let response;
      
      if (type === 'all') {
        response = await axios.delete(`${API_URL}/api/cleanup/all`, {
          data: cleanupOptions
        });
      } else if (type === 'activities') {
        response = await axios.delete(`${API_URL}/api/cleanup/activities`, {
          data: { days: cleanupOptions.activities_days }
        });
      } else if (type === 'alerts') {
        response = await axios.delete(`${API_URL}/api/cleanup/alerts`, {
          data: { days: cleanupOptions.alerts_days }
        });
      } else if (type === 'screenshots') {
        response = await axios.delete(`${API_URL}/api/cleanup/screenshots`, {
          data: { days: cleanupOptions.screenshots_days }
        });
      }
      
      if (response && response.data.success) {
        setResult({
          success: true,
          message: response.data.message,
          data: response.data.data
        });
        fetchStats();
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.error || error.message
      });
    } finally {
      setCleaning(false);
      setShowConfirm(null);
    }
  };

  const handleOptimize = async () => {
    setCleaning(true);
    setResult(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/cleanup/optimize`);
      
      if (response.data.success) {
        setResult({
          success: true,
          message: 'Database optimization completed'
        });
        fetchStats();
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.error || error.message
      });
    } finally {
      setCleaning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Memuat statistik database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Cleanup & Maintenance</h2>
              <p className="text-red-100 text-base mt-1">Bersihkan data lama untuk optimasi performa server</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <Database className="w-5 h-5" />
              <span className="text-sm font-semibold">{stats?.database_size.total_mb || '0'} MB</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-semibold">{stats?.activities.total || 0} Activities</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <Bell className="w-5 h-5" />
              <span className="text-sm font-semibold">{stats?.alerts.total || 0} Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activities.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Total Aktivitas</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-orange-600">{stats.activities.older_than_7_days}</span> data &gt; 7 hari
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.browser_tabs.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Browser Tabs</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Tab browser terekam
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.alerts.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Total Alerts</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Notifikasi sistem
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.database_size.total_mb}</p>
            <p className="text-sm text-gray-600 mt-1">Database Size</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                MB total ukuran
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cleanup Configuration */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Konfigurasi Cleanup</h3>
            <p className="text-sm text-gray-600">Atur periode data yang akan dihapus</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Activity className="w-4 h-4 inline mr-2" />
              Hapus aktivitas lebih lama dari
            </label>
            <div className="relative">
              <input
                type="number"
                value={cleanupOptions.activities_days}
                onChange={(e) => setCleanupOptions({
                  ...cleanupOptions,
                  activities_days: parseInt(e.target.value) || 7
                })}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="1"
                max="365"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">hari</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Bell className="w-4 h-4 inline mr-2" />
              Hapus alerts lebih lama dari
            </label>
            <div className="relative">
              <input
                type="number"
                value={cleanupOptions.alerts_days}
                onChange={(e) => setCleanupOptions({
                  ...cleanupOptions,
                  alerts_days: parseInt(e.target.value) || 30
                })}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="1"
                max="365"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">hari</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Image className="w-4 h-4 inline mr-2" />
              Hapus screenshot lebih lama dari
            </label>
            <div className="relative">
              <input
                type="number"
                value={cleanupOptions.screenshots_days}
                onChange={(e) => setCleanupOptions({
                  ...cleanupOptions,
                  screenshots_days: parseInt(e.target.value) || 7
                })}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="1"
                max="365"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">hari</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setShowConfirm('activities')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Activity className="w-5 h-5" />
            <span>Bersihkan Aktivitas</span>
          </button>

          <button
            onClick={() => setShowConfirm('alerts')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Bell className="w-5 h-5" />
            <span>Bersihkan Alerts</span>
          </button>

          <button
            onClick={() => setShowConfirm('screenshots')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Image className="w-5 h-5" />
            <span>Bersihkan Screenshot</span>
          </button>

          <button
            onClick={() => setShowConfirm('all')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Trash2 className="w-5 h-5" />
            <span>Cleanup Semua</span>
          </button>
        </div>

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={cleaning}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Optimasi Database</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Konfirmasi Cleanup</h3>
                <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {showConfirm === 'all' && (
                  <>
                    Anda akan menghapus <strong>SEMUA data lama</strong> sesuai pengaturan:
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Aktivitas &gt; {cleanupOptions.activities_days} hari</li>
                      <li>• Alerts &gt; {cleanupOptions.alerts_days} hari</li>
                      <li>• Screenshots &gt; {cleanupOptions.screenshots_days} hari</li>
                    </ul>
                  </>
                )}
                {showConfirm === 'activities' && (
                  <>Anda akan menghapus <strong>aktivitas browsing</strong> lebih lama dari <strong>{cleanupOptions.activities_days} hari</strong>. Data browser tabs terkait juga akan dihapus.</>
                )}
                {showConfirm === 'alerts' && (
                  <>Anda akan menghapus <strong>notifikasi/alerts</strong> lebih lama dari <strong>{cleanupOptions.alerts_days} hari</strong>.</>
                )}
                {showConfirm === 'screenshots' && (
                  <>Anda akan menghapus <strong>file screenshot</strong> lebih lama dari <strong>{cleanupOptions.screenshots_days} hari</strong>.</>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                disabled={cleaning}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => handleCleanup(showConfirm)}
                disabled={cleaning}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all font-semibold shadow-lg"
              >
                {cleaning ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Message */}
      {result && (
        <div className={`rounded-2xl p-6 border-2 shadow-lg ${
          result.success 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
        }`}>
          <div className="flex items-start gap-4">
            {result.success ? (
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="flex-1">
              <p className={`text-lg font-bold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? '✅ Cleanup Berhasil!' : '❌ Cleanup Gagal'}
              </p>
              <p className={`text-sm mt-1 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
              {result.success && result.data && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {result.data.deleted_activities !== undefined && (
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-700 font-semibold">Aktivitas Dihapus</p>
                      <p className="text-2xl font-bold text-green-900">{result.data.deleted_activities}</p>
                    </div>
                  )}
                  {result.data.deleted_browser_tabs !== undefined && (
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-700 font-semibold">Browser Tabs Dihapus</p>
                      <p className="text-2xl font-bold text-green-900">{result.data.deleted_browser_tabs}</p>
                    </div>
                  )}
                  {result.data.deleted_alerts !== undefined && (
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-700 font-semibold">Alerts Dihapus</p>
                      <p className="text-2xl font-bold text-green-900">{result.data.deleted_alerts}</p>
                    </div>
                  )}
                  {result.data.deleted_screenshots !== undefined && (
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-700 font-semibold">Screenshots Dihapus</p>
                      <p className="text-2xl font-bold text-green-900">{result.data.deleted_screenshots}</p>
                    </div>
                  )}
                  {result.data.freed_space_mb !== undefined && parseFloat(result.data.freed_space_mb) > 0 && (
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200 col-span-2">
                      <p className="text-xs text-green-700 font-semibold">Ruang Dibebaskan</p>
                      <p className="text-2xl font-bold text-green-900">{result.data.freed_space_mb} MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-blue-900 text-lg mb-3">💡 Rekomendasi</p>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Jalankan cleanup secara berkala (mingguan/bulanan) untuk menjaga performa</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Gunakan "Cleanup Semua" untuk maintenance rutin yang komprehensif</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Optimasi database setelah cleanup untuk reclaim space dan improve performance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Backup database sebelum melakukan cleanup besar untuk keamanan data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Monitor ukuran database secara berkala untuk mencegah pertumbuhan berlebihan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
