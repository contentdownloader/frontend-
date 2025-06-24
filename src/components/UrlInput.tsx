import React, { useState } from 'react';
import { Link, Download, AlertCircle, Check, Info } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string, options: DownloadOptions) => void;
  isLoading: boolean;
}

interface DownloadOptions {
  format: string;
  quality: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [urlWarning, setUrlWarning] = useState<string | null>(null);

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      
      // Check for supported platforms and show warnings
      if (urlObj.hostname.includes('facebook.com')) {
        setUrlWarning('Facebook content may have limited support. Try using direct video links when possible.');
      } else if (urlObj.hostname.includes('instagram.com')) {
        setUrlWarning('Instagram content may require the post to be public.');
      } else if (urlObj.hostname.includes('tiktok.com')) {
        setUrlWarning('TikTok content support may vary depending on privacy settings.');
      } else {
        setUrlWarning(null);
      }
      
      return inputUrl.length > 0;
    } catch {
      setUrlWarning(null);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl.trim()) {
      setIsValidUrl(validateUrl(newUrl));
    } else {
      setIsValidUrl(null);
      setUrlWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl && url.trim()) {
      onSubmit(url.trim(), { format, quality });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Content URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Paste your content URL here..."
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isValidUrl === true
                  ? 'border-green-300 bg-green-50'
                  : isValidUrl === false
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isValidUrl === true && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {isValidUrl === false && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
          {isValidUrl === false && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
          )}
          {urlWarning && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{urlWarning}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="mp4">MP4 Video</option>
              <option value="mp3">MP3 Audio</option>
              <option value="webm">WebM</option>
              <option value="avi">AVI</option>
              <option value="mov">MOV</option>
            </select>
          </div>

          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="1080p">1080p (Full HD)</option>
              <option value="720p">720p (HD)</option>
              <option value="480p">480p (SD)</option>
              <option value="360p">360p</option>
              <option value="best">Best Available</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Supported Platforms</h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• <strong>YouTube:</strong> Videos, playlists, and shorts</p>
            <p>• <strong>Instagram:</strong> Posts, reels, and stories (public content)</p>
            <p>• <strong>Twitter/X:</strong> Video and image content</p>
            <p>• <strong>TikTok:</strong> Public videos</p>
            <p>• <strong>Facebook:</strong> Limited support for public videos</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValidUrl || isLoading}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            !isValidUrl || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Download Content
            </>
          )}
        </button>
      </form>
    </div>
  );
};
