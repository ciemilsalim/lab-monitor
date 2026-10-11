import { useState, useEffect } from 'react';
import { FileText, Calendar, Download, Loader, Printer } from 'lucide-react';
import axios from 'axios';

// Dynamic import untuk pdfmake
let pdfMake: any = null;
let pdfFonts: any = null;

const loadPdfMake = async () => {
  if (!pdfMake) {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    pdfMake = pdfMakeModule.default || pdfMakeModule;
    pdfFonts = pdfFontsModule.default || pdfFontsModule;
    pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;
  }
  return pdfMake;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ReportData {
  activities: Array<{
    id: number;
    timestamp: string;
    student_name: string;
    computer_id: string;
    domain: string;
    category: string;
    duration: number;
    is_violation: boolean;
  }>;
  summary: {
    total_activities: number;
    total_violations: number;
    total_students: number;
    total_computers: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  profile: {
    school_name: string;
    school_address: string;
    school_phone: string;
    school_email: string;
    lab_head_name: string;
    lab_head_nip: string;
    lab_head_position: string;
    logo_url: string;
    city: string;
    province: string;
  } | null;
}

export default function ReportGenerator() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/reports/monitoring`, {
        params: {
          start_date: dateRange.start,
          end_date: dateRange.end
        }
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert('Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!reportData) {
      alert('Silakan ambil data laporan terlebih dahulu');
      return;
    }

    setGenerating(true);

    try {
      // Load pdfMake dynamically
      await loadPdfMake();
      // Format tanggal
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      };

      const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} detik`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} jam ${remainingMinutes} menit`;
      };

      // Get profile data
      const profile = reportData.profile;
      
      // KOP Laporan
      const headerContent = [
        {
          columns: [
            {
              width: 80,
              stack: profile?.logo_url ? [
                { image: profile.logo_url, width: 70, height: 70 }
              ] : [
                { text: 'LOGO', style: 'logoPlaceholder' }
              ]
            },
            {
              width: '*',
              stack: [
                { text: 'PEMERINTAH DAERAH', style: 'kopTitle1' },
                { text: 'DINAS PENDIDIKAN', style: 'kopTitle2' },
                { text: profile?.school_name || 'SMA NEGERI 1 CONTOH', style: 'kopTitle3' },
                { text: profile?.school_address || 'Jl. Pendidikan No. 123, Kota Contoh, Provinsi 12345', style: 'kopAddress' },
                { text: `${profile?.school_phone ? `Telp: ${profile.school_phone}` : 'Telp: (021) 1234-5678'}${profile?.school_email ? ` | Email: ${profile.school_email}` : ' | Email: info@sman1contoh.sch.id'}`, style: 'kopContact' }
              ]
            }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2, lineColor: '#000' }] },
        { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 1, lineColor: '#000' }] },
        { text: ' ', margin: [0, 5, 0, 0] }
      ];

      // Judul Laporan
      const titleContent = [
        { text: 'LAPORAN MONITORING LAB KOMPUTER', style: 'reportTitle' },
        { text: `Periode: ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`, style: 'reportPeriod' },
        { text: ' ', margin: [0, 10, 0, 0] }
      ];

      // Ringkasan
      const summaryContent = [
        { text: 'RINGKASAN', style: 'sectionTitle' },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              ['Total Aktivitas', reportData.summary.total_activities.toString()],
              ['Total Pelanggaran', reportData.summary.total_violations.toString()],
              ['Total Siswa', reportData.summary.total_students.toString()],
              ['Total Komputer', reportData.summary.total_computers.toString()]
            ].map(row => [
              { text: row[0], style: 'summaryLabel' },
              { text: row[1], style: 'summaryValue' }
            ])
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#ccc',
            vLineColor: () => '#ccc'
          }
        },
        { text: ' ', margin: [0, 10, 0, 0] }
      ];

      // Tabel Detail Aktivitas
      const detailContent = [
        { text: 'DETAIL AKTIVITAS SISWA', style: 'sectionTitle' },
        {
          table: {
            headerRows: 1,
            widths: [30, 80, 70, 120, 60, 60, 95],
            body: [
              [
                { text: 'No', style: 'tableHeader' },
                { text: 'Tanggal/Waktu', style: 'tableHeader' },
                { text: 'Nama Siswa', style: 'tableHeader' },
                { text: 'Komputer', style: 'tableHeader' },
                { text: 'Durasi', style: 'tableHeader' },
                { text: 'Website', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
              ],
              ...reportData.activities.map((activity, index) => [
                { text: (index + 1).toString(), style: 'tableCell' },
                { text: `${formatDate(activity.timestamp)}\n${formatTime(activity.timestamp)}`, style: 'tableCell' },
                { text: activity.student_name, style: 'tableCell' },
                { text: activity.computer_id, style: 'tableCell' },
                { text: formatDuration(activity.duration), style: 'tableCell' },
                { text: activity.domain, style: 'tableCell' },
                { 
                  text: activity.is_violation ? 'PELANGGARAN' : 'Normal',
                  style: activity.is_violation ? 'violationCell' : 'normalCell'
                }
              ])
            ]
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#ccc',
            vLineColor: () => '#ccc'
          }
        }
      ];

      // Footer
      const footerContent = [
        { text: ' ', margin: [0, 20, 0, 0] },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              stack: [
                { text: `${profile?.city || 'Kota Contoh'}, ${formatDate(new Date().toISOString())}`, alignment: 'center' },
                { text: profile?.lab_head_position || 'Kepala Laboratorium', alignment: 'center', margin: [0, 5, 0, 40] },
                { text: profile?.lab_head_name || '(___________________)', alignment: 'center', bold: true },
                { text: `NIP. ${profile?.lab_head_nip || '123456789012345678'}`, alignment: 'center' }
              ]
            }
          ]
        }
      ];

      // Document Definition
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        
        header: (current: number, pageCount: number) => {
          if (current === 1) return null;
          return {
            columns: [
              { text: 'Laporan Monitoring Lab Komputer', style: 'headerText' },
              { text: `Halaman ${current} dari ${pageCount}`, style: 'headerPage' }
            ],
            margin: [40, 20, 40, 0]
          };
        },
        
        footer: (current: number, pageCount: number) => {
          return {
            text: `Dicetak pada: ${new Date().toLocaleString('id-ID')} | Halaman ${current} dari ${pageCount}`,
            alignment: 'center',
            style: 'footerText',
            margin: [0, 20, 0, 0]
          };
        },
        
        content: [
          ...headerContent,
          ...titleContent,
          ...summaryContent,
          ...detailContent,
          ...footerContent
        ],
        
        styles: {
          kopTitle1: {
            fontSize: 12,
            bold: true,
            alignment: 'center'
          },
          kopTitle2: {
            fontSize: 14,
            bold: true,
            alignment: 'center'
          },
          kopTitle3: {
            fontSize: 16,
            bold: true,
            alignment: 'center'
          },
          kopAddress: {
            fontSize: 10,
            alignment: 'center',
            margin: [0, 2, 0, 0]
          },
          kopContact: {
            fontSize: 9,
            alignment: 'center',
            margin: [0, 2, 0, 0]
          },
          logoPlaceholder: {
            fontSize: 10,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            color: '#999'
          },
          reportTitle: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 5]
          },
          reportPeriod: {
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          sectionTitle: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          summaryLabel: {
            fontSize: 10,
            margin: [5, 3, 0, 3]
          },
          summaryValue: {
            fontSize: 10,
            bold: true,
            alignment: 'right',
            margin: [0, 3, 5, 3]
          },
          tableHeader: {
            fontSize: 9,
            bold: true,
            alignment: 'center',
            color: '#fff',
            fillColor: '#4a5568',
            margin: [2, 3, 2, 3]
          },
          tableCell: {
            fontSize: 8,
            margin: [2, 2, 2, 2]
          },
          violationCell: {
            fontSize: 8,
            bold: true,
            color: '#fff',
            fillColor: '#e53e3e',
            alignment: 'center',
            margin: [2, 2, 2, 2]
          },
          normalCell: {
            fontSize: 8,
            color: '#38a169',
            alignment: 'center',
            margin: [2, 2, 2, 2]
          },
          headerText: {
            fontSize: 8,
            italics: true,
            color: '#666'
          },
          headerPage: {
            fontSize: 8,
            italics: true,
            color: '#666',
            alignment: 'right'
          },
          footerText: {
            fontSize: 8,
            color: '#999'
          }
        },
        
        defaultStyle: {
          font: 'Roboto'
        }
      };

      // Generate PDF
      pdfMake.createPdf(docDefinition).download(
        `Laporan_Monitoring_Lab_${dateRange.start}_${dateRange.end}.pdf`
      );

      setGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF');
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Cetak Laporan Monitoring</h2>
            <p className="text-indigo-100 mt-1">Generate laporan aktivitas siswa dalam format PDF</p>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Pilih Periode Laporan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchReportData}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Mengambil Data...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Ambil Data Laporan</span>
              </>
            )}
          </button>

          <button
            onClick={generatePDF}
            disabled={generating || !reportData}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
          >
            {generating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      {reportData && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Printer className="w-6 h-6 text-indigo-600" />
            Preview Laporan
          </h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
              <p className="text-3xl font-bold">{reportData.summary.total_activities}</p>
              <p className="text-sm opacity-90">Total Aktivitas</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
              <p className="text-3xl font-bold">{reportData.summary.total_violations}</p>
              <p className="text-sm opacity-90">Pelanggaran</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
              <p className="text-3xl font-bold">{reportData.summary.total_students}</p>
              <p className="text-sm opacity-90">Siswa</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <p className="text-3xl font-bold">{reportData.summary.total_computers}</p>
              <p className="text-sm opacity-90">Komputer</p>
            </div>
          </div>

          {/* Activities Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tanggal/Waktu</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama Siswa</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Komputer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Website</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.activities.map((activity, index) => (
                  <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {new Date(activity.timestamp).toLocaleDateString('id-ID')}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{activity.student_name}</td>
                    <td className="px-4 py-3 text-gray-700">{activity.computer_id}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {activity.duration < 60 
                        ? `${activity.duration} detik`
                        : `${Math.floor(activity.duration / 60)} menit`
                      }
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{activity.domain}</td>
                    <td className="px-4 py-3">
                      {activity.is_violation ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          PELANGGARAN
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
