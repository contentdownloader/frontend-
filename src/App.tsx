import React from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LoadingProgress } from './components/LoadingProgress';
import { DownloadHistory } from './components/DownloadHistory';
import { useDownloader } from './hooks/useDownloader';

function App() {
  const {
    downloads,
    currentDownload,
    isLoading,
    startDownload,
    deleteDownload,
    retryDownload,
  } = useDownloader();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Download Content from Anywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Paste any content URL and download it in your preferred format and quality.
              Support for videos, audio, and more.
            </p>
          </div>

          {/* URL Input Form */}
          <UrlInput 
            onSubmit={startDownload} 
            isLoading={isLoading} 
          />

          {/* Loading Progress */}
          {currentDownload && (
            <LoadingProgress
              progress={currentDownload.progress}
              status={
                currentDownload.progress === undefined 
                  ? 'Starting download...' 
                  : currentDownload.progress < 100 
                    ? `Downloading... ${currentDownload.progress}%`
                    : 'Download complete!'
              }
              url={currentDownload.url}
            />
          )}

          {/* Download History */}
          <DownloadHistory
            downloads={downloads}
            onDelete={deleteDownload}
            onRetry={retryDownload}
          />

          {/* Features Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Supported Platforms & Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-sm">YT</span>
                </div>
                <h4 className="font-medium text-gray-900">YouTube</h4>
                <p className="text-sm text-gray-600">Videos and playlists</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IG</span>
                </div>
                <h4 className="font-medium text-gray-900">Instagram</h4>
                <p className="text-sm text-gray-600">Photos and stories</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TW</span>
                </div>
                <h4 className="font-medium text-gray-900">Twitter</h4>
                <p className="text-sm text-gray-600">Media content</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>Pro Tip:</strong> For best results, use direct links to content. 
                Higher quality options may take longer to process.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              © 2025 ContentGrab. Built with modern web technologies.
            </p>
            <p className="text-xs text-gray-500">
              Please respect copyright laws and terms of service of content platforms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
