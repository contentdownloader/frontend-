import React from 'react';
import { Download, ExternalLink, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface DownloadItem {
  id: string;
  url: string;
  title: string;
  format: string;
  quality: string;
  status: 'completed' | 'failed' | 'pending';
  downloadUrl?: string;
  timestamp: Date;
  error?: string;
}

interface DownloadHistoryProps {
  downloads: DownloadItem[];
  onDelete: (id: string) => void;
  onRetry: (item: DownloadItem) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  downloads,
  onDelete,
  onRetry,
}) => {
  if (downloads.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads yet</h3>
        <p className="text-gray-500">Your download history will appear here</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Download History</h2>
        <p className="text-sm text-gray-500 mt-1">
          {downloads.length} download{downloads.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {downloads.map((download) => (
          <div key={download.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(download.status)}
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {download.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(download.status)}`}>
                    {download.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-2 break-all">
                  {download.url}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{download.format.toUpperCase()}</span>
                  <span>{download.quality}</span>
                  <span>{download.timestamp.toLocaleString()}</span>
                </div>
                
                {download.error && (
                  <p className="text-sm text-red-600 mt-2">{download.error}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {download.status === 'completed' && download.downloadUrl && (
                  <a
                    href={download.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open download"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                
                {download.status === 'failed' && (
                  <button
                    onClick={() => onRetry(download)}
                    className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Retry download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => onDelete(download.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete from history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
