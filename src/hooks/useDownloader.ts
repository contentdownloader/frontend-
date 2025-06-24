import { useState, useCallback } from 'react';

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
  progress?: number;
}

interface DownloadOptions {
  format: string;
  quality: string;
}

const API_BASE_URL = 'https://try-back-end.onrender.com';

export const useDownloader = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [currentDownload, setCurrentDownload] = useState<DownloadItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Clean and normalize URLs
  const cleanUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // Remove Facebook mobile parameters that might cause issues
      if (urlObj.hostname.includes('facebook.com')) {
        urlObj.searchParams.delete('mibextid');
        urlObj.searchParams.delete('utm_source');
        urlObj.searchParams.delete('utm_medium');
        urlObj.searchParams.delete('utm_campaign');
      }
      
      return urlObj.toString();
    } catch {
      return url; // Return original if URL parsing fails
    }
  };

  // Get user-friendly error messages
  const getErrorMessage = (error: any, url: string): string => {
    if (error.message?.includes('400')) {
      if (url.includes('facebook.com')) {
        return 'Facebook content may not be supported or the URL format is invalid. Try using a direct video link.';
      }
      return 'Invalid URL or unsupported content. Please check the URL and try again.';
    }
    
    if (error.message?.includes('403')) {
      return 'Access denied. The content may be private or require authentication.';
    }
    
    if (error.message?.includes('404')) {
      return 'Content not found. The URL may be incorrect or the content has been removed.';
    }
    
    if (error.message?.includes('429')) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    if (error.message?.includes('500')) {
      return 'Server error. The backend service may be temporarily unavailable.';
    }
    
    return error.message || 'Download failed. Please try again.';
  };

  const startDownload = useCallback(async (url: string, options: DownloadOptions) => {
    const downloadId = generateId();
    const cleanedUrl = cleanUrl(url);
    
    const newDownload: DownloadItem = {
      id: downloadId,
      url: cleanedUrl,
      title: cleanedUrl.split('/').pop() || 'Unknown',
      format: options.format,
      quality: options.quality,
      status: 'pending',
      timestamp: new Date(),
      progress: 0,
    };

    setCurrentDownload(newDownload);
    setIsLoading(true);

    try {
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Sending request to:', `${API_BASE_URL}/api/download`);
      console.log('Request payload:', {
        url: cleanedUrl,
        format: options.format,
        quality: options.quality,
      });

      const response = await fetch(`${API_BASE_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          url: cleanedUrl,
          format: options.format,
          quality: options.quality,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Try to get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, use the text or default message
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Invalid response format from server');
      }
      
      // If the backend returns immediate success with download URL
      if (result.success && result.downloadUrl) {
        const completedDownload = {
          ...newDownload,
          status: 'completed' as const,
          downloadUrl: result.downloadUrl,
          title: result.title || newDownload.title,
          progress: 100,
        };
        
        setDownloads(prev => [completedDownload, ...prev]);
        setCurrentDownload(null);
        setIsLoading(false);
        return;
      }

      // If backend returns a job ID for polling
      if (result.jobId) {
        await pollDownloadStatus(result.jobId, newDownload);
        return;
      }

      // If we get here, the response format is unexpected
      throw new Error('Unexpected response format from server');

    } catch (error) {
      console.error('Download error:', error);
      
      const failedDownload = {
        ...newDownload,
        status: 'failed' as const,
        error: getErrorMessage(error, cleanedUrl),
      };
      
      setDownloads(prev => [failedDownload, ...prev]);
      setCurrentDownload(null);
      setIsLoading(false);
    }
  }, []);

  const pollDownloadStatus = async (jobId: string, download: DownloadItem) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.status === 'completed') {
          const completedDownload = {
            ...download,
            status: 'completed' as const,
            downloadUrl: result.downloadUrl,
            title: result.title || download.title,
            progress: 100,
          };
          
          setDownloads(prev => [completedDownload, ...prev]);
          setCurrentDownload(null);
          setIsLoading(false);
          return;
        }

        if (result.status === 'failed') {
          throw new Error(result.error || 'Download failed');
        }

        // Update progress if available
        if (result.progress !== undefined) {
          setCurrentDownload(prev => prev ? { ...prev, progress: result.progress } : null);
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          throw new Error('Download timeout - the process took too long');
        }
      } catch (error) {
        const failedDownload = {
          ...download,
          status: 'failed' as const,
          error: getErrorMessage(error, download.url),
        };
        
        setDownloads(prev => [failedDownload, ...prev]);
        setCurrentDownload(null);
        setIsLoading(false);
      }
    };

    poll();
  };

  const deleteDownload = useCallback((id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  }, []);

  const retryDownload = useCallback((download: DownloadItem) => {
    startDownload(download.url, { 
      format: download.format, 
      quality: download.quality 
    });
  }, [startDownload]);

  return {
    downloads,
    currentDownload,
    isLoading,
    startDownload,
    deleteDownload,
    retryDownload,
  };
};
