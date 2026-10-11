import { useState, useEffect } from 'react';
import { Building2, User, Phone, Mail, MapPin, Save, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { AppProfile } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<AppProfile>({
    id: 1,
    school_name: '',
    school_address: '',
    school_phone: '',
    school_email: '',
    lab_head_name: '',
    lab_head_nip: '',
    lab_head_position: 'Kepala Laboratorium',
    logo_url: '',
    city: '',
    province: '',
    updated_at: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/profile`);
      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await axios.put(`${API_URL}/api/profile`, profile);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Gagal menyimpan profil' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, logo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Setting Profil Aplikasi</h2>
              <p className="text-blue-100 text-base mt-1">Konfigurasi data sekolah untuk laporan</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            Data ini akan digunakan pada KOP surat di laporan PDF monitoring lab komputer
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`rounded-2xl p-4 border-2 shadow-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          )}
          <p className={`font-semibold ${message.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Logo Upload Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Logo Sekolah
        </h3>
        
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <label className="block">
              <span className="sr-only">Pilih file logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Format: PNG, JPG, JPEG. Maksimal 2MB. Rekomendasi: 200x200px
            </p>
            {profile.logo_url && (
              <button
                onClick={() => setProfile({ ...profile, logo_url: '' })}
                className="text-sm text-red-600 hover:text-red-700 mt-2 font-semibold"
              >
                Hapus Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          Informasi Sekolah
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Sekolah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.school_name}
              onChange={(e) => setProfile({ ...profile, school_name: e.target.value })}
              placeholder="Contoh: SMA Negeri 1 Jakarta"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Alamat Sekolah <span className="text-red-500">*</span>
            </label>
            <textarea
              value={profile.school_address}
              onChange={(e) => setProfile({ ...profile, school_address: e.target.value })}
              placeholder="Contoh: Jl. Pendidikan No. 123, Jakarta Pusat"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kota/Kabupaten <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="Contoh: Jakarta"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.province}
              onChange={(e) => setProfile({ ...profile, province: e.target.value })}
              placeholder="Contoh: DKI Jakarta"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Telepon
            </label>
            <input
              type="text"
              value={profile.school_phone}
              onChange={(e) => setProfile({ ...profile, school_phone: e.target.value })}
              placeholder="Contoh: (021) 1234-5678"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={profile.school_email}
              onChange={(e) => setProfile({ ...profile, school_email: e.target.value })}
              placeholder="Contoh: info@sekolah.sch.id"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Lab Head Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" />
          Penanggung Jawab Laboratorium
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.lab_head_name}
              onChange={(e) => setProfile({ ...profile, lab_head_name: e.target.value })}
              placeholder="Contoh: Budi Santoso, S.Pd"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              NIP (Nomor Induk Pegawai)
            </label>
            <input
              type="text"
              value={profile.lab_head_nip}
              onChange={(e) => setProfile({ ...profile, lab_head_nip: e.target.value })}
              placeholder="Contoh: 196801011990031001"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.lab_head_position}
              onChange={(e) => setProfile({ ...profile, lab_head_position: e.target.value })}
              placeholder="Contoh: Kepala Laboratorium"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Preview KOP Surat
        </h3>
        
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-xl border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm font-bold text-gray-700">PEMERINTAH DAERAH</p>
              <p className="text-sm font-bold text-gray-700">DINAS PENDIDIKAN</p>
              <p className="text-lg font-bold text-gray-900">{profile.school_name || '[Nama Sekolah]'}</p>
              <p className="text-xs text-gray-600">{profile.school_address || '[Alamat Sekolah]'}</p>
              <p className="text-xs text-gray-600">
                {profile.school_phone && `Telp: ${profile.school_phone}`}
                {profile.school_phone && profile.school_email && ' | '}
                {profile.school_email && `Email: ${profile.school_email}`}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
          <div className="border-t-2 border-b-2 border-gray-800 py-1"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 italic">
            {profile.city || '[Kota]'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-sm font-semibold text-gray-700 mt-2">{profile.lab_head_position || '[Jabatan]'}</p>
          <div className="mt-12">
            <p className="text-sm font-semibold text-gray-700 underline">
              {profile.lab_head_name || '[Nama Penanggung Jawab]'}
            </p>
            <p className="text-xs text-gray-600">NIP. {profile.lab_head_nip || '[NIP]'}</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          {saving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Simpan Profil</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
