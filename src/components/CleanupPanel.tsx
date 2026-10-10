import { useState, useEffect } from 'react';
import { Trash2, Database, HardDrive, AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
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
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Memuat statistik...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Trash2 className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Cleanup & Maintenance</h2>
            <p className="text-red-100 text-sm">Bersihkan data lama untuk mengoptimasi performa server</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-blue-600" />
              <span className="text-sm text-gray-600">Aktivitas</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activities.total}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activities.older_than_7_days} data &gt; 7 hari
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-purple-600" />
              <span className="text-sm text-gray-600">Browser Tabs</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.browser_tabs.total}</p>
            <p className="text-xs text-gray-500 mt-1">Tab browser terekam</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <span className="text-sm text-gray-600">Alerts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.alerts.total}</p>
            <p className="text-xs text-gray-500 mt-1">Notifikasi sistem</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">Database Size</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.database_size.total_mb} MB</p>
            <p className="text-xs text-gray-500 mt-1">Total ukuran database</p>
          </div>
        </div>
      )}

      {/* Cleanup Options */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Cleanup</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hapus aktivitas lebih lama dari (hari)
            </label>
            <input
              type="number"
              value={cleanupOptions.activities_days}
              onChange={(e) => setCleanupOptions({
                ...cleanupOptions,
                activities_days: parseInt(e.target.value) || 7
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="365"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hapus alerts lebih lama dari (hari)
            </label>
            <input
              type="number"
              value={cleanupOptions.alerts_days}
              onChange={(e) => setCleanupOptions({
                ...cleanupOptions,
                alerts_days: parseInt(e.target.value) || 30
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="365"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hapus screenshot lebih lama dari (hari)
            </label>
            <input
              type="number"
              value={cleanupOptions.screenshots_days}
              onChange={(e) => setCleanupOptions({
                ...cleanupOptions,
                screenshots_days: parseInt(e.target.value) || 7
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="365"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setShowConfirm('activities')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Bersihkan Aktivitas</span>
          </button>

          <button
            onClick={() => setShowConfirm('alerts')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Bersihkan Alerts</span>
          </button>

          <button
            onClick={() => setShowConfirm('screenshots')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HardDrive className="w-5 h-5" />
            <span>Bersihkan Screenshot</span>
          </button>

          <button
            onClick={() => setShowConfirm('all')}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Cleanup Semua</span>
          </button>
        </div>

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={cleaning}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Optimasi Database</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Konfirmasi Cleanup</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              {showConfirm === 'all' && 'Anda akan menghapus SEMUA data lama sesuai pengaturan. Tindakan ini tidak dapat dibatalkan!'}
              {showConfirm === 'activities' && `Anda akan menghapus aktivitas lebih lama dari ${cleanupOptions.activities_days} hari. Tindakan ini tidak dapat dibatalkan!`}
              {showConfirm === 'alerts' && `Anda akan menghapus alerts lebih lama dari ${cleanupOptions.alerts_days} hari. Tindakan ini tidak dapat dibatalkan!`}
              {showConfirm === 'screenshots' && `Anda akan menghapus screenshot lebih lama dari ${cleanupOptions.screenshots_days} hari. Tindakan ini tidak dapat dibatalkan!`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleCleanup(showConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Message */}
      {result && (
        <div className={`rounded-xl p-4 border ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? 'Cleanup Berhasil' : 'Cleanup Gagal'}
              </p>
              <p className={`text-sm mt-1 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
              {result.success && result.data && (
                <div className="mt-3 text-sm text-green-700">
                  {result.data.deleted_activities !== undefined && (
                    <p>• {result.data.deleted_activities} aktivitas dihapus</p>
                  )}
                  {result.data.deleted_browser_tabs !== undefined && (
                    <p>• {result.data.deleted_browser_tabs} browser tabs dihapus</p>
                  )}
                  {result.data.deleted_alerts !== undefined && (
                    <p>• {result.data.deleted_alerts} alerts dihapus</p>
                  )}
                  {result.data.deleted_screenshots !== undefined && (
                    <p>• {result.data.deleted_screenshots} screenshot dihapus</p>
                  )}
                  {result.data.freed_space_mb !== undefined && (
                    <p>• {result.data.freed_space_mb} MB ruang dibebaskan</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">Rekomendasi</p>
            <ul className="text-blue-800 text-sm mt-2 space-y-1">
              <li>• Jalankan cleanup secara berkala (mingguan/bulanan)</li>
              <li>• Gunakan "Cleanup Semua" untuk maintenance rutin</li>
              <li>• Optimasi database setelah cleanup untuk reclaim space</li>
              <li>• Backup database sebelum melakukan cleanup besar</li>
              <li>• Monitor ukuran database secara berkala</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
