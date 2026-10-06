import { useState } from 'react';
import { Search, Download, TrendingUp } from 'lucide-react';
import { BrowsingActivity } from '../types';

interface ActivityMonitorProps {
  activities: BrowsingActivity[];
}

export default function ActivityMonitor({ activities }: ActivityMonitorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'educational': return 'from-green-500 to-emerald-600';
      case 'social-media': return 'from-blue-500 to-cyan-600';
      case 'entertainment': return 'from-purple-500 to-pink-600';
      case 'search-engine': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'educational': return 'Edukasi';
      case 'social-media': return 'Media Sosial';
      case 'entertainment': return 'Hiburan';
      case 'search-engine': return 'Pencarian';
      default: return 'Lainnya';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === '' ||
      activity.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Monitor Aktivitas Internet</h2>
          <p className="text-gray-600 text-sm mt-1">Pantau semua akses internet siswa</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg active:scale-95 transition-all">
          <Download className="w-4 h-4 inline mr-2" />
          Export Log
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari siswa atau website..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium"
          >
            <option value="all">Semua Kategori</option>
            <option value="educational">Edukasi</option>
            <option value="social-media">Media Sosial</option>
            <option value="entertainment">Hiburan</option>
            <option value="search-engine">Pencarian</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <span className="text-sm font-semibold text-gray-700">
            Menampilkan <strong className="text-blue-600">{filteredActivities.length}</strong> aktivitas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Waktu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Siswa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Komputer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Website</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Durasi</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.slice(0, 50).map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                    {activity.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{activity.studentName}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-xs">{activity.computerId}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">{activity.domain}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(activity.category)} shadow-md`}>
                      {getCategoryLabel(activity.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {activity.duration >= 60 ? `${Math.floor(activity.duration / 60)}m` : `${activity.duration}s`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
