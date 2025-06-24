import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  progress?: number;
  status: string;
  url?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  status,
  url,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          {progress !== undefined && (
            <div className="absolute -bottom-2 -right-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-600">
                <span className="text-xs font-semibold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Download
        </h3>
        <p className="text-sm text-gray-600 mb-4">{status}</p>
        
        {url && (
          <p className="text-xs text-gray-500 break-all bg-gray-50 p-2 rounded-lg">
            {url}
          </p>
        )}
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
