// Audio service for handling playback and downloads
class AudioService {
  constructor() {
    this.audio = new Audio();
    this.currentSong = null;
    this.isInitialized = false;
  }

  init(onTimeUpdate, onLoadedMetadata, onEnded, onVolumeChange) {
    if (this.isInitialized) return;
    
    // Remove any existing listeners first
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('volumechange', this.onVolumeChange);
    
    // Store the callbacks for cleanup
    this.onTimeUpdate = onTimeUpdate;
    this.onLoadedMetadata = onLoadedMetadata;
    this.onEnded = onEnded;
    this.onVolumeChange = onVolumeChange;
    
    // Add new listeners
    this.audio.addEventListener('timeupdate', onTimeUpdate);
    this.audio.addEventListener('loadedmetadata', onLoadedMetadata);
    this.audio.addEventListener('ended', (e) => {
      console.log('Audio ended event triggered'); // Debug log
      onEnded(e);
    });
    
    // Listen for volume changes (system volume, media keys, etc.)
    if (onVolumeChange) {
      this.audio.addEventListener('volumechange', () => {
        onVolumeChange(this.audio.volume);
      });
    }
    
    this.isInitialized = true;
  }

  async play() {
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.error('Error playing audio:', error);
      return false;
    }
  }

  pause() {
    this.audio.pause();
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume() {
    return this.audio.volume;
  }

  setCurrentTime(time) {
    this.audio.currentTime = time;
  }

  getCurrentTime() {
    return this.audio.currentTime || 0;
  }

  getDuration() {
    return this.audio.duration || 0;
  }

  hasEnded() {
    return this.audio.ended;
  }

  getProgress() {
    if (this.audio.duration > 0) {
      return this.audio.currentTime / this.audio.duration;
    }
    return 0;
  }

  setSrc(src) {
    this.audio.src = src;
  }

  // Offline download functionality
  async downloadSong(song) {
    try {
      // Check if the song is already downloaded
      const existingDownload = await this.getDownloadedSong(song.id);
      if (existingDownload) {
        return existingDownload;
      }

      // In a real app, you would download from your music service
      // For demo purposes, we'll simulate the download
      const response = await fetch(song.audioUrl);
      const blob = await response.blob();
      
      // Store in IndexedDB for offline access
      const downloadedSong = {
        ...song,
        downloadedAt: new Date().toISOString(),
        localUrl: URL.createObjectURL(blob),
        size: blob.size
      };

      await this.storeDownloadedSong(downloadedSong);
      return downloadedSong;
    } catch (error) {
      console.error('Error downloading song:', error);
      throw error;
    }
  }

  async storeDownloadedSong(song) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['downloads'], 'readwrite');
        const store = transaction.objectStore('downloads');
        
        const addRequest = store.add(song);
        addRequest.onsuccess = () => resolve(song);
        addRequest.onerror = () => reject(addRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('downloads')) {
          const store = db.createObjectStore('downloads', { keyPath: 'id' });
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };
    });
  }

  async getDownloadedSong(songId) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['downloads'], 'readonly');
        const store = transaction.objectStore('downloads');
        
        const getRequest = store.get(songId);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  async getAllDownloadedSongs() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['downloads'], 'readonly');
        const store = transaction.objectStore('downloads');
        
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('downloads')) {
          const store = db.createObjectStore('downloads', { keyPath: 'id' });
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };
    });
  }

  async removeDownloadedSong(songId) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['downloads'], 'readwrite');
        const store = transaction.objectStore('downloads');
        
        const deleteRequest = store.delete(songId);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  }

  // Check if device is online
  isOnline() {
    return navigator.onLine;
  }

  // Get storage usage
  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        available: estimate.quota,
        percentage: (estimate.usage / estimate.quota) * 100
      };
    }
    return null;
  }
}

const audioService = new AudioService();
export default audioService;