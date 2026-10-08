import { useState, useEffect } from 'react';
import { X, Download, Maximize2, Minimize2, RefreshCw, Clock, Monitor, User, Loader } from 'lucide-react';
import { Screenshot } from '../types';

interface ScreenshotViewerProps {
  screenshot: Screenshot | null;
  onClose: () => void;
}

export default function ScreenshotViewer({ screenshot, onClose }: ScreenshotViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (screenshot?.image) {
      // Validate and fix base64 format
      let validImage = screenshot.image;
      
      // Check jika sudah ada prefix 'data:'
      if (!validImage.startsWith('data:')) {
        // Check jika ada prefix 'image/png;base64,' tanpa 'data:'
        if (validImage.startsWith('image/png;base64,')) {
          validImage = 'data:' + validImage;
        } 
        // Check jika hanya base64 string tanpa prefix
        else if (!validImage.includes('base64,')) {
          validImage = 'data:image/png;base64,' + validImage;
        }
      }
      
      console.log('📸 Image format:', validImage.substring(0, 50) + '...');
      console.log('📸 Image size:', (screenshot.size / 1024).toFixed(2), 'KB');
      
      // Update screenshot dengan format yang benar
      screenshot.image = validImage;
      setIsLoading(false);
    }
  }, [screenshot]);

  const handleDownload = () => {
    if (!screenshot?.image) return;

    const link = document.createElement('a');
    link.href = screenshot.image;
    link.download = `screenshot-${screenshot.computerId}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!screenshot) return null;

  return (
    <div className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-8'}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{screenshot.computerName}</h3>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{screenshot.studentName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(screenshot.timestamp).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/20"
              title="Download Screenshot"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/20"
              title={isFullscreen ? 'Minimize' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm rounded-xl transition-all border border-red-400/30"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-6xl max-h-[80vh]'} flex items-center justify-center`}>
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-white text-lg">Memuat screenshot...</p>
          </div>
        ) : imageError ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-white text-lg">Gagal memuat screenshot</p>
            <p className="text-gray-400 text-sm">File mungkin rusak atau tidak valid</p>
          </div>
        ) : (
          <img
            src={screenshot.image}
            alt={`Screenshot ${screenshot.computerName}`}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${
              isFullscreen ? 'w-full h-full' : ''
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setImageError(true);
            }}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>{screenshot.computerId}</span>
            </div>
            <div>
              <span>Ukuran: {(screenshot.size / 1024).toFixed(2)} KB</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
              Live Screenshot
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
