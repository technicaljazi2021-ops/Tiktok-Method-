/**
 * Video metadata inspection utility
 */
import { scanTopLevelBoxes } from './mp4Patcher';

export interface VideoMetadata {
  filename: string;
  filesize: number;
  formattedSize: string;
  duration: number;
  formattedDuration: string;
  width: number;
  height: number;
  aspectRatio: string;
  estimatedFps: number;
  isFastStart: boolean;
  mimeType: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export async function checkFastStart(file: File): Promise<boolean> {
  try {
    const boxes = await scanTopLevelBoxes(file);
    const moov = boxes.find(b => b.type === 'moov');
    const mdat = boxes.find(b => b.type === 'mdat');
    if (!moov || !mdat) return false;
    return moov.offset < mdat.offset;
  } catch (e) {
    return false;
  }
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  const isFastStart = await checkFastStart(file);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      // Fallback if video tag stalls
      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration: 0,
        formattedDuration: '0:00',
        width: 1080,
        height: 1920,
        aspectRatio: '9:16',
        estimatedFps: 60,
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    }, 5000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      const duration = video.duration || 0;

      // Calculate simplified aspect ratio
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height);
      const aspectWidth = width / divisor;
      const aspectHeight = height / divisor;
      const aspectRatio = (aspectWidth <= 16 && aspectHeight <= 16)
        ? `${aspectWidth}:${aspectHeight}`
        : `${(width / height).toFixed(2)}:1`;

      URL.revokeObjectURL(url);

      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration,
        formattedDuration: formatDuration(duration),
        width,
        height,
        aspectRatio,
        estimatedFps: 60, // Standard modern capture target
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration: 0,
        formattedDuration: '0:00',
        width: 1080,
        height: 1920,
        aspectRatio: '9:16',
        estimatedFps: 60,
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    };
  });
}
